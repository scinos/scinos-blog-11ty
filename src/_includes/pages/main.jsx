/* eslint-disable react/no-danger */
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import { useContext } from 'react';
import { HTMLPage } from '../components/html-page';

function MainLayout() {
    const ctx = useContext(EleventyContext);
    const { content, title } = ctx;

    return (
        <HTMLPage>
            <div className="content">
                <h1
                    className="title"
                    dangerouslySetInnerHTML={{
                        __html: title,
                    }}
                />
                <div
                    dangerouslySetInnerHTML={{
                        __html: content.replace(`<h1>${title}</h1>`, ''),
                    }}
                />
            </div>
        </HTMLPage>
    );
}

export default MainLayout;
