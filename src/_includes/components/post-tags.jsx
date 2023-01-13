export function PostTags({ tags }) {
    return (
        <ul className="post-tags">
            {tags.map((tag, idx) => (
                <li key={idx}>
                    <a href={`/tags/${tag}`}>{tag}</a>
                </li>
            ))}
        </ul>
    );
}
