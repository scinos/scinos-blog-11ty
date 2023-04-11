---
tags:
  - yarn
  - package_management
description:
  Yarn is a great tool with lots of great features, but not everything is peaches and cream, as it is prone to package
  duplication. This can cause your dependencies to take longer to install and increase the size of your bundle if you're
  serving them to a browser. In this post, you'll learn how to use yarn-deduplicate, a tool to help you identify and
  resolve those duplicated dependencies.
---

# De-duplicating `yarn.lock`

I have been using [yarn](https://yarnpkg.com/lang/en/) since version 0.18. I’ve used it in experiments and toy projects,
but also in very big projects with thousands of dependencies. It is a very nice tool with lots of great features. But
not everything is peaches and cream.

As you probably know, merges in `yarn.lock` are not always very clean, and you have to either solve the errors by hand,
or re-apply the set of package updates that both branches did. And if you choose to solve it by hand, you’ll start to
notice some package duplication here and there. For example, from React’s `yarn.lock`:

```txt
debug@^2.1.1, debug@^2.2.0:
  version "2.6.6"
  resolved "https://registry.yarnpkg.com/debug/-/debug 2.6.6.tgz#a9fa6fbe9ca43cf1e79f73b75c0189cbb7d6db5a"
  dependencies:
    ms "0.7.3"

debug@^2.6.3:
  version "2.6.8"
  resolved "https://registry.yarnpkg.com/debug/-/debug-2.6.8.tgz#e731531ca2ede27d188222427da17821d68ff4fc"
  dependencies:
    ms "2.0.0"
```

`yarn.lock` lists all dependencies in the project (both direct and transitive). For each dependency, it includes the
version requested in `package.json`, the actual installed version of the package, and the dependencies of such package.

For example, in the above code, we have that some package of our project depends on `debug ^2.6.3`, but yarn installed
`debug 2.6.8`. This is fine, because `2.6.8` can satisfy the requirement of `^2.6.3` and it is more modern.

In the next block we see that some package depends on `debug ^2.1.1`, and some other package depends on `debug ^2.2.0`.
But in this case yarn installed `debug 2.6.6`, even when `debug 2.6.8` (which is already installed!) could satisfy the
dependencies as well. What we have here is package duplication: our project uses two different versions of `debug` when
in fact we only need one to satisfy all requirements.

This is not only duplicated information in `yarn.lock`. You can actually see both packages in `node_modules/`:

```shell
$ cat node_modules/debug/package.json | grep version
  "version": "2.6.6",

$ cat node_modules/istanbul-lib-source-maps/node_modules/debug/package.json | grep version
  "version": "2.6.8",
```

Package duplication has a few bad consequences. Your dependencies will take longer to install and, probably more
important, if you are bundling your duplicated dependencies and serving them to a browser your bundle will be bigger
than it should be.

I wrote a tool to help you identify and resolve those dependencies. It is called
[yarn-deduplicate](https://www.npmjs.com/package/yarn-deduplicate) (originally called `yarn-tools`). The CLI flags
should be self-explanatory but if you want to read more, check the
[README](https://github.com/scinos/yarn-deduplicate/blob/master/README.md).

For completeness, these are all duplicated dependencies in React at the time of writing:

```txt
Package "ansi-styles" wants ^3.0.0 and could get 3.1.0, but got 3.0.0
Package "babylon" wants ^6.11.0 and could get 6.17.4, but got 6.15.0
Package "babylon" wants ^6.13.0 and could get 6.17.4, but got 6.17.0
Package "babylon" wants ^6.15.0 and could get 6.17.4, but got 6.17.0
Package "babylon" wants ^6.17.0 and could get 6.17.4, but got 6.17.0
Package "chalk" wants * and could get 2.0.1, but got 1.1.3
Package "debug" wants ^2.1.1 and could get 2.6.8, but got 2.6.6
Package "debug" wants ^2.2.0 and could get 2.6.8, but got 2.6.6
Package "fsevents" wants ^1.0.0 and could get 1.1.2, but got 1.1.1
Package "istanbul-lib-coverage" wants ^1.0.2 and could get 1.1.1, but got 1.0.2
Package "istanbul-lib-instrument" wants ^1.6.2 and could get 1.7.4, but got 1.7.0
Package "js-yaml" wants ^3.5.1 and could get 3.8.3, but got 3.6.1
Package "node-pre-gyp" wants ^0.6.29 and could get 0.6.36, but got 0.6.34
Package "node-pre-gyp" wants ~0.6.32 and could get 0.6.36, but got 0.6.34
Package "request" wants 2 and could get 2.81.0, but got 2.79.0
```

By no means this is applies only to React. I scanned `yarn.lock` files from the most starred packages in GitHub and
others are affected too, like [Angular.js](https://github.com/angular/angular.js/blob/master/yarn.lock),
[Immutable.js](https://github.com/facebook/immutable-js/),
[Foundation for Sites](https://github.com/zurb/foundation-sites) or, funny enough, even
[yarn](https://github.com/yarnpkg/yarn/blob/master/yarn.lock) itself!

So if you are using `yarn.lock` in your project, chances are you are affected too. Please share your feedback if you use
[yarn-deduplicate](https://www.npmjs.com/package/yarn-deduplicate).

Thanks for reading :)

Update: The above only applies to Yarn 1.x or "classic". In Yarn 2.2.0 a
[similar feature](https://github.com/yarnpkg/berry/issues/2297) has been added to Yarn core.
