import { lazy, Suspense } from 'react';
import { withoutSSR } from './NoSSR';
import "quill-next/dist/quill.snow.css";
import "quill-next/dist/quill.bubble.css";

const QuillEditor = lazy(() => import("quill-next-react"));

const Editor = ({
  children,
  rootStyle,
  config,
  onSelectionChange,
  onLoad,
  ...props
}) => {
  const onReady = (quill) => {
    if (rootStyle) {
      Object.assign(quill.root.style, rootStyle);
    }
    if (typeof onLoad === "function") {
      onLoad(quill);
    }
  }

  return (
    <Suspense>
      <QuillEditor
        onReady={onReady}
        config={config}
        onSelectionChange={onSelectionChange}
        {...props}
      />
    </Suspense>
  );
};

export default withoutSSR(Editor);
