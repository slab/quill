import { GoogleAnalytics } from '@next/third-parties/google';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './variables.scss';
import './base.css';
import './styles.scss';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <Theme accentColor="yellow">
      <GoogleAnalytics gaId="G-8676QJP3KG" />
      <Component {...pageProps} />
    </Theme>
  );
}
