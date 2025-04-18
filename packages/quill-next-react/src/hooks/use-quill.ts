import Quill from "quill-next";
import { useContext } from "react";
import { QuillContext } from "../context/quill-context";

export function useQuill(): Quill | null {
  return useContext(QuillContext);
}
