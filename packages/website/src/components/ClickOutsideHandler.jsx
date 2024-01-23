import { useEffect, useRef } from 'react';

const TOUCH_EVENT = { react: 'onTouchStart', native: 'touchstart' };
const MOUSE_EVENT = { react: 'onMouseDown', native: 'mousedown' };

const setUpReactEventHandlers = (handler, props) => ({
  ...props,
  [TOUCH_EVENT.react]: (e) => {
    handler();
    props[TOUCH_EVENT.react]?.(e);
  },
  [MOUSE_EVENT.react]: (e) => {
    handler();
    props[MOUSE_EVENT.react]?.(e);
  },
});

const ClickOutsideHandler = ({ onClickOutside, ...props }) => {
  const isTargetInsideReactTreeRef = useRef(false);

  const onClickOutsideRef = useRef(onClickOutside);
  useEffect(() => {
    onClickOutsideRef.current = onClickOutside;
  }, [onClickOutside]);

  useEffect(() => {
    const handler = (e) => {
      if (!isTargetInsideReactTreeRef.current) {
        onClickOutsideRef.current?.(e);
      }

      isTargetInsideReactTreeRef.current = false;
    };

    document.addEventListener(TOUCH_EVENT.native, handler, { passive: true });
    document.addEventListener(MOUSE_EVENT.native, handler, { passive: true });
    return () => {
      document.removeEventListener(TOUCH_EVENT.native, handler);
      document.removeEventListener(MOUSE_EVENT.native, handler);
    };
  }, []);

  const handleReactEvent = () => {
    isTargetInsideReactTreeRef.current = true;
  };

  return <div {...setUpReactEventHandlers(handleReactEvent, props)} />;
};

export default ClickOutsideHandler;
