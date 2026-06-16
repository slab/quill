const normalWeightRegexp = /font-weight:\s*normal/;
const blockTagNames = ['P', 'OL', 'UL'];
const isBlockElement = element => {
  return element && blockTagNames.includes(element.tagName);
};
const normalizeEmptyLines = doc => {
  Array.from(doc.querySelectorAll('br')).filter(br => isBlockElement(br.previousElementSibling) && isBlockElement(br.nextElementSibling)).forEach(br => {
    br.parentNode?.removeChild(br);
  });
};
const normalizeFontWeight = doc => {
  Array.from(doc.querySelectorAll('b[style*="font-weight"]')).filter(node => node.getAttribute('style')?.match(normalWeightRegexp)).forEach(node => {
    const fragment = doc.createDocumentFragment();
    fragment.append(...node.childNodes);
    node.parentNode?.replaceChild(fragment, node);
  });
};
export default function normalize(doc) {
  if (doc.querySelector('[id^="docs-internal-guid-"]')) {
    normalizeFontWeight(doc);
    normalizeEmptyLines(doc);
  }
}
//# sourceMappingURL=googleDocs.js.map