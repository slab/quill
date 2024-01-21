import classNames from 'classnames';
import LogoIcon from '../svg/logo.svg';
import Link from 'next/link';
import OctocatIcon from '../svg/octocat.svg';
import XIcon from '../svg/x.svg';
import GitHub from './GitHub';
import * as styles from './Header.module.scss';
import { DocSearch } from '@docsearch/react';
import { useState } from 'react';
import ActiveLink from './ActiveLink';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className={styles.header}>
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
          <ActiveLink
            activeClassName={styles.active}
            activePath="/docs"
            href="/docs/quickstart"
          >
            Documentation
          </ActiveLink>
          <ActiveLink
            activeClassName={styles.active}
            activePath="/guides"
            href="/guides/why-quill"
          >
            Guides
          </ActiveLink>
          <ActiveLink
            activeClassName={styles.active}
            activePath="/playground"
            href="/playground"
          >
            Playground
          </ActiveLink>
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
  );
};

export default Header;
