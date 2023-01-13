export function PostDate({ date }) {
    return (
        <span className="date">{new Intl.DateTimeFormat().format(date)}</span>
    );
}
