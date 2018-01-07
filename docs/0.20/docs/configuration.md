---
layout: v0.20
permalink: /0.20/docs/configuration/
title: Configuration - Quill v0.20
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
        <li class="active">
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
        <li>
          <a href="/0.20/examples/">Examples</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-9" id="docs-container">
      <h1 id="configuration">Configuration</h1>
      <p>Quill allows several ways to customize it to suit your needs. This
      section is dedicated to tweaking existing functionality. See the <a href=
      "/0.20/docs/modules/">Modules</a> section for adding new functionality
      and the <a href="/0.20/docs/themes/">Themes</a> section for styling.</p>
      <h3 id="container">Container</h3>
      <p>Quill requires an container where the editor will be appended. You can
      either pass in a CSS selector or a DOM object.</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">editor</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"s1">'.editor'</span><span class="p">);</span>  <span class=
"c1">// The first result of the selector will be used</span></code>
</pre>
      </figure>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">container</span> <span class=
"o">=</span> <span class="nb">document</span><span class=
"p">.</span><span class="nx">getElementById</span><span class=
"p">(</span><span class="s1">'editor'</span><span class="p">);</span>
<span class="kd">var</span> <span class="nx">editor</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"nx">container</span><span class="p">);</span></code>
</pre>
      </figure>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">container</span> <span class=
"o">=</span> <span class="nx">$</span><span class="p">(</span><span class=
"s1">'.editor'</span><span class="p">).</span><span class=
"nx">get</span><span class="p">(</span><span class="mi">0</span><span class=
"p">);</span>
<span class="kd">var</span> <span class="nx">editor</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"nx">container</span><span class="p">);</span></code>
</pre>
      </figure>
      <h3 id="options">Options</h3>
      <p>To configure Quill, pass in an options object:</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">configs</span> <span class=
"o">=</span> <span class="p">{</span>
  <span class="na">readOnly</span><span class="p">:</span> <span class=
"kc">true</span><span class="p">,</span>
  <span class="na">theme</span><span class="p">:</span> <span class=
"s1">'snow'</span>
<span class="p">};</span>
<span class="kd">var</span> <span class="nx">editor</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"s1">'#editor'</span><span class="p">,</span> <span class=
"nx">configs</span><span class="p">);</span></code>
</pre>
      </figure>
      <p>The following keys are recognized:</p>
      <h4 id="formats">formats</h4>
      <ul>
        <li>Formats recognized by the editor. See <a href=
        "/0.20/docs/formats/">Formats</a> for more information.
        </li>
      </ul>
      <h4 id="modules">modules</h4>
      <ul>
        <li>Collection of modules to include. See <a href=
        "/0.20/docs/modules/">Modules</a> for more information.
        </li>
      </ul>
      <h4 id="pollinterval">pollInterval</h4>
      <ul>
        <li>
          <p>Default: <code class="highlighter-rouge">100</code></p>
        </li>
        <li>
          <p>Number of milliseconds between checking for local changes in the
          editor. Note that certain actions or API calls may prompt immediate
          checking.</p>
        </li>
      </ul>
      <h4 id="readonly">readOnly</h4>
      <ul>
        <li>
          <p>Default: <code class="highlighter-rouge">false</code></p>
        </li>
        <li>
          <p>Whether to instantiate the editor to read-only mode.</p>
        </li>
      </ul>
      <h4 id="styles">styles</h4>
      <ul>
        <li>
          <p>Default: <code class="highlighter-rouge"><span class=
          "p">{}</span></code></p>
        </li>
        <li>
          <p>Object containing CSS rules to add to the Quill editor. Passing in
          <code class="highlighter-rouge">false</code> (not merely a falsy
          value) will prevent Quill from inserting any default styles. In this
          latter case it is assumed either the base stylesheet (<code class=
          "highlighter-rouge">quill.base.css</code>) or a theme stylesheet is
          included manually.</p>
        </li>
        <li>
          <p><strong>Example</strong></p>
        </li>
      </ul>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">editor</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"s1">'#editor'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">styles</span><span class="p">:</span> <span class=
"p">{</span>
    <span class="s1">'.ql-editor'</span><span class="p">:</span> <span class=
"p">{</span>
      <span class="s1">'font-family'</span><span class=
"p">:</span> <span class="s2">"'Arial', san-serif"</span>
    <span class="p">},</span>
    <span class="s1">'.ql-editor a'</span><span class="p">:</span> <span class=
"p">{</span>
      <span class="s1">'text-decoration'</span><span class=
"p">:</span> <span class="s1">'none'</span>
    <span class="p">}</span>
  <span class="p">}</span>
<span class="p">});</span></code>
</pre>
      </figure>
      <h4 id="theme">theme</h4>
      <ul>
        <li>Name of theme to use. Note the theme’s specific stylesheet still
        needs to be included manually. See <a href=
        "/0.20/docs/themes/">Themes</a> for more information.
        </li>
      </ul>
    </div>
    <div class="col-sm-3" id="sidebar-container">
      <div class="sidebar-nav" data-offset-top="40" data-spy="affix">
        <ul class="nav">
          <li>
            <a href="/0.20/docs/quickstart/">Quickstart</a>
          </li>
          <li class="active">
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