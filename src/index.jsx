/* eslint-disable react/no-danger */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import { HTMLPage } from './_includes/components/html-page';
import { PostEntry } from './_includes/components/post-entry';

export default function Page() {
    const { collections, title } = useContext(EleventyContext);

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
    });
    const postsByDate = collections.posts.reduce((allPostsByDate, post) => {
        const postDate = new Date(
            post.date.getFullYear(),
            post.date.getMonth(),
            1
        );
        // eslint-disable-next-line no-param-reassign
        const dateIdx = postDate.getTime();
        let existingPostDate = allPostsByDate.find(
            ({ idx }) => idx === dateIdx
        );
        if (!existingPostDate) {
            existingPostDate = {
                idx: dateIdx,
                date: postDate,
                time: formatter.format(postDate),
                posts: [],
            };
            allPostsByDate.push(existingPostDate);
        }
        existingPostDate.posts.push(post);
        return allPostsByDate;
    }, []);

    return (
        <HTMLPage>
            <div className="posts content">
                <h1>{title}</h1>
                {postsByDate
                    .sort((a, b) => b.idx - a.idx)
                    .map(({ time, posts }, idx) => (
                        <div key={idx} className="post-group">
                            <h2>{time}</h2>
                            {posts
                                .sort((a, b) => b.date - a.date)
                                .map((post, idx) => (
                                    <PostEntry
                                        key={idx}
                                        title={post.data.title}
                                        tags={post.data.tags}
                                        url={post.url}
                                    />
                                ))}
                        </div>
                    ))}
            </div>
        </HTMLPage>
    );
}

Page.data = {
    title: 'Blog',
};
