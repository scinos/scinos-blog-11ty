import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import { Sidebar } from './sidebar';
// import { Navbar } from './navbar';
// import { Footer } from './footer';
import { InlineStyle } from './inline-style';

export function HTMLPage({ children }) {
    const { title, eleventy } = useContext(EleventyContext);
    const { generator } = eleventy;

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <title>{title}</title>
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
                        '../../css/base.css',
                        '../../css/index.css',
                        '../../css/tags.css',
                        '../../css/post.css',
                        '../../css/sidebar.css',
                        '../../css/post-entry.css',
                        '../../css/footer.css',
                        '../../css/post-header.css',
                        require.resolve(
                            'highlight.js/styles/base16/solarized-dark.css'
                        ),
                        // '../../css/navbar.css',
                        // '../../css/gallery.css',
                        // '../../css/footer.css',
                    ]}
                />
            </head>

            <body>
                <div id="page">
                    <Sidebar />
                    <div className="content">
                        {/* <Navbar /> */}
                        {children}
                    </div>
                </div>

                <script
                    defer
                    src="https://static.cloudflareinsights.com/beacon.min.js"
                    data-cf-beacon='{"token": "14e2f68d799d458e87d0331508ebf106"}'
                />
            </body>
        </html>
    );
}
