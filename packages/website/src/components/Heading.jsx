import { createElement } from 'react';
import slug from '../utils/slug';

const EXPERIMENTAL_FLAG = ' #experimental';

const Heading = ({ level, children, anchor = 'on' }) => {
  const tag = `h${level}`;

  if (typeof children !== 'string') {
    return createElement(tag, null, children);
  }

  const isExperimental = children.endsWith(EXPERIMENTAL_FLAG);
  const title = isExperimental
    ? children.slice(0, -EXPERIMENTAL_FLAG.length)
    : children;
  const id =
    anchor === 'on'
      ? slug(title) + (isExperimental ? '-experimental' : '')
      : undefined;

  return createElement(
    tag,
    { id },
    <>
      {id && <a className="anchor" href={`#${id}`}></a>}
      {title}
      {isExperimental && <span className="experimental">experimental</span>}
    </>,
  );
};

export const Heading1 = ({ children, anchor }) => (
  <Heading level={1} anchor={anchor}>
    {children}
  </Heading>
);
export const Heading2 = ({ children, anchor }) => (
  <Heading level={2} anchor={anchor}>
    {children}
  </Heading>
);
export const Heading3 = ({ children, anchor }) => (
  <Heading level={3} anchor={anchor}>
    {children}
  </Heading>
);
export const Heading4 = ({ children, anchor }) => (
  <Heading level={4} anchor={anchor}>
    {children}
  </Heading>
);
export const Heading5 = ({ children, anchor }) => (
  <Heading level={5} anchor={anchor}>
    {children}
  </Heading>
);
export const Heading6 = ({ children, anchor }) => (
  <Heading level={6} anchor={anchor}>
    {children}
  </Heading>
);
