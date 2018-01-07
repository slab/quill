---
layout: v0.20
permalink: /0.20/docs/deltas/
title: Deltas - Quill v0.20
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
        <li class="active">
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
      <h1 id="deltas">Deltas</h1>
      <p>Quill uses the <a href="https://github.com/ottypes/rich-text">rich
      text</a> format to represent the editor’s contents, as well as changes to
      those contents. In most cases directly dealing with Deltas can be
      avoided. But it is available to provide a powerful interface to
      Quill.</p>
      <p>A Delta representing the editor’s contents looks something like
      this:</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"p">{</span>
  <span class="nl">ops</span><span class="p">:[</span>
    <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'Gandalf'</span><span class=
"p">,</span> <span class="na">attributes</span><span class=
"p">:</span> <span class="p">{</span> <span class="na">bold</span><span class=
"p">:</span> <span class="kc">true</span> <span class="p">}</span> <span class=
"p">},</span>
    <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">' the '</span> <span class="p">},</span>
    <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'Grey'</span><span class=
"p">,</span> <span class="na">attributes</span><span class=
"p">:</span> <span class="p">{</span> <span class="na">color</span><span class=
"p">:</span> <span class="s1">'#ccc'</span> <span class=
"p">}</span> <span class="p">}</span>
  <span class="p">]</span>
<span class="p">)</span></code>
</pre>
      </figure>
      <p>A change looks something like this:</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"p">{</span>
  <span class="nl">ops</span><span class="p">:</span> <span class="p">[</span>
    <span class="p">{</span> <span class="na">retain</span><span class=
"p">:</span> <span class="mi">12</span> <span class="p">},</span>
    <span class="p">{</span> <span class="na">delete</span><span class=
"p">:</span> <span class="mi">4</span> <span class="p">},</span>
    <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'White'</span><span class=
"p">,</span> <span class="na">attributes</span><span class=
"p">:</span> <span class="p">{</span> <span class="na">color</span><span class=
"p">:</span> <span class="s1">'#fff'</span> <span class=
"p">}</span> <span class="p">}</span>
  <span class="p">]</span>
<span class="p">}</span></code>
</pre>
      </figure>
      <p>Note there’s really no difference between the two; the contents
      representation is simply the change from an empty document.</p>
      <h2 id="operations">Operations</h2>
      <p>Operations describe a singular change. They can be an <a href=
      "#insert">insert</a>, <a href="#delete">delete</a> or <a href=
      "#retain">retain</a>. Note operations do not take an index. They always
      describe the change at the current index. Use retains to “keep” or “skip”
      certain parts of the document.</p>
      <h3 id="insert">Insert</h3>
      <p>Insert operations have an <code class=
      "highlighter-rouge">insert</code> key defined. A String value represents
      inserting text. A Number value represents inserting an embed, with the
      value corresponding to an embed type (such as an image or video).</p>
      <p>Quill recognizes the following embed types:</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"p">{</span>
  <span class="nl">image</span><span class="p">:</span> <span class=
"mi">1</span>
<span class="p">}</span></code>
</pre>
      </figure>
      <p>In both cases of text and embeds, an optional <code class=
      "highlighter-rouge">attributes</code> key can be defined with an Object
      to describe additonal formatting information. A format on the newline
      character describes the format for the line. Formats can be changed by
      the <a href="#retain">retain</a> operation.</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"c1">// Insert a bolded "Text"</span>
<span class="p">{</span> <span class="nl">insert</span><span class=
"p">:</span> <span class="s2">"Text"</span><span class=
"p">,</span> <span class="nx">attributes</span><span class=
"err">:</span> <span class="p">{</span> <span class=
"nl">bold</span><span class="p">:</span> <span class=
"kc">true</span> <span class="p">}</span> <span class="p">}</span>

<span class="c1">// Insert a link</span>
<span class="p">{</span> <span class="nl">insert</span><span class=
"p">:</span> <span class="s2">"Google"</span><span class=
"p">,</span> <span class="nx">attributes</span><span class=
"err">:</span> <span class="p">{</span> <span class=
"nl">link</span><span class="p">:</span> <span class=
"s1">'https://www.google.com'</span> <span class="p">}</span> <span class=
"p">}</span>

<span class="c1">// Insert an image</span>
<span class="p">{</span>
  <span class="nl">insert</span><span class="p">:</span> <span class=
"mi">1</span><span class="p">,</span>
  <span class="nx">attributes</span><span class="err">:</span> <span class=
"p">{</span>
    <span class="nl">image</span><span class="p">:</span> <span class=
"s1">'https://octodex.github.com/images/labtocat.png'</span>
  <span class="p">}</span>
<span class="p">}</span>

<span class="c1">// Aligned text example</span>
<span class="p">{</span>
  <span class="nl">ops</span><span class="p">:[</span>
    <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'Right align'</span> <span class="p">},</span>
    <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'\n'</span><span class="p">,</span> <span class=
"na">attributes</span><span class="p">:</span> <span class=
"p">{</span> <span class="na">align</span><span class="p">:</span> <span class=
"s1">'right'</span> <span class="p">}</span> <span class="p">},</span>
    <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'Center align'</span> <span class="p">},</span>
    <span class="p">{</span> <span class="na">insert</span><span class=
"p">:</span> <span class="s1">'\n'</span><span class="p">,</span> <span class=
"na">attributes</span><span class="p">:</span> <span class=
"p">{</span> <span class="na">align</span><span class="p">:</span> <span class=
"s1">'center'</span> <span class="p">}</span> <span class="p">}</span>
  <span class="p">]</span>
<span class="p">)</span></code>
</pre>
      </figure>
      <h3 id="delete">Delete</h3>
      <p>Delete operations have a Number <code class=
      "highlighter-rouge">delete</code> key defined representing the number of
      characters to delete. All embeds have a length of 1.</p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"c1">// Delete the next 10 characters</span>
<span class="p">{</span> <span class="nl">delete</span><span class=
"p">:</span> <span class="mi">10</span> <span class="p">}</span></code>
</pre>
      </figure>
      <h3 id="retain">Retain</h3>
      <p>Retain operations have a Number <code class=
      "highlighter-rouge">retain</code> key defined representing the number of
      characters to keep (other libraries might use the name keep or skip). An
      optional <code class="highlighter-rouge">attributes</code> key can be
      defined with an Object to describe formatting changes to the character
      range. A value of null in the <code class=
      "highlighter-rouge">attributes</code> Object represents removal of that
      key.</p>
      <p><em>Note: It is not necessary to retain the last characters of a
      document as this is implied.</em></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"c1">// Keep the next 5 characters</span>
<span class="p">{</span> <span class="nl">retain</span><span class=
"p">:</span> <span class="mi">5</span> <span class="p">}</span>

<span class="c1">// Keep and bold the next 5 characters</span>
<span class="p">{</span> <span class="nl">retain</span><span class=
"p">:</span> <span class="mi">5</span><span class="p">,</span> <span class=
"nx">attributes</span><span class="err">:</span> <span class=
"p">{</span> <span class="nl">bold</span><span class="p">:</span> <span class=
"kc">true</span> <span class="p">}</span> <span class="p">}</span>

<span class="c1">// Keep and unbold the next 5 characters</span>
<span class=
"c1">// More specifically, remove the bold key in the attributes Object</span>
<span class="c1">// in the next 5 characters</span>
<span class="p">{</span> <span class="nl">retain</span><span class=
"p">:</span> <span class="mi">5</span><span class="p">,</span> <span class=
"nx">attributes</span><span class="err">:</span> <span class=
"p">{</span> <span class="nl">bold</span><span class="p">:</span> <span class=
"kc">null</span> <span class="p">}</span> <span class="p">}</span></code>
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
          <li class="active">
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