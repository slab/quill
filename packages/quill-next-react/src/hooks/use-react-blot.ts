import React, { useMemo, useRef, useEffect } from "react";
import { createRoot, Root as ReactRoot } from "react-dom/client";
import { BlotConstructor, EmbedBlot, Scope, Root } from "parchment";

export type BlotScope = 'block' | 'inline';

export interface IRenderOptions {
  value: unknown;
  attributes?: Record<string, unknown>;
}

export type RenderFunc = (optoins: IRenderOptions) => React.ReactNode;

export interface IReactBlotOptions {
  blotName: string;
  scope?: BlotScope;
  tagName?: string;
  create?: (value?: unknown) => HTMLElement;
  render: RenderFunc;
}

export function useEmbedBlot(
  options: IReactBlotOptions,
): BlotConstructor {
  const { blotName, tagName, create, render, scope } = options;

  const renderFuncRef = useRef<RenderFunc>(render);
  useEffect(() => {
    renderFuncRef.current = render;
  }, [render]);

  return useMemo(() => {
    let blotScope = Scope.INLINE;
    if (scope === 'block') {
      blotScope = Scope.BLOCK;
    }

    return class extends EmbedBlot {
      static override blotName: string = blotName;
      static override tagName = tagName || 'div';
      static override scope: Scope = blotScope;

      static override create(value?: unknown) {
        if (create) {
          return create(value) as HTMLElement;
        }
        const s = super.create(value) as HTMLElement;
        s.setAttribute("contenteditable", "false");
        s.setAttribute("data-blot-name", blotName);
        return s;
      }

      private root: ReactRoot | null;
      #value: unknown = undefined;
      #attributes: Record<string, unknown> = {};

      constructor(scroll: Root, domNode: Node, value?: unknown) {
        super(scroll, domNode);
        if (value) {
          this.#value = value;
        }
      }

      override attach(): void {
        this.root = createRoot(this.domNode as HTMLElement);
        this.render();
      }

      override detach(): void {
        console.log("detatch");
        if (this.root) {
          const root = this.root;
          this.root = null;
          requestAnimationFrame(() => {
            root.unmount();
          });
        }
      }

      override value(): unknown {
        return {
          [blotName]: this.#value,
        }
      }

      override format(name: string, value: string): void {
        this.#attributes[name] = value;
        this.render();
      }

      render() {
        this.root.render(renderFuncRef.current({
          value: this.#value,
          attributes: this.#attributes,
        }))
      }
    }
  }, [scope, blotName, tagName, create]);
}
