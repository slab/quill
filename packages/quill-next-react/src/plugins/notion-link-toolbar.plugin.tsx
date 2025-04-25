import React from "react";
import { NotionLinkToolbar } from "../components/notion-link-toolbar.component";
import { LinkToolbarPlugin } from "./link-toolbar-plugin";

function NotionLinkToolbarPlugin() {
  return <LinkToolbarPlugin render={(props) => <NotionLinkToolbar {...props} />} />;
}

NotionLinkToolbarPlugin.displayName = "NotionLinkToolbarPlugin";

export { NotionLinkToolbarPlugin };
