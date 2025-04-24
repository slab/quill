import React from "react";
import "./notion-link-toolbar.component.css";

export interface INotionLinkToolbarProps {
  url: string;
}

function NotionLinkToolbar(props: INotionLinkToolbarProps) {
  const { url } = props;
  return (
    <div className="qn-notion-link-toolbar-container">
      <div>
        <div className="qn-notion-link-toolbar">
          {url}
        </div>
      </div>
    </div>
  );
}

NotionLinkToolbar.displayName = "NotionLinkToolbar";

export { NotionLinkToolbar };
