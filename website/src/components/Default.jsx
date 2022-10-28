import classNames from 'classnames';
import { graphql, Link, useStaticQuery } from 'gatsby';
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
              <Link className="navbar-link" to="/docs/quickstart/">
                Documentation
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" to="/guides/why-quill/">
                Guides
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" to="/playground/">
                Playground
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" to="/blog/">
                Blog
              </Link>
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
              <Link className="navbar-link" to="/docs/quickstart/">
                Documentation
              </Link>
            </li>
            <li
              className={classNames('navbar-item', {
                active: pageType === 'guides',
              })}
            >
              <Link className="navbar-link" to="/guides/why-quill/">
                Guides
              </Link>
            </li>
            <li className="logo-item">
              <Link className="logo" to="/">
                <LogoIcon />
              </Link>
            </li>
            <li
              className={classNames('navbar-item', {
                active: pageType === 'playground',
              })}
            >
              <Link className="navbar-link" to="/playground/">
                Playground
              </Link>
            </li>
            <li
              className={classNames('navbar-item', {
                active: pageType === 'blog',
              })}
            >
              <Link className="navbar-link" to="/blog/">
                Blog
              </Link>
            </li>
            <li className="download-item">
              <Link className="action" to="/docs/download/">
                Download
              </Link>
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
            <Link to="/docs/" className="action documentation">
              Documentation
            </Link>
            <Link to="/docs/download/" className="action">
              Download v
              {data?.site.siteMetadata.version.split('.').slice(0, 2).join('.')}
            </Link>
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
