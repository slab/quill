import classNames from 'classnames';
import { graphql, useStaticQuery } from 'gatsby';
import { useState } from 'react';
import Helmet from 'react-helmet';
import LogoIcon from '../svg/logo.svg';
import GitHub from './GitHub';

const Default = ({ children, pageType }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          version
        }
      }
    }
  `);

  return (
    <>
      <Helmet
        bodyAttributes={{ class: classNames(pageType, 'layout-default') }}
      />
      <header className={pageType || undefined}>
        <nav className={classNames('navbar-drop', { active: isNavOpen })}>
          <button
            className="navbar-close"
            onClick={() => setIsNavOpen(false)}
          ></button>
          <ul>
            <li className="navbar-item">
              <a className="navbar-link" href="/docs/quickstart/">
                Documentation
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="/guides/why-quill/">
                Guides
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="/playground/">
                Playground
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="/blog/">
                Blog
              </a>
            </li>
            <li className="navbar-item">
              <GitHub dark />
            </li>
          </ul>
        </nav>
        <nav className="container">
          <ul className="navbar-list">
            <li
              className={classNames('navbar-item', {
                active: pageType === 'docs',
              })}
            >
              <a className="navbar-link" href="/docs/quickstart/">
                Documentation
              </a>
            </li>
            <li
              className={classNames('navbar-item', {
                active: pageType === 'guides',
              })}
            >
              <a className="navbar-link" href="/guides/why-quill/">
                Guides
              </a>
            </li>
            <li className="logo-item">
              <a className="logo" href="/">
                <LogoIcon />
              </a>
            </li>
            <li
              className={classNames('navbar-item', {
                active: pageType === 'playground',
              })}
            >
              <a className="navbar-link" href="/playground/">
                Playground
              </a>
            </li>
            <li
              className={classNames('navbar-item', {
                active: pageType === 'blog',
              })}
            >
              <a className="navbar-link" href="/blog/">
                Blog
              </a>
            </li>
            <li className="download-item">
              <a className="action" href="/docs/download/">
                Download
              </a>
            </li>
          </ul>
        </nav>
        <button className="navbar-open" onClick={() => setIsNavOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
      {children}
      <footer>
        <div className="container">
          <div className="logo row">
            <LogoIcon />
          </div>
          <h1>Your powerful rich text editor.</h1>
          <div className="actions row">
            <a href="/docs/quickstart/" className="action documentation">
              Documentation
            </a>
            <a href="/docs/download/" className="action">
              Download v
              {data?.site.siteMetadata.version.split('.').slice(0, 2).join('.')}
            </a>
          </div>
          <div className="users row">
            <h3>Trusted By</h3>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Default;
