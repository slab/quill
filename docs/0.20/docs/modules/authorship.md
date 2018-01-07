---
layout: v0.20
permalink: /0.20/docs/modules/authorship/
title: Authorship Module - Quill v0.20
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
            <li>
              <a href="/0.20/docs/modules/toolbar/">Toolbar</a>
            </li>
            <li class="active">
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
      <h1 id="authorship">Authorship</h1>
      <p>The Authorship module highlights the background of text to show who
      wrote what.</p>
      <div class="quill-wrapper">
        <div class="editor" id="authorship-editor"></div>
      </div>
      <p>Enabling this module will also add a new format <code class=
      "highlighter-rouge">author</code> to the list of recognized <a href=
      "/0.20/docs/formats/">formats</a>. The value of the <code class=
      "highlighter-rouge">author</code> format is the id of the author. Changes
      made to the Quill editor will also attach the local author metadata.</p>
      <h3 id="configuration">Configuration</h3>
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
            <td><code class="highlighter-rouge">authorId</code></td>
            <td><em>String</em></td>
            <td>ID of current author.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">button</code></td>
            <td><em>String</em></td>
            <td>CSS selector for button that toggles authorship colors
            on/off.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">color</code></td>
            <td><em>String</em></td>
            <td>Color to correspond with current author. Can be any valid CSS
            color.</td>
          </tr>
        </tbody>
      </table>
      <h3 id="methods">Methods</h3>
      <ul>
        <li><code class="highlighter-rouge">addAuthor(id, color)</code></li>
      </ul>
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
            <td><code class="highlighter-rouge">id</code></td>
            <td><em>String</em></td>
            <td>ID of author to add.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">color</code></td>
            <td><em>String</em></td>
            <td>Color to correspond with author id. Can be any valid CSS
            color.</td>
          </tr>
        </tbody>
      </table>
      <h3 id="example">Example</h3>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">editor</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"s1">'#editor'</span><span class="p">);</span>

<span class="kd">var</span> <span class="nx">module</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">addModule</span><span class="p">(</span><span class=
"s1">'authorship'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">authorId</span><span class="p">:</span> <span class=
"s1">'id-1234'</span><span class="p">,</span>
  <span class="na">button</span><span class="p">:</span> <span class=
"s1">'#author-button'</span><span class="p">,</span>
  <span class="na">color</span><span class="p">:</span> <span class=
"s1">'rgb(255, 0, 255)'</span>
<span class="p">});</span>

<span class="nx">module</span><span class="p">.</span><span class=
"nx">addAuthor</span><span class="p">(</span><span class=
"s1">'id-5678'</span><span class="p">,</span> <span class=
"s1">'rgb(255, 255, 0)'</span><span class="p">);</span> <span class=
"c1">// Set external authors</span>

<span class="nx">editor</span><span class="p">.</span><span class=
"nx">on</span><span class="p">(</span><span class=
"s1">'text-update'</span><span class="p">,</span> <span class=
"kd">function</span><span class="p">(</span><span class=
"nx">delta</span><span class="p">)</span> <span class="p">{</span>
  <span class=
"c1">// If the user types an 'a' into the editor, normally we would get:</span>
  <span class="c1">//   delta.ops = [{ 'a' }]</span>
  <span class=
"c1">// But with the author module enabled we would now get:</span>
  <span class=
"c1">//   delta.ops = [{ value: 'a', attributes: { author: 'id-1234' } }]</span>
<span class="p">});</span></code>
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
              <li>
                <a href="/0.20/docs/modules/toolbar/">Toolbar</a>
              </li>
              <li class="active">
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
var editor = new Quill('#authorship-editor');

var module = editor.addModule('authorship', {
  authorId: 'frodo',
  color: 'rgba(153,0,153,0.4)'
});

module.addAuthor('jrr', 'rgba(0,153,255,0.4)');
module.addAuthor('tolkien', 'rgba(255,153,51,0.4)');
module.enable();

editor.setContents({
  ops: [
    { insert: 'The ', attributes: { author: 'tolkien' } },
    { insert: 'Balrog', attributes: { author: 'jrr' } },
    { insert: ' reached the bridge. ', attributes: { author: 'tolkien' } },
    { insert: 'Gandalf stood in the middle of the span, leaning on the staff in his left hand, but in his other hand Glamdring gleamed, cold and white. ', attributes: { author: 'tolkien' } },
    { insert: 'His enemy halted again, facing him, and the shadow about it reached out like two vast wings. It raised the whip, and the thongs whined and cracked. Fire came from its nostrils.', attributes: { author: 'jrr' } },
    { insert: ' But Gandalf stood firm.', attributes: { author: 'tolkien' } }
  ]
});
</script>