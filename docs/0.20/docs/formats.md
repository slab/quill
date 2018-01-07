---
layout: v0.20
permalink: /0.20/docs/formats/
title: Formats - Quill v0.20
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
        <li class="active">
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
        <li>
          <a href="/0.20/examples/">Examples</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-9" id="docs-container">
      <h1 id="formats">Formats</h1>
      <p>Quill currently supports a number of formats. Enabling a format:</p>
      <ul>
        <li>- Allows the Quill Editor to recognize the format</li>
        <li>- Allows API calls using the format</li>
        <li>- Registers associated hotkeys</li>
      </ul>
      <p>Note that enabling a format is distinct from adding a control in the
      <a href="/0.20/docs/modules/toolbar/">toolbar</a>. By default all
      supported formats are enabled.</p>
      <ul>
        <li>Bold - <code class="highlighter-rouge">bold</code></li>
        <li>Italic - <code class="highlighter-rouge">italic</code></li>
        <li>Strikethrough - <code class="highlighter-rouge">strike</code></li>
        <li>Underline - <code class="highlighter-rouge">underline</code></li>
        <li>Font - <code class="highlighter-rouge">font</code></li>
        <li>Size - <code class="highlighter-rouge">size</code></li>
        <li>Color - <code class="highlighter-rouge">color</code></li>
        <li>Background Color - <code class=
        "highlighter-rouge">background</code></li>
        <li>Image - <code class="highlighter-rouge">image</code></li>
        <li>Link - <code class="highlighter-rouge">link</code></li>
        <li>Bullet - <code class="highlighter-rouge">bullet</code></li>
        <li>List - <code class="highlighter-rouge">list</code></li>
        <li>Text Alignment - <code class="highlighter-rouge">align</code></li>
      </ul>
      <h3 id="configuring">Configuring</h3>
      <p>To customize the supported formats, pass in a whitelist array of
      formats you wish to support.</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">editor</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"s1">'#editor'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">formats</span><span class="p">:</span> <span class=
"p">[</span><span class="s1">'bold'</span><span class="p">,</span> <span class=
"s1">'italic'</span><span class="p">,</span> <span class=
"s1">'color'</span><span class="p">]</span>
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
          <li class="active">
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