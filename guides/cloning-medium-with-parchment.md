---
layout: guide
title: Cloning Medium with Parchment
permalink: /guides/cloning-medium-with-parchment/
stability: incomplete
---

To provide a consistent editing experience, you need consistent data and predictable behaviors. The DOM is unfortunately lacking on both of these to be a high quality data store. The solution for modern editors is to maintain its own document model to represent its contents. Parchment is Quill's document model. It is organized in its own codebase with its own API layer, to keep with Quill's modular architecture. You can use Parchment to extend the content and formats Quill recognizes, or add entirely new ones.

In this guide, we will use the building blocks provided by Parchment and Quill to replicate the editor on Medium. We are going to start with the bare bones of Quill, without any themes, extraneous modules, or formats. At this basic level, Quill only understand plain text. But by the end of this guide, Quill will understand links, videos, and even Tweets.

<div data-height="600" data-theme-id="23269" data-slug-hash="qNJrYB" data-default-tab="result" data-embed-version="2" class="codepen"><pre><code>


<!-- script -->
<script src="//codepen.io/assets/embed/ei.js" type="text/javascript"></script>
<!-- script -->
