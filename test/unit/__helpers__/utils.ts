export const sleep = (ms: number) =>
  new Promise<void>((r) => {
    setTimeout(() => {
      r();
    }, ms);
  });

export const normalizeHTML = (html: string | { html: string }) =>
  typeof html === 'object' ? html.html : html.replace(/\n\s*/g, '');
