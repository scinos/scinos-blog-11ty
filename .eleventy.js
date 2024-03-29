const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const CleanCSS = require('clean-css');
const path = require('path');
const eleventyJsxPlugin = require('eleventy-plugin-react-ssr');
const markdownIt = require('markdown-it');
const markdownAnchor = require('markdown-it-anchor');

const hljs = require('highlight.js');

const mdOptions = {
    html: true,
    breaks: false,
    highlight: function (str, lang) {
        let content;
        if (lang && hljs.getLanguage(lang)) {
            content = hljs.highlight(str, {
                language: lang,
                ignoreIllegals: true,
            }).value;
        } else {
            content = md.utils.escapeHtml(str);
        }

        return `<pre><code class="language-${lang} hljs">${content}</code></pre>`;
    },
};
const mdParser = markdownIt(mdOptions);
const mdRenderer = markdownIt(mdOptions).use(markdownAnchor, {
    permalink: markdownAnchor.permalink.headerLink(),
    level: 2,
});

module.exports = function (eleventyConfig) {
    eleventyConfig.addFilter('cssmin', function (code) {
        return new CleanCSS({}).minify(code).styles;
    });

    eleventyConfig.setLibrary('md', mdRenderer);

    eleventyConfig.addWatchTarget('src/css');

    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(eleventyJsxPlugin, {
        babelConfig: {
            cache: true,
            plugins: [['inline-react-svg', { svgo: false }]],
        },
    });

    eleventyConfig.addPassthroughCopy('src/img');

    eleventyConfig.addCollection('posts', function (collectionApi) {
        const posts = collectionApi.getFilteredByGlob('./src/posts/**/*.md');

        posts.forEach((post) => {
            const postTokens = mdParser.parse(
                post.template.frontMatter.content,
                {}
            );
            const headingTokenIndex = postTokens.findIndex(
                (token) => token.type === 'heading_open' && token.tag === 'h1'
            );
            if (headingTokenIndex === -1) {
                throw new Error(
                    "Can't extract title from post " + post.inputPath
                );
            }
            const titleToken = postTokens[headingTokenIndex + 1];
            post.data.title = mdRenderer.renderer.render([titleToken], {});
        });
        return posts;
    });

    eleventyConfig.addCollection('tags', function (collectionApi) {
        const posts = collectionApi.getFilteredByGlob('./src/posts/**/*.md');
        const tags = posts.reduce((set, post) => {
            post.data.tags.forEach((tag) => set.add(tag));
            return set;
        }, new Set());
        return Array.from(tags);
    });

    return {
        passthroughFileCopy: true,
        dir: {
            input: 'src',
        },
    };
};
