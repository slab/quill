export const isMac = process.platform === 'darwin';
export const SHORTKEY = isMac ? 'Meta' : 'Control';

export function getSelectionInTextNode() {
  const selection = document.getSelection();
  if (!selection) {
    throw new Error('Selection is null');
  }
  const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
  return JSON.stringify([
    (anchorNode as Text).data,
    anchorOffset,
    (focusNode as Text).data,
    focusOffset,
  ]);
}
