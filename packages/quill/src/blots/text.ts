import { TextBlot } from 'parchment';

class Text extends TextBlot {}

// https://lodash.com/docs#escape
const entityMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeText(text: string) {
  return text.replace(/[&<>"']/g, (s) => entityMap[s]);
}

export { Text as default, escapeText };
