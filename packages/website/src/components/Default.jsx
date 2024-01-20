import classNames from 'classnames';
import { useState } from 'react';
import Helmet from 'react-helmet';
import LogoIcon from '../svg/logo.svg';
import Link from 'next/link';
import OctocatIcon from '../svg/octocat.svg';
import XIcon from '../svg/x.svg';
import GitHub from './GitHub';
import * as styles from './Default.module.scss';
import SEO from './SEO';
import { DocSearch } from '@docsearch/react';

const Default = ({ children, title, pageType }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <SEO title={title} />
      <Helmet bodyAttributes={{ class: pageType }} />
      <header className={classNames(styles.header, pageType || undefined)}>
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
            <li className={classNames(styles.githubMenuItem)}>
              <GitHub dark />
            </li>
          </ul>
        </nav>
        <div className={styles.headerContent}>
          <Link className={styles.logo} href="/">
            <LogoIcon width="60" />
            <div className={styles.version}>v2</div>
          </Link>
          <nav className={styles.mainNav}>
            <Link
              className={classNames({ [styles.active]: pageType === 'docs' })}
              href="/docs/quickstart"
            >
              Documentation
            </Link>
            <Link
              className={classNames({ [styles.active]: pageType === 'guides' })}
              href="/guides/why-quill"
            >
              Guides
            </Link>
            <Link
              className={classNames({
                [styles.active]: pageType === 'playground',
              })}
              href="/playground"
            >
              Playground
            </Link>
          </nav>
          <nav className={styles.secondaryNav}>
            <a
              href="https://github.com/quilljs/quill"
              target="_blank"
              title="Edit on GitHub"
            >
              <OctocatIcon />
            </a>
            <a
              href="https://twitter.com/quilljs"
              target="_blank"
              title="Quill on X"
            >
              <XIcon />
            </a>
            <DocSearch
              appId="quilljs"
              indexName="quilljs"
              apiKey="281facf513620e95600126795a00ab6c"
            />
          </nav>
        </div>
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
