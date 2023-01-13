export function Link({ children, external, style, href, className, rel = [] }) {
    const externalAttr = {
        target: '_blank',
        rel: [...rel, 'noopener', 'noreferrer'].join(' '),
    };
    return (
        <a
            style={style}
            className={className}
            href={href}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(external ? externalAttr : { rel: rel.join(' ') })}
        >
            {children}
        </a>
    );
}
