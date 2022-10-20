import classNames from 'classnames';
import Helmet from 'react-helmet';
import { graphql, useStaticQuery } from 'gatsby';
import LogoIcon from '../svg/logo.svg';
import GitHub from './GitHub';
import usePageType from '../utils/usePageType';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          version
        }
      }
    }
  `);

  const pageType = usePageType();

  return (
    <>
      <Helmet bodyAttributes={{ class: pageType }} />
      <header>
        <nav className="navbar-drop">
          <button className="navbar-close"></button>
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
        <button className="navbar-open">
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
            <a href="/docs/" className="action documentation">
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

export default Layout;
