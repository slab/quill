const createTrustedHtml = (html: string): string => {
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    const policy = window.trustedTypes.createPolicy('quill.js', {
      createHTML: (val) => val,
    });
    return policy.createHTML(html) as unknown as string;
  }

  return html;
};

export default createTrustedHtml;
