class Security {
  constructor() {
    const supportsTrustedTypes =
      window.trustedTypes && window.trustedTypes.createPolicy;
    let trustedTypesPolicy;

    try {
      if (supportsTrustedTypes) {
        trustedTypesPolicy = window.trustedTypes.createPolicy("quill@core", {
          createHTML: function (html) {
            // Trust all strings passed to this function.
            return html;
          },
        });
      }
    } catch (e) {}

    this.blessHTML = trustedTypesPolicy ? trustedTypesPolicy.createHTML.bind(trustedTypesPolicy) : (x) => x;
  }
}

export default Security;
