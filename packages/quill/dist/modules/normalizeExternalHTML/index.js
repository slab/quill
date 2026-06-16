import googleDocs from './normalizers/googleDocs.js';
import msWord from './normalizers/msWord.js';
const NORMALIZERS = [msWord, googleDocs];
const normalizeExternalHTML = doc => {
  if (doc.documentElement) {
    NORMALIZERS.forEach(normalize => {
      normalize(doc);
    });
  }
};
export default normalizeExternalHTML;
//# sourceMappingURL=index.js.map