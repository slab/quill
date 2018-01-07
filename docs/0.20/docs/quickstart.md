---
layout: v0.20
permalink: /0.20/docs/quickstart/
title: Quickstart - Quill v0.20
---
<div class="container">
  <div id="sidebar-dropdown">
    <div class="btn-group">
      <button class="btn btn-default dropdown-toggle" data-toggle="dropdown"
      type="button">Navigate the Docs... <span class="caret"></span></button>
      <ul class="dropdown-menu" role="menu">
        <li class="active">
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
        <li>
          <a href="/0.20/examples/">Examples</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-9" id="docs-container">
      <h1 id="quickstart">Quickstart</h1>
      <p>The best way to get started is a simple example. Quill is initialized
      with a DOM element to contain the editor. The contents of that element
      will become the initial contents of Quill.</p>
      <figure class="highlight">
        <pre>
<code class="language-html" data-lang="html"><span class=
"c">&lt;!-- Create the toolbar container --&gt;</span>
<span class="nt">&lt;div</span> <span class="na">id=</span><span class=
"s">"toolbar"</span><span class="nt">&gt;</span>
  <span class="nt">&lt;button</span> <span class="na">class=</span><span class=
"s">"ql-bold"</span><span class="nt">&gt;</span>Bold<span class=
"nt">&lt;/button&gt;</span>
  <span class="nt">&lt;button</span> <span class="na">class=</span><span class=
"s">"ql-italic"</span><span class="nt">&gt;</span>Italic<span class=
"nt">&lt;/button&gt;</span>
<span class="nt">&lt;/div&gt;</span>

<span class="c">&lt;!-- Create the editor container --&gt;</span>
<span class="nt">&lt;div</span> <span class="na">id=</span><span class=
"s">"editor"</span><span class="nt">&gt;</span>
  <span class="nt">&lt;div&gt;</span>Hello World!<span class=
"nt">&lt;/div&gt;</span>
  <span class="nt">&lt;div&gt;</span>Some initial <span class=
"nt">&lt;b&gt;</span>bold<span class="nt">&lt;/b&gt;</span> text<span class=
"nt">&lt;/div&gt;</span>
  <span class="nt">&lt;div&gt;&lt;br&gt;&lt;/div&gt;</span>
<span class="nt">&lt;/div&gt;</span>

<span class="c">&lt;!-- Include the Quill library --&gt;</span>
<span class="nt">&lt;script </span><span class="na">src=</span><span class=
"s">"//cdn.quilljs.com/0.20.1/quill.js"</span><span class=
"nt">&gt;&lt;/script&gt;</span>

<span class="c">&lt;!-- Initialize Quill editor --&gt;</span>
<span class="nt">&lt;script&gt;</span>
  <span class="kd">var</span> <span class="nx">quill</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"s1">'#editor'</span><span class="p">);</span>
  <span class="nx">quill</span><span class="p">.</span><span class=
"nx">addModule</span><span class="p">(</span><span class=
"s1">'toolbar'</span><span class="p">,</span> <span class=
"p">{</span> <span class="na">container</span><span class=
"p">:</span> <span class="s1">'#toolbar'</span> <span class="p">});</span>
<span class="nt">&lt;/script&gt;</span></code>
</pre>
      </figure>
      <p>Quill also supports a powerful <a href="/0.20/docs/api/">API</a> for
      fine grain access and manipulation of the editor contents.</p>
      <figure class="highlight">
        <pre>
<code class="language-html" data-lang="html"><span class=
"nt">&lt;script&gt;</span>
  <span class="nx">quill</span><span class="p">.</span><span class=
"nx">on</span><span class="p">(</span><span class=
"s1">'text-change'</span><span class="p">,</span> <span class=
"kd">function</span><span class="p">(</span><span class=
"nx">delta</span><span class="p">,</span> <span class=
"nx">source</span><span class="p">)</span> <span class="p">{</span>
    <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'Editor contents have changed'</span><span class="p">,</span> <span class=
"nx">delta</span><span class="p">);</span>
  <span class="p">});</span>

  <span class="nx">quill</span><span class="p">.</span><span class=
"nx">insertText</span><span class="p">(</span><span class=
"mi">11</span><span class="p">,</span> <span class=
"s1">' Bilbo'</span><span class="p">);</span>
  <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"nx">quill</span><span class="p">.</span><span class=
"nx">getText</span><span class="p">());</span>   <span class=
"c1">// Should output "Hello World Bilbo!\nSome initial bold text";</span>
<span class="nt">&lt;/script&gt;</span></code>
</pre>
      </figure>
      <h3 id="next-steps">Next Steps</h3>
      <p>That’s all you need to do to set up a simple Quill editor! But the
      power of Quill is its flexibility and extensibility. Check out the
      <a href="/0.20/examples/">Examples</a> to see this in action. Or start
      interacting with Quill with its flexible <a href=
      "/0.20/docs/api/">API</a>.</p>
    </div>
    <div class="col-sm-3" id="sidebar-container">
      <div class="sidebar-nav" data-offset-top="40" data-spy="affix">
        <ul class="nav">
          <li class="active">
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