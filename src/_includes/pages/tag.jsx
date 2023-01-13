/* eslint-disable react/no-danger */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import { HTMLPage } from '../components/html-page';
import { PostEntry } from '../components/post-entry';

export default function TagLayout() {
    const { collections, tag } = useContext(EleventyContext);

    const posts = collections.posts
        .filter((post) => post.data.tags.includes(tag))
        .sort((a, b) => b.date - a.date);

    return (
        <HTMLPage>
            <div className="posts">
                <h1>Posts - {tag}</h1>
                <div className="post-group">
                    {posts.map((post, idx) => (
                        <PostEntry
                            key={idx}
                            title={post.data.title}
                            date={post.date}
                            url={post.url}
                        />
                    ))}
                </div>
            </div>
        </HTMLPage>
    );
}
