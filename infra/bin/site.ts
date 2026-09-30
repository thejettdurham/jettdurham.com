import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

const app = new cdk.App();
const account = app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT;
const hostedZoneId = app.node.tryGetContext('hostedZoneId');
if (!account || !hostedZoneId)
  throw new Error('Pass -c account=... -c hostedZoneId=... (see README).');

class SiteStack extends cdk.Stack {
  readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string) {
    super(scope, id, {
      env: { account, region: 'us-east-1' },
      description: 'Static personal site: S3, CloudFront, DNS, and deploy role',
    });
    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
      hostedZoneId,
      zoneName: 'jettdurham.com',
    });
    const bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: true,
      lifecycleRules: [{ noncurrentVersionExpiration: cdk.Duration.days(30) }],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: 'www.jettdurham.com',
      subjectAlternativeNames: ['jettdurham.com'],
      validation: acm.CertificateValidation.fromDns(zone),
    });
    const rewrite = new cloudfront.Function(this, 'CleanUrls', {
      code: cloudfront.FunctionCode.fromInline(`function handler(event) {
  var request = event.request;
  if (request.headers.host.value === 'jettdurham.com') {
    return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: 'https://www.jettdurham.com' + request.uri + (request.querystring && Object.keys(request.querystring).length ? '?' + Object.keys(request.querystring).map(function(k) { return k + '=' + request.querystring[k].value; }).join('&') : '') } } };
  }
  if (request.uri.endsWith('/')) request.uri += 'index.html';
  else if (request.uri.indexOf('.', request.uri.lastIndexOf('/')) === -1) request.uri += '/index.html';
  return request;
}`),
    });
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      domainNames: ['www.jettdurham.com', 'jettdurham.com'],
      certificate,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          { function: rewrite, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.seconds(60),
        },
      ],
    });
    const providerArn = `arn:aws:iam::${account}:oidc-provider/token.actions.githubusercontent.com`;
    const role = new iam.Role(this, 'GitHubDeployRole', {
      assumedBy: new iam.WebIdentityPrincipal(providerArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          'token.actions.githubusercontent.com:sub':
            'repo:thejettdurham/jettdurham.com:ref:refs/heads/main',
        },
      }),
    });
    role.addToPolicy(
      new iam.PolicyStatement({ actions: ['s3:ListBucket'], resources: [bucket.bucketArn] }),
    );
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['s3:PutObject', 's3:DeleteObject'],
        resources: [bucket.arnForObjects('*')],
      }),
    );
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [this.distribution.distributionArn],
      }),
    );
    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'DistributionId', { value: this.distribution.distributionId });
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
    });
    new cdk.CfnOutput(this, 'DeployRoleArn', { value: role.roleArn });
  }
}

class DnsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, distribution: cloudfront.IDistribution) {
    super(scope, id, {
      env: { account, region: 'us-east-1' },
      description: 'Route 53 aliases for the static site',
    });
    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
      hostedZoneId,
      zoneName: 'jettdurham.com',
    });
    for (const name of ['www', '']) {
      const suffix = name || 'Apex';
      new route53.ARecord(this, `AliasA${suffix}`, {
        zone,
        recordName: name || undefined,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      });
      new route53.AaaaRecord(this, `AliasAAAA${suffix}`, {
        zone,
        recordName: name || undefined,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      });
    }
  }
}

const site = new SiteStack(app, 'JettDurhamSite');
new DnsStack(app, 'JettDurhamDns', site.distribution);
