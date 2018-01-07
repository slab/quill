---
layout: v0.20
permalink: /0.20/docs/modules/toolbar/
title: Toolbar Module - Quill v0.20
---
<div class="container">
  <div id="sidebar-dropdown">
    <div class="btn-group">
      <button class="btn btn-default dropdown-toggle" data-toggle="dropdown"
      type="button">Navigate the Docs... <span class="caret"></span></button>
      <ul class="dropdown-menu" role="menu">
        <li>
          <a href="/0.20/docs/quickstart/">Quickstart</a>
        </li>
        <li>
          <a href="/0.20/docs/configuration/">Configuration</a>
        </li>
        <li>
          <a href="/0.20/docs/formats/">Formats</a>
        </li>
        <li>
          <a href="/0.20/docs/api/">API</a>
        </li>
        <li>
          <a href="/0.20/docs/events/">Events</a>
        </li>
        <li>
          <a href="/0.20/docs/deltas/">Deltas</a>
        </li>
        <li class="active">
          <a href="/0.20/docs/modules/">Modules</a>
          <ul>
            <li class="active">
              <a href="/0.20/docs/modules/toolbar/">Toolbar</a>
            </li>
            <li>
              <a href="/0.20/docs/modules/authorship/">Authorship</a>
            </li>
            <li>
              <a href="/0.20/docs/modules/multi-cursors/">Multiple Cursors</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="/0.20/docs/themes/">Themes</a>
        </li>
        <li>
          <a href="/0.20/examples/">Examples</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-9" id="docs-container">
      <h1 id="toolbar">Toolbar</h1>
      <p>The Toolbar module allow users to easily format Quill’s contents.</p>
      <div class="quill-wrapper">
        <div class="toolbar" id="toolbar-toolbar">
          <span class="ql-format-group"><select class="ql-font" title="Font">
            <option selected value="sans-serif">
              Sans Serif
            </option>
            <option value="serif">
              Serif
            </option>
            <option value="monospace">
              Monospace
            </option>
          </select> <select class="ql-size" title="Size">
            <option value="10px">
              Small
            </option>
            <option selected value="13px">
              Normal
            </option>
            <option value="18px">
              Large
            </option>
            <option value="32px">
              Huge
            </option>
          </select></span> <span class="ql-format-group"><span class=
          "ql-format-button ql-bold" title="Bold"></span> <span class=
          "ql-format-separator"></span> <span class=
          "ql-format-button ql-italic" title="Italic"></span> <span class=
          "ql-format-separator"></span> <span class=
          "ql-format-button ql-underline" title="Underline"></span>
          <span class="ql-format-separator"></span> <span class=
          "ql-format-button ql-strike" title="Strikethrough"></span></span>
          <span class="ql-format-group"><select class="ql-color" title=
          "Text Color">
            <option label="rgb(0, 0, 0)" selected value="rgb(0, 0, 0)">
              </option>
            <option label="rgb(230, 0, 0)" value="rgb(230, 0, 0)">
              </option>
            <option label="rgb(255, 153, 0)" value="rgb(255, 153, 0)">
              </option>
            <option label="rgb(255, 255, 0)" value="rgb(255, 255, 0)">
              </option>
            <option label="rgb(0, 138, 0)" value="rgb(0, 138, 0)">
              </option>
            <option label="rgb(0, 102, 204)" value="rgb(0, 102, 204)">
              </option>
            <option label="rgb(153, 51, 255)" value="rgb(153, 51, 255)">
              </option>
            <option label="rgb(255, 255, 255)" value="rgb(255, 255, 255)">
              </option>
            <option label="rgb(250, 204, 204)" value="rgb(250, 204, 204)">
              </option>
            <option label="rgb(255, 235, 204)" value="rgb(255, 235, 204)">
              </option>
            <option label="rgb(255, 255, 204)" value="rgb(255, 255, 204)">
              </option>
            <option label="rgb(204, 232, 204)" value="rgb(204, 232, 204)">
              </option>
            <option label="rgb(204, 224, 245)" value="rgb(204, 224, 245)">
              </option>
            <option label="rgb(235, 214, 255)" value="rgb(235, 214, 255)">
              </option>
            <option label="rgb(187, 187, 187)" value="rgb(187, 187, 187)">
              </option>
            <option label="rgb(240, 102, 102)" value="rgb(240, 102, 102)">
              </option>
            <option label="rgb(255, 194, 102)" value="rgb(255, 194, 102)">
              </option>
            <option label="rgb(255, 255, 102)" value="rgb(255, 255, 102)">
              </option>
            <option label="rgb(102, 185, 102)" value="rgb(102, 185, 102)">
              </option>
            <option label="rgb(102, 163, 224)" value="rgb(102, 163, 224)">
              </option>
            <option label="rgb(194, 133, 255)" value="rgb(194, 133, 255)">
              </option>
            <option label="rgb(136, 136, 136)" value="rgb(136, 136, 136)">
              </option>
            <option label="rgb(161, 0, 0)" value="rgb(161, 0, 0)">
              </option>
            <option label="rgb(178, 107, 0)" value="rgb(178, 107, 0)">
              </option>
            <option label="rgb(178, 178, 0)" value="rgb(178, 178, 0)">
              </option>
            <option label="rgb(0, 97, 0)" value="rgb(0, 97, 0)">
              </option>
            <option label="rgb(0, 71, 178)" value="rgb(0, 71, 178)">
              </option>
            <option label="rgb(107, 36, 178)" value="rgb(107, 36, 178)">
              </option>
            <option label="rgb(68, 68, 68)" value="rgb(68, 68, 68)">
              </option>
            <option label="rgb(92, 0, 0)" value="rgb(92, 0, 0)">
              </option>
            <option label="rgb(102, 61, 0)" value="rgb(102, 61, 0)">
              </option>
            <option label="rgb(102, 102, 0)" value="rgb(102, 102, 0)">
              </option>
            <option label="rgb(0, 55, 0)" value="rgb(0, 55, 0)">
              </option>
            <option label="rgb(0, 41, 102)" value="rgb(0, 41, 102)">
              </option>
            <option label="rgb(61, 20, 102)" value="rgb(61, 20, 102)">
              </option>
          </select> <span class="ql-format-separator"></span> <select class=
          "ql-background" title="Background Color">
            <option label="rgb(0, 0, 0)" value="rgb(0, 0, 0)">
              </option>
            <option label="rgb(230, 0, 0)" value="rgb(230, 0, 0)">
              </option>
            <option label="rgb(255, 153, 0)" value="rgb(255, 153, 0)">
              </option>
            <option label="rgb(255, 255, 0)" value="rgb(255, 255, 0)">
              </option>
            <option label="rgb(0, 138, 0)" value="rgb(0, 138, 0)">
              </option>
            <option label="rgb(0, 102, 204)" value="rgb(0, 102, 204)">
              </option>
            <option label="rgb(153, 51, 255)" value="rgb(153, 51, 255)">
              </option>
            <option label="rgb(255, 255, 255)" selected value=
            "rgb(255, 255, 255)">
              </option>
            <option label="rgb(250, 204, 204)" value="rgb(250, 204, 204)">
              </option>
            <option label="rgb(255, 235, 204)" value="rgb(255, 235, 204)">
              </option>
            <option label="rgb(255, 255, 204)" value="rgb(255, 255, 204)">
              </option>
            <option label="rgb(204, 232, 204)" value="rgb(204, 232, 204)">
              </option>
            <option label="rgb(204, 224, 245)" value="rgb(204, 224, 245)">
              </option>
            <option label="rgb(235, 214, 255)" value="rgb(235, 214, 255)">
              </option>
            <option label="rgb(187, 187, 187)" value="rgb(187, 187, 187)">
              </option>
            <option label="rgb(240, 102, 102)" value="rgb(240, 102, 102)">
              </option>
            <option label="rgb(255, 194, 102)" value="rgb(255, 194, 102)">
              </option>
            <option label="rgb(255, 255, 102)" value="rgb(255, 255, 102)">
              </option>
            <option label="rgb(102, 185, 102)" value="rgb(102, 185, 102)">
              </option>
            <option label="rgb(102, 163, 224)" value="rgb(102, 163, 224)">
              </option>
            <option label="rgb(194, 133, 255)" value="rgb(194, 133, 255)">
              </option>
            <option label="rgb(136, 136, 136)" value="rgb(136, 136, 136)">
              </option>
            <option label="rgb(161, 0, 0)" value="rgb(161, 0, 0)">
              </option>
            <option label="rgb(178, 107, 0)" value="rgb(178, 107, 0)">
              </option>
            <option label="rgb(178, 178, 0)" value="rgb(178, 178, 0)">
              </option>
            <option label="rgb(0, 97, 0)" value="rgb(0, 97, 0)">
              </option>
            <option label="rgb(0, 71, 178)" value="rgb(0, 71, 178)">
              </option>
            <option label="rgb(107, 36, 178)" value="rgb(107, 36, 178)">
              </option>
            <option label="rgb(68, 68, 68)" value="rgb(68, 68, 68)">
              </option>
            <option label="rgb(92, 0, 0)" value="rgb(92, 0, 0)">
              </option>
            <option label="rgb(102, 61, 0)" value="rgb(102, 61, 0)">
              </option>
            <option label="rgb(102, 102, 0)" value="rgb(102, 102, 0)">
              </option>
            <option label="rgb(0, 55, 0)" value="rgb(0, 55, 0)">
              </option>
            <option label="rgb(0, 41, 102)" value="rgb(0, 41, 102)">
              </option>
            <option label="rgb(61, 20, 102)" value="rgb(61, 20, 102)">
              </option>
          </select></span> <span class="ql-format-group"><span class=
          "ql-format-button ql-list" title="List"></span> <span class=
          "ql-format-separator"></span> <span class=
          "ql-format-button ql-bullet" title="Bullet"></span> <span class=
          "ql-format-separator"></span> <select class="ql-align" title=
          "Text Alignment">
            <option label="Left" selected value="left">
              </option>
            <option label="Center" value="center">
              </option>
            <option label="Right" value="right">
              </option>
            <option label="Justify" value="justify">
              </option>
          </select></span>
        </div>
        <div class="editor" id="toolbar-editor"></div>
      </div>
      <p>Simply create a container and the module to the Quill editor.</p>
      <figure class="highlight">
        <pre>
<code class="language-html" data-lang="html"><span class=
"c">&lt;!-- Create toolbar container --&gt;</span>
<span class="nt">&lt;div</span> <span class="na">id=</span><span class=
"s">"toolbar"</span><span class="nt">&gt;</span>
  <span class="c">&lt;!-- Add font size dropdown --&gt;</span>
  <span class="nt">&lt;select</span> <span class="na">class=</span><span class=
"s">"ql-size"</span><span class="nt">&gt;</span>
    <span class="nt">&lt;option</span> <span class=
"na">value=</span><span class="s">"10px"</span><span class=
"nt">&gt;</span>Small<span class="nt">&lt;/option&gt;</span>
    <span class="nt">&lt;option</span> <span class=
"na">value=</span><span class="s">"13px"</span> <span class=
"na">selected</span><span class="nt">&gt;</span>Normal<span class=
"nt">&lt;/option&gt;</span>
    <span class="nt">&lt;option</span> <span class=
"na">value=</span><span class="s">"18px"</span><span class=
"nt">&gt;</span>Large<span class="nt">&lt;/option&gt;</span>
    <span class="nt">&lt;option</span> <span class=
"na">value=</span><span class="s">"32px"</span><span class=
"nt">&gt;</span>Huge<span class="nt">&lt;/option&gt;</span>
  <span class="nt">&lt;/select&gt;</span>
  <span class="c">&lt;!-- Add a bold button --&gt;</span>
  <span class="nt">&lt;button</span> <span class="na">class=</span><span class=
"s">"ql-bold"</span><span class="nt">&gt;&lt;/button&gt;</span>
<span class="nt">&lt;/div&gt;</span>
<span class="nt">&lt;div</span> <span class="na">id=</span><span class=
"s">"editor"</span><span class="nt">&gt;&lt;/div&gt;</span>

<span class="c">&lt;!-- Initialize editor and toolbar --&gt;</span>
<span class="nt">&lt;script&gt;</span>
  <span class="kd">var</span> <span class="nx">editor</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"s1">'#editor'</span><span class="p">);</span>
  <span class="nx">editor</span><span class="p">.</span><span class=
"nx">addModule</span><span class="p">(</span><span class=
"s1">'toolbar'</span><span class="p">,</span> <span class="p">{</span>
    <span class="na">container</span><span class="p">:</span> <span class=
"s1">'#toolbar'</span>     <span class=
"c1">// Selector for toolbar container</span>
  <span class="p">});</span>
<span class="nt">&lt;/script&gt;</span></code>
</pre>
      </figure>
      <p>The <code class="highlighter-rouge">ql-toolbar</code> class will be
      added to the toolbar container.</p>
      <p>A click handler will be added to any DOM element with the following
      classes:</p>
      <ul>
        <li><code class="highlighter-rouge">ql-bold</code></li>
        <li><code class="highlighter-rouge">ql-italic</code></li>
        <li><code class="highlighter-rouge">ql-strike</code></li>
        <li><code class="highlighter-rouge">ql-underline</code></li>
        <li><code class="highlighter-rouge">ql-link</code></li>
      </ul>
      <p>A change (DOM <code class="highlighter-rouge">change</code> event)
      handler will be added to any DOM element with the following classes:</p>
      <ul>
        <li><code class="highlighter-rouge">ql-background</code></li>
        <li><code class="highlighter-rouge">ql-color</code></li>
        <li><code class="highlighter-rouge">ql-font</code></li>
        <li><code class="highlighter-rouge">ql-size</code></li>
      </ul>
      <p>The toolbar will also listen to cursor movements and will add an
      <code class="highlighter-rouge">ql-active</code> class to elements in the
      toolbar that corresponds to the format of the text the cursor is on.</p>
      <p>The following classes are also recognized by the toolbar but largely
      used by <a href="/0.20/docs/themes/">Themes</a> for styling:</p>
      <ul>
        <li><code class="highlighter-rouge">ql-format-button</code></li>
        <li><code class="highlighter-rouge">ql-format-group</code></li>
        <li><code class="highlighter-rouge">ql-format-separator</code></li>
      </ul>
    </div>
    <div class="col-sm-3" id="sidebar-container">
      <div class="sidebar-nav" data-offset-top="40" data-spy="affix">
        <ul class="nav">
          <li>
            <a href="/0.20/docs/quickstart/">Quickstart</a>
          </li>
          <li>
            <a href="/0.20/docs/configuration/">Configuration</a>
          </li>
          <li>
            <a href="/0.20/docs/formats/">Formats</a>
          </li>
          <li>
            <a href="/0.20/docs/api/">API</a>
          </li>
          <li>
            <a href="/0.20/docs/events/">Events</a>
          </li>
          <li>
            <a href="/0.20/docs/deltas/">Deltas</a>
          </li>
          <li class="active">
            <a href="/0.20/docs/modules/">Modules</a>
            <ul class="nav">
              <li class="active">
                <a href="/0.20/docs/modules/toolbar/">Toolbar</a>
              </li>
              <li>
                <a href="/0.20/docs/modules/authorship/">Authorship</a>
              </li>
              <li>
                <a href="/0.20/docs/modules/multi-cursors/">Multiple
                Cursors</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/0.20/docs/themes/">Themes</a>
          </li>
          <li>
            <a href="/0.20/examples/">Examples</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
<script src="//cdn.quilljs.com/0.20.1/quill.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
<script>
var editor = new Quill('#toolbar-editor', {
  modules: {
    toolbar: { container: '#toolbar-toolbar' }
  },
  theme: 'snow'
});
</script>