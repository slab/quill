import { HTMLAttributes, ReactNode, useEffect, useRef } from 'react';

interface EditorProps extends HTMLAttributes<HTMLDivElement> {
  config: unknown;
  children?: ReactNode;
  rootStyle?: CSSStyleDeclaration;
  onSelectionChange?: () => void;
}

const Editor = ({
  children,
  rootStyle,
  config,
  onSelectionChange,
  ...props
}: EditorProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const rootStyleRef = useRef(rootStyle);
  const onSelectionChangeRef = useRef(onSelectionChange);

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    // @ts-expect-error
    const quill = new window.Quill(ref.current, config);
    if (rootStyleRef) {
      Object.assign((quill.root as HTMLElement).style, rootStyleRef.current);
    }
    // @ts-expect-error
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
