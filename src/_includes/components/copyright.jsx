import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import { Link } from './link';

export function Copyright() {
    const {
        eleventy: { generator },
        siteconfig,
    } = useContext(EleventyContext);
    const { repo, main, eleventy } = siteconfig.urls;

    return (
        <div className="copyright">
            <Link href={main}>This work</Link> is licensed under{' '}
            <Link
                href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1"
                external
                rel={['license']}
            >
                CC BY 4.0
            </Link>
            <br />
            Built with{' '}
            <Link href={eleventy} external>
                {generator}
            </Link>
            . Source in{' '}
            <Link href={repo} external>
                GitHub
            </Link>
            .
        </div>
    );
}
