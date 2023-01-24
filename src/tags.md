---
pagination:
  data: collections.tags
  size: 1
  alias: tag
permalink: 'tags/{{ tag | slug }}/index.html'
eleventyComputed:
  title: 'Posts - {{ tag }}'
layout: 'pages/tag.jsx'
---
