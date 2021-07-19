---
layout: v1.0-docs
title: API
permalink: /1.0/docs/api/
api:
  - Content:
    - deleteText
    - getContents
    - getLength
    - getText
    - insertEmbed
    - insertText
    - setContents
    - setText
    - updateContents
  - Formatting:
    - format
    - formatLine
    - formatText
    - getFormat
    - removeFormat
  - Selection:
    - getBounds
    - getSelection
    - setSelection
  - Editor:
    - blur
    - focus
    - disable
    - enable
    - hasFocus
    - update
  - Events:
    - text-change
    - selection-change
    - editor-change
    - "off"
    - "on"
    - once
  - Model:
    - find-experimental
    - getIndex-experimental
    - getLeaf-experimental
    - getLine-experimental
    - getLines-experimental
  - Extension:
    - debug
    - import
    - register
    - addContainer
    - getModule
---

<div class="table-of-contents">
{% for hash in page.api %}
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
