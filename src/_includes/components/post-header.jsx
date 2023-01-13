/* eslint-disable react/no-danger */
import { PostTags } from './post-tags';

export function PostHeader({ title, date, tags = [] }) {
    return (
        <div className="post-header">
            <h1
                className="title"
                dangerouslySetInnerHTML={{
                    __html: title,
                }}
            />
            {tags.length ? <PostTags tags={tags} /> : null}
            <time dateTime={date.toISOString()}>
                {new Intl.DateTimeFormat().format(date)}
            </time>
        </div>
    );
}
