import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuillInput, type IUseQuillInputResult } from "../hooks/use-quill-input";
import { PrerenderPanel } from "../components/prerender-panel.component";
import { Subject, fromEvent, takeUntil } from "rxjs";
import { useQuill } from "../hooks/use-quill";
import { Delta } from "quill-next";

export interface ISlashCommandRenderOptions {
  selectedIndex: number;
  content: string;
  apply: () => void;
}

export interface ISlashCommandPluginProps {
  length: number;
  onEnter?: (index: number) => void;
  render?: (options: ISlashCommandRenderOptions) => React.ReactNode;
}

export function SlashCommandPlugin(props: ISlashCommandPluginProps) {
  const { length, render, onEnter } = props;
  const quill = useQuill();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputResultRef = useRef<IUseQuillInputResult | null>(null);

  const [inputResult, clearInput] = useQuillInput({
    trigger: "/",
  });

  useEffect(() => {
    inputResultRef.current = inputResult;
    if (!inputResult) {
      setSelectedIndex(0);
    }
  }, [inputResult, setSelectedIndex]);

  useEffect(() => {
    if (length > 0 && selectedIndex >= length) {
      setSelectedIndex(length - 1);
    }
  }, [selectedIndex, setSelectedIndex, length]);

  const apply = useCallback(() => {
    const inputResult = inputResultRef.current;
    if (!inputResult) {
      return;
    }
    quill.updateContents(new Delta().retain(inputResult.startPos).delete(inputResult.length));
    clearInput();
  }, [clearInput]);

  useEffect(() => {
    const dispose$ = new Subject<void>();
    const keydown$ = fromEvent(quill.container, "keydown", { capture: true });

    keydown$.pipe(takeUntil(dispose$)).subscribe((e: KeyboardEvent) => {
      const inputResult = inputResultRef.current;
      if (!inputResult) {
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        clearInput();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prevIndex) => {
          if (prevIndex === 0) {
            return length - 1;
          }
          return prevIndex - 1;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prevIndex) => {
          if (prevIndex === length - 1) {
            return 0;
          }
          return prevIndex + 1;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        apply();
        window.requestAnimationFrame(() => {
          onEnter?.(selectedIndex);
        });
      }
    });

    return () => {
      dispose$.next();
      dispose$.complete();
    };
  }, [quill, clearInput, apply, length]);

  if (!inputResult) {
    return null;
  }

  return (
    <PrerenderPanel
      className="qn-slash-command-container"
      bounds={inputResult.bounds}
      render={() =>
        render?.({
          selectedIndex,
          content: inputResult.content,
          apply,
        })
      }
    />
  );
}
