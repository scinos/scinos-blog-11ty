/* eslint-disable react/no-danger */
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import { useContext } from 'react';
import { HTMLPage } from '../components/html-page';
import { PostHeader } from '../components/post-header';

function PostLayout() {
    const ctx = useContext(EleventyContext);
    const { content, page, title, tags } = ctx;

    return (
        <HTMLPage>
            <article className="post">
                <PostHeader date={page.date} title={title} tags={tags} />
                <div
                    dangerouslySetInnerHTML={{
                        __html: content.replace(`<h1>${title}</h1>`, ''),
                    }}
                />
            </article>
        </HTMLPage>
    );
}

export default PostLayout;
