import { Suspense, lazy } from "react";
import DevelopersIcon from '../svg/features/developers.svg';
import ScaleIcon from '../svg/features/scale.svg';
import GitHub from '../components/GitHub';
import OctocatIcon from '../svg/octocat.svg';
import CrossPlatformIcon from '../svg/features/cross-platform.svg';
import Layout from '../components/Layout';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import NoSSR from '../components/NoSSR';
import Editor from '../components/Editor';
import { Jost, Inter } from "next/font/google";

import MainButton from '../components/MainButton';
import LinkedInLogo from '../svg/users/linkedin.svg';
import MicrosoftLogo from '../svg/users/microsoft.svg';
import SalesforceLogo from '../svg/users/salesforce.svg';
import ZoomLogo from '../svg/users/zoom.svg';
import AirtableLogo from '../svg/users/airtable.svg';
import FigmaLogo from '../svg/users/figma.svg';
import MiroLogo from '../svg/users/miro.svg';
import SlackLogo from '../svg/users/slack.svg';
import CalendlyLogo from '../svg/users/calendly.svg';
import FrontLogo from '../svg/users/front.svg';
import GrammarlyLogo from '../svg/users/grammarly.svg';
import VoxMediaLogo from '../svg/users/vox-media.svg';
import ApolloLogo from '../svg/users/apollo.svg';
import GemLogo from '../svg/users/gem.svg';
import ModeLogo from '../svg/users/mode.svg';
import TypeformLogo from '../svg/users/typeform.svg';
import SlabLogo from '../svg/users/slab.svg';

const fonts = ['sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'];
const userBuckets = [
  [
    ['LinkedIn', 'https://www.linkedin.com/', LinkedInLogo],
    ['Microsoft', 'https://www.microsoft.com/', MicrosoftLogo],
    ['Salesforce', 'https://www.salesforce.com/', SalesforceLogo],
    ['Zoom', 'https://zoom.us/', ZoomLogo],
  ],
  [
    ['Airtable', 'https://airtable.com/', AirtableLogo],
    ['Figma', 'https://www.figma.com/', FigmaLogo],
    ['Miro', 'https://miro.com/', MiroLogo],
    ['Slack', 'https://slack.com/', SlackLogo],
  ],
  [
    ['Calendly', 'https://calendly.com/', CalendlyLogo],
    ['Front', 'https://frontapp.com/', FrontLogo],
    ['Grammarly', 'https://www.grammarly.com/', GrammarlyLogo],
    ['Vox Media', 'https://www.voxmedia.com/', VoxMediaLogo],
  ],
  [
    ['Apollo', 'https://www.apollo.io/', ApolloLogo],
    ['Gem', 'https://www.gem.com/', GemLogo],
    ['Mode', 'https://mode.com/', ModeLogo],
    ['Typeform', 'https://www.typeform.com/', TypeformLogo],
  ],
  [['Slab', 'https://slab.com/', SlabLogo]],
];

const content = () => {
  const cdn = process.env.cdn;
  return `
                <h1>Quill Next Editor</h1>
                <p><br></p>
                <p>
                  Quill Next is a fork of <a href="https://github.com/slab/quill/">Quill</a>.
                  Created by <span class="qn-mention" data-value="Vincent Chan">Vincent Chan</span>
                </p>
                <p><br></p>
                <iframe class="ql-video ql-align-center" src="https://player.vimeo.com/video/253905163" width="500" height="280" allowfullscreen></iframe>
                <p><br></p>
                <h2 class="ql-align-center">Getting Started is Easy</h2>
                <p><br></p>
                <pre data-language="javascript" class="ql-syntax" spellcheck="false"><span class="hljs-comment">// &lt;link href="${cdn}/quill.snow.css" rel="stylesheet"&gt;</span>
<span class="hljs-comment">// &lt;script src="${cdn}/quill.js"&gt;&lt;/script&gt;</span>

<span class="hljs-keyword">const</span> quill = <span class="hljs-keyword">new</span> Quill(<span class="hljs-string">'#editor'</span>, {
  modules: {
    toolbar: <span class="hljs-string">'#toolbar'</span>
  },
  theme: <span class="hljs-string">'snow'</span>
});

<span class="hljs-comment">// Open your browser's developer console to try out the API!</span>
</pre>
                <p><br></p>
                <p><br></p>
                <p class="ql-align-center"><strong>Built with</strong></p>
                <p class="ql-align-center"><span class="ql-formula" data-value="x^2 + (y - \\sqrt[3]{x^2})^2 = 1"></span></p>
                <p><br></p>

`;
};

const jost = Jost({
  weight: '300',
  subsets: ['latin'],
});

const EnhancedEditor = lazy(() => import('../components/EnhancedEditor'));

const inter = Inter({ subsets: ['latin'] })

const IndexPage = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    import('quill-next').then(({ default: Quill }) => {
      // @ts-expect-error
      const Font = Quill.import('formats/font');
      Font.whitelist = fonts;
      // @ts-expect-error
      Quill.register(Font, true);

      function loadFonts() {
        window.WebFontConfig = {
          google: {
            families: [
              'Inconsolata::latin',
              'Ubuntu+Mono::latin',
              'Slabo+27px::latin',
              'Roboto+Slab::latin',
            ],
          },
        };
        (function () {
          var wf = document.createElement('script');
          wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
          wf.type = 'text/javascript';
          wf.async = 'true';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(wf, s);
        })();
      }

      loadFonts();
    });
  }, []);

  const [quills, setQuills] = useState([]);

  const handleEditorLoad = (index) => (quill) => {
    setQuills((q) => {
      const n = [...q];
      n[index] = quill;
      return n;
    });
  };

  useEffect(() => {
    const quill = quills[activeIndex];
    if (!quill) return;

    window.quill = quill;

    if (isFirstRenderRef.current) {
      console.log(
        "Welcome to Quill!\n\nThe editor on this page is available via `quill`. Give the API a try:\n\n\tquill.formatText(11, 4, 'bold', true);\n\nVisit the API documentation page to learn more: https://quilljs.com/docs/api/\n",
      );
    } else {
      console.info('window.quill is now bound to', quill);
    }

    isFirstRenderRef.current = false;
  }, [activeIndex, quills]);

  return (
    <Layout>
      <div
        id="above-container"
        className={
          classNames({ 'demo-active': isDemoActive })
          + ' ' + inter.className
        }
      >
        <div className="container">
          <div id="users-container">
            <h1 className={jost.className}>
              Still the Quill you know and love
            </h1>
            <h1 className={jost.className}>
              Now enhanced with React
            </h1>
            <h4 className={jost.className}>
              Your powerful and extensible rich text editor
            </h4>
            <div className="buttons-container">
              <MainButton
                variant='white'
                href="https://github.com/vincentdchan/quill-next"
                target="_blank"
              >
                <OctocatIcon />
                Check on Github
              </MainButton>
              <MainButton variant='black' href="/docs/quickstart">Documentation</MainButton>
            </div>
          </div>

          <div id="laptop-container" onClick={() => setIsDemoActive(true)}>
            {/* <div id="camera-container">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={classNames('camera', {
                    active: activeIndex === index,
                  })}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsDemoActive(true);
                  }}
                >
                  <div className="dot" />
                </div>
              ))}
            </div> */}
            <NoSSR>
              <div id="demo-container">
                <div
                  id="carousel-container"
                >
                  <div id="bubble-wrapper">
                    <div id="bubble-container">
                      <Suspense>
                        <EnhancedEditor
                          config={{
                            bounds: '#bubble-container .ql-container',
                            modules: {
                              syntax: true,
                            },
                            theme: 'next',
                          }}
                          onLoad={handleEditorLoad(0)}
                          dangerouslySetInnerHTML={{ __html: content() }}
                        />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </NoSSR>
          </div>
        </div>
      </div>

      <div id="features-container">
        <div className="container">
          <div className="feature row">
            <div className="columns details">
              <h2>Built on Delta</h2>
              <span>
                Clean, readable JSON describing your content.
              </span>
              <Link className="action-link" href="/docs/quickstart">
                Learn More
              </Link>
            </div>
            <div className="columns">
              <ScaleIcon />
            </div>
          </div>

          {/* <div id="github-wrapper">
            <div id="github-container">
              <GitHub />
            </div>
          </div> */}

          <hr />

          <div className="feature row">
            <div className="columns details">
              <h2>Quill meets React</h2>
              <span>
                Delivering rich features, built for extension.
              </span>
              <Link className="action-link" href="/docs/quickstart">
                Learn More
              </Link>
            </div>
            <div className="columns">
              <ScaleIcon />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
