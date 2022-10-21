import { useEffect, useRef } from 'react';

const useScripts = (urls: string[], callback: () => void) => {
  const stringURLs = JSON.stringify(urls);

  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const scripts = (JSON.parse(stringURLs) as string[]).map(url => {
      const script = document.createElement('script');

      script.src = url;

      document.body.appendChild(script);
      return script;
    });

    let pending = scripts.length;
    const listener = () => {
      if (!--pending) {
        callbackRef.current();
      }
    };

    scripts.forEach(script => {
      script.addEventListener('load', listener);
    });

    return () => {
      scripts.forEach(script => {
        document.body.removeChild(script);
      });
    };
  }, [stringURLs]);
};

export default useScripts;
