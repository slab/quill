interface TrustedTypePolicy {
  createHTML(s: string): unknown;
}

let quillPolicy: TrustedTypePolicy | null | undefined;

function getPolicy(): TrustedTypePolicy | null {
  if (quillPolicy === undefined) {
    quillPolicy = null;
    if (
      typeof window !== 'undefined' &&
      window.trustedTypes &&
      window.trustedTypes.createPolicy
    ) {
      try {
        quillPolicy = window.trustedTypes.createPolicy('quill', {
          createHTML: (s: string) => s,
        });
      } catch (e) {
        // Fallback or ignore if policy creation fails
      }
    }
  }
  return quillPolicy;
}



export function parseHTML(html: string): Document {
  const policy = getPolicy();
  const content = policy ? (policy.createHTML(html) as string) : html;
  // @ts-expect-error parseFromString accepts TrustedHTML in modern browsers
  return new DOMParser().parseFromString(content, 'text/html');
}
