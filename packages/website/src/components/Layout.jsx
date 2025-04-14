import LogoIcon from '../svg/logo.svg';
import Link from 'next/link';
import SEO from './SEO';
import Header from './Header';
import playground from '../data/playground';
import docs from '../data/docs';
import { Jost, Inter } from "next/font/google";

const jost = Jost({
  weight: '400',
  subsets: ['latin'],
});

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
          <h1 className={jost.className}>Your powerful and extensible rich text editor.</h1>
        </div>
      </footer>
    </>
  );
};

export default Layout;
