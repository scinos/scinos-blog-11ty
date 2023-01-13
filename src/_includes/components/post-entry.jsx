/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-danger */
import { PostTags } from './post-tags';

function PostDate({ date }) {
    return (
        <time dateTime={date.toISOString()}>
            {new Intl.DateTimeFormat().format(date)}
        </time>
    );
}

export function PostEntry({ title, url, tags = [], date }) {
    return (
        <div className="post-entry">
            {date ? <PostDate date={date} /> : null}

            <a
                href={url}
                className="title"
                dangerouslySetInnerHTML={{
                    __html: title,
                }}
            />
            {tags.length ? <PostTags tags={tags} /> : null}
        </div>
    );
}
