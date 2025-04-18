import React from "react";
import "./notion-menu-list.component.css";

export interface INotionMenuList {
  children?: React.ReactNode;
}

function NoitionMenuList(props: INotionMenuList) {
  const { children } = props;
  return <div className="qn-notion-menu-list">{children}</div>;
}

export interface INotionMenuItemHeader {
  children?: React.ReactNode;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function NotionMenuItemHeader(props: INotionMenuItemHeader) {
  const { children, onClick } = props;
  return (
    <div className="qn-notion-menu-item-header" onClick={onClick}>
      {children}
    </div>
  );
}

function NotionMenuItem(props: INotionMenuItemHeader) {
  const { children, active, onClick } = props;
  return (
    <div
      className={"qn-notion-menu-item" + (active ? " active" : "")}
      onClick={onClick}
    >
      <div className="qn-notion-menu-item-content">{children}</div>
    </div>
  );
}

export { NoitionMenuList, NotionMenuItemHeader, NotionMenuItem };
