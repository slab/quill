import DevelopersIcon from '../svg/features/developers.svg';
import ScaleIcon from '../svg/features/scale.svg';
import GitHub from '../components/GitHub';
import CrossPlatformIcon from '../svg/features/cross-platform.svg';
import Layout from '../components/Layout';
import { useEffect, useRef, useState } from 'react';
import Editor from '../components/Editor';
import classNames from 'classnames';
import Link from 'next/link';
import NoSSR, { withoutSSR } from '../components/NoSSR';

const fonts = ['sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'];
const userBuckets = [
  {
    Intuit: 'https://www.intuit.com/',
    LinkedIn: 'https://www.linkedin.com/',
    Microsoft: 'https://www.microsoft.com/',
    Salesforce: 'https://www.salesforce.com/',
    Slack: 'https://slack.com/',
  },
  {
    Asana: 'https://asana.com/',
    Airtable: 'https://airtable.com/',
    Grammarly: 'https://www.grammarly.com/',
    Gusto: 'https://www.gusto.com/',
    'Vox Media': 'https://www.voxmedia.com/',
  },
  {
    Buffer: 'https://buffer.com/',
    Front: 'https://frontapp.com/',
    Lever: 'https://www.lever.co/',
    Reedsy: 'https://reedsy.com/',
    Slab: 'https://slab.com/',
  },
];

const Content = () => {
  const cdn = process.env.cdn;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
                <h1 class="ql-align-center">Quill Rich Text Editor</h1>
                <p><br></p>
                <p>Quill is a free, <a href="https://github.com/quilljs/quill/">open source</a> WYSIWYG editor built for the modern web. With its <a href="https://quilljs.com/docs/modules/">modular architecture</a> and expressive <a href="https://quilljs.com/docs/api">API</a>, it is completely customizable to fit any need.</p>
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

`,
      }}
    />
  );
};

const Users = withoutSSR(() => {
  const [selectedUsers] = useState(() =>
    userBuckets.map((bucket) => {
      const keys = Object.keys(bucket);
      const name = keys[Math.floor(Math.random() * keys.length)];
      return {
        // @ts-expect-error
        href: bucket[name],
        title: name,
        className: 'user-' + name.toLowerCase().replace(/\s/g, ''),
      };
    }),
  );

  return (
    <>
      {selectedUsers.map((user) => (
        <li key={user.title}>
          <a {...user} target="_blank" />
        </li>
      ))}
    </>
  );
});

const IndexPage = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
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
        className={classNames({ 'demo-active': isDemoActive })}
      >
        <div className="container">
          <div id="users-container">
            <h2>
              <button
                className="prev"
                style={{ visibility: activeIndex === 0 ? 'hidden' : undefined }}
                onClick={() => setActiveIndex(activeIndex - 1)}
              >
                <span className="arrow">
                  <span className="tip"></span>
                  <span className="shaft"></span>
                </span>
              </button>
              Switch Examples
              <button
                className="next"
                style={{ visibility: activeIndex === 2 ? 'hidden' : undefined }}
                onClick={() => setActiveIndex(activeIndex + 1)}
              >
                <span className="arrow">
                  <span className="tip"></span>
                  <span className="shaft"></span>
                </span>
              </button>
            </h2>
            <h1>Your powerful rich text editor.</h1>
            <ul>
              <li>Trusted by:</li>
              <Users />
            </ul>
          </div>

          <div id="laptop-container">
            <div id="camera-container">
              <span
                className={classNames('camera', { active: activeIndex === 0 })}
                onClick={() => {
                  setActiveIndex(0);
                  setIsDemoActive(true);
                }}
              ></span>
              <span
                className={classNames('camera', { active: activeIndex === 1 })}
                onClick={() => {
                  setActiveIndex(1);
                  setIsDemoActive(true);
                }}
              ></span>
              <span
                className={classNames('camera', { active: activeIndex === 2 })}
                onClick={() => {
                  setActiveIndex(2);
                  setIsDemoActive(true);
                }}
              ></span>
            </div>
            <NoSSR>
              <div id="demo-container">
                <div
                  id="carousel-container"
                  style={{ marginLeft: `${activeIndex * -100}%` }}
                >
                  <div id="bubble-wrapper">
                    <div id="bubble-container">
                      <Editor
                        config={{
                          bounds: '#bubble-container .ql-container',
                          modules: {
                            syntax: true,
                          },
                          theme: 'bubble',
                        }}
                        onSelectionChange={() => setIsDemoActive(true)}
                        onLoad={handleEditorLoad(0)}
                      >
                        <Content />
                      </Editor>
                    </div>
                  </div>
                  <div id="snow-wrapper">
                    <div id="snow-container">
                      <div className="toolbar">
                        <span className="ql-formats">
                          <select className="ql-header" defaultValue="3">
                            <option value="1">Heading</option>
                            <option value="2">Subheading</option>
                            <option value="3">Normal</option>
                          </select>
                          <select className="ql-font" defaultValue="sailec">
                            <option value="sailec">Sailec Light</option>
                            <option value="sofia">Sofia Pro</option>
                            <option value="slabo">Slabo 27px</option>
                            <option value="roboto">Roboto Slab</option>
                            <option value="inconsolata">Inconsolata</option>
                            <option value="ubuntu">Ubuntu Mono</option>
                          </select>
                        </span>
                        <span className="ql-formats">
                          <button className="ql-bold"></button>
                          <button className="ql-italic"></button>
                          <button className="ql-underline"></button>
                        </span>
                        <span className="ql-formats">
                          <button className="ql-list" value="ordered"></button>
                          <button className="ql-list" value="bullet"></button>
                          <select className="ql-align" defaultValue="false">
                            <option label="left"></option>
                            <option label="center" value="center"></option>
                            <option label="right" value="right"></option>
                            <option label="justify" value="justify"></option>
                          </select>
                        </span>
                        <span className="ql-formats">
                          <button className="ql-link"></button>
                          <button className="ql-image"></button>
                          <button className="ql-video"></button>
                        </span>
                        <span className="ql-formats">
                          <button className="ql-formula"></button>
                          <button className="ql-code-block"></button>
                        </span>
                        <span className="ql-formats">
                          <button className="ql-clean"></button>
                        </span>
                      </div>
                      <Editor
                        config={{
                          bounds: '#snow-container .ql-container',
                          modules: {
                            syntax: true,
                            toolbar: '#snow-container .toolbar',
                          },
                          theme: 'snow',
                        }}
                        onSelectionChange={() => setIsDemoActive(true)}
                        onLoad={handleEditorLoad(1)}
                      >
                        <Content />
                      </Editor>
                    </div>
                  </div>
                  <div id="full-wrapper">
                    <div id="full-container">
                      <Editor
                        config={{
                          bounds: '#full-container .ql-container',
                          modules: {
                            syntax: true,
                            toolbar: [
                              [{ font: fonts }, { size: [] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ color: [] }, { background: [] }],
                              [{ script: 'super' }, { script: 'sub' }],
                              [
                                { header: '1' },
                                { header: '2' },
                                'blockquote',
                                'code-block',
                              ],
                              [
                                { list: 'ordered' },
                                { list: 'bullet' },
                                { indent: '-1' },
                                { indent: '+1' },
                              ],
                              [{ direction: 'rtl' }, { align: [] }],
                              ['link', 'image', 'video', 'formula'],
                              ['clean'],
                            ],
                          },
                          theme: 'snow',
                        }}
                        onSelectionChange={() => setIsDemoActive(true)}
                        onLoad={handleEditorLoad(2)}
                      >
                        <Content />
                      </Editor>
                    </div>
                  </div>
                </div>
              </div>
            </NoSSR>
          </div>
        </div>
      </div>

      <div id="detail-container">
        <div className="container">
          <Link className="action" href="/docs/quickstart">
            Documentation
          </Link>
          <h1>An API Driven Rich Text Editor</h1>
        </div>
      </div>

      <div id="features-container">
        <div className="container">
          <div className="row">
            <div className="feature columns">
              <DevelopersIcon />
              <div className="details">
                <h2>Built for Developers</h2>
                <span>
                  Granular access to the editor&apos;s content, changes and
                  events through a simple API. Works consistently and
                  deterministically with JSON as both input and output.
                </span>
                <Link className="action-link" href="/docs/quickstart">
                  View documentation
                </Link>
              </div>
            </div>
            <div className="feature columns">
              <CrossPlatformIcon />
              <div className="details">
                <h2>Cross Platform</h2>
                <span>
                  Supports all modern browsers on desktops, tablets and phones.
                  Experience the same consistent behavior and produced HTML
                  across platforms.
                </span>
                <a
                  className="action-link"
                  href="https://github.com/quilljs/quill/#readme"
                >
                  See the Chart
                </a>
              </div>
            </div>
          </div>

          <div id="github-wrapper">
            <div id="github-container">
              <GitHub />
            </div>
          </div>

          <hr />

          <div className="feature row">
            <div className="columns details">
              <h2>Fits Like a Glove</h2>
              <span>
                Used in small projects and giant Fortune 500s alike. Start
                simple with the Quill core then easily customize or add your own
                extensions later if your product needs grow.
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
