/* eslint-disable jsx-a11y/img-redundant-alt */
import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import { Copyright } from './copyright';
import { Socials } from './socials';

export function Sidebar() {
    const { siteconfig, page } = useContext(EleventyContext);
    return (
        <div className="sidebar">
            <a href="/" className="logo">
                <img
                    width="256"
                    height="256"
                    src="/img/logo.png"
                    alt="Funny picture of Sergio Cinos, black and white, finger pointing"
                />
            </a>
            <Socials />
            <nav>
                <ul>
                    {siteconfig.navigation.map(({ url, title }, idx) => {
                        return (
                            <li
                                key={idx}
                                className={url === page.url ? 'active' : ''}
                            >
                                <a href={url}>{title}</a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <Copyright />
        </div>
    );
}
