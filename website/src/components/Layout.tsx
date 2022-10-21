import { MDXProvider } from '@mdx-js/react';
import CodePen from './CodePen';

const shortcodes = { CodePen };

export default function Layout({ children }) {
  return <MDXProvider components={shortcodes}>{children}</MDXProvider>;
}
