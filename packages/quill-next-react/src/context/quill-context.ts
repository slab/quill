import { createContext } from "react";
import type Quill from "quill-next";

export const QuillContext = createContext<Quill | null>(null);
