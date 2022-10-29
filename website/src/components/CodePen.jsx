import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';

const SCRIPT_URL = 'https://static.codepen.io/assets/embed/ei.js'; // new embed
const LOAD_STATE = {
  booting: '__booting__',
  error: '__error__',
  loading: '__loading__',
  loaded: '__loaded__',
};

const CodePen = props => {
  const [loadState, setLoadState] = useState(LOAD_STATE.booting);
  const _isMounted = useRef(false);

  const loadScript = useCallback(() => {
    // load the codepen embed script
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      // do not do anything if the component is already unmounted.
      if (!_isMounted.current) return;
      setLoadState(LOAD_STATE.loaded);
    };
    script.onerror = () => {
      if (!_isMounted.current) return;
      setLoadState(LOAD_STATE.error);
    };

    setLoadState(LOAD_STATE.loading);
    document.body.appendChild(script);
  }, [setLoadState]);

  useEffect(() => {
    loadScript();
  }, [loadScript]);

  const visibility = loadState === LOAD_STATE.loaded ? 'visible' : 'hidden';
  const penLink = `https://codepen.io/${props.user}/pen/${props.hash}/`;
  const userProfileLink = `https://codepen.io/${props.user}`;

  return (
    <>
      <div
        data-height={props.height || 400}
        data-theme-id={props.themeId || 23269}
        data-slug-hash={props.hash}
        data-default-tab={props.defaultTab || 'js'}
        data-user={props.user}
        data-embed-version={props.version || 2}
        data-pen-title={props.title}
        data-preview={
          typeof props.preview === 'boolean' ? props.preview : false
        }
        data-editable={props.editable || false}
        className="codepen"
        style={{ visibility }}
      >
        {props.children ? (
          props.children
        ) : (
          <>
            See the Pen <a href={penLink}>{props.title}</a>
            by {props.user} (<a href={userProfileLink}>@{props.user}</a>) on{' '}
            <a href="https://codepen.io">CodePen</a>.
          </>
        )}
      </div>
    </>
  );
};

export default CodePen;
