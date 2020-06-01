---
title: "Start With A Monorepo"
date: 2020-06-01T12:00:00-05:00
draft: false
summary: "If you're about to start a new project, why not start with a monorepo?"
---

In recent years, I've worked on Javascript projects of varying scopes and sizes. Through that experience, I've come to notice a common trend: **Large products naturally trend toward the need to share code**.

There are many ways to enable code sharing between several projects in a product. I'm convinced that **a multi-package monorepo is the ideal solution for sharing code between projects** for small teams. I’m so confident in this that the next time I start a new product, I plan to start it as a monorepo.

[Monorepos](https://en.wikipedia.org/wiki/Monorepo) are a divisive topic: some swear by them, and some detest them. I’m not here to discuss the pros and cons of a monorepo, or whether it’s a good thing for your existing system. There are too many variables for anyone to recommend a monorepo for every product or team. Instead, I’m here to suggest two things:

1. The need to share code in software products is inevitable.
1. It's easier to start with a monorepo than to migrate toward one later.

> NOTE: I'm speaking from the experience of working in small teams (~10 developers). I'm sure that monorepos can provide the same benefits to larger groups and codebases, but I don't have that level of direct experience.

## Trending Towards Code Sharing

Sophisticated software products very rarely consist of a single software _project_. Even a typical blog has two separate facets: the published user-facing posts, and the admin panel used by the author. This project separation has only gotten more abundant with the rise of mobile computing and app stores. Today, it's almost a given that any new software product will have a web version, mobile versions, and perhaps even desktop versions.

Within this collection of software projects, it’s almost guaranteed that at least two of them will use the same programming language. When this happens, the need for code sharing is inevitable. You will usually find a need to share some common bit of business logic or to share some visual components.

There are a lot of [recent](https://kentcdodds.com/blog/aha-programming) [thoughts](https://dev.to/wuz/stop-trying-to-be-so-dry-instead-write-everything-twice-wet-5g33) from the community rethinking the practice of [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). These are all excellent points and generally right. This conversation around sharing code assumes you've already solidified the abstraction. If there are too many barriers one has to overcome to reuse a valuable abstraction, it's likely not to happen.

> I should rephrase: sharing this code _will_ happen, but not in a desirable way: copy-pasta 🍝

## What about Packages in Multiple Repos?

Most modern programming languages have a [Package Manager](https://en.wikipedia.org/wiki/Package_manager). Javascript has [npm](https://www.npmjs.com/), .NET has [NuGet](https://www.nuget.org/), Python has [pypi](https://pypi.org/), Ruby has [rubygems](https://rubygems.org/), PHP has [Packagist](https://packagist.org/), and so-on. These are usually intended for public packages, but most of them provide some ability to publish private packages. Private packages can be an attractive solution for sharing code.

**In my experience, the extra overhead of maintaining and publishing packages is more trouble than its worth for small teams.**

When you need to make a change to a shared package, it’s usually to implement a new requirement in the application. If the code for the package lives next to the applications using it, implementing the change is straightforward:

1. Change the code.
1. Verify the change.
1. Commit the change.
1. Submit a pull request.

When the package resides in a separate repo, the process looks more like this:

1. Pull the package's codebase to your system
1. Link your application's instance of the package to your local version. In [some cases](https://www.google.com/search?q=yarn+link+not+working), this may be challenging.
1. Make the change in the package.
1. Verify the change in the application.
1. Commit the change in the package.
1. Submit a pull request in the package.
1. Publish a new version of the package. 
1. Consume the newly published version of the package in your application.
1. Re-verify the change in the application.
1. Commit the version bump in the application.
1. Submit a pull request in the application.
1. Do the other consumers of this package need to update to the latest version?

In a sufficiently large and mature organization, this might be the best approach. There may be auditing requirements and enough risk to call for such a rigorous, time-consuming process. Yet, for a small team looking to share code with minimal overhead, this is usually not desirable.

## Continuous Integration

The idea of using packages as a unit of shareable code is a good one. If it weren't, Package Managers wouldn't be so popular. **It's the separation across many repos that make them challenging to handle.**

Code-sharing concerns aside, consider Continuous Integration. Typically, a CI job runs against a single repository. When you have 10 packages, you have 10 separate CI jobs to maintain. If you want to add a new step to each of these jobs, it can be time-consuming and result in duplicated configuration.

Likewise, if all the projects colocate in the same repository, there's only one CI job to manage. This job needs to be more complicated than a job against a single-project repository, but many tools can help manage this. If configured correctly (which is the topic of another post), a monorepo CI job can make the global build system easier to maintain. You can add new packages with less effort.

## Starting with a Monorepo

All that said, how do you _start_ a project with a monorepo? While a monorepo is more manageable with specific tools, you don't need them to get started. Beginning with a monorepo mostly involves a mindset-shift: **acknowledging that this repo will one day contain more than one project.**

With that in mind: let's say you want to start a new javascript project. Instead of setting up a new repository focused around the app, like so:

```
├── my-awesome-app/
    ├── .git
    ├── .gitignore
    ├── README.md
    ├── node_modules/
    ├── package.json
    ├── public/
    ├── src/
    └── yarn.lock
```

You would set up a new repository around the _product_, and move the app's source code into a subdirectory of that repository, like so:

```
└── my-awesome-product/
    ├── .git
    ├── .gitignore
    ├── apps/
        └── my-awesome-app/
            ├── README.md
            ├── node_modules/
            ├── package.json
            ├── public/
            ├── src/
            └── yarn.lock
    └── packages/
```

That's all you really need to start with a monorepo. This expresses your intent to add more apps and packages as the need arises. You don't need to start with any fancy tools or build setups. 

If you have the time, it's good to start thinking about how you'll add new projects. Will you need to build things in a particular order? Will you be able to reuse tooling configuration? Will you need any special tools to orchestrate CI? You don't have to figure everything out right now. Today, there are many great open-source resources out there to help manage monorepos.

- [Lerna](https://lerna.js.org/)
- [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
- [Bazel](https://bazel.build/)
- [Awesome Monorepo](https://github.com/korfuri/awesome-monorepo)

## Monorepo to Multi-Repo, if you need it

Much of the pain of a monorepo comes from migrating code from existing repos. Usually, it’s not _only_ the code that needs to move: it’s the version control history, the documentation, CI job(s), deployment configuration, and so on. Getting these things right can take a lot of time and effort.

Yet, I’d argue that moving a project _out of_ a monorepo is easier than moving it _into_ one. You’ll still need to deal with writing new CI jobs, deployment configs, and moving the code while retaining history, and so on. But, in general, each of these things will be less complex when they don’t have to coordinate with everything else in the monorepo.

When (or if) you should migrate a project out of a monorepo is another issue entirely. It depends on the nature of the project and the team. It’s just worth reinforcing: you can always decompose a monorepo into many repositories if you ever need to.

## Conclusion

The bar for software product quality is very high, and it continues to rise. As this bar rises, our code will continue to grow in complexity. The need to share code will always emerge in any sufficiently complex product. The earlier you consider this need, the easier it will be to do. 

For your next big project or product, why not start with a monorepo?
