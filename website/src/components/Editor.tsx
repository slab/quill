import { Script } from 'gatsby';
import { HTMLAttributes, ReactNode, useLayoutEffect, useRef } from 'react';
import useSite from '../utils/useSite';
import useStyle from '../utils/useStyle';

interface EditorProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  config: unknown;
}

const Editor = ({ children, config, ...props }: EditorProps) => {
  const site = useSite();
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    // @ts-expect-error
    new window.Quill(ref.current, config);
  }, []);

  return (
    <>
      <Script src={`${site.katex}/katex.min.js`} />
      <Script src={`${site.highlightjs}/highlight.min.js`} />
      <Script src={`${site.cdn}${site.version}/${site.quill}`} />
      <div ref={ref} {...props}>
        {children}
      </div>
    </>
  );
};

export default Editor;
