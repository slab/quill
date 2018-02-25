---
layout: v0.20
permalink: /0.20/examples/
title: Examples - Quill v0.20
---
<div class="container">
  <div id="sidebar-dropdown">
    <div class="btn-group">
      <button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">Navigate the Docs... <span class="caret"></span></button>
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
        <li>
          <a href="/0.20/docs/modules/">Modules</a>
          <ul>
            <li>
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
        <li class="active">
          <a href="/0.20/examples/">Examples</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-9" id="docs-container">
      <div id="examples-container">
        <h1 id="examples">Examples</h1>
        <p>The two examples below demonstrate what is possible with Quill. Check out how they interact with each other!</p>
        <h2 id="basic-example">Basic Example</h2>
        <p>A basic editor with just a few formats to get started.</p>
        <div class="quill-wrapper">
          <div class="toolbar" id="basic-toolbar">
            <select class="ql-size" title="Size">
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
            </select> <button class="ql-bold">Bold</button> <button class="ql-italic">Italic</button>
          </div>
          <div class="editor" id="basic-editor">
            <div><span style="font-size: 18px;">One Ring to Rule Them All</span></div>
<div><a href="https://en.wikipedia.org/wiki/One_Ring">https://en.wikipedia.org/wiki/One_Ring</a></div>
<div><br></div>
<div><span>Three Rings for the </span><u>Elven-kings</u><span> under the sky,</span></div>
<div><span>Seven for the </span><u>Dwarf-lords</u><span> in halls of stone,</span></div>
<div><span>Nine for </span><u>Mortal Men</u><span>, doomed to die,</span></div>
<div><span>One for the </span><u>Dark Lord</u><span> on his dark throne.</span></div>
<div><br></div>
<div><span>In the Land of Mordor where the Shadows lie.</span></div>
<div><span>One Ring to </span><b>rule</b><span> them all, One Ring to </span><b>find</b><span> them,</span></div>
<div><span>One Ring to </span><b>bring</b><span> them all and in the darkness </span><b>bind</b><span> them.</span></div>
<div><span>In the Land of Mordor where the Shadows lie.</span></div>
          </div>
        </div>
        <p><a class="accordian-toggle" data-toggle="collapse" href="#basic-collapse">Show/Hide Code</a></p>
        <div class="accordian-body collapse" id="basic-collapse">
          <figure class="highlight">
            <pre>
<code class="language-javascript" data-lang="javascript"><span class="kd">var</span> <span class="nx">basicEditor</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Quill</span><span class="p">(</span><span class="s1">'#basic-editor'</span><span class="p">);</span>
<span class="nx">basicEditor</span><span class="p">.</span><span class="nx">addModule</span><span class="p">(</span><span class="s1">'toolbar'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">container</span><span class="p">:</span> <span class="s1">'#basic-toolbar'</span>
<span class="p">});</span></code>
</pre>
          </figure>
        </div>
        <h2 id="full-example">Full Example</h2>
        <p>Uses all the features of Quill, including <a href="/0.20/docs/modules/">Modules</a> and <a href="/0.20/docs/themes/">Themes</a>.</p>
        <div class="quill-wrapper">
          <div class="toolbar" id="full-toolbar">
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
            </select></span> <span class="ql-format-group"><span class="ql-format-button ql-bold" title="Bold"></span> <span class="ql-format-separator"></span> <span class="ql-format-button ql-italic" title="Italic"></span> <span class="ql-format-separator"></span> <span class="ql-format-button ql-underline" title="Underline"></span> <span class="ql-format-separator"></span> <span class="ql-format-button ql-strike" title="Strikethrough"></span></span> <span class="ql-format-group"><select class="ql-color" title="Text Color">
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
            </select> <span class="ql-format-separator"></span> <select class="ql-background" title="Background Color">
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
              <option label="rgb(255, 255, 255)" selected value="rgb(255, 255, 255)">
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
            </select></span> <span class="ql-format-group"><span class="ql-format-button ql-list" title="List"></span> <span class="ql-format-separator"></span> <span class="ql-format-button ql-bullet" title="Bullet"></span> <span class="ql-format-separator"></span> <select class="ql-align" title="Text Alignment">
              <option label="Left" selected value="left">
                </option>
              <option label="Center" value="center">
                </option>
              <option label="Right" value="right">
                </option>
              <option label="Justify" value="justify">
                </option>
            </select></span> <span class="ql-format-group"><span class="ql-format-button ql-link" title="Link"></span></span>
          </div>
          <div class="editor" id="full-editor">
            <div><span style="font-size: 18px;">One Ring to Rule Them All</span></div>
<div><a href="https://en.wikipedia.org/wiki/One_Ring">https://en.wikipedia.org/wiki/One_Ring</a></div>
<div><br></div>
<div><span>Three Rings for the </span><u>Elven-kings</u><span> under the sky,</span></div>
<div><span>Seven for the </span><u>Dwarf-lords</u><span> in halls of stone,</span></div>
<div><span>Nine for </span><u>Mortal Men</u><span>, doomed to die,</span></div>
<div><span>One for the </span><u>Dark Lord</u><span> on his dark throne.</span></div>
<div><br></div>
<div><span>In the Land of Mordor where the Shadows lie.</span></div>
<div><span>One Ring to </span><b>rule</b><span> them all, One Ring to </span><b>find</b><span> them,</span></div>
<div><span>One Ring to </span><b>bring</b><span> them all and in the darkness </span><b>bind</b><span> them.</span></div>
<div><span>In the Land of Mordor where the Shadows lie.</span></div>
          </div>
        </div>
        <p><a class="accordian-toggle" data-toggle="collapse" href="#full-collapse">Show/Hide Code</a></p>
        <div class="accordian-body collapse" id="full-collapse">
          <figure class="highlight">
            <pre>
<code class="language-javascript" data-lang="javascript"><span class="c1">// Initialize editor with custom theme and modules</span>
<span class="kd">var</span> <span class="nx">fullEditor</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Quill</span><span class="p">(</span><span class="s1">'#full-editor'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">modules</span><span class="p">:</span> <span class="p">{</span>
    <span class="s1">'authorship'</span><span class="p">:</span> <span class="p">{</span> <span class="nl">authorId</span><span class="p">:</span> <span class="s1">'galadriel'</span><span class="p">,</span> <span class="na">enabled</span><span class="p">:</span> <span class="kc">true</span> <span class="p">},</span>
    <span class="s1">'multi-cursor'</span><span class="p">:</span> <span class="kc">true</span><span class="p">,</span>
    <span class="s1">'toolbar'</span><span class="p">:</span> <span class="p">{</span> <span class="nl">container</span><span class="p">:</span> <span class="s1">'#full-toolbar'</span> <span class="p">},</span>
    <span class="s1">'link-tooltip'</span><span class="err">:</span> <span class="kc">true</span>
  <span class="p">},</span>
  <span class="nx">theme</span><span class="err">:</span> <span class="s1">'snow'</span>
<span class="p">});</span>

<span class="c1">// Add basic editor's author</span>
<span class="kd">var</span> <span class="nx">authorship</span> <span class="o">=</span> <span class="nx">fullEditor</span><span class="p">.</span><span class="nx">getModule</span><span class="p">(</span><span class="s1">'authorship'</span><span class="p">);</span>
<span class="nx">authorship</span><span class="p">.</span><span class="nx">addAuthor</span><span class="p">(</span><span class="s1">'gandalf'</span><span class="p">,</span> <span class="s1">'rgba(255,153,51,0.4)'</span><span class="p">);</span>

<span class="c1">// Add a cursor to represent basic editor's cursor</span>
<span class="kd">var</span> <span class="nx">cursorManager</span> <span class="o">=</span> <span class="nx">fullEditor</span><span class="p">.</span><span class="nx">getModule</span><span class="p">(</span><span class="s1">'multi-cursor'</span><span class="p">);</span>
<span class="nx">cursorManager</span><span class="p">.</span><span class="nx">setCursor</span><span class="p">(</span><span class="s1">'gandalf'</span><span class="p">,</span> <span class="nx">fullEditor</span><span class="p">.</span><span class="nx">getLength</span><span class="p">()</span><span class="o">-</span><span class="mi">1</span><span class="p">,</span> <span class="s1">'Gandalf'</span><span class="p">,</span> <span class="s1">'rgba(255,153,51,0.9)'</span><span class="p">);</span>

<span class="c1">// Sync basic editor's cursor location</span>
<span class="nx">basicEditor</span><span class="p">.</span><span class="nx">on</span><span class="p">(</span><span class="s1">'selection-change'</span><span class="p">,</span> <span class="kd">function</span><span class="p">(</span><span class="nx">range</span><span class="p">)</span> <span class="p">{</span>
  <span class="k">if</span> <span class="p">(</span><span class="nx">range</span><span class="p">)</span> <span class="p">{</span>
    <span class="nx">cursorManager</span><span class="p">.</span><span class="nx">moveCursor</span><span class="p">(</span><span class="s1">'gandalf'</span><span class="p">,</span> <span class="nx">range</span><span class="p">.</span><span class="nx">end</span><span class="p">);</span>
  <span class="p">}</span>
<span class="p">});</span>

<span class="c1">// Update basic editor's content with ours</span>
<span class="nx">fullEditor</span><span class="p">.</span><span class="nx">on</span><span class="p">(</span><span class="s1">'text-change'</span><span class="p">,</span> <span class="kd">function</span><span class="p">(</span><span class="nx">delta</span><span class="p">,</span> <span class="nx">source</span><span class="p">)</span> <span class="p">{</span>
  <span class="k">if</span> <span class="p">(</span><span class="nx">source</span> <span class="o">===</span> <span class="s1">'user'</span><span class="p">)</span> <span class="p">{</span>
    <span class="nx">basicEditor</span><span class="p">.</span><span class="nx">updateContents</span><span class="p">(</span><span class="nx">delta</span><span class="p">);</span>
  <span class="p">}</span>
<span class="p">});</span>

<span class="c1">// basicEditor needs authorship module to accept changes from fullEditor's authorship module</span>
<span class="nx">basicEditor</span><span class="p">.</span><span class="nx">addModule</span><span class="p">(</span><span class="s1">'authorship'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">authorId</span><span class="p">:</span> <span class="s1">'gandalf'</span><span class="p">,</span>
  <span class="na">color</span><span class="p">:</span> <span class="s1">'rgba(255,153,51,0.4)'</span>
<span class="p">});</span>

<span class="c1">// Update our content with basic editor's</span>
<span class="nx">basicEditor</span><span class="p">.</span><span class="nx">on</span><span class="p">(</span><span class="s1">'text-change'</span><span class="p">,</span> <span class="kd">function</span><span class="p">(</span><span class="nx">delta</span><span class="p">,</span> <span class="nx">source</span><span class="p">)</span> <span class="p">{</span>
  <span class="k">if</span> <span class="p">(</span><span class="nx">source</span> <span class="o">===</span> <span class="s1">'user'</span><span class="p">)</span> <span class="p">{</span>
    <span class="nx">fullEditor</span><span class="p">.</span><span class="nx">updateContents</span><span class="p">(</span><span class="nx">delta</span><span class="p">);</span>
  <span class="p">}</span>
<span class="p">});</span></code>
</pre>
          </figure>
        </div>
        <script src="//cdn.quilljs.com/0.20.1/quill.js">
        </script>
        <script>
        var basicEditor = new Quill('#basic-editor');
        basicEditor.addModule('toolbar', {
        container: '#basic-toolbar'
        });
        // Initialize editor with custom theme and modules
        var fullEditor = new Quill('#full-editor', {
        modules: {
        'authorship': { authorId: 'galadriel', enabled: true },
        'multi-cursor': true,
        'toolbar': { container: '#full-toolbar' },
        'link-tooltip': true
        },
        theme: 'snow'
        });

        // Add basic editor's author
        var authorship = fullEditor.getModule('authorship');
        authorship.addAuthor('gandalf', 'rgba(255,153,51,0.4)');

        // Add a cursor to represent basic editor's cursor
        var cursorManager = fullEditor.getModule('multi-cursor');
        cursorManager.setCursor('gandalf', fullEditor.getLength()-1, 'Gandalf', 'rgba(255,153,51,0.9)');

        // Sync basic editor's cursor location
        basicEditor.on('selection-change', function(range) {
        if (range) {
        cursorManager.moveCursor('gandalf', range.end);
        }
        });

        // Update basic editor's content with ours
        fullEditor.on('text-change', function(delta, source) {
        if (source === 'user') {
        basicEditor.updateContents(delta);
        }
        });

        // basicEditor needs authorship module to accept changes from fullEditor's authorship module
        basicEditor.addModule('authorship', {
        authorId: 'gandalf',
        color: 'rgba(255,153,51,0.4)'
        });

        // Update our content with basic editor's
        basicEditor.on('text-change', function(delta, source) {
        if (source === 'user') {
        fullEditor.updateContents(delta);
        }
        });

        </script>
      </div>
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
          <li>
            <a href="/0.20/docs/modules/">Modules</a>
            <ul class="nav">
              <li>
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
          <li class="active">
            <a href="/0.20/examples/">Examples</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>