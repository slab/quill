import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QuillEditor } from './editor.component';
import { Delta } from "quill-next";
import "quill-next/dist/quill.snow.css";
import "quill-next/dist/quill.bubble.css";

const meta = {
  title: 'QuillEditor/Basic',
  component: QuillEditor,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof QuillEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Snow: Story = {
  args: {
    defaultValue: new Delta().insert("Hello World"),
    config: {
      theme: 'snow',
    }
  }
}

export const Bubble: Story = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
  args: {
    defaultValue: new Delta().insert("Hello World"),
    config: {
      theme: 'bubble',
      modules: {
        toolbar: true,
      }
    },
  },
}

// function CustomImage(options: IRenderOptions) {
//   return <div>image: <img src={options.value as string} /></div>
// }

// export const ReactImage: Story = {
//   decorators: [
//     (Story) =>{ 
//       const Blot = useEmbedBlot({
//         blotName: 'image',
//         render: (options) => <CustomImage {...options}></CustomImage>
//       })
//       return (
//         <div style={{ margin: '3em' }}>
//           {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
//           <Story blots={[Blot]} />
//         </div>
//       )
//     },
//   ],
//   args: {
//     defaultValue: new Delta().insert("Hello World\n").insert({
//       image: "https://github.com/vincentdchan/quill-next/raw/main/images/quill-next.png",
//     }),
//     config: {
//       theme: 'bubble',
//       modules: {
//         toolbar: true,
//       }
//     },
//   },
// }
