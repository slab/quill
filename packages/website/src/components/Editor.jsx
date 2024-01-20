import { useLayoutEffect, useRef } from 'react';
import { withoutSSR } from './NoSSR';

const Editor = ({
  children,
  rootStyle,
  config,
  onSelectionChange,
  onLoad,
  ...props
}) => {
  const ref = useRef(null);
  const rootStyleRef = useRef(rootStyle);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const onLoadRef = useRef(onLoad);

  useLayoutEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useLayoutEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  const configRef = useRef(config);

  useLayoutEffect(() => {
    const quill = new window.Quill(ref.current, configRef.current);
    if (rootStyleRef) {
      Object.assign(quill.root.style, rootStyleRef.current);
    }
    quill.on(window.Quill.events.SELECTION_CHANGE, () => {
      onSelectionChangeRef.current?.();
    });

    onLoadRef.current?.(quill);
  }, []);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
};

export default withoutSSR(Editor);
