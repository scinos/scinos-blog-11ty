/* eslint-disable react/no-danger */
import { PostTags } from './post-tags';

export function PostHeader({ title, date, tags = [] }) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
    const parts = dateTimeFormat.formatToParts(date).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
    }, {});
    const simpleDate = [parts.year, parts.month, parts.day].join('/');

    return (
        <div className="post-header">
            <h1
                className="title"
                dangerouslySetInnerHTML={{
                    __html: title,
                }}
            />
            {tags.length ? <PostTags tags={tags} /> : null}
            <time dateTime={date.toISOString()}>{simpleDate}</time>
        </div>
    );
}
