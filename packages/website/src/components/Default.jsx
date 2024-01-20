import classNames from 'classnames';
import { useState } from 'react';
import Helmet from 'react-helmet';
import LogoIcon from '../svg/logo.svg';
import Link from 'next/link';
import GitHub from './GitHub';
import * as styles from './Default.module.scss';
import SEO from './SEO';

const Default = ({ children, title, pageType }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <SEO title={title} />
      <Helmet bodyAttributes={{ class: pageType }} />
      <header className={pageType || undefined}>
        <nav className={classNames('navbar-drop', { active: isNavOpen })}>
          <button
            className="navbar-close"
            onClick={() => setIsNavOpen(false)}
          ></button>
          <ul>
            <li className="navbar-item">
              <Link className="navbar-link" href="/docs/quickstart">
                Documentation
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" href="/guides/why-quill">
                Guides
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" href="/playground">
                Playground
              </Link>
            </li>
            <li className="navbar-item" style={{ display: 'none' }}>
              <Link className="navbar-link" href="/blog/">
                Blog
              </Link>
            </li>
            <li className={classNames('navbar-item', styles.githubMenuItem)}>
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
              <Link className="navbar-link" href="/docs/quickstart">
                Documentation
              </Link>
            </li>
            <li
              className={classNames('navbar-item', {
                active: pageType === 'guides',
              })}
            >
              <Link className="navbar-link" href="/guides/why-quill/">
                Guides
              </Link>
            </li>
            <li className="logo-item">
              <Link className="logo" href="/">
                <LogoIcon />
              </Link>
            </li>
            <li
              className={classNames('navbar-item', {
                active: pageType === 'playground',
              })}
            >
              <Link className="navbar-link" href="/playground">
                Playground
              </Link>
            </li>
            <li
              className={classNames('navbar-item', {
                active: pageType === 'blog',
              })}
              style={{ display: 'none' }}
            >
              <Link className="navbar-link" href="/blog">
                Blog
              </Link>
            </li>
            <li className="download-item">
              <Link className="action" href="/docs/download/">
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
            <Link href="/docs/quickstart" className="action documentation">
              Documentation
            </Link>
            <Link href="/docs/download/" className="action">
              Download v{process.env.version.split('.').slice(0, 2).join('.')}
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
