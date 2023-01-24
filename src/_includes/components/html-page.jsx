import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import stripTags from 'striptags';
import { Sidebar } from './sidebar';
import { InlineStyle } from './inline-style';
import { Copyright } from './copyright';

export function HTMLPage({ children }) {
    const { title, eleventy } = useContext(EleventyContext);
    const { generator } = eleventy;

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <title>{stripTags(title)}</title>
                <meta name="generator" content={generator} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Alegreya&family=Oswald&display=swap"
                    rel="stylesheet"
                />

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
