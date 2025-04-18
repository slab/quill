import React from "react";
import "./notion-toolbar-button.component.css";

export interface INotionToolbarButtonProps {
  active?: boolean;
  svg? : string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

function NotionToolbarButton(props: INotionToolbarButtonProps) {
  const { children, svg, onClick, active } = props;
  return (
    <div
      className={"qn-notion-toolbar-button" + (active ? " active" : "")}
      onClick={onClick}
      dangerouslySetInnerHTML={svg ? {
        __html: svg,
      } : undefined}
    >
      {children}
    </div>
  )
}

export { NotionToolbarButton }
