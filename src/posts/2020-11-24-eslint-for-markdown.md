---
tags:
  - eslint
  - markdown
  - prettier
  - linting
---

# Part II: ESLint for Markdown

ESLint can be used to validate files other than JavaScript. Markdown is a very good example, because you can apply
Prettier rules (eg: ensure consistent formatting) and linting rules (eg: validate that titles are not duplicated).

In this post I'm going to assume that you have ESLint+Prettier already working.

## Linting Markdown

First, you need to install the plugin

```bash
npm install --save-dev eslint-plugin-md
```

Then, extend it from your `.eslintrc` config file. The plugin exposes two presets: one to use standalone and another one
to use with Prettier. In this case we'll use the latter:

```javascript
{
    "extends": [
        "plugin:prettier/recommended",
        "plugin:md/prettier"
    ]
}
```

And that's pretty much it for the basic setup. This should give you error when there are style or format issues in your
Markdown files.

A thing worth mentioning is that since ESLInt 7.0 you don't have to specify the extensions anymore. Before 7.0 you had
to run `eslint --ext .js,.md` to lint JavaScript and Markdown files. Since 7.0,
[ESLint will verify all extensions for which you have an override](https://eslint.org/blog/2020/02/whats-coming-in-eslint-7.0.0#file-extensions-in-config-files)
in `.eslintrc`. And because the preset `plugin:md/prettier` defines an override for `*.md` , you only need to run
`eslint` to get linting for Markdown working.

## Rule configuration

The plugin exposes a new rule called `prettier/prettier`, but it has severity `"warning"` by default. If you want to
change it to `"error"`, you have to:

```json
{
  "overrides": [
    {
      "files": ["*.md"],
      "parser": "markdown-eslint-parser",
      "rules": {
        "prettier/prettier": [
          "error",
          {
            // Tells prettier to use `markdown` parser for .md files
            "parser": "markdown"
          }
        ]
      }
    }
  ]
}
```

The plugin also uses [remark-lint](https://github.com/remarkjs/remark-lint), a linter specialized in Markdown files. By
default it uses the preset
[markdown-style-guide](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide).
It exposes the results under a new eslint rule called `md/remark`.

Customize that rule is a bit tricky, as ESLint doesn't support composing rules configuration. Instead you have to
manually compose the rule configuration:

```javascript
{
  overrides: [
    files: [ '*.md' ],
    parser: 'markdown-eslint-parser',
    rules: {
        'md/remark': [
            'error',
            {
                plugins: [
                    // This is the original ruleset from `plugin:md/prettier`.
                    ...require( 'eslint-plugin-md' ).configs.prettier.rules[ 'md/remark' ][ 1 ].plugins,

                    // List of disabled rules form the preset
                    [ 'lint-maximum-heading-length', false ],
                    [ 'lint-no-duplicate-headings', false ],
                ],
            },
        ],
    },
  ]
}
```

## Skipping rules

Another tricky bit is how to add support for disabling rules directly from Markdown files (i.e. the equivalent of
`//eslint-disable-next-line`). It can be done by configuring the special rule `message-control`.

```javascript
{
    overrides: [
        {
            files: [ '*.md' ],
            parser: 'markdown-eslint-parser',
            rules: {
                'prettier/prettier': [
                    'error',
                    {
                        // Tells prettier to use `markdown` parser for .md files
                        parser: 'markdown',
                    },
                ],
                'md/remark': [
                    'error',
                    {
                        plugins: [
                            // This is the original ruleset from `plugin:md/prettier`.
                            // We need to include it again because eslint doesn't compose overrides
                            ...require( 'eslint-plugin-md' ).configs.prettier.rules[ 'md/remark' ][ 1 ].plugins,

                            // List of disabled rules form the preset
                            [ 'lint-maximum-heading-length', false ],
                            [ 'lint-no-duplicate-headings', false ],

                            // This special plugin is used to allow the syntax <!--eslint ignore <rule>-->.
                            // It has to come last!
                            [ 'message-control', { name: 'eslint', source: 'remark-lint' } ],
                        ],
                    },
                ],
            },
        },
    ],
```

### Linting code blocks

The above configuration gives you something really nice by default: it uses ESLint to lint fenced code blocks tagged as
`js` or `javascript`.

The way it works is quite clever: it uses
[ESLint preprocessors](https://eslint.org/docs/developer-guide/working-with-plugins#processors-in-plugins) to split a
the Markdown into "virtual" files: one the Markdown minus the code blocks, and one file for each code block, using the
tagged language as the extension. So, in the example above, ESLint sees a `README.md` without code blocks, and a
`README.md.js` with the content of the code block. It lint each file individually and then the plugin aggregate the
errors back so they make sense.

The names are not really important, they are only used to match the set of rules to apply. By default, a `js` code block
will be linted with the same rules as any JavaScript file in our project. But probably you want to relax some rules, as
code blocks are usually examples and not all rules make sense there.

To customize it, we can use an override:

```javascript
{
    overrides: [
        {
            files: [ '*.md.js', '*.md.javascript' ],
            rules: {
                // These are ok for examples
                'no-console': 'off',
                'no-redeclare': 'off',
                'no-restricted-imports': 'off',
                'no-undef': 'off',
                'no-unused-vars': 'off',
            },
        },
    ],
}
```

Just make sure the override is in the right order: another override down the line that matches `*.js` could overwrite
some of those rules.

---

I really hope you find this useful. In my opinion, linting Markdown files (both regular text and code blocks) is
critical for a project, as documentation is usually the first point of contact for new contributors and users.

Usually the very first thing they see is your `README.md`, it is the first impression they get form your project. It is
quite bad to see a README file with sloppy code examples or messed up heading. Similarly, having internal documentation
with examples that don't follow the code style is a source of frustration for new contributors that like to copy+paste
from the doc.
