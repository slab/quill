---
layout: v0.20
permalink: /0.20/docs/api/
title: API - Quill v0.20
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
        <li class="active">
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
        <li>
          <a href="/0.20/examples/">Examples</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-9" id="docs-container">
      <h1 id="api">API</h1>
      <p>Quill allows granular access to its contents.</p>
      <h4 id="retrieval">Retrieval</h4>
      <ul>
        <li>
          <a href="#quillprototypegettext">Quill.prototype.getText</a>
        </li>
        <li>
          <a href="#quillprototypegetlength">Quill.prototype.getLength</a>
        </li>
        <li>
          <a href="#quillprototypegetcontents">Quill.prototype.getContents</a>
        </li>
        <li>
          <a href="#quillprototypegethtml">Quill.prototype.getHTML</a>
        </li>
      </ul>
      <h4 id="manipulation">Manipulation</h4>
      <ul>
        <li>
          <a href="#quillprototypeinserttext">Quill.prototype.insertText</a>
        </li>
        <li>
          <a href="#quillprototypedeletetext">Quill.prototype.deleteText</a>
        </li>
        <li>
          <a href="#quillprototypeformattext">Quill.prototype.formatText</a>
        </li>
        <li>
          <a href="#quillprototypeformatline">Quill.prototype.formatLine</a>
        </li>
        <li>
          <a href="#quillprototypeinsertembed">Quill.prototype.insertEmbed</a>
        </li>
        <li>
          <a href=
          "#quillprototypeupdatecontents">Quill.prototype.updateContents</a>
        </li>
        <li>
          <a href="#quillprototypesetcontents">Quill.prototype.setContents</a>
        </li>
        <li>
          <a href="#quillprototypesethtml">Quill.prototype.setHTML</a>
        </li>
        <li>
          <a href="#quillprototypesettext">Quill.prototype.setText</a>
        </li>
      </ul>
      <h4 id="selection">Selection</h4>
      <ul>
        <li>
          <a href=
          "#quillprototypegetselection">Quill.prototype.getSelection</a>
        </li>
        <li>
          <a href=
          "#quillprototypesetselection">Quill.prototype.setSelection</a>
        </li>
        <li>
          <a href=
          "#quillprototypeprepareformat">Quill.prototype.prepareFormat</a>
        </li>
        <li>
          <a href="#quillprototypefocus">Quill.prototype.focus</a>
        </li>
        <li>
          <a href="#quillprototypegetbounds">Quill.prototype.getBounds</a>
        </li>
      </ul>
      <h4 id="customization">Customization</h4>
      <ul>
        <li>
          <a href="#quillregistermodule">Quill.registerModule</a>
        </li>
        <li>
          <a href="#quillprototypeaddmodule">Quill.prototype.addModule</a>
        </li>
        <li>
          <a href="#quillprototypegetmodule">Quill.prototype.getModule</a>
        </li>
        <li>
          <a href=
          "#quillprototypeonmoduleload">Quill.prototype.onModuleLoad</a>
        </li>
        <li>
          <a href="#quillprototypeaddformat">Quill.prototype.addFormat</a>
        </li>
        <li>
          <a href=
          "#quillprototypeaddcontainer">Quill.prototype.addContainer</a>
        </li>
      </ul>
      <h3 id="quillprototypegettext">Quill.prototype.getText</h3>
      <p>Retrieves the string contents of the editor.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">getText()</code></li>
        <li><code class="highlighter-rouge">getText(start)</code></li>
        <li><code class="highlighter-rouge">getText(start, end)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">start</code></td>
            <td><em>Number</em></td>
            <td>Start index of text retrieval. Defaults to 0.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">end</code></td>
            <td><em>Number</em></td>
            <td>End index of text retrieval. Defaults to end of the
            document.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Returns</strong></p>
      <ul>
        <li><em>String</em> contents of the editor</li>
      </ul>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">text</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">getText</span><span class="p">(</span><span class=
"mi">0</span><span class="p">,</span> <span class="mi">10</span><span class=
"p">);</span></code>
</pre>
      </figure>
      <h3 id="quillprototypegetlength">Quill.prototype.getLength</h3>
      <p>Retrieves the length of the editor contents.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">getLength()</code></li>
      </ul>
      <p><strong>Returns</strong></p>
      <ul>
        <li><em>Number</em> of characters in the editor.</li>
      </ul>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">length</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">getLength</span><span class="p">();</span></code>
</pre>
      </figure>
      <h3 id="quillprototypegetcontents">Quill.prototype.getContents</h3>
      <p>Retrieves contents of the editor, with formatting data, represented by
      a <a href="/0.20/docs/deltas/">Delta</a> object.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">getContents()</code></li>
        <li><code class="highlighter-rouge">getContents(start)</code></li>
        <li><code class="highlighter-rouge">getContents(start, end)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">start</code></td>
            <td><em>Number</em></td>
            <td>Start index of retrieval. Defaults to 0.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">end</code></td>
            <td><em>Number</em></td>
            <td>End index of retrieval. Defaults to the rest of the
            document.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Returns</strong></p>
      <ul>
        <li><em>Delta</em> contents of the editor.</li>
      </ul>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">delta</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">getContents</span><span class="p">();</span></code>
</pre>
      </figure>
      <h3 id="quillprototypegethtml">Quill.prototype.getHTML</h3>
      <p>Retrieves the HTML contents of the editor.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">getHTML()</code></li>
      </ul>
      <p><strong>Returns</strong></p>
      <ul>
        <li><em>String</em> HTML contents of the editor</li>
      </ul>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">html</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">getHTML</span><span class="p">();</span></code>
</pre>
      </figure>
      <h3 id="quillprototypeinserttext">Quill.prototype.insertText</h3>
      <p>Inserts text into the editor. See <a href=
      "/0.20/docs/formats/">formats</a> for a list of available formats.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">insertText(index, text)</code></li>
        <li><code class="highlighter-rouge">insertText(index, text, name,
        value)</code></li>
        <li><code class="highlighter-rouge">insertText(index, text,
        formats)</code></li>
        <li><code class="highlighter-rouge">insertText(index, text,
        source)</code></li>
        <li><code class="highlighter-rouge">insertText(index, text, name,
        value, source)</code></li>
        <li><code class="highlighter-rouge">insertText(index, text, formats,
        source)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">index</code></td>
            <td><em>Number</em></td>
            <td>Index where text should be inserted.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">text</code></td>
            <td><em>String</em></td>
            <td>Text to be inserted.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">name</code></td>
            <td><em>String</em></td>
            <td>Name of format to apply to inserted text.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">value</code></td>
            <td><em>String</em></td>
            <td>Value of format to apply to inserted text.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">formats</code></td>
            <td><em>Object</em></td>
            <td>Key/value pairs of formats to apply to inserted text.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">source</code></td>
            <td><em>String</em></td>
            <td>
              <a href="/0.20/docs/events/#text-change">Source</a> to be
              emitted. Defaults to <code class="highlighter-rouge">api</code>.
            </td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">insertText</span><span class="p">(</span><span class=
"mi">0</span><span class="p">,</span> <span class=
"s1">'Hello'</span><span class="p">,</span> <span class=
"s1">'bold'</span><span class="p">,</span> <span class=
"kc">true</span><span class="p">);</span>

<span class="nx">editor</span><span class="p">.</span><span class=
"nx">insertText</span><span class="p">(</span><span class=
"mi">5</span><span class="p">,</span> <span class=
"s1">'Quill'</span><span class="p">,</span> <span class="p">{</span>
  <span class="s1">'italic'</span><span class="p">:</span> <span class=
"kc">true</span><span class="p">,</span>
  <span class="s1">'fore-color'</span><span class="p">:</span> <span class=
"s1">'#ffff00'</span>
<span class="p">});</span></code>
</pre>
      </figure>
      <h3 id="quillprototypedeletetext">Quill.prototype.deleteText</h3>
      <p>Deletes text from the editor.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">deleteText(start, end)</code></li>
        <li><code class="highlighter-rouge">deleteText(start, end,
        source)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">start</code></td>
            <td><em>Number</em></td>
            <td>Start index of deletion.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">end</code></td>
            <td><em>Number</em></td>
            <td>End index of deletion.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">source</code></td>
            <td><em>String</em></td>
            <td>
              <a href="/0.20/docs/events/#text-change">Source</a> to be
              emitted. Defaults to <code class="highlighter-rouge">api</code>.
            </td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">deleteText</span><span class="p">(</span><span class=
"mi">0</span><span class="p">,</span> <span class="mi">10</span><span class=
"p">);</span></code>
</pre>
      </figure>
      <h3 id="quillprototypeformattext">Quill.prototype.formatText</h3>
      <p>Formats text in the editor. For line level formats, such as text
      alignment, target the newline character or use the <a href=
      "#quillprototypeformatline"><code class=
      "highlighter-rouge">formatLine</code></a> helper. See <a href=
      "/0.20/docs/formats/">formats</a> for a list of available formats.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">formatText(start, end)</code></li>
        <li><code class="highlighter-rouge">formatText(start, end, name,
        value)</code></li>
        <li><code class="highlighter-rouge">formatText(start, end,
        formats)</code></li>
        <li><code class="highlighter-rouge">formatText(start, end,
        source)</code></li>
        <li><code class="highlighter-rouge">formatText(start, end, name, value,
        source)</code></li>
        <li><code class="highlighter-rouge">formatText(start, end, formats,
        source)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">start</code></td>
            <td><em>Number</em></td>
            <td>Start index of formatting range.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">end</code></td>
            <td><em>Number</em></td>
            <td>End index of formatting range.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">name</code></td>
            <td><em>String</em></td>
            <td>Name of format to apply to text.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">value</code></td>
            <td><em>String</em></td>
            <td>Value of format to apply to text. A falsy value will remove the
            format.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">source</code></td>
            <td><em>String</em></td>
            <td>
              <a href="/0.20/docs/events/#text-change">Source</a> to be
              emitted. Defaults to <code class="highlighter-rouge">api</code>.
            </td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">setText</span><span class="p">(</span><span class=
"s1">'Hello\nWorld!\n'</span><span class="p">);</span>

<span class="nx">editor</span><span class="p">.</span><span class=
"nx">formatText</span><span class="p">(</span><span class=
"mi">0</span><span class="p">,</span> <span class="mi">5</span><span class=
"p">,</span> <span class="s1">'bold'</span><span class=
"p">,</span> <span class="kc">true</span><span class=
"p">);</span>      <span class="c1">// bolds 'hello'</span>

<span class="nx">editor</span><span class="p">.</span><span class=
"nx">formatText</span><span class="p">(</span><span class=
"mi">0</span><span class="p">,</span> <span class="mi">5</span><span class=
"p">,</span> <span class="p">{</span>                   <span class=
"c1">// unbolds 'hello' and set its color to blue</span>
  <span class="s1">'bold'</span><span class="p">:</span> <span class=
"kc">false</span><span class="p">,</span>
  <span class="s1">'color'</span><span class="p">:</span> <span class=
"s1">'rgb(0, 0, 255)'</span>
<span class="p">});</span>

<span class="nx">editor</span><span class="p">.</span><span class=
"nx">formatText</span><span class="p">(</span><span class=
"mi">5</span><span class="p">,</span> <span class="mi">6</span><span class=
"p">,</span> <span class="s1">'align'</span><span class=
"p">,</span> <span class="s1">'right'</span><span class=
"p">);</span>  <span class="c1">// right aligns the 'hello' line</span></code>
</pre>
      </figure>
      <h3 id="quillprototypeformatline">Quill.prototype.formatLine</h3>
      <p>Formats all lines in given range. See <a href=
      "/0.20/docs/formats/">formats</a> for a list of available formats. Has no
      effect when called with inline formats.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">formatLine(start, end)</code></li>
        <li><code class="highlighter-rouge">formatLine(start, end, name,
        value)</code></li>
        <li><code class="highlighter-rouge">formatLine(start, end,
        formats)</code></li>
        <li><code class="highlighter-rouge">formatLine(start, end,
        source)</code></li>
        <li><code class="highlighter-rouge">formatLine(start, end, name, value,
        source)</code></li>
        <li><code class="highlighter-rouge">formatLine(start, end, formats,
        source)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">start</code></td>
            <td><em>Number</em></td>
            <td>Start index of formatting range.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">end</code></td>
            <td><em>Number</em></td>
            <td>End index of formatting range.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">name</code></td>
            <td><em>String</em></td>
            <td>Name of format to apply to text.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">value</code></td>
            <td><em>String</em></td>
            <td>Value of format to apply to text. A falsy value will remove the
            format.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">source</code></td>
            <td><em>String</em></td>
            <td>
              <a href="/0.20/docs/events/#text-change">Source</a> to be
              emitted. Defaults to <code class="highlighter-rouge">api</code>.
            </td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">setText</span><span class="p">(</span><span class=
"s1">'Hello\nWorld!\n'</span><span class="p">);</span>

<span class="nx">editor</span><span class="p">.</span><span class=
"nx">formatLine</span><span class="p">(</span><span class=
"mi">1</span><span class="p">,</span> <span class="mi">3</span><span class=
"p">,</span> <span class="s1">'align'</span><span class=
"p">,</span> <span class="s1">'right'</span><span class=
"p">);</span>   <span class="c1">// right aligns the first line</span>
<span class="nx">editor</span><span class="p">.</span><span class=
"nx">formatLine</span><span class="p">(</span><span class=
"mi">4</span><span class="p">,</span> <span class="mi">8</span><span class=
"p">,</span> <span class="s1">'align'</span><span class=
"p">,</span> <span class="s1">'center'</span><span class=
"p">);</span>  <span class="c1">// center aligns both lines</span></code>
</pre>
      </figure>
      <h3 id="quillprototypeinsertembed">Quill.prototype.insertEmbed</h3>
      <p>Insert embedded content into the editor. Currently only images are
      supported.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">insertEmbed(index, type,
        url)</code></li>
        <li><code class="highlighter-rouge">insertEmbed(index, type, url,
        source)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">index</code></td>
            <td><em>Number</em></td>
            <td>Index where content should be inserted.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">type</code></td>
            <td><em>String</em></td>
            <td>Type of content. Currently accepts only <code class=
            "highlighter-rouge">image</code>.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">url</code></td>
            <td><em>String</em></td>
            <td>URL where content is located.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">source</code></td>
            <td><em>String</em></td>
            <td>
              <a href="/0.20/docs/events/#text-change">Source</a> to be
              emitted. Defaults to <code class="highlighter-rouge">api</code>.
            </td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">insertEmbed</span><span class="p">(</span><span class=
"mi">10</span><span class="p">,</span> <span class=
"s1">'image'</span><span class="p">,</span> <span class=
"s1">'https://quilljs.com/images/cloud.png'</span><span class=
"p">);</span></code>
</pre>
      </figure>
      <h3 id="quillprototypeupdatecontents">Quill.prototype.updateContents</h3>
      <p>Applies Delta to editor contents.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">updateContents(delta)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">delta</code></td>
            <td>
              <a href="/0.20/docs/deltas/"><em>Delta</em></a>
            </td>
            <td>Delta that will be applied.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"c1">// Assuming editor currently contains [{ insert: 'Hello World!' }]</span>
<span class="nx">editor</span><span class="p">.</span><span class=
"nx">updateContents</span><span class="p">({</span>
  <span class="na">ops</span><span class="p">:</span> <span class="p">[</span>
    <span class="p">{</span> <span class="na">retain</span><span class=
"p">:</span> <span class="mi">6</span> <span class=
"p">},</span>        <span class="c1">// Keep 'Hello '</span>
    <span class="p">{</span> <span class="na">delete</span><span class=
"p">:</span> <span class="mi">5</span> <span class=
"p">},</span>        <span class="c1">// 'World' is deleted</span>
    <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'Quill'</span> <span class=
"p">},</span>  <span class="c1">// Insert 'Quill'</span>
    <span class="p">{</span> <span class="na">retain</span><span class=
"p">:</span> <span class="mi">1</span><span class="p">,</span> <span class=
"na">attributes</span><span class="p">:</span> <span class=
"p">{</span> <span class="na">bold</span><span class="p">:</span> <span class=
"kc">true</span> <span class="p">}</span> <span class=
"p">}</span>    <span class="c1">// Apply bold to exclamation mark</span>
  <span class="p">]</span>
<span class="p">});</span>
<span class=
"c1">// Editor should now be [{ insert: 'Hello Quill' }, { insert: '!', attributes: { bold: true} }]</span></code>
</pre>
      </figure>
      <h3 id="quillprototypesetcontents">Quill.prototype.setContents</h3>
      <p>Overwrites editor with given contents.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">setContents(delta)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">delta</code></td>
            <td>
              <a href="/0.20/docs/deltas/"><em>Delta</em></a>
            </td>
            <td>Delta editor should be set to.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">setContents</span><span class="p">([</span>
  <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'Hello '</span> <span class="p">},</span>
  <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'World!'</span><span class=
"p">,</span> <span class="na">attributes</span><span class=
"p">:</span> <span class="p">{</span> <span class="na">bold</span><span class=
"p">:</span> <span class="kc">true</span> <span class="p">}</span> <span class=
"p">},</span>
  <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'\n'</span> <span class="p">}</span>
<span class="p">]);</span></code>
</pre>
      </figure>
      <h3 id="quillprototypesethtml">Quill.prototype.setHTML</h3>
      <p>Sets contents of editor with given HTML. Note the editor will
      normalize the input to the subset it recognizes. For example <code class=
      "highlighter-rouge">strong</code> tags will be converted to <code class=
      "highlighter-rouge">b</code> tags.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">setHTML(html)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">html</code></td>
            <td><em>String</em></td>
            <td>HTML to set editor contents to.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">setHTML</span><span class="p">(</span><span class=
"s1">'&lt;div&gt;Hello&lt;/div&gt;'</span><span class="p">);</span></code>
</pre>
      </figure>
      <h3 id="quillprototypesettext">Quill.prototype.setText</h3>
      <p>Sets contents of editor with given text. Note Quill documents end with
      a newline so one will be added for you if omitted.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">setText(text)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">text</code></td>
            <td><em>String</em></td>
            <td>Text to set editor contents to.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">setText</span><span class="p">(</span><span class=
"s1">'Hello\n'</span><span class="p">);</span></code>
</pre>
      </figure>
      <h3 id="quillprototypegetselection">Quill.prototype.getSelection</h3>
      <p>Retrieves the user’s selection range.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">getSelection()</code></li>
      </ul>
      <p><strong>Returns</strong></p>
      <ul>
        <li><em>Range</em> with keys <code class=
        "highlighter-rouge">start</code> and <code class=
        "highlighter-rouge">end</code> representing user’s selection range</li>
      </ul>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">range</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">getSelection</span><span class="p">();</span>
<span class="k">if</span> <span class="p">(</span><span class=
"nx">range</span><span class="p">)</span> <span class="p">{</span>
  <span class="k">if</span> <span class="p">(</span><span class=
"nx">range</span><span class="p">.</span><span class=
"nx">start</span> <span class="o">==</span> <span class=
"nx">range</span><span class="p">.</span><span class=
"nx">end</span><span class="p">)</span> <span class="p">{</span>
    <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'User cursor is at index'</span><span class="p">,</span> <span class=
"nx">range</span><span class="p">.</span><span class=
"nx">start</span><span class="p">);</span>
  <span class="p">}</span> <span class="k">else</span> <span class="p">{</span>
    <span class="kd">var</span> <span class="nx">text</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">getText</span><span class="p">(</span><span class=
"nx">range</span><span class="p">.</span><span class=
"nx">start</span><span class="p">,</span> <span class=
"nx">range</span><span class="p">.</span><span class=
"nx">end</span><span class="p">);</span>
    <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'User has highlighted: '</span><span class="p">,</span> <span class=
"nx">text</span><span class="p">);</span>
  <span class="p">}</span>
<span class="p">}</span> <span class="k">else</span> <span class="p">{</span>
  <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'User cursor is not in editor'</span><span class="p">);</span>
<span class="p">}</span></code>
</pre>
      </figure>
      <h3 id="quillprototypesetselection">Quill.prototype.setSelection</h3>
      <p>Sets user selection to given range. Will also focus the editor. If
      <code class="highlighter-rouge">null</code>, will blur the editor.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">setSelection(start,
        end)</code></li>
        <li><code class="highlighter-rouge">setSelection(start, end,
        source)</code></li>
        <li><code class="highlighter-rouge">setSelection(range)</code></li>
        <li><code class="highlighter-rouge">setSelection(range,
        source)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">start</code></td>
            <td><em>Number</em></td>
            <td>Start index of selection range.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">end</code></td>
            <td><em>Number</em></td>
            <td>End index of selection range.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">range</code></td>
            <td><em>Object</em></td>
            <td>Object with <strong>start</strong> and <strong>end</strong>
            keys indicating the corresponding indexes where the selection
            exists.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">source</code></td>
            <td><em>String</em></td>
            <td>
              <a href="/0.20/docs/events/#text-change">Source</a> to be
              emitted. Defaults to <code class="highlighter-rouge">api</code>.
            </td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">setSelection</span><span class="p">(</span><span class=
"mi">0</span><span class="p">,</span> <span class="mi">5</span><span class=
"p">);</span></code>
</pre>
      </figure>
      <h3 id="quillprototypeprepareformat">Quill.prototype.prepareFormat</h3>
      <p>Sets the format at the current cursor position. Thus subsequent typing
      will result in those characters being set to the given format value. For
      example, setting bold and then typing ‘a’ will result in a bolded
      ‘a’.</p>
      <p>Has no effect if current selection does not exist or is not a
      cursor.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">prepareFormat(format,
        value)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">format</code></td>
            <td><em>String</em></td>
            <td>
              Name of format to set. See <a href=
              "/0.20/docs/formats/">formats</a> for a list of available
              formats.
            </td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">value</code></td>
            <td><em>String</em></td>
            <td>Value of format to apply to set. A falsy value will unset the
            format.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">prepareFormat</span><span class="p">(</span><span class=
"s1">'bold'</span><span class="p">,</span> <span class=
"kc">true</span><span class="p">);</span></code>
</pre>
      </figure>
      <h3 id="quillprototypefocus">Quill.prototype.focus</h3>
      <p>Focuses the editor.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">focus()</code></li>
      </ul>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">focus</span><span class="p">();</span></code>
</pre>
      </figure>
      <h3 id="quillprototypegetbounds">Quill.prototype.getBounds</h3>
      <p>Retrieves the pixel position (relative to the editor container) and
      height of a cursor at a given index. The actual cursor need not be at
      that index. Useful for calculating where to place tooltips.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">getBounds(index)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">index</code></td>
            <td><em>Number</em></td>
            <td>Index position to measure cursor bounds.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Returns</strong></p>
      <ul>
        <li><em>Object</em> Object with keys <code class=
        "highlighter-rouge">height</code>, <code class=
        "highlighter-rouge">left</code>, and <code class=
        "highlighter-rouge">top</code>.</li>
      </ul>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">setText</span><span class="p">(</span><span class=
"s1">'Hello\nWorld\n'</span><span class="p">);</span>
<span class="nx">editor</span><span class="p">.</span><span class=
"nx">getBounds</span><span class="p">(</span><span class=
"mi">7</span><span class="p">);</span>    <span class=
"c1">// Returns { height: 15, left: 27, top: 31 }</span></code>
</pre>
      </figure>
      <h3 id="quillregistermodule">Quill.registerModule</h3>
      <p>Registers a module, making it available to be added to an editor. See
      <a href="/0.20/docs/modules/">Modules</a> for more details.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">registerModule(name,
        function)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">name</code></td>
            <td><em>String</em></td>
            <td>Name of module to register.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">options</code></td>
            <td><em>Function</em></td>
            <td>Options to be passed into module constructor.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">Quill</span><span class="p">.</span><span class=
"nx">registerModule</span><span class="p">(</span><span class=
"s1">'custom-module'</span><span class="p">,</span> <span class=
"kd">function</span><span class="p">(</span><span class=
"nx">quill</span><span class="p">,</span> <span class=
"nx">options</span><span class="p">)</span> <span class="p">{</span>
  <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"nx">options</span><span class="p">);</span>
<span class="p">});</span></code>
</pre>
      </figure>
      <h3 id="quillprototypeaddmodule">Quill.prototype.addModule</h3>
      <p>Add module to editor. The module should have been previously
      registered with <a href="#quillregistermodule">registerModule</a>. See
      <a href="/0.20/docs/modules/">Modules</a> for more details.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">addModule(name,
        options)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">name</code></td>
            <td><em>String</em></td>
            <td>Name of module to add.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">options</code></td>
            <td><em>Object</em></td>
            <td>Options to be passed into module constructor.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Returns</strong></p>
      <ul>
        <li><em>Object</em> Instance of the module that was added.</li>
      </ul>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">toolbar</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">addModule</span><span class="p">(</span><span class=
"s1">'toolbar'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">container</span><span class="p">:</span> <span class=
"s1">'#toolbar-container'</span>
<span class="p">});</span></code>
</pre>
      </figure>
      <h3 id="quillprototypegetmodule">Quill.prototype.getModule</h3>
      <p>Retrieves a module that has been added to the editor.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">getModule(name)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">name</code></td>
            <td><em>String</em></td>
            <td>Name of module to retrieve.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Returns</strong></p>
      <ul>
        <li><em>Object</em> Instance of the module that was added.</li>
      </ul>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">toolbar</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">getModule</span><span class="p">(</span><span class=
"s1">'toolbar'</span><span class="p">);</span></code>
</pre>
      </figure>
      <h3 id="quillprototypeonmoduleload">Quill.prototype.onModuleLoad</h3>
      <p>Calls a given callback when given module is added. If the module is
      already added, the callback is called immediately.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">onModuleLoad(name,
        callback)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">name</code></td>
            <td><em>String</em></td>
            <td>Name of module.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">callback</code></td>
            <td><em>Function</em></td>
            <td>Function to call.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">onModuleLoad</span><span class="p">(</span><span class=
"s1">'toolbar'</span><span class="p">,</span> <span class=
"kd">function</span><span class="p">(</span><span class=
"nx">toolbar</span><span class="p">)</span> <span class="p">{</span>
  <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'Toolbar has been added'</span><span class="p">);</span>
<span class="p">});</span></code>
</pre>
      </figure>
      <h3 id="quillprototypeaddformat">Quill.prototype.addFormat</h3>
      <p>Add a custom defined format to editor.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">addFormat(name, config)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">name</code></td>
            <td><em>String</em></td>
            <td>Name of format to add. Will overwrite if name already
            exists.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">config</code></td>
            <td><em>Object</em></td>
            <td>
              Format configurations. See <a href=
              "/0.20/docs/formats/">formats</a> for more details.
            </td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">addFormat</span><span class="p">(</span><span class=
"s1">'strike'</span><span class="p">,</span> <span class=
"p">{</span> <span class="na">tag</span><span class="p">:</span> <span class=
"s1">'S'</span><span class="p">,</span> <span class=
"na">prepare</span><span class="p">:</span> <span class=
"s1">'strikeThrough'</span> <span class="p">});</span></code>
</pre>
      </figure>
      <h3 id="quillprototypeaddcontainer">Quill.prototype.addContainer</h3>
      <p>Add a div container inside the Quill container, sibling to the editor
      itself. By convention, Quill modules should have a class name prefixed
      with <code class="highlighter-rouge">ql-</code>.</p>
      <p><strong>Methods</strong></p>
      <ul>
        <li><code class="highlighter-rouge">addContainer(cssClass,
        before)</code></li>
      </ul>
      <p><strong>Parameters</strong></p>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code class="highlighter-rouge">cssClass</code></td>
            <td><em>String</em></td>
            <td>CSS class to add to created container.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">before</code></td>
            <td><em>Boolean</em></td>
            <td>If <code class="highlighter-rouge">true</code>, will insert
            before the editor container, otherwise it will be appended
            after.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Returns</strong></p>
      <ul>
        <li><em>DOMElement</em> DIV container that was added.</li>
      </ul>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">container</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">addContainer</span><span class="p">(</span><span class=
"s1">'ql-custom'</span><span class="p">);</span></code>
</pre>
      </figure>
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
          <li class="active">
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
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>