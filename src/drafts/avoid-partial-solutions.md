---
tags:
  - yarn
  - ci
  - software_engineering
---

# Avoid partial solutions

When you run `yarn` to install dependencies, it will read `package.json` and `yarn.lock`, and after the dependencies are
installed, it will update `yarn.lock` as needed (for example, if you added a new dependency to `package.json`).

In all projects, you'd expect that if I check out a commit and I run `yarn`, it won't update `yarn.lock`. If that
happens it would mean that the author of the commit forgot to push an update for `yarn.lock`, and thus the commit is
incomplete. I've seen this called a "dirty commit", or more specifically, "yarn.lock is dirty".

Today we found a gap in our automated CI testing: we allow dirty commits. The team quickly fixed it by adding
`--frozen-lockfile` (unfortunatelly we are still in Yarn v1) to the CI scripts. The
[documentation](https://classic.yarnpkg.com/lang/en/docs/cli/install/#toc-yarn-install-frozen-lockfile) seems pretty
clear: "Don’t generate a `yarn.lock` lockfile and fail if an update is needed.". Problem fixed, right? Well, is not that
simple.

For starters, it's a [well-known issue](https://github.com/yarnpkg/yarn/issues/5840) that `yarn --frozen-lockfile` will
actually update `yarn.lock` in some cases and it won't fail. But that's not the point of this post. The point is that it
does work in some cases, it's a partial solution.

Should we apply that partial solution? I'd say that is a bad idea.

The problem is that there is nothing there that suggest `--frozen-lockfile` doesn't work as expected. If I read that
flag, I'd assume that it means it won't change the lockfile. And if I have any doubts (which I probably don't), a quick
search in the docs will confirm it. This causes a few problem:

- I believe that developers would be more inclined to not verify their changes (or lack thereof) in `yarn.lock`, because
  we already have a CI system to check for "dirtyness".

- When (not if) there is another dirty `yarn.lock`, I'll look for the bug elsewhere, because we already have a system to
  guard against it.
