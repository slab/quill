import { ReactNode } from 'react';
import Default from './Default';

const Blog = ({ children }: { children: ReactNode }) => (
  <Default>
    <div id="blog-container" className="container">
      <div className="post-list">{children}</div>
    </div>
  </Default>
);

export default Blog;
