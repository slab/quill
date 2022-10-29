import { useLocation } from '@reach/router';
import classNames from 'classnames';
import { graphql } from 'gatsby';
import SEO from '../components/SEO';
import docsItems from '../data/docs';
import guideItems from '../data/guides';
import OctocatIcon from '../svg/octocat.svg';
import slug from '../utils/slug';
import Default from '../components/Default';
import OpenSource from '../components/OpenSource';
import React, { useEffect } from 'react';

const getPagination = (permalink, items) => {
  const flattenedItems = [];

  const flatItems = i => {
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

  let prev = null;
  let next = null;

  if (index > 0) prev = flattenedItems[index - 1];
  if (index < flattenedItems.length - 1) next = flattenedItems[index + 1];

  return { prev, next };
};

const SidebarItem = ({ item }) => {
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

const Doc = ({ data, location, children }) => {
  const { title } = data.mdx.frontmatter;
  const { permalink, pageType } = data.mdx.fields;
  const category = pageType === 'guide' ? 'Guides' : 'Documentation';

  const items = pageType === 'guide' ? guideItems : docsItems;
  const { prev, next } = getPagination(permalink, items);

  useEffect(() => {
    docsearch({
      apiKey: '281facf513620e95600126795a00ab6c',
      indexName: 'quilljs',
      inputSelector: '.search-item input',
      debug: false,
    });
  }, []);

  return (
    <Default pageType={pageType}>
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
                <span>{title}</span>
              </span>
              <a
                className="edit-link"
                href={`${data.site.siteMetadata.github}${location.pathname}`}
                target="_blank"
                title="Edit on Github"
              >
                <OctocatIcon />
                <span>Edit on Github</span>
              </a>
            </div>
            <hr />
            <div id="content-container">
              <h1 id={slug(title)}>{title}</h1>
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

export const query = graphql`
  query ($id: String) {
    site {
      siteMetadata {
        github
      }
    }
    mdx(id: { eq: $id }) {
      fields {
        slug
        permalink
        pageType
      }
      frontmatter {
        title
      }
    }
  }
`;

export const Head = ({ data }) => (
  <>
    <SEO
      title={data.mdx.frontmatter.title}
      permalink={data.mdx.fields.permalink}
    />
    <link rel="stylesheet" href="/assets/css/base.css" />
    <link rel="stylesheet" href="/assets/css/styles.css" />
  </>
);

export default Doc;
