import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import stripTags from 'striptags';
import { Sidebar } from './sidebar';
import { InlineStyle } from './inline-style';
import { Copyright } from './copyright';

export function HTMLPage({ children }) {
    const {
        title: titleWithTags,
        description: postDescription,
        eleventy,
        siteconfig,
    } = useContext(EleventyContext);
    const { generator } = eleventy;

    const { metadata, urls } = siteconfig;

    const description = postDescription ?? metadata.description;
    const title = stripTags(titleWithTags);

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <title>{title}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@300&family=Alegreya:wght@700&family=Fira+Code&display=swap"
                    rel="stylesheet"
                />

                <meta name="generator" content={generator} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={urls.main} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={urls.mainImage} />
                <meta name="twitter:site" content={metadata.twitterHandle} />
                <meta name="twitter:creator" content={metadata.twitterHandle} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="author" content="Sergio Cinos" />

                <InlineStyle
                    styles={[
                        '../../css/vars.css',
                        '../../css/layout.css',
                        '../../css/base.css',
                        '../../css/sidebar.css',
                        '../../css/responsive.css',
                        require.resolve(
                            'highlight.js/styles/base16/solarized-dark.css'
                        ),
                    ]}
                />
            </head>

            <body>
                <div id="page">
                    <Sidebar />
                    <main>{children}</main>
                    <Copyright />
                </div>
            </body>
        </html>
    );
}
