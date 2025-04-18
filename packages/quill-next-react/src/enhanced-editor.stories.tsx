import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QuillEditor, IQuillEditorProps } from "./editor.component";
import { Delta } from "quill-next";
import { useQuillNextImage } from "./quill-next-image.component";
import { ToolbarPlugin } from "./plugins/toolbar-plugin.component";
import { SlashCommandPlugin } from "./plugins/slash-command-plugin.component";
import { NotionToolbar } from "./components/notion-toolbar.component";
import {
  NoitionMenuList,
  NotionMenuItemHeader,
  NotionMenuItem,
} from "./components/notion-menu-list.component";
import "quill-next/dist/quill.snow.css";
import "quill-next/dist/quill.bubble.css";

interface SlashCommandItem {
  key: string;
  content: string;
}

function WrappedQuillEditor(props: IQuillEditorProps) {
  const slashCommands: SlashCommandItem[] = [
    { key: "image", content: "Image" },
    { key: "canvas", content: "Canvas" },
  ];
  const { blots = [] } = props;
  const ImageBlot = useQuillNextImage();
  return (
    <QuillEditor {...props} blots={[...blots, ImageBlot]}>
      <ToolbarPlugin render={() => <NotionToolbar />} />
      <SlashCommandPlugin
        length={slashCommands.length}
        render={({ selectedIndex, content, apply }) => (
          <NoitionMenuList>
            <NotionMenuItemHeader>Input: {content}</NotionMenuItemHeader>
            {slashCommands.map((item, index) => (
              <NotionMenuItem
                key={item.key}
                active={index === selectedIndex}
                onClick={apply}
              >
                {item.content}
              </NotionMenuItem>
            ))}
          </NoitionMenuList>
        )}
      />
    </QuillEditor>
  );
}

const meta = {
  title: "QuillEditor/Enhanced",
  component: WrappedQuillEditor,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof QuillEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    defaultValue: new Delta().insert("Hello World\n").insert(
      {
        image:
          "https://github.com/vincentdchan/quill-next/raw/main/images/quill-next.png",
      },
      {
        naturalWidth: 800,
        naturalHeight: 197,
      }
    ),
    config: {},
  },
};
