import { useLocation } from '@reach/router';
import classNames from 'classnames';
import { HeadFC } from 'gatsby';
import docsItems from '../data/docs';
import guideItems from '../data/guides';
import OctocatIcon from '../svg/octocat.svg';
import usePageType from '../utils/usePageType';
import Default from './Default';
import OpenSource from './OpenSource';

type Item = { title: string; url: string; children?: Item[] };

const getPagination = (permalink: string, items: Item[]) => {
  const flattenedItems: Item[] = [];

  const flatItems = (i: Item[]) => {
    i.forEach(child => {
      if (child.url.includes('#')) return;
      flattenedItems.push(child);
      if (child.children) {
        flatItems(child.children);
      }
    });
  };

  flatItems(items);

  const index = flattenedItems.findIndex(item => item.url === permalink);
  if (index === -1) return { prev: null, next: null };

  let prev: Item | null = null;
  let next: Item | null = null;

  if (index > 0) prev = flattenedItems[index - 1];
  if (index < flattenedItems.length - 1) next = flattenedItems[index + 1];

  return { prev, next };
};

const SidebarItem = ({ item }: { item: Item }) => {
  const { pathname } = useLocation();

  return (
    <li className={classNames({ active: pathname.includes(item.url) })}>
      <a href={item.url}>{item.title}</a>
      {item.children && (
        <ul>
          {item.children.map(child => (
            <SidebarItem key={child.url} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

const Docs = ({ permalink, title, children }) => {
  const pageType = usePageType();
  const category = pageType === 'guides' ? 'Guides' : 'Documentation';

  const items = pageType === 'guides' ? guideItems : docsItems;
  const { prev, next } = getPagination(permalink, items);

  return (
    <Default>
      <div id="docs-wrapper" className="container">
        <div className="row">
          <div id="sidebar-container" className="three columns">
            <button className="sidebar-button">Document Navigation</button>
            <ul className="sidebar-list">
              <li className="search-item">
                <input type="text" />
              </li>
              {items.map(item => (
                <SidebarItem key={item.url} item={item} />
              ))}
            </ul>
          </div>
          <div id="docs-container" className="nine columns">
            <div className="row">
              <span className="breadcrumb">
                <span>{category}:</span>
                <span>Modules</span>
              </span>
              <a
                className="edit-link"
                href="{{site.github}}/{{page.path}}"
                target="_blank"
                title="Edit on Github"
              >
                <OctocatIcon />
                <span>Edit on Github</span>
              </a>
            </div>
            <hr />
            <div id="content-container">
              <h1 id="{{ page.title | slugify }}">{title}</h1>
              {children}
            </div>
            <div className="row" id="pagination-container">
              {prev && (
                <a className="prev" href={prev.url}>
                  <span className="label">{prev.title}</span>
                  <span className="arrow">
                    <span className="tip"></span>
                    <span className="shaft"></span>
                  </span>
                </a>
              )}
              {next && (
                <a className="next" href={next.url}>
                  <span className="label">{next.title}</span>
                  <span className="arrow">
                    <span className="tip"></span>
                    <span className="shaft"></span>
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <hr />
        </div>

        <OpenSource />
      </div>
    </Default>
  );
};

export const Head: HeadFC = () => (
  <>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Inconsolata"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css"
    />
  </>
);

export default Docs;
