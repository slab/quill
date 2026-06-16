const ignoreRegexp = /\bmso-list:[^;]*ignore/i;
const idRegexp = /\bmso-list:[^;]*\bl(\d+)/i;
const indentRegexp = /\bmso-list:[^;]*\blevel(\d+)/i;
const parseListItem = (element, html) => {
  const style = element.getAttribute('style');
  const idMatch = style?.match(idRegexp);
  if (!idMatch) {
    return null;
  }
  const id = Number(idMatch[1]);
  const indentMatch = style?.match(indentRegexp);
  const indent = indentMatch ? Number(indentMatch[1]) : 1;
  const typeRegexp = new RegExp(`@list l${id}:level${indent}\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)`, 'i');
  const typeMatch = html.match(typeRegexp);
  const type = typeMatch && typeMatch[1] === 'bullet' ? 'bullet' : 'ordered';
  return {
    id,
    indent,
    type,
    element
  };
};

// list items are represented as `p` tags with styles like `mso-list: l0 level1` where:
// 1. "0" in "l0" means the list item id;
// 2. "1" in "level1" means the indent level, starting from 1.
const normalizeListItem = doc => {
  const msoList = Array.from(doc.querySelectorAll('[style*=mso-list]'));
  const ignored = [];
  const others = [];
  msoList.forEach(node => {
    const shouldIgnore = (node.getAttribute('style') || '').match(ignoreRegexp);
    if (shouldIgnore) {
      ignored.push(node);
    } else {
      others.push(node);
    }
  });

  // Each list item contains a marker wrapped with "mso-list: Ignore".
  ignored.forEach(node => node.parentNode?.removeChild(node));

  // The list stype is not defined inline with the tag, instead, it's in the
  // style tag so we need to pass the html as a string.
  const html = doc.documentElement.innerHTML;
  const listItems = others.map(element => parseListItem(element, html)).filter(parsed => parsed);
  while (listItems.length) {
    const childListItems = [];
    let current = listItems.shift();
    // Group continuous items into the same group (aka "ul")
    while (current) {
      childListItems.push(current);
      current = listItems.length && listItems[0]?.element === current.element.nextElementSibling &&
      // Different id means the next item doesn't belong to this group.
      listItems[0].id === current.id ? listItems.shift() : null;
    }
    const ul = document.createElement('ul');
    childListItems.forEach(listItem => {
      const li = document.createElement('li');
      li.setAttribute('data-list', listItem.type);
      if (listItem.indent > 1) {
        li.setAttribute('class', `ql-indent-${listItem.indent - 1}`);
      }
      li.innerHTML = listItem.element.innerHTML;
      ul.appendChild(li);
    });
    const element = childListItems[0]?.element;
    const {
      parentNode
    } = element ?? {};
    if (element) {
      parentNode?.replaceChild(ul, element);
    }
    childListItems.slice(1).forEach(_ref => {
      let {
        element: e
      } = _ref;
      parentNode?.removeChild(e);
    });
  }
};
export default function normalize(doc) {
  if (doc.documentElement.getAttribute('xmlns:w') === 'urn:schemas-microsoft-com:office:word') {
    normalizeListItem(doc);
  }
}
//# sourceMappingURL=msWord.js.map