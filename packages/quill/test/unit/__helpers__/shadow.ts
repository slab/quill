// Creates a container inside a shadow root attached to document.body.
// __helpers__/cleanup.ts empties document.body before each test.
export const createShadowContainer = (
  mode: ShadowRootMode = 'open',
  parent: Node = document.body,
) => {
  const host = document.createElement('div');
  parent.appendChild(host);
  const shadowRoot = host.attachShadow({ mode });
  const container = document.createElement('div');
  shadowRoot.appendChild(container);
  return { host, shadowRoot, container };
};
