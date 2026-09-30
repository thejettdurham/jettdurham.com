# Jett Durham's website

A static personal site built with Astro and TypeScript. `pnpm build` produces `dist/`, which can be uploaded directly to S3 and served through CloudFront. No runtime server or client framework is required.

## Local development

The exact Node version is in `.nvmrc`; the pnpm version is in `package.json` under `packageManager`. With nvm and Corepack installed:

```sh
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

For a production check:

```sh
pnpm format:check
pnpm check
pnpm build
pnpm verify
```

Run `pnpm format` to format the source. `pnpm install` installs the Husky precommit hook, which formats staged files with Prettier before a commit. Published Markdown in `src/content/blog/` is excluded because Obsidian owns those files.

The site lives in `src/pages/`, its shared layout and CSS in `src/layouts/` and `src/styles/`, and posts in `src/content/blog/`. Edit `src/content/about.md` and `src/content/ai-use.md` for those pages' text and metadata; their Astro pages supply the layout. `public/` contains files served without processing. The canonical site is `https://www.jettdurham.com`.

To change the site's colors, edit the light and dark palettes together in `src/styles/theme.css`. The desktop frame and navigation are in `src/layouts/Base.astro`; `src/styles/global.css` applies the color tokens and article typography. The navigation font is self-hosted in the static build.

## Publishing from Obsidian

The site consumes the natural output of [Publish to Git Repo](https://community.obsidian.md/plugins/publish-to-git-repo). The plugin works on desktop and mobile. Configure it once in each vault installation where you plan to publish:

| Setting              | Value                                               |
| -------------------- | --------------------------------------------------- |
| Repository           | `thejettdurham/jettdurham.com`                      |
| Branch               | `main`                                              |
| Base path            | leave empty                                         |
| Default storage path | `src/content/blog`                                  |
| Published base URL   | leave empty; this site computes URLs from filenames |

Give the plugin a GitHub fine grained token limited to this repository with **Contents: Read and write**. The plugin stores its token in its local Obsidian settings file, so keep vault configuration private and never commit `.obsidian/` or the token. The target branch must already exist with a commit.

Create a note with a stable, URL friendly filename such as `building-a-small-thing.md`, and add Properties like:

```yaml
---
title: Building a Small Thing
description: What I learned along the way
date: 2026-09-27
updated: 2026-09-28
tags:
  - software
draft: false
gh-publish: true
---
```

`title` and `date` are required for the site; `description`, `updated`, `tags`, and `draft` are optional. Use a checkbox Property for `draft` in Obsidian when possible; the site also accepts quoted `"true"` and `"false"` values from text Properties. `gh-publish: true` is required by the Obsidian plugin but is stripped from the published file. A `draft: true` note is excluded from the site, RSS, and sitemap, but its Markdown remains visible in this public GitHub repository. Keep private drafts in your Obsidian vault; do not publish them to this repo. To publish a repo draft on the site, change `draft` to `false` and publish again.

Run **Publish to Git Repo** in Obsidian and confirm its preview. It pushes published Markdown and attachments directly to GitHub; GitHub Actions then builds and deploys the site. No Astro, Git, CLI, or script is needed on the writing device. If Obsidian Sync carries your vault to another device, install and configure the plugin there as well.

The plugin writes text only notes as `src/content/blog/name.md`. A note with an embedded image becomes `src/content/blog/name/index.md` plus `images/`. Astro accepts both layouts under the same `/blog/name/` URL. Relative image embeds are fingerprinted by Astro. Other colocated attachments are copied to matching output paths so normal Markdown links to PDFs and similar files work.

- `![[photo.png]]` is rewritten by the plugin to `![](images/photo.png)`.
- `[[another-post]]` and `[[another-post|a label]]` become links to `/blog/another-post/` during the build. Standard Markdown links to another `.md` post work too. Link to published notes only; `pnpm verify` catches broken links after build.
- Put an ordinary YouTube URL on its own Markdown line to render a responsive, privacy enhanced embed. A normal inline YouTube link remains a link.
- The plugin does not expand note transclusions (`![[another-note]]`). It also does not delete posts from GitHub when you unmark or delete them in Obsidian. Remove obsolete files in GitHub when necessary. If removing the last image changes a post from `name/index.md` to `name.md`, delete the old folder in GitHub to avoid duplicate content IDs.
- Avoid changing a published note's filename unless you also arrange a redirect from its previous URL. The filename determines the public slug.

The publishing contract and its limitations are documented in the [plugin's README](https://community.obsidian.md/plugins/publish-to-git-repo). The build adapter is deliberately small and lives in `src/lib/obsidian-markdown.ts`.

## AWS setup and deployment

`infra/` contains two small CDK stacks in `us-east-1`. `JettDurhamSite` defines a private, versioned S3 bucket, CloudFront with Origin Access Control and clean URL rewrites, an ACM certificate, and a GitHub Actions deploy role restricted to `main`. `JettDurhamDns` defines the Route 53 aliases for the apex and `www`. The apex redirects to canonical `www`. The site stack retains the bucket if the stack is removed.

1. Ensure the `jettdurham.com` Route 53 hosted zone exists and note its zone ID. Keep the existing site records in place while preparing the new site.
2. Ensure the GitHub OIDC provider `token.actions.githubusercontent.com` exists in the AWS account. Its audience is `sts.amazonaws.com`. The stack references this account level provider; it does not create a duplicate.
3. After the root `pnpm install --frozen-lockfile`, review and deploy only the site stack. Replace `PROFILE` with your local AWS CLI profile. The DNS stack remains undeployed, so the old site stays live.

   ```sh
   pnpm --dir infra cdk diff JettDurhamSite -c account=ACCOUNT_ID -c hostedZoneId=ZONE_ID --profile PROFILE
   pnpm --dir infra cdk deploy JettDurhamSite -c account=ACCOUNT_ID -c hostedZoneId=ZONE_ID --profile PROFILE
   ```

4. Copy stack outputs `BucketName`, `DistributionId`, and `DeployRoleArn` to GitHub repository **Actions variables** named `AWS_SITE_BUCKET`, `AWS_CLOUDFRONT_DISTRIBUTION_ID`, and `AWS_DEPLOY_ROLE_ARN`.
5. Once ready, merge or push the Astro branch to `main`. `.github/workflows/deploy.yml` builds and checks on each push to `main`, syncs `dist/` to S3, assigns a short cache lifetime to HTML and immutable caching to Astro's fingerprinted `_astro/` assets, then invalidates CloudFront. Verify the new site at the `DistributionDomainName` stack output before changing DNS.
6. At cutover, remove the existing apex A record (`104.198.14.52`) and `www` CNAME (`jettdurham-com.netlify.com`) from the hosted zone. Leave the NS, SOA, MX, TXT, and underscore-prefixed validation CNAME records alone. Then review and deploy the DNS stack, which creates A and AAAA aliases for both names:

   ```sh
   pnpm --dir infra cdk diff JettDurhamDns -c account=ACCOUNT_ID -c hostedZoneId=ZONE_ID --profile PROFILE
   pnpm --dir infra cdk deploy JettDurhamDns -c account=ACCOUNT_ID -c hostedZoneId=ZONE_ID --profile PROFILE
   ```

   Keep the old record values handy until the new records and site are verified. After cutover, DNS stays managed by `JettDurhamDns`.

The deployment workflow never runs CDK. Infrastructure changes require an explicit reviewed CDK deployment. CloudFront rewrites clean paths such as `/blog/` to `/blog/index.html` before requesting from the private bucket.
