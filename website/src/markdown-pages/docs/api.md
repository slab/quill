---
layout: docs
title: API
permalink: /docs/api/
redirect_from:
  - /docs/api/events/
  - /docs/api/manipulation/
  - /docs/editor/
  - /docs/editor/api/
  - /docs/events/
---

import apiItems from '../../docs/api';

<div class="table-of-contents">
{apiItems.map(({title, hashes}) => (
<nav>
  <h4>{title}</h4>
  <ul>
  {hashes.map(hash => (
  <li><a href={`#${hash.toLowerCase()}`}>{hash.replace('-experimental', '')}</a></li>
  ))}
  </ul>
</nav>
</div>
))}

`markdown:docs/api/contents.md`
`markdown:docs/api/contents.md`
`markdown:docs/api/formatting.md`
`markdown:docs/api/selection.md`
`markdown:docs/api/editor.md`
`markdown:docs/api/events.md`
`markdown:docs/api/model.md`
`markdown:docs/api/extension.md`
