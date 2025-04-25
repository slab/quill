import React, { useState, useCallback, useRef, useEffect } from "react";
import { Delta } from "quill-next";
import { useQuill } from "../hooks/use-quill";
import "./notion-link-toolbar.component.css";

export interface INotionLinkToolbarProps {
  link: string;
  index: number;
  length: number;
}

const MIN_WIDTH = 60;

function NotionLinkToolbar(props: INotionLinkToolbarProps) {
  const { link: url, index, length } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUrl, setEditedUrl] = useState(url);
  const quill = useQuill();

  const handleEdit = useCallback(() => {
    setIsEditing(true);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    setWidth(Math.max(rect.width, MIN_WIDTH));
  }, []);

  const handleSave = useCallback(() => {
    setIsEditing(false);

    quill.updateContents(new Delta().retain(index).retain(length, {
      link: editedUrl,
    }));
  }, [editedUrl, quill, index, length]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing, inputRef]);

  return (
    <div className="qn-notion-link-toolbar-container" ref={containerRef} style={width > 0 ? {
      width: `${width}px`,
    }
      : {}}
    >
      <div className="qn-notion-link-toolbar">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text" value={editedUrl} onChange={(e) => setEditedUrl(e.target.value)} />
        ) : (
          <span>{url}</span>
        )}
        {isEditing ? (
          <button className="qn-notion-link-toolbar-button" onClick={handleSave}>Save</button>
        ) : (
          <button className="qn-notion-link-toolbar-button" onClick={handleEdit}>Edit</button>
        )}
      </div>
    </div>
  );
}

NotionLinkToolbar.displayName = "NotionLinkToolbar";

export { NotionLinkToolbar };
