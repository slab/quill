import classNames from 'classnames';
import LogoIcon from '../svg/logo.svg';
import Link from 'next/link';
import OctocatIcon from '../svg/octocat.svg';
import ExternalLinkIcon from '../svg/external-link.svg';
import DropdownIcon from '../svg/dropdown.svg';
import * as styles from './Header.module.scss';
import { DocSearch } from '@docsearch/react';
import { useState } from 'react';
import ActiveLink from './ActiveLink';
import ClickOutsideHandler from './ClickOutsideHandler';

const shortVersion = (version) => {
  const parts = version.split('-');
  const matched = parts[0].match(/(\d+)\.(\d+)\.\d+/);
  if (!matched) return version;
  return `${matched[1]}.${matched[2]}`;
};

const MainNav = ({ ...props }) => {
  return (
    <nav {...props}>
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
        v{shortVersion(process.env.version)} <DropdownIcon />
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
          href="https://quilljs.com"
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
            appId="quilljs"
            indexName="quilljs"
            apiKey="281facf513620e95600126795a00ab6c"
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
