import { useEffect, useRef } from 'react';

const Editor = ({
  children,
  rootStyle,
  config,
  onSelectionChange,
  ...props
}) => {
  const ref = useRef(null);
  const rootStyleRef = useRef(rootStyle);
  const onSelectionChangeRef = useRef(onSelectionChange);

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    const quill = new window.Quill(ref.current, config);
    if (rootStyleRef) {
      Object.assign(quill.root.style, rootStyleRef.current);
    }
    quill.on(window.Quill.events.SELECTION_CHANGE, () => {
      onSelectionChangeRef.current?.();
    });
  }, []);

  return (
    <>
      <div ref={ref} {...props}>
        {children}
      </div>
    </>
  );
};

export default Editor;
