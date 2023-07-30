Dependencies play a critical role in the development of web applications. In this post, we'll explore the history of
package depenencies and how they evolved over time.

# Early dependencies

In the beginning, we didn't have any automated way of installing dependencies for a project. Developers would directly
download the libraries or frameworks they needed from the official websites or repositories. These files would then be
included in the project manually. For instance, if a developer needed to use jQuery, they would download it from the
jQuery website and include the jQuery.js file in their HTML.

Alternatively, many libraries also distributed their JS file via CDN. Instead of downloading `jQuery.js` and serving it
from your static resources directory (like any other script or image), you added a script tag that loaded `jQuery.js`
from a CDN (example: `<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js"></script>`). The main
benefit of this method was that if the user has already downloaded jQuery from the _same_ CDN, it would be cached
locally and it should be faster to load. Or at least that was the intention.

Well known libraries provided different JS files: minimized, without polyfills, development-friendly... Some libraries
(for example, [jQueryUI](https://jqueryui.com/download/)) provided an online bundler where you could select which
features you need, and it will create a `jQueryUI.js` with just those features and nothing else.

As you can see, the process was quite manual and cumbersome. Thankfully, it wasn't very common to have many
dependencies. Unless we are talking about jQuery plugins. It was common to have jQuery, jQueryUI and some jQuery
plugins. This added an extra layer of complexity, as you need to make sure all versions were compatible. Semver (as a
spec) was not a thing back then, so finding out compatible versions was an exercise of reading READMEs, blog posts and
forums to find the answer. On top of that, plugins (or in general, related dependencies) had to be loaded in a specific
order. I do remember many

There were some proto-package-managers (mostly small bash scripts) that were trying to atuomate the process of
downloading scripts and keep them up-to-date. As far as I know, no one catched up. Until Bower.

# Bower

Bower was released in 2012 by Twitter. While this was released years after NPM, my feeling is that most web projects
adopted Bower before using NPM. This is probably because NPM wasn't mature enought back then.

Bower's phiollosofy was to do one thing and do it well. It didn't bother with minification, bundling or altering JS in
any way. It was "just" a CLI to download dependencies, recursive dependencies and keep them up-to-date. It was built
around a set of core ideas:

- Git for everything. A "package" was a GitHub repo. Installing a package was virtually the same as cloning a GitHub
  repo.
