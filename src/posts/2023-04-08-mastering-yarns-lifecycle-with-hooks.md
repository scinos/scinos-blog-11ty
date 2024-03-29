---
tags:
  - yarn
description:
  Learn how to create custom Yarn plugins and take your Node.js package management to the next level. In this tutorial,
  you will master Yarn's lifecycle hooks by creating a plugin that checks whether the environment is correctly set up.
  Whether you're a beginner or an experienced developer, this tutorial will equip you with the knowledge you need to
  create your own Yarn plugins.
---

# Mastering Yarn's lifecycle with hooks

Yarn is a powerful package manager for Node.js projects that comes with a rich set of features, including support for
plugins (starting with Yarn 2.x).

As your project grows in size and complexity, you might find that you need to extend the functionality of Yarn to cater
to your specific requirements. This is where custom Yarn plugins can help you. By writing a custom Yarn plugin, you can
add new commands, modify existing ones, and integrate external tools and services. In this blog post, we'll take a look
at the process of creating custom Yarn plugins.

Whether you are a beginner or an experienced developer, this post will equip you with the knowledge you need to create
your own Yarn plugins and elevate your package management game.

---

Imagine you need to ensure that all contributors to your project have properly set up their local environment before
they can make any changes. This is commonly referred to as a "project doctor". In this case, you need to check whether
they have configured the maximum Node memory by setting up `--max-old-space-size` in the `NODE_OPTIONS` environment
variable.

To achieve this, we will create a custom yarn hook that runs every time a developer runs `yarn install` and validates
that the environment is correctly set up.

## Register the plugin

First, let's start by telling Yarn the location of our plugin. Open `.yarnrc.yml` and add a new entry:

```yaml
plugins:
  - ./my-plugin.js
```

## Plugins skeleton

This is the basic set up of an empty plugin. Save this as `my-plugin.js`:

```js
module.exports = {
    name: 'my-plugin',
    factory: () => {
        return {
            hooks: {},
        };
    },
};
```

`hooks` is an object that allows us to hook into the Yarn lifecycle steps. The
[official documentation](https://yarnpkg.com/advanced/plugin-tutorial#official-hooks) is not very comprehensive, but is
a good starting point to know what hooks are available. Checking the
[source code of the Hooks implementation](https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-core/sources/Plugin.ts#L46)
may be helpful to have a better understanding of the API.

## Validating a project

There is a hook called `validateProject` that does exactly what we need: runs before the `install` method and checks
that the project is valid. Because it runs _before_ `install`, it means we can't rely on any external dependency being
installed. Yarn provides [a bundler](https://yarnpkg.com/advanced/plugin-tutorial#all-in-one-plugin-builder) to overcome
this limitation, but for our example we don't need to worry about it.

Let's start with our project validation. Change `my-plugin.js` to:

```js
module.exports = {
    name: 'yarn-doctor',
    factory: () => {
        return {
            hooks: {
                validateProject(project, report) {
                    console.log("Hello world");
                }
            },
        };
    },
};
```

Now, when you run `yarn install`, you should see the plugin in action:

```bash
$ yarn install

Hello world
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: Done in 0s 31ms
```

## Doing the actual check

We are almost there. All we need to do is change our hook implementation to check the value of `NODE_OPTIONS`, and
report an error if it doesn't match our expectations. Change the implementation to:

```js
module.exports = {
    name: `yarn-doctor`,
    factory: () => {
        return {
            hooks: {
                validateProject(project, report) {
                    if (!process.env.NODE_OPTIONS) {
                        // reportError is specified in
                        // https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-core/sources/Plugin.ts#L144
                        //
                        // After some trial an error, I found that MessageName is _mandatory_ and a it must be a Number.
                        // It will be used to generate an error code like YN0099. As far as I know there is no
                        // recommendation about what error codes we should use for our custom errors.
                        report.reportError(99, "NODE_OPTIONS is not set");
                        return;
                    }

                    const match = process.env.NODE_OPTIONS.match( /--max-old-space-size=([0-9]+)/ );
                    if (!match) {
                        report.reportError(99, "max-old-space-size not set");
                    }
                },
            },
        };
    },
};
```

## See it in action

We can run a few commands to verify it works.

This is what happens when NODE_OPTIONS is not set:

```bash
$ NODE_OPTIONS="" yarn install

➤ YN0000: ┌ Project validation
➤ YN0099: │ NODE_OPTIONS is not set
➤ YN0000: └ Completed
...
➤ YN0000: Failed with errors in 0s 30ms
```

And this is the error when set to an invalid value

```bash
$ NODE_OPTIONS="foo" yarn install

➤ YN0000: ┌ Project validation
➤ YN0099: │ max-old-space-size not set
➤ YN0000: └ Completed
...
➤ YN0000: Failed with errors in 0s 30ms
```

And finally, this is what happens when the env var is correctly set:

```bash
# Simulate that NODE_OPTIONS is not set
$ NODE_OPTIONS="--max-old-space-size=1024" yarn install

...
➤ YN0000: Done in 0s 31ms
```

## Taking it from here

This example of checking an environment variable is just a small glimpse into the potential of Yarn hooks. For
medium-sized or larger teams, this concept of a "project doctor" can be taken even further to validate various aspects
of contributors' environments, such as environment variables, IDE configurations, authentication credentials, network
settings, and more.

In general, tapping into the Yarn lifecycle has tremendous potential to improve the developer experience for your
contributors. Just by browsing the list of available hooks, it's easy to imagine many use cases that can help your
developers:

- Use the `afterWorkspaceDependencyAddition` hook to ensure new dependencies meet your standards.
- Use `cleanGlobalArtifacts` to clear up other caches besides Yarn's.
- Use `fetchPackageInfo` to enhance package information with known vulnerabilities.
- Use `getNpmAuthenticationHeader` to ensure devs can access your internal NPM registry.
- Use `setupScriptEnvironment` to set up environment variables before running any npm script.
- Use `wrapScriptExecution` to monitor which scripts are run by your contributors.

With the flexibility and power of Yarn hooks, the possibilities are endless.
