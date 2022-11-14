export const SHORTKEY = process.platform === 'darwin' ? 'Meta' : 'Control';

export function getSelectionInTextNode() {
  const { anchorNode, anchorOffset, focusNode, focusOffset } =
    document.getSelection();
  return JSON.stringify([
    (anchorNode as Text).data,
    anchorOffset,
    (focusNode as Text).data,
    focusOffset,
  ]);
}
