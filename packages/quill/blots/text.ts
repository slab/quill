import { TextBlot } from 'parchment';

class Text extends TextBlot {}

function escapeText(text: string) {
  return text.replace(/[&<>"']/g, (s) => {
    // https://lodash.com/docs#escape
    const entityMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entityMap[s];
  });
}

export { Text as default, escapeText };
