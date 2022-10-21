import type { HeadFC } from 'gatsby';
import DevelopersIcon from '../svg/features/developers.svg';
import ScaleIcon from '../svg/features/scale.svg';
import GitHub from '../components/GitHub';
import CrossPlatformIcon from '../svg/features/cross-platform.svg';
import Default from '../components/Default';

const IndexPage = () => (
  <Default>
    <div id="above-container">
      <div className="container">
        <div id="users-container">
          <h2>
            <button className="prev">
              <span className="arrow">
                <span className="tip"></span>
                <span className="shaft"></span>
              </span>
            </button>
            Switch Examples
            <button className="next">
              <span className="arrow">
                <span className="tip"></span>
                <span className="shaft"></span>
              </span>
            </button>
          </h2>
          <h1>Your powerful rich text editor.</h1>
          <ul>
            <li>Trusted by:</li>
            <li>
              <a
                className="user-linkedin"
                href="https://www.linkedin.com/"
                title="LinkedIn"
                target="_blank"
              ></a>
            </li>
            <li>
              <a
                className="user-slack"
                href="https://slack.com/"
                target="_blank"
                title="Slack"
              ></a>
            </li>
            <li>
              <a
                className="user-slab"
                href="https://www.slab.com/"
                target="_blank"
                title="Slab"
              ></a>
            </li>
          </ul>
        </div>

        <div id="laptop-container">
          <div id="camera-container">
            <span className="camera"></span>
            <span className="camera active"></span>
            <span className="camera"></span>
          </div>
          <div id="demo-container">
            <div id="carousel-container">
              <div id="bubble-wrapper">
                <div id="bubble-container">
                  <div className="editor"></div>
                </div>
              </div>
              <div id="snow-wrapper">
                <div id="snow-container">
                  <div className="toolbar">
                    <span className="ql-formats">
                      <select className="ql-header">
                        <option value="1">Heading</option>
                        <option value="2">Subheading</option>
                        <option selected>Normal</option>
                      </select>
                      <select className="ql-font">
                        <option selected>Sailec Light</option>
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
                      <select className="ql-align">
                        <option label="left" selected></option>
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
                  <div className="editor">
                    <h1 className="ql-align-center">Quill Rich Text Editor</h1>
                    <p>
                      <br />
                    </p>
                    <p>
                      Quill is a free,{' '}
                      <a href="https://github.com/quilljs/quill/">
                        open source
                      </a>{' '}
                      WYSIWYG editor built for the modern web. With its{' '}
                      <a href="https://quilljs.com/docs/modules/">
                        modular architecture
                      </a>{' '}
                      and expressive{' '}
                      <a href="https://quilljs.com/docs/api/">API</a>, it is
                      completely customizable to fit any need.
                    </p>
                    <p>
                      <br />
                    </p>
                    <iframe
                      className="ql-video ql-align-center"
                      src="https://player.vimeo.com/video/253905163"
                      width="500"
                      height="280"
                      allowFullScreen
                    ></iframe>
                    <p>
                      <br />
                    </p>
                    <h2 className="ql-align-center">Getting Started is Easy</h2>
                    <p>
                      <br />
                    </p>
                    {/* TODO */}

                    <pre className="ql-syntax" spellCheck="false">
                      <span className="hljs-comment">
                        // &lt;link
                        href="https://cdn.quilljs.com/1.2.6/quill.snow.css"
                        rel="stylesheet"&gt;
                      </span>
                      <span className="hljs-comment">
                        // &lt;script
                        src="https://cdn.quilljs.com/1.2.6/quill.min.js"&gt;&lt;/script&gt;
                      </span>
                      <span className="hljs-keyword">var</span> quill ={' '}
                      <span className="hljs-keyword">new</span> Quill(
                      <span className="hljs-string">'#editor'</span>
                      {`, {
  modules: {
    toolbar: <span className="hljs-string">'#toolbar'</span>
  },
  theme: <span className="hljs-string">'snow'</span>
});

`}
                      <span className="hljs-comment">
                        // Open your browser's developer console to try out the
                        API!
                      </span>
                    </pre>

                    <p>
                      <br />
                    </p>
                    <p>
                      <br />
                    </p>
                    <p className="ql-align-center">
                      <strong>Built with</strong>
                    </p>
                    <p className="ql-align-center">
                      <span
                        className="ql-formula"
                        data-value="x^2 + (y - \sqrt[3]{x^2})^2 = 1"
                      ></span>
                    </p>
                    <p>
                      <br />
                    </p>
                  </div>
                </div>
              </div>
              <div id="full-wrapper">
                <div id="full-container">
                  <div className="editor"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="detail-container">
      <div className="container">
        <a className="action" href="/docs/download/">
          Download Now
        </a>
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
                Granular access to the editor's content, changes and events
                through a simple API. Works consistently and deterministically
                with JSON as both input and output.
              </span>
              <a className="action-link" href="/docs/">
                View documentation
              </a>
            </div>
          </div>
          <div className="feature columns">
            <CrossPlatformIcon />
            <div className="details">
              <h2>Cross Platform</h2>
              <span>
                Supports all modern browsers on desktops, tablets and phones.
                Experience the same consistent behavior and produced HTML across
                platforms.
              </span>
              <a
                className="action-link"
                href="//github.com/quilljs/quill/#readme"
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
              Used in small projects and giant Fortune 500s alike. Start simple
              with the Quill core then easily customize or add your own
              extensions later if your product needs grow.
            </span>
            <a className="action-link" href="/docs/">
              Learn More
            </a>
          </div>
          <div className="columns">
            <ScaleIcon />
          </div>
        </div>
      </div>
    </div>
  </Default>
);

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
