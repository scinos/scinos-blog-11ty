---
tags:
  - eslint
  - prettier
  - linting
---

# Part I: ESLint + Prettier

## Setup

Usually this setup raises two questions:

### Do you really need prettier and ESLint?

Yes, you probably need both. They seems to solve the same problem (but they don't) and certainly there is some overlap,
but the goals are different. As the [Prettier docs](https://prettier.io/docs/en/comparison.html) puts it: use Prettier
to enforce a consistent formatting, use ESLint to catch bugs.

### But why run prettier "inside" ESLint?

You certainly don't have to. Prettier has its own binary that supports running it on a subset of files and fixing them,
and most editors have decent support for Prettier.

However, running both sometimes confuses the IDE, specially if you configure it to auto-fix the file on save. If they
are misconfigured, ESLint autofix may do a change that makes Prettier unhappy and it will revert it on save, getting a
weird conflict that usually ends up with a permanent squiggly red line in your editor that you can't easily get rid off.

Another reason is to take advantage of all ESLint features, like having composable config files per directory,
overriding some set of rules for files matching a glob or generate statistics about number of errors in your files. By
running Prettier inside ESLint you automatically tap into all those features for free.

---

To have Prettier running as a part of ESLint, you need to install a few dependencies:

```shell
npm install --save-dev prettier eslint-plugin-prettier eslint-config-prettier
```

- `prettier`: the actual Prettier package.

- `eslint-plugin-prettier`: is a ESLint plugin that allows running Prettier as a lint rule. It exposes a rule named
  `prettier/prettier`.

- `eslint-config-prettier`: is a preset that disables ESLint rules that conflict with Prettier checks.

Then, in your `.eslintrc` config file you need to add:

```json
{
	"extends": ["plugin:prettier/recommended"]
}
```

This does three things for you:

- Enables `eslint-plugin-prettier`
- Sets the rule `prettier/prettier` to `"error"`
- Extends `eslint-config-prettier`

And that's pretty much it, now you should see Prettier errors as ESLint errors:

The rule `prettier/prettier` is auto-fixable, so if you run ESLint with `eslint --fix .` (or configure your IDE to
automatically apply eslint fixes), it should fix all errors reported by Prettier.

## Configuring Prettier rules

The new `prettier/prettier` rule will read the defaults from `.prettierrc` (like `prettier`). But if you want, you can
configure it directly in `.eslintrc`, including setting overrides for some parts of your code.

To do so, you can configure it like any other ESLint rule:

```json
{
    "rules": {
        "prettier/prettier": ["error", {
            "singleQuote": true
        }]
    }
}
```

See more options in the [plugin docs](https://github.com/prettier/eslint-plugin-prettier#options)

## Avoiding conflicts with ESLint

Prettier and ESLint have some overlap. For example, both can be configured to check for a particular quote style. When
using Prettier+ESLint, it is recommended to disable ESLint rules that overlap and let Prettier do its job. The plugin
`eslint-config-prettier` does exactly that, and if you followed the installation steps described above it should be
active.

However, that is not the only case. For example, if you use
[`eslint-plugin-react`](https://github.com/yannickcr/eslint-plugin-react) it enables some rules that also conflict with
Prettier. Similarly, the best option is disable `eslint-plugin-react rules` that conflict with Prettier:

```json
{
    "extends": [
        "plugin:prettier/recommended",
        "prettier/react",
    ]
}
```

In general, if you use `eslint-plugin-foo`, you should also extend from `prettier/foo` (if available) to disable the
conflicting rules. This is the
[list of supported plugins](https://github.com/prettier/eslint-config-prettier#installation).

---

That's all, I hope you find this setup useful :)
