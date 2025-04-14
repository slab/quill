import React, { useRef, useEffect, useState } from 'react';
import Quill, { type Delta, type EmitterSource, type QuillOptions } from "quill-next";
import { useQuillEvent } from "./hooks/use-quill-event";
import { QuillContext } from "./context/quill-context";
import { BlotConstructor } from "parchment";
import { ForkedRegistry } from "./forked-registry";
import { EditorChangeHandler } from './types/editor-change-handler.type';
import { NextTheme } from './next-theme';


export interface IQuillEditorProps {
  defaultValue?: Delta;
  children?: React.ReactNode;
  readOnly?: boolean;
  config?: QuillOptions;
  onReady?: (quill: Quill) => void;
  onTextChange?: (delta: Delta, oldContent: Delta, source: EmitterSource) => void;
  onSelectionChange?: (range: Range, oldRange: Range, source: EmitterSource) => void;
  onEditorChange?: EditorChangeHandler;
  className?: string;
  style?: React.CSSProperties;
  dangerouslySetInnerHTML?: {
    // Should be InnerHTML['innerHTML'].
    // But unfortunately we're mixing renderer-specific type declarations.
    __html: string | TrustedHTML;
  } | undefined;
  blots?: BlotConstructor[];
}

function makeQuillWithBlots(container: HTMLElement, options: QuillOptions, blots?: BlotConstructor[]) {
  const originalImports = Quill.imports;
  const newImports = {
    ...originalImports,
  }

  let quill: Quill;
  try {
    Quill.imports = newImports;

    Quill.register("themes/next", NextTheme);

    blots?.forEach((blot) => {
      Quill.register(blot, true);
    });
    quill = new Quill(container, options);
  } finally {
    Quill.imports = originalImports;
  }

  return quill;
}

const QuillEditor = (props: IQuillEditorProps) => {
  const {
    config,
    children,
    defaultValue,
    readOnly,
    onReady,
    onTextChange,
    onSelectionChange,
    onEditorChange,
    className,
    style,
    dangerouslySetInnerHTML,
    blots,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    // if (dangerouslySetInnerHTML && containerRef.current) {
    //   containerRef.current.innerHTML = dangerouslySetInnerHTML.__html as any;
    // }

    const forkedRegistry = new ForkedRegistry(Quill.DEFAULTS.registry);

    const quillOptions: QuillOptions = {
      ...config,
      registry: forkedRegistry,
    };

    if (!quillOptions.theme) {
      quillOptions.theme = 'next';
    }

    const quill = makeQuillWithBlots(
      containerRef.current!,
      quillOptions,
      blots,
    );

    // if (defaultValue) {
    //   quill.setContents(defaultValue);
    // }

    setQuill(quill);

    if (onReady) {
      try {
        onReady(quill);
      } catch (err) {
        console.error('Error in onReady callback:', err);
      }
    }

    return () => {
      quill.destroy();
    }
  }, []);

  useEffect(() => {
    quill?.enable(!readOnly);
  }, [quill, readOnly]);

  useEffect(() => {
    if (dangerouslySetInnerHTML && quill) {
      const contents = quill.clipboard.convert({
        html: `${dangerouslySetInnerHTML.__html}<p><br></p>`,
        text: '\n',
      });
      quill.setContents(contents);
    }
  }, [quill]);

  useEffect(() => {
    // we must set the contents after the quill is initialized
    // so we can listen to the NextLinkAttached event
    if (defaultValue && quill) {
      quill.setContents(defaultValue);
    }
  }, [defaultValue, quill]);

  useQuillEvent(quill, Quill.events.TEXT_CHANGE, onTextChange);
  useQuillEvent(quill, Quill.events.SELECTION_CHANGE, onSelectionChange);
  useQuillEvent(quill, Quill.events.EDITOR_CHANGE, onEditorChange);

  return (
    <QuillContext.Provider value={quill}>
      <div
        ref={containerRef}
        className={className}
        style={style}
      />
      {quill && children}
    </QuillContext.Provider>
  );
};

QuillEditor.displayName = 'QuillEditor';

export { QuillEditor }
