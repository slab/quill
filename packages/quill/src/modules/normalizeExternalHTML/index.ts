import googleDocs from './normalizers/googleDocs';
import msWord from './normalizers/msWord';

const NORMALIZERS = [msWord, googleDocs];

const normalizeExternalHTML = (doc: Document) => {
  if (doc.documentElement) {
    NORMALIZERS.forEach((normalize) => {
      normalize(doc);
    });
  }
};

export default normalizeExternalHTML;
