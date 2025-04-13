import { QuillContext } from "./context/quill-context";
import { QuillEditor, type EditorChangeHandler, type IQuillEditorProps } from "./editor.component";
import { ForkedRegistry } from "./forked-registry";
import {
  useEmbedBlot,
  type BlotScope,
  type IRenderOptions,
  type IReactBlotOptions,
} from "./hooks/use-react-blot";
import { QuillNextImage, useQuillNextImage } from "./quill-next-image.component";

export {
  QuillEditor as default,
  QuillContext,
  ForkedRegistry,
  useEmbedBlot,
  QuillNextImage,
  useQuillNextImage,
  type EditorChangeHandler,
  type IQuillEditorProps,
  type BlotScope,
  type IRenderOptions,
  type IReactBlotOptions,
};
