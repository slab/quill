import LogoIcon from '../svg/logo.svg';
import Link from 'next/link';
import SEO from './SEO';
import Header from './Header';

const Layout = ({ children, title }) => {
  return (
    <>
      <SEO title={title} />
      <Header />
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
            <Link href="/playground" className="action">
              Playground
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

export default Layout;
