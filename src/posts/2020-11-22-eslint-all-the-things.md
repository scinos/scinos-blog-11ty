---
tags:
  - eslint
  - linting
description:
  Learn how to use ESLint to enforce consistent code style, best practices, and prevent dangerous patterns beyond just
  JavaScript and TypeScript. With its plugin system, you can easily extend ESLint to integrate with other tools like
  Prettier or even lint Markdown files. This post series will guide you through setting up ESLint with Prettier, linting
  Markdown files, and configuring VSCode for an optimized development experience. Follow along to improve your code
  quality and save time with automatic fixes.
---

# ESLint all the things!

[ESlint](https://eslint.org/) is an awesome tool that allow us to keep a consistent code style across the code, enforce
best practices and forbid dangerous patterns. It is usually used to lint JavaScript (or TypeScript) files, but it can do
way more.

Its plugin system gives us lots of ways to extend eslint, not only by adding new rules but delegating part of the
processing to other tools like [Prettier](https://prettier.io/), or even parse files other than JavaScript (for example,
Markdown).

This allows eslint to act as the central tool to orchestrate code style, formatting and syntax verifications across all
file types. This gives developer all the eslint capabilities, like an amazing IDE integration, being able to customize
rules using `.eslintrc` files or overrides, apply auto-fixes...

In this series of post I'll explain how to configure ESLint to use Prettier, how to lint Markdown files (including code
blocks!) and how to configure VSCode to better work with this setup.

- [Part I: ESLint + Prettier](/posts/2020-11-23-eslint-plus-prettier/)
- [Part II: ESLint for Markdown files](/posts/2020-11-24-eslint-for-markdown/)
- Part III: Configuring VSCode
