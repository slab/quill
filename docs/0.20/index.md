---
layout: v0.20
permalink: /0.20/
title: A Rich Text WYSIWYG Editor with an API - Quill v0.20
---
<div id="demo-container">
  <div class="quill-wrapper" data-toggle="tooltip" data-placement="left" title="Try me out!">
    <div id="toolbar" class="toolbar">
      <span class="ql-format-group">
  <select title="Font" class="ql-font">
    <option value="sans-serif" selected="">Sans Serif</option>
    <option value="serif">Serif</option>
    <option value="monospace">Monospace</option>
  </select>
  <select title="Size" class="ql-size">
    <option value="10px">Small</option>
    <option value="13px" selected="">Normal</option>
    <option value="18px">Large</option>
    <option value="32px">Huge</option>
  </select>
</span>
<span class="ql-format-group">
  <span title="Bold" class="ql-format-button ql-bold"></span>
  <span class="ql-format-separator"></span>
  <span title="Italic" class="ql-format-button ql-italic"></span>
  <span class="ql-format-separator"></span>
  <span title="Underline" class="ql-format-button ql-underline"></span>
  <span class="ql-format-separator"></span>
  <span title="Strikethrough" class="ql-format-button ql-strike"></span>
</span>
<span class="ql-format-group">
  <select title="Text Color" class="ql-color">
    <option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)" selected=""></option>
    <option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"></option>
    <option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"></option>
    <option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"></option>
    <option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"></option>
    <option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"></option>
    <option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"></option>
    <option value="rgb(255, 255, 255)" label="rgb(255, 255, 255)"></option>
    <option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"></option>
    <option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"></option>
    <option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"></option>
    <option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"></option>
    <option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"></option>
    <option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"></option>
    <option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"></option>
    <option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"></option>
    <option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"></option>
    <option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"></option>
    <option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"></option>
    <option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"></option>
    <option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"></option>
    <option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"></option>
    <option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"></option>
    <option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"></option>
    <option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"></option>
    <option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"></option>
    <option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"></option>
    <option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"></option>
    <option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"></option>
    <option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"></option>
    <option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"></option>
    <option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"></option>
    <option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"></option>
    <option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"></option>
    <option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"></option>
  </select>
  <span class="ql-format-separator"></span>
  <select title="Background Color" class="ql-background">
    <option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)"></option>
    <option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"></option>
    <option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"></option>
    <option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"></option>
    <option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"></option>
    <option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"></option>
    <option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"></option>
    <option value="rgb(255, 255, 255)" label="rgb(255, 255, 255)" selected=""></option>
    <option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"></option>
    <option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"></option>
    <option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"></option>
    <option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"></option>
    <option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"></option>
    <option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"></option>
    <option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"></option>
    <option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"></option>
    <option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"></option>
    <option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"></option>
    <option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"></option>
    <option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"></option>
    <option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"></option>
    <option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"></option>
    <option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"></option>
    <option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"></option>
    <option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"></option>
    <option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"></option>
    <option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"></option>
    <option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"></option>
    <option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"></option>
    <option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"></option>
    <option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"></option>
    <option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"></option>
    <option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"></option>
    <option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"></option>
    <option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"></option>
  </select>
</span>
<span class="ql-format-group">
  <span title="List" class="ql-format-button ql-list"></span>
  <span class="ql-format-separator"></span>
  <span title="Bullet" class="ql-format-button ql-bullet"></span>
  <span class="ql-format-separator"></span>
  <select title="Text Alignment" class="ql-align">
    <option value="left" label="Left" selected=""></option>
    <option value="center" label="Center"></option>
    <option value="right" label="Right"></option>
    <option value="justify" label="Justify"></option>
  </select>
</span>
      <span class="ql-format-group">
        <span title="Link" class="ql-format-button ql-link"></span>
        <span class="ql-format-separator"></span>
        <span title="Image" class="ql-format-button ql-image"></span>
      </span>
    </div>
    <div id="editor" class="editor">
      <div><span style="font-size: 18px;">Quill Rich Text Editor</span></div>
      <div><br /></div>
      <div>
        <span>Quill is a free, </span>
        <a href="https://github.com/quilljs/quill/">open source</a>
        <span> WYSIWYG editor built for the modern web. With its </span>
        <a href="https://quilljs.com/0.20/docs/modules/">extensible architecture</a>
        <span> and a </span>
        <a href="https://quilljs.com/0.20/docs/api/">expressive API</a>
        <span> you can completely customize it to fulfill your needs. Some built in features include:</span>
      </div>
      <div><br /></div>
      <ul>
        <li>Fast and lightweight</li>
        <li>Semantic markup</li>
        <li>Standardized HTML between browsers</li>
        <li>Cross browser support including Chrome, Firefox, Safari, and IE 9+</li>
      </ul>
      <div><br /></div>
      <div style="text-align: center;"><img src="/0.20/assets/images/quill-photo.jpg" alt="Quill Pen" /></div>
      <div style="text-align: center;"><a style="font-size: 32px;" href="https://github.com/quilljs/quill/releases/download/v0.20.1/quill.tar.gz">Download Quill</a></div>
      <div><br /></div>
    </div>
  </div>
</div>

<div class="container">
  <div id="features-container" class="row">
    <div class="col-sm-4">
      <h3>Full Featured API</h3>
      <a title="Quill API" href="/0.20/docs/api/">
        <img class="img-responsive" src="/0.20/assets/images/cloud.png" alt="Full Featured API" />
      </a>
      <p>Get fine-grained access to editor contents and event notifications.</p>
    </div>
    <div class="col-sm-4">
      <h3>Cross Platform</h3>
      <a title="Quill on Sauce Labs" href="https://saucelabs.com/u/quill">
        <img class="img-responsive" src="/0.20/assets/images/browsers.png" alt="Cross Platform" />
      </a>
      <p>Works across all modern browsers on desktops, tablets and phones.</p>
    </div>
    <div class="col-sm-4">
      <h3>Customizable</h3>
      <a title="Quill Modules" href="/0.20/docs/modules/">
        <img class="img-responsive" src="/0.20/assets/images/tubes.png" alt="Customizable" />
      </a>
      <p>It's easy to add custom behavior or modifications on top of Quill.</p>
    </div>
  </div>

  <hr class="half-rule" />

  <div id="users-container" class="row">
    <div class="row text-center">
      <h3>Out in the Wild</h3>
      <div class="col-sm-2 col-sm-offset-2">
        <a href="https://asana.com/" title="Asana" target="_blank">
          <img class="img-responsive" src="/0.20/assets/images/users/asana.png" alt="Asana" />
        </a>
      </div>
      <div class="col-sm-2">
        <a href="https://www.intuit.com/" title="Intuit" target="_blank">
          <img class="img-responsive" src="/0.20/assets/images/users/intuit.png" alt="Intuit" />
        </a>
      </div>
      <div class="col-sm-2">
        <a href="https://www.lever.co/" title="Lever" target="_blank">
          <img class="img-responsive" src="/0.20/assets/images/users/lever.png" alt="Lever" />
        </a>
      </div>
      <div class="col-sm-2">
        <a href="https://www.relateiq.com/" title="RelateIQ" target="_blank">
          <img class="img-responsive" src="/0.20/assets/images/users/relateiq.png" alt="RelateIQ" />
        </a>
      </div>
    </div>
  </div>

  <hr class="half-rule" />

  <div id="download-container" class="row text-center">
    <p class="lead">Quill is open source. It is hosted and maintained on <a href="https://github.com/quilljs/quill/">GitHub</a>.</p>
    <a href="https://github.com/quilljs/quill/releases/download/v0.20.1/quill.tar.gz" class="btn-lg btn" title="Quill v0.20.1" onclick="ga('send','event','download',this.href);">Download Quill</a>
  </div>
</div>
<script src="//cdn.quilljs.com/0.20.1/quill.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
<script src="/0.20/assets/js/index.js"></script>