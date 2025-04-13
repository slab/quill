import type { Meta, StoryObj } from '@storybook/react';
import { QuillEditor } from './editor.component';
import { QuillNextImage } from "./quill-next-image.component";

const meta = {
  title: 'QuillEditor/Image',
  component: QuillNextImage,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof QuillEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    value: "https://github.com/vincentdchan/quill-next/raw/main/images/quill-next.png",
    attributes: {
      naturalWidth: 800,
      naturalHeight: 197,
    },
  }
}
