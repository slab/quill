function flattenData(root) {
  const data = [];
  const flatten = (i) => {
    i.forEach((child) => {
      if (child.url.includes('#')) return;
      data.push(child);
      if (child.children) {
        flatten(child.children);
      }
    });
  };

  flatten(root);
  return data;
}

export default flattenData;
