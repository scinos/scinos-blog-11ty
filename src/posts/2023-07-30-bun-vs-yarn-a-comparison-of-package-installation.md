---
tags:
  - yarn
  - package_management
description:
  Bun vs Yarn:, An In-Depth Comparison for Package Management in Node.js Projects. This detailed analysis explores the
  efficiency and functionality of Bun as a potential alternative to Yarn. Using a real-world medium-large project, the
  author investigates claims of Bun's superior speed, uncovers several issues, and provides insights that could inform
  your choice between these two package managers. A transparent and nuanced look at what each tool offers, perfect for
  developers seeking an informed decision.
---

# Bun vs Yarn: A Comparison of Package Installation

[Bun](https://bun.sh/) was recently announced as a faster alternative to Node.js. This "all-in-one" solution can also
replace [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/) or [pNPm](https://pnpm.io/) as a package manager for
your projects.

Many comparisons assert that Bun is several times faster than Yarn, with the Bun website even claiming that it's 30x
faster. However, I've discovered that these benchmarks often use outdated Yarn versions or are misconfigured. Intrigued,
I decided to conduct my own tests, focusing on Bun's package management capabilities (`bun install`) without exploring
other features like testing, runtime, or bundling.

Disclaimer: I have my reservations about Bun (generally disliking all-in-one approaches) and I appreciate Yarn and
consider it the best package manager for Node.js overall. Despite this preference, I aimed for an unbiased comparison. I
expect Bun to perform faster for several reasons, including its simplicity and use of [Zig](https://ziglang.org/).

**Update**: After getting feedback from both Yarn and Bun communities (thanks!), I've updated some results. Updates are
at the end of the blogpost, in the form of footnotes.

## Setup

I selected the existing medium-large project [Automattic/wp-calypso](https://github.com/Automattic/wp-calypso) for this
test. With 97 packages and roughly 3000 external dependencies, it provided a comprehensive testing ground. It's open
source, so anybody can replicate these tests.

I ran the tests on an MBP M1 Max using Bun 0.6.15 and Yarn 3.6.1[^1], simulating a fresh install with a warm network
cache. In other words, I'm comparing `yarn install` vs `bun install` with clean `node_modules`.

## Preparation

Before the test, I made sure both package managers generated the same dependency tree, using the tool
[`effective-depenency-tree`](https://www.npmjs.com/package/effective-dependency-tree).

This tool will generate the "logical" view of the dependency tree. You can see which packages requires what
dependencies, not depending on its fisical location in the file system or if they have been hoisted/deduped. I wrote
this tool to help projects migrate between different package managers (or versions) to ensure there are not unexpected
changes in the dependency tree. This logical view ensured consistency between the two systems.

Porting the project to Bun wasn't straightforward. I encountered several issues, which I have detailed below to assist
anyone attempting a similar transition:

- **Life-cycle scripts**: Yarn will run `postinstall` for local packages and external dependencies, while Bun will run
  `postinstall` _only_ for local packages (by default). I
  [disabled script execution in Yarn](https://yarnpkg.com/configuration/yarnrc#enableScripts) for consistency, and
  deleted any `postinstall` script from the repo.

  After fixing that, I discovered Bun will also run the script `prepare` for local packages (which is not docummented,
  [issue](https://github.com/oven-sh/bun/issues/3874)). To mimic this behaviour, I also deleted the script `prepare`
  from all packages in the monorepo.

- **Workspace protocol**: `wp-calypso` uses `workspace` protocol to link other packages in the monorepo, like:

  ```json
  "dependencies": {
    "@automattic/calypso-babel-config": "workspace:^"
  }
  ```

  This doesn't seem to be supported by Bun ([issue](https://github.com/oven-sh/bun/issues/3686)). I changed all of them
  to `workspace:*`, which is supported by both package managers. For this particular monorepo, the result should be the
  same.

- **Lock files**: Bun won't use the existing `yarn.lock` to know which specific versions where used to satisfy the
  version ranges ([issue](https://github.com/oven-sh/bun/issues/1751)). This will complicate the migration process for
  any repo that is not up-to-date, as migrating to Bun will effectively mean migrating all dependencies to the latest
  compatible version in one go. I think that's a bad thing, but for the purpose of these tests, we can reduce this
  effect by deleting `yarn.lock` and recreate it with `yarn install` to force a re-resolution of all dependencies.

- **Bun lock file**: Bun has a bug where it doesn't work if you have a lock file (`bun.lockb`) in a monorepo with linked
  packages, and you delete `node_modules` ([issue](https://github.com/oven-sh/bun/issues/3685)). I had to delete
  `bun.lockb` between runs (otherwise it doesn't work). It probably affects installation times, but I'm not able to
  verify it until the issue is resolved.

- **Wrong semver resoution**: There is a couple of bugs in Bun that affect which versions are used to satisfy semver
  ranges. This causes the dependency trees between Yarn and Bun to not be exactly the same:

  - Pre-release versions are not resolved correctly. For example, when resolving `html-webpack-plugin@^5.0.0-beta.4` it
    will use `html-webpack-plugin@5.0.0-beta.6`, even when `html-webpack-plugin@5.5.3` is available
    ([issue](https://github.com/oven-sh/bun/issues/3684)).

  - It picks the oldest version available, not the highest one. For example, when resolving `minimatch@^3.0.4` it will
    use `minimatch@3.0.8` instead of `minimatch@3.1.2`. This is likely because `3.0.8` was published _after_ `3.1.2`
    ([issue](https://github.com/oven-sh/bun/issues/3873)).

- **Forced resolutions**: `wp-calypso` uses a bunch of forced resolutions. This is required for the repo to work and
  eliminate some duplicated packages, but Bun doesn't support it yet
  ([issue](https://github.com/oven-sh/bun/issues/1134)). For this comparison, I've deleted the `resolutions` entry.

## Running the Test

I cloned the repo twice (`wp-calypso-bun` and `wp-calypso-yarn`), applied the necessary changes in both instances to
make them behave similary, and used `hyperfine` to run the tests.

- Bun: `hyperfine --shell zsh --prepare 'rm -fr **/node_modules bun.lockb' 'bun install'`:

  ![Results of running bun install 10 times with hyperfine. Mean time is 9.616 s ±1.564 s](/img/posts/yarn-vs-bun/image-1.png)

- Yarn: `hyperfine --shell zsh --prepare 'rm -fr **/node_modules' 'yarn install'`:

  ![results of running yarn install 10 times with hyperfine. Mean time is 19.536 s ±0.422 s](/img/posts/yarn-vs-bun/image-2.png)

## Results

Yarn mean time is **19.536s**, while Bun mean time is **9.616s**, so it is 10 seconds fater (or about ~~2x
faster~~[^2]). A few notes:

- Despite all my efforts, this is still not comparing apples to apples. I couldn't reuse Bun lockfile beetween runs, and
  the resolution bugs means the dependency trees are not exactly the same. Yarn provides more features at install time
  (so it does more work) that can't be disabled or emulated in Bun. But I think this is the closest we can get to a fair
  comparison right now.

- Bun's first run (_after_ the network cache is primed, i.e. all packages are already downloaded) took ~14 seconds,
  while subsequent runs took ~9 seconds, indicating some persistent caching. Whithout knowing more about this cache and
  how it will behave on CI, I can't tell which figure (14s or 9s) is more correct. I'll update the post once I know more
  ([relevant question in their Discord server](https://discord.com/channels/876711213126520882/1135079573462188062))
  (see [^3])

- Deleting `bun.lockb` is wrong, as it should be persisted in the repo like `yarn.lock`. However, because the issue
  described above, it's a neecesary workaround right now. I don't now how this affect Bun performance, but I imagine Bun
  will get faster once I don't have to delete it. I'll update the post once the
  [issue](https://github.com/oven-sh/bun/issues/3685) is fixed.

- Yarn will show information about missing peer dependencies when running `yarn install`, which is something Bun
  ignores. I believe this is a critical issue for a healthy dependency tree, and I hope Bun implements it eventually.
  This crucial difference could influence your choice between the two.

  ![Yarn shows information about missing peer dependencies](/img/posts/yarn-vs-bun/image-3.png)

- Yarn's hoisting and deduplication appeared more efficient, resulting in a smaller total size for `node_modules`. With
  Bun, all `node_modules` sum 2,193,452 kb, with Yarn it is 2,061,172 kb (or about 132 mb less):

  ![Size of all node_modules when using Bun](/img/posts/yarn-vs-bun/image-6.png)

  ![Size of all node_modules when using Yarn](/img/posts/yarn-vs-bun/image-5.png)

## Conclusion

Personal opinion: In a project of this size, Bun is roughly ~~twice as fast~~ 10 seconds faster than Yarn (very far from
the 30x claim in the oficial docs), and it could likely become even faster once certain issues are resolved. However,
given the existing bugs and the functionality that's missing compared to Yarn, I believe that the speed improvement
doesn't quite justify the tradeoffs right now.

---

## Updates

<!--lint disable code-block-style-->

[^1]:
    I've tried Yarn 4.0 (`4.0.0-rc.48.git.20230729.hash-8d70543` to be more specific) and the results are very similar
    (in fact, a bit slower than Yarn v3):

    ![Results of running yarn (v4) install 10 times with hyperfine. Mean time is 21.041 s ±0.250 s](/img/posts/yarn-vs-bun/image-7.png)

[^2]:
    In reality "2x faster" or "twice as fast" figure is very misleading. In this test `postinstall` and `prepare`
    scripts were disabled, but that's not realistic as the repo won't work unlees those scripts are executed. If I
    enable those scripts, then installation times are aprox. 40s vs 50s. Bun is still 10 seconds faster, but it is not
    "twice as fast" anymore.

[^3]: I've been told by Jarred Sumner (Bun author) that the difference is most likely caused by the manifest cache.

<!--lint enable code-block-style-->
