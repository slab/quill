const { version, homepage } = require('./package.json');

const cdn = process.env.NEXT_PUBLIC_LOCAL_QUILL
  ? `https://localhost:${process.env.npm_package_config_ports_website}/webpack-dev-server`
  : `https://cdn.jsdelivr.net/npm/quill@${version}/dist`;

module.exports = {
  version,
  cdn,
  github: 'https://github.com/quilljs/quill/tree/develop/packages/website/',
  highlightjs: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0',
  katex: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1',
  url: homepage,
  title: 'Quill - Your powerful rich text editor',
  shortTitle: 'Quill Rich Text Editor',
  description:
    'Quill is a free, open source WYSIWYG editor built for the modern web. Completely customize it for any need with its modular architecture and expressive API.',
  shortDescription:
    'Quill is a free, open source rich text editor built for the modern web.',
};
