---
layout: v0.20
permalink: /0.20/docs/modules/
title: Modules - Quill v0.20
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
      <div class="alert alert-warning">
        This interface has not been finalized.
      </div>
      <h1 id="modules">Modules</h1>
      <p>Modules allow Quill’s behavior and functionality to customized. To
      enable a module, simply add it to the editor at initialization:</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"kd">var</span> <span class="nx">editor</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"s1">'#editor'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">modules</span><span class="p">:</span> <span class=
"p">{</span> <span class="na">toolbar</span><span class=
"p">:</span> <span class="nx">options</span> <span class="p">}</span>
<span class="p">});</span></code>
</pre>
      </figure>
      <p>Or you can add it later:</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">addModule</span><span class="p">(</span><span class=
"s1">'toolbar'</span><span class="p">,</span> <span class=
"nx">options</span><span class="p">);</span></code>
</pre>
      </figure>
      <p>A few common and officially supported modules are listed here:</p>
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
      <h2 id="custom-modules">Custom Modules</h2>
      <p>You can also build your own module. Simply register it with <a href=
      "/0.20/docs/api/">Quill.registerModule</a> and the module will be passed
      the corresponding Quill editor and options. Check out the <a href=
      "/blog/building-a-custom-module/">Building a Custom Module</a> guide for
      a walkthrough.</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">Quill</span><span class="p">.</span><span class=
"nx">registerModule</span><span class="p">(</span><span class=
"s1">'armorer'</span><span class="p">,</span> <span class=
"kd">function</span><span class="p">(</span><span class=
"nx">quill</span><span class="p">,</span> <span class=
"nx">options</span><span class="p">)</span> <span class="p">{</span>
  <span class="k">switch</span><span class="p">(</span><span class=
"nx">options</span><span class="p">.</span><span class=
"nx">hero</span><span class="p">)</span> <span class="p">{</span>
    <span class="k">case</span> <span class="s1">'aragorn'</span><span class=
"err">:</span>
      <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'anduril'</span><span class="p">);</span>
      <span class="k">break</span><span class="p">;</span>
    <span class="k">case</span> <span class="s1">'bilbo'</span><span class=
"err">:</span>
    <span class="k">case</span> <span class="s1">'frodo'</span><span class=
"err">:</span>
      <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'sting'</span><span class="p">);</span>
      <span class="k">break</span><span class="p">;</span>
    <span class="k">case</span> <span class="s1">'eomer'</span><span class=
"err">:</span>
      <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'guthwine'</span><span class="p">);</span>
      <span class="k">break</span><span class="p">;</span>
    <span class="k">case</span> <span class="s1">'gandalf'</span><span class=
"err">:</span>
      <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'glamdring'</span><span class="p">);</span>
      <span class="k">break</span><span class="p">;</span>
    <span class="nl">default</span><span class="p">:</span>
      <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'stick'</span><span class="p">);</span>
  <span class="p">}</span>
<span class="p">});</span>

<span class="kd">var</span> <span class="nx">quill</span> <span class=
"o">=</span> <span class="k">new</span> <span class=
"nx">Quill</span><span class="p">(</span><span class=
"s1">'#editor'</span><span class="p">);</span>
<span class="nx">quill</span><span class="p">.</span><span class=
"nx">addModule</span><span class="p">(</span><span class=
"s1">'armorer'</span><span class="p">,</span> <span class="p">{</span>
  <span class="na">hero</span><span class="p">:</span> <span class=
"s1">'sam'</span>
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