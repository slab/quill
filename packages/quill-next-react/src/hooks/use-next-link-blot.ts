import { useMemo, useRef, useEffect } from "react";
import Quill, { Link } from "quill-next";
import { BlotConstructor } from "parchment";
import { messages } from "../messages";
import "./use-next-link-blot.css";

export interface ILinkBlotOptions {
  onClick?: (event: MouseEvent) => void;
}

export function useNextLinkBlot(options?: ILinkBlotOptions): BlotConstructor {
  const { onClick } = options || {};
  const onClickRef = useRef<((event: MouseEvent) => void) | undefined>(onClick);
  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  return useMemo((): BlotConstructor => {
    return class extends Link {

      static override create(value: string) {
        const node = super.create(value) as HTMLElement;
        node.setAttribute('href', this.sanitize(value));
        node.setAttribute('rel', 'noopener noreferrer');
        node.setAttribute('target', '_blank');
        node.classList.add('qn-link');
        return node;
      }

      fetchQuill(): Quill | null {
        const container = this.domNode.closest('.ql-editor');
        if (!container) {
          return null;
        }
        return Quill.find(container.parentElement as HTMLElement) as Quill | null;
      }

      #quill: Quill | null = null;

      #handleClick = (event: MouseEvent): void => {
        onClickRef.current?.(event);

        if (event.defaultPrevented) {
          return;
        }
        event.preventDefault();
        
        window.open(this.domNode.getAttribute('href') || '', '_blank');
      }

      override attach(): void {
        super.attach();
        this.#quill = this.fetchQuill();

        this.#quill?.emitter.emit(messages.NextLinkAttached, this);

        this.domNode.addEventListener('click', this.#handleClick);
      }

      override detach(): void {
        this.#quill?.emitter.emit(messages.NextLinkDetached, this);
        this.#quill = null;

        super.detach();
        this.domNode.removeEventListener('click', this.#handleClick);
      }

    }
  }, []);
}
