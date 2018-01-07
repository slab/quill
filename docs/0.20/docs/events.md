---
layout: v0.20
permalink: /0.20/docs/events/
title: Events - Quill v0.20
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
        <li class="active">
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
      <h1 id="events">Events</h1>
      <p>Quill inherits from <a href=
      "https://github.com/asyncly/EventEmitter2">EventEmitter</a> and allows
      you access to listen to the following events:</p>
      <ol>
        <li>
          <a href="#text-change">text-change</a>
        </li>
        <li>
          <a href="#selection-change">selection-change</a>
        </li>
      </ol>
      <h3 id="text-change">Text Change</h3>
      <p>Emitted when the contents of Quill have changed. Details of the
      change, along with the source of the change are provided. The source will
      be <code class="highlighter-rouge">"user"</code> if it originates from
      the users. For example:</p>
      <ul>
        <li>- User types into the editor</li>
        <li>- User formats text using the toolbar</li>
        <li>- User uses a hotkey to undo</li>
        <li>- User uses OS spelling correction</li>
      </ul>
      <p>Changes may occur through an API but as long as they originate from
      the user, the provided source will still be <code class=
      "highlighter-rouge">"user"</code>. For example, when a user clicks on the
      toolbar, technically the toolbar module calls a Quill API to effect the
      change. But source is still <code class="highlighter-rouge">"user"</code>
      since the origin of the change was the user’s click.</p>
      <p><strong>Callback Parameters</strong></p>
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
            <td>Represention of change.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">source</code></td>
            <td><em>String</em></td>
            <td>Source of change. Will be either <code class=
            "highlighter-rouge">"user"</code> or <code class=
            "highlighter-rouge">"api"</code>.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">on</span><span class="p">(</span><span class=
"s1">'text-change'</span><span class="p">,</span> <span class=
"kd">function</span><span class="p">(</span><span class=
"nx">delta</span><span class="p">,</span> <span class=
"nx">source</span><span class="p">)</span> <span class="p">{</span>
  <span class="k">if</span> <span class="p">(</span><span class=
"nx">source</span> <span class="o">==</span> <span class=
"s1">'api'</span><span class="p">)</span> <span class="p">{</span>
    <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s2">"An API call triggered this change."</span><span class="p">);</span>
  <span class="p">}</span> <span class="k">else</span> <span class=
"k">if</span> <span class="p">(</span><span class=
"nx">source</span> <span class="o">==</span> <span class=
"s1">'user'</span><span class="p">)</span> <span class="p">{</span>
    <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s2">"A user action triggered this change."</span><span class="p">);</span>
  <span class="p">}</span>
<span class="p">});</span></code>
</pre>
      </figure>
      <h3 id="selection-change">Selection Change</h3>
      <p>Emitted when a user or API causes the selection to change, with a
      range representing the selection boundaries. A null range indicates
      selection loss (usually caused by loss of focus from the editor).</p>
      <p>You can also use this event as a focus change event by just checking
      if the emitted range is null or not.</p>
      <p><strong>Callback Parameters</strong></p>
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
            <td><code class="highlighter-rouge">range</code></td>
            <td><em>Object</em></td>
            <td>Object with <strong>start</strong> and <strong>end</strong>
            keys indicating the corresponding indexes where the selection
            exists.</td>
          </tr>
          <tr>
            <td><code class="highlighter-rouge">source</code></td>
            <td><em>String</em></td>
            <td>Source of change. Will be either <code class=
            "highlighter-rouge">"user"</code> or <code class=
            "highlighter-rouge">"api"</code>.</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Examples</strong></p>
      <figure class="highlight">
        <pre>
<code class="language-javascript" data-lang="javascript"><span class=
"nx">editor</span><span class="p">.</span><span class=
"nx">on</span><span class="p">(</span><span class=
"s1">'selection-change'</span><span class="p">,</span> <span class=
"kd">function</span><span class="p">(</span><span class=
"nx">range</span><span class="p">)</span> <span class="p">{</span>
  <span class="k">if</span> <span class="p">(</span><span class=
"nx">range</span><span class="p">)</span> <span class="p">{</span>
    <span class="k">if</span> <span class="p">(</span><span class=
"nx">range</span><span class="p">.</span><span class=
"nx">start</span> <span class="o">==</span> <span class=
"nx">range</span><span class="p">.</span><span class=
"nx">end</span><span class="p">)</span> <span class="p">{</span>
      <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'User cursor is on'</span><span class="p">,</span> <span class=
"nx">range</span><span class="p">.</span><span class=
"nx">start</span><span class="p">);</span>
    <span class="p">}</span> <span class="k">else</span> <span class=
"p">{</span>
      <span class="kd">var</span> <span class="nx">text</span> <span class=
"o">=</span> <span class="nx">editor</span><span class="p">.</span><span class=
"nx">getText</span><span class="p">(</span><span class=
"nx">range</span><span class="p">.</span><span class=
"nx">start</span><span class="p">,</span> <span class=
"nx">range</span><span class="p">.</span><span class=
"nx">end</span><span class="p">);</span>
      <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'User has highlighted'</span><span class="p">,</span> <span class=
"nx">text</span><span class="p">);</span>
    <span class="p">}</span>
  <span class="p">}</span> <span class="k">else</span> <span class="p">{</span>
    <span class="nx">console</span><span class="p">.</span><span class=
"nx">log</span><span class="p">(</span><span class=
"s1">'Cursor not in the editor'</span><span class="p">);</span>
  <span class="p">}</span>
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
          <li class="active">
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