import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import { Link } from './link';
import TwitterLogo from '../../img/twitter.svg';
import GitHubLogo from '../../img/github.svg';
import LinkedInLogo from '../../img/linkedin.svg';

export function Socials() {
    const { siteconfig } = useContext(EleventyContext);
    const { github, twitter, linkedin } = siteconfig.urls;

    return (
        <div className="socials">
            <span className="name">by Sergio Cinos</span>
            <div className="links">
                <Link href={twitter} className="twitter" external>
                    <TwitterLogo />
                    <span>Twitter profile</span>
                </Link>
                <Link href={github} className="github" external>
                    <GitHubLogo />
                    <span>GitHub profile</span>
                </Link>
                <Link href={linkedin} className="linkedin" external>
                    <LinkedInLogo />
                    <span>LinkedIn profile</span>
                </Link>
            </div>
        </div>
    );
}
