import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import docsItems from '../data/docs';
import guideItems from '../data/guides';
import OctocatIcon from '../svg/octocat.svg';
import Link from 'next/link';
import slug from '../utils/slug';
import Layout from '../components/Layout';
import OpenSource from '../components/OpenSource';
import React, { useState } from 'react';
import * as styles from './PostLayout.module.scss';
import flattenData from '../utils/flattenData';

const getPagination = (permalink, items) => {
  const flattenedItems = flattenData(items);
  const index = flattenedItems.findIndex((item) => item.url === permalink);
  if (index === -1) return { prev: null, next: null };

  let prev = null;
  let next = null;

  if (index > 0) prev = flattenedItems[index - 1];
  if (index < flattenedItems.length - 1) next = flattenedItems[index + 1];

  return { prev, next };
};

const SidebarItem = ({ item }) => {
  const pathname = usePathname();

  return (
    <li className={classNames({ active: pathname.includes(item.url) })}>
      <Link href={item.url}>{item.title}</Link>
      {item.children && (
        <ul>
          {item.children.map((child) => (
            <SidebarItem key={child.url} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

const PostLayout = ({ title, pageType, filePath, permalink, children }) => {
  const category = pageType === 'guides' ? 'Guides' : 'Documentation';

  const items = pageType === 'guides' ? guideItems : docsItems;
  const { prev, next } = getPagination(permalink, items);

  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <Layout>
      <div id="docs-wrapper" className="container">
        <div className="row">
          <div
            id="sidebar-container"
            className={classNames('three', 'columns', {
              active: isNavOpen,
            })}
          >
            <button
              className="sidebar-button"
              onClick={() => {
                setIsNavOpen(!isNavOpen);
              }}
            >
              Document Navigation
            </button>
            <ul className="sidebar-list">
              {items.map((item) => (
                <SidebarItem key={item.url} item={item} />
              ))}
            </ul>
          </div>
          <div id="docs-container" className="nine columns">
            <div className={classNames('row', styles.breadcrumbRow)}>
              <div className={styles.breadcrumb}>
                <span>{category}</span>
                <span>{title}</span>
              </div>
            </div>
            <article id="content-container" className={styles.content}>
              <h1 id={slug(title)}>{title}</h1>
              {children}
            </article>
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
            <div className={styles.editOnGitHub}>
              <a
                className={styles.editLink}
                href={process.env.github + filePath}
                target="_blank"
                title="Edit on GitHub"
              >
                Edit this page on GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="row">
          <hr />
        </div>

        <OpenSource />
      </div>
    </Layout>
  );
};

export default PostLayout;
