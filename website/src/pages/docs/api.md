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

<div class="table-of-contents">
{% for hash in site.data.api %}
<nav>
  {% for category in hash %}
  <h4>{{ category[0] }}</h4>
  <ul>
  {% for api in category[1] %}<li><a href="#{{ api | downcase }}">{{ api | remove: "-experimental" }}</a></li>{% endfor %}
  </ul>
  {% endfor %}
</nav>
{% endfor %}
</div>

{% include_relative api/contents.md %}
{% include_relative api/formatting.md %}
{% include_relative api/selection.md %}
{% include_relative api/editor.md %}
{% include_relative api/events.md %}
{% include_relative api/model.md %}
{% include_relative api/extension.md %}
