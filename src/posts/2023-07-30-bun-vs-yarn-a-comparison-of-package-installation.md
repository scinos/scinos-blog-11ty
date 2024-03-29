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

## TLDR

Bun 0.6.5 is ~10 seconds faster than Yarn 3.6.1 (`9.616s` vs `19.536s`)

**Update 2023/08/05**: Bun 0.7.3 is ~11 seconds faster than Yarn v3 or Yarn v4 (`8.482s` vs `19.536s`)

**Update 2023/08/08**: In Linux, Bun 0.7.3 is ~52 seconds faster than Yarn v3 (`7.868s` vs `60.374s`)

## Setup

I selected the existing medium-large project [Automattic/wp-calypso](https://github.com/Automattic/wp-calypso) for this
test. With 97 packages and roughly 3000 external dependencies, it provided a comprehensive testing ground. It's open
source, so anybody can replicate these tests.

I ran the tests on an MBP M1 Max using Bun 0.6.15 and Yarn 3.6.1 (see [updates](#updates) for comparison with more
recent versions), simulating a fresh install with a warm network cache. In other words, I'm comparing `yarn install` vs
`bun install` with clean `node_modules`. I'm using Node 18.13.0 with `NODE_OPTIONS=--max-old-space-size=12288`.

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
  verify it until the issue is resolved (update: [it has been fixed](#2024%2F08%2F07)).

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

Yarn mean time is **19.536s**, while Bun mean time is **9.616s**, so it is 10 seconds fater (or about ~~2x faster~~ see
[updates](#2024%2F08%2F06)). A few notes:

- Despite all my efforts, this is still not comparing apples to apples. I couldn't reuse Bun lockfile beetween runs, and
  the resolution bugs means the dependency trees are not exactly the same. Yarn provides more features at install time
  (so it does more work) that can't be disabled or emulated in Bun. But I think this is the closest we can get to a fair
  comparison right now.

- Bun's first run (_after_ the network cache is primed, i.e. all packages are already downloaded) took ~14 seconds,
  while subsequent runs took ~9 seconds, indicating some persistent caching. Whithout knowing more about this cache and
  how it will behave on CI, I can't tell which figure (14s or 9s) is more correct. I'll update the post once I know more
  ([relevant question in their Discord server](https://discord.com/channels/876711213126520882/1135079573462188062))
  (update: [question solved](#2024%2F08%2F06))

- Deleting `bun.lockb` is wrong, as it should be persisted in the repo like `yarn.lock`. However, because the issue
  described above, it's a neecesary workaround right now. I don't now how this affect Bun performance, but I imagine Bun
  will get faster once I don't have to delete it. I'll update the post once the
  [issue](https://github.com/oven-sh/bun/issues/3685) is fixed. (Update: [it has been fixed](#2024%2F08%2F07))

- Yarn will show information about missing peer dependencies when running `yarn install`, which is something Bun
  ignores. I believe this is a critical issue for a healthy dependency tree, and I hope Bun implements it eventually.
  This crucial difference could influence your choice between the two.

  ![Yarn shows information about missing peer dependencies](/img/posts/yarn-vs-bun/image-3.png)

- Yarn's hoisting and deduplication appeared more efficient, resulting in a smaller total size for `node_modules`. With
  Bun, all `node_modules` sum 2,193,452 kb, with Yarn it is 2,061,172 kb (or about 132 mb less):

  ![Size of all node_modules when using Bun](/img/posts/yarn-vs-bun/image-6.png)

  ![Size of all node_modules when using Yarn](/img/posts/yarn-vs-bun/image-5.png)

## Conclusion

Personal opinion: In a project of this size, Bun is roughly 10 seconds faster than Yarn (very far from the 30x claim in
the oficial docs), and it could likely become even faster once certain issues are resolved. However, given the existing
bugs and the functionality that's missing compared to Yarn, I believe that the speed improvement doesn't quite justify
the tradeoffs right now.

**Update 2023/08/08**: The story is quite different in Linux (and therefore, in CI agents). There, Bun is much faster
(50 seconds faster). It's a very interesting trade-off, becuase shaving almost 1 minute from CI is huge (specially in
projects with a high change frequency), but it's hard to let go the correctness that Yarn brings to the table with the
analysis of missing peer dependencies. Maybe the ideal setup is to have a separate CI test with Yarn just to test for
correctness, but that means in practice maintaing two separate configurations and the risks of them drifting apart with
time.

---

## Updates

### 2023/08/05

I've tried Yarn 4.0 (`4.0.0-rc.48.git.20230729.hash-8d70543` to be more specific) and the results are very similar (in
fact, a bit slower than Yarn v3):

![Results of running yarn (v4) install 10 times with hyperfine. Mean time is 21.041 s ±0.250 s](/img/posts/yarn-vs-bun/image-7.png)

I've been seen some confusion around the "2x faster" statement. It is wrong because "2x faster" hints there is a linear
relationship between Yarn and Bun install times, but that is not correct. With a single datapoint we don't know if it s
"always twice as fast", or "always 10 second slower" or something else.

It's worth mentioning that, in this test, `postinstall` and `prepare` scripts were disabled. That is ok for the test,
but is a not good indicator of real-life performance because without those scripts, the repo just won't work (as in,
some tooling will be missing). When I enabled those scripts, the installation times are aprox 40s vs 50s. Bun is still
faster, but not "2x faster".

### 2023/08/06

I've been told by Jarred Sumner (Bun author) that the difference between Bun runs (9s vs 14s) is most likely caused by
the manifest cache.

### 2023/08/07

The bug with `bun.lockb` has been fixed in Bun 0.7.3. Now I can run the test persisting `bun.lockb` between runs. The
results are:

![Results of running bun install 10 times with hyperfine and Bun 0.7.3. Mean time is 8.482 s ±0.148 s](/img/posts/yarn-vs-bun/image-8.png)

### 2023/08/08

As requested by Yarn and Bun community, I run the tests on Linux. It's not a very powerful computer though: an Intel NUC
7CJYHN with a dual-core Intel Celeron, 8Gb RAM and a cheap SSD. I'm still using Node 18.13.0 with
`NODE_OPTIONS=--max-old-space-size=2048`

It's worth mentioning that both package managers provide different ways to create files in `node_modules`, mainly using
hardlinks or copying files ([Yarn docs](https://yarnpkg.com/configuration/yarnrc#nmMode),
[Bun docs](https://github.com/oven-sh/bun/blob/main/docs/cli/bun-install.md#platform-specific-backends)). Different
modes have different performance characteristics, so I decided to test all of them:

- Yarn v3:

![Results of running yarn install with Yarn v3. Fastest backend is hardlinks-global, with a mean time of 60.374 s ±2.282 s](/img/posts/yarn-vs-bun/image-9.png)

- Bun v0.7.3:

![Results of running bun install with Bun v0.7.3. Fastest backend is clonefile, with a mean time of 7.868s ±2.625 s](/img/posts/yarn-vs-bun/image-10.png)

An in-depth analysis of each mode is off-topic for this post (but something I'd like to investigate in the future). In a
nutshell, Yarn's `hardlinks-global` and Bun's `clonefile` use hardlinks to link each package in `node_modules` from a
central location (respectively, `.yarn/berry/cache/` and `.bun/install/cache/`), so the approaches are equivalent.

Interstingly, Bun docs says `clonefile` is only available in MacOS, but doesn't seem to be the case (at least I didn't
get any error). Nevertheless, Bun is **much** faster than Yarn in Linux (60.374s vs 7.868s).
