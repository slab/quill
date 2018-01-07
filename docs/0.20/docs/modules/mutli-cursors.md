---
layout: v0.20
permalink: /0.20/docs/modules/multi-cursors/
title: Cursors Module - Quill v0.20
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
            <li>
              <a href="/0.20/docs/modules/authorship/">Authorship</a>
            </li>
            <li class="active">
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
      <div class="alert alert-warning">
        This interface has not been finalized.
      </div>
      <h1 id="multiple-cursors">Multiple Cursors</h1>
      <p>The Multiple Cursors modules enables the display of multiple external
      cursors inside the Quill editor.</p>
      <div class="quill-wrapper">
        <div class="editor" id="multi-cursor-editor"></div>
      </div>
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
            <td><code class="highlighter-rouge">template</code></td>
            <td><em>String</em></td>
            <td>HTML template to use for cursor element.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">timeout</code></td>
            <td><em>Number</em></td>
            <td>Milliseconds of inaction before cursor flag is hidden.</td>
          </tr>
        </tbody>
      </table>
      <h3 id="methods">Methods</h3>
      <ul>
        <li><code class="highlighter-rouge">setCursor(id, index, text,
        color)</code></li>
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
            <td>ID of cursor.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">index</code></td>
            <td><em>Number</em></td>
            <td>Position to place the cursor.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">text</code></td>
            <td><em>String</em></td>
            <td>Text to place above cursor.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">color</code></td>
            <td><em>String</em></td>
            <td>Color of cursor. Can be any valid CSS color.</td>
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
"s1">'multi-cursor'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">timeout</span><span class="p">:</span> <span class=
"mi">10000</span>
<span class="p">});</span>

<span class="nx">module</span><span class="p">.</span><span class=
"nx">setCursor</span><span class="p">(</span><span class=
"s1">'id-1234'</span><span class="p">,</span> <span class=
"mi">10</span><span class="p">,</span> <span class=
"s1">'Frodo'</span><span class="p">,</span> <span class=
"s1">'rgb(255, 0, 255)'</span><span class="p">);</span></code>
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
              <li>
                <a href="/0.20/docs/modules/authorship/">Authorship</a>
              </li>
              <li class="active">
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
<script src="//cdn.quilljs.com/0.20.1/quill.js"></script>
<script>
var editor = new Quill('#multi-cursor-editor');
editor.insertText(0, 'Upon great pedestals founded in the deep waters stood two great kings of stone: still with blurred eyes and crannied brows they frowned upon the North.\n\nThe left hand of each was raised palm outwards in gesture of warning; in each right hand there was an axe; upon each head there was a crumbling helm and crown.\n\nGreat power and majesty they still wore, the silent wardens of a long-vanished kingdom.');

module = editor.addModule('multi-cursor', {
  timeout: 600000
});
setTimeout(function() {
  module.setCursor('merry', 0, 'Merry', 'rgba(0,153,255,0.9)');
  module.setCursor('pippin', editor.getText().indexOf('\n'), 'Pippin', 'rgba(255,153,51,0.9)');
  module.setCursor('frodo', editor.getText().length, 'Frodo', 'rgba(153,0,153,0.9)');
}, 500);
</script>