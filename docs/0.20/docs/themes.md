---
layout: v0.20
permalink: /0.20/docs/themes/
title: Themes - Quill v0.20
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
        <li class="active">
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
      <h1 id="themes">Themes</h1>
      <p>Themes allow you to easily make your Quill editor look good with
      minimal effort.</p>
      <p>To use a custom theme, simply add its stylesheet in the <code class=
      "highlighter-rouge">&lt;head&gt;</code>:</p>
      <figure class="highlight">
        <pre>
<code class="language-html" data-lang="html"><span class=
"nt">&lt;link</span> <span class="na">rel=</span><span class=
"s">"stylesheet"</span> <span class="na">href=</span><span class=
"s">"//cdn.quilljs.com/0.20.1/quill.snow.css"</span> <span class=
"nt">/&gt;</span></code>
</pre>
      </figure>
      <p>and specify its usage at initialization:</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">editor</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"s1">'#editor'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">theme</span><span class="p">:</span> <span class=
"s1">'snow'</span>
<span class="p">});</span></code>
</pre>
      </figure>
      <p>There is currently only one predefined theme <code class=
      "highlighter-rouge">snow</code> for Quill.</p>
      <p>In the future we will provide more options and even allow you to
      create your own. We will provide documentation and guidance here once
      they are finalized.</p>
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
                <a href="/0.20/docs/modules/multi-cursors/">Multiple
                Cursors</a>
              </li>
            </ul>
          </li>
          <li class="active">
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