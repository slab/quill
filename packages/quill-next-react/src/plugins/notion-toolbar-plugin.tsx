import React from "react";
import { IToolbarPluginProps, ToolbarPlugin } from "./toolbar-plugin";
import { NotionToolbar } from "../components/notion-toolbar.component";

type INotionToolbarPluginProps = Omit<IToolbarPluginProps, 'render'>;

function NotionToolbarPlugin(props: INotionToolbarPluginProps) {
  return <ToolbarPlugin {...props}
    render={({ formats }) => (
      <NotionToolbar formats={formats} />
    )}
  />;
}

export { NotionToolbarPlugin };
