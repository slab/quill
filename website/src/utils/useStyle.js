import { useEffect } from 'react';

const useStyle = href => {
  useEffect(() => {
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = href;

    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
};

export default useStyle;
