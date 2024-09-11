import DOMPurify from 'dompurify';

const createTrustedHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    RETURN_TRUSTED_TYPE: true,
  }) as unknown as string;
};

export default createTrustedHtml;
