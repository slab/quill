import { GoogleAnalytics } from '@next/third-parties/google';
import './variables.scss';
import './base.css';
import './styles.scss';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics gaId="G-B37E2WMSPW" />
      <Component {...pageProps} />
    </>
  );
}
