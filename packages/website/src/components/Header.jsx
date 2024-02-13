import classNames from 'classnames';
import LogoIcon from '../svg/logo.svg';
import Link from 'next/link';
import OctocatIcon from '../svg/octocat.svg';
import ExternalLinkIcon from '../svg/external-link.svg';
import DropdownIcon from '../svg/dropdown.svg';
import * as styles from './Header.module.scss';
import { DocSearch } from '@docsearch/react';
import { useState } from 'react';
import playground from '../data/playground';
import docs from '../data/docs';
import guides from '../data/guides';
import ActiveLink from './ActiveLink';
import ClickOutsideHandler from './ClickOutsideHandler';

const MainNav = ({ ...props }) => {
  return (
    <nav {...props}>
      <ActiveLink
        activeClassName={styles.active}
        activePath="/docs"
        href={docs[0].url}
      >
        Documentation
      </ActiveLink>
      <ActiveLink
        activeClassName={styles.active}
        activePath="/guides"
        href={guides[0].url}
      >
        Guides
      </ActiveLink>
      <ActiveLink
        activeClassName={styles.active}
        activePath="/playground"
        href={playground[0].url}
      >
        Playground
      </ActiveLink>
    </nav>
  );
};

const VersionSelector = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ClickOutsideHandler
      onClickOutside={() => {
        setIsOpen(false);
      }}
      className={styles.versionWrapper}
    >
      <div
        role="button"
        className={styles.version}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        v{process.env.version} <DropdownIcon />
      </div>
      <div
        role="menu"
        className={classNames(styles.versionDropdown, {
          [styles.isOpen]: isOpen,
        })}
      >
        <a
          role="menuitem"
          href={`https://github.com/quilljs/quill/releases/tag/v${process.env.version}`}
          className={styles.versionDropdownItem}
          target="_blank"
        >
          Release Notes <ExternalLinkIcon />
        </a>
        <a
          role="menuitem"
          href={`https://github.com/quilljs/quill/blob/v${process.env.version}/.github/CONTRIBUTING.md`}
          className={styles.versionDropdownItem}
          target="_blank"
        >
          Contributing <ExternalLinkIcon />
        </a>
        <div className={styles.versionLabel}>Previous Versions</div>
        <a
          role="menuitem"
          href="https://v1.quilljs.com"
          className={styles.versionDropdownItem}
          target="_blank"
        >
          v{'1.3.7'} <ExternalLinkIcon />
        </a>
      </div>
    </ClickOutsideHandler>
  );
};

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <Link href="/">
            <LogoIcon width="60" />
          </Link>
          <VersionSelector />
        </div>
        <MainNav className={styles.mainNav} />
        <nav className={styles.secondaryNav}>
          <a
            href="https://github.com/quilljs/quill"
            target="_blank"
            title="Edit on GitHub"
          >
            <OctocatIcon />
          </a>
          <DocSearch
            appId="ZTZN3V01SS"
            indexName="quilljsdev"
            apiKey="7e6ff70a985e6af9bfea77c780411b9a"
          />
        </nav>
        <button
          className={styles.mobileNavToggle}
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div
        className={classNames(styles.mobileNav, {
          [styles.isNavOpen]: isNavOpen,
        })}
      >
        <MainNav className={styles.mobileMainNav} />
      </div>
    </header>
  );
};

export default Header;
