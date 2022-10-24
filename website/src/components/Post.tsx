import { format } from 'date-fns';
import { ReactNode } from 'react';
import Default from './Default';

const Post = ({
  title,
  date,
  children,
}: {
  title: string;
  date: string;
  children: ReactNode;
}) => (
  <Default>
    <div id="blog-container" className="container">
      <div className="post">
        <h1>{title}</h1>
        <div className="post-meta">
          <time>{format(new Date(date), 'd MMM yyyy')}</time>
          <span>
            {' - '}
            <a href="https://twitter.com/jhchen" title="Jason Chen">
              Jason Chen
            </a>
          </span>
        </div>
        {children}
      </div>
    </div>
  </Default>
);

export default Post;
