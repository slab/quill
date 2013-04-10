describe('Normalize', ->
  describe('breakLine', ->
    blockTest = new Scribe.Test.HtmlTest(
      expected: [
        '<div><span>One</span></div>'
        '<div><span>Two</span></div>'
      ]
      fn: (container) ->
        Scribe.Normalizer.breakLine(container.firstChild, container)
    )

    blockTest.run('Inner divs', 
      initial: [
        '<div>
          <div><span>One</span></div>
          <div><span>Two</span></div>
        </div>'
      ]
    )

    blockTest.run('Nested inner divs', 
      initial: [
        '<div>
          <div><div><span>One</span></div></div>
          <div><div><span>Two</span></div></div>
        </div>'
      ]
    )
  )

  describe('normalizeBreak', ->
    breakTest = new Scribe.Test.HtmlTest(
      fn: (container) ->
        Scribe.Normalizer.normalizeBreak(container.querySelector('br'), container)
    )

    breakTest.run('Break in middle of line', 
      initial:  [
        '<div><b>One<br />Two</b></div>'
      ]
      expected: [
        '<div><b>One</b></div>'
        '<div><b>Two</b></div>'
      ]
    )

    breakTest.run('Break preceding line', 
      initial: [
        '<div><b><br />One</b></div>'
      ]
      expected: [
        '<div><b><br /></b></div>'
        '<div><b>One</b></div>'
      ]
    )

    breakTest.run('Break after line', 
      initial:  ['<div><b>One<br /></b></div>']
      expected: ['<div><b>One</b></div>']
    )
  )

  describe('groupBlocks', ->
    groupTest = new Scribe.Test.HtmlTest(
      fn: (container) ->
        Scribe.Normalizer.groupBlocks(container)
    )

    groupTest.run('Wrap newline', 
      initial:  ['<br />']
      expected: ['<div><br /></div>']
    )

    groupTest.run('Wrap span', 
      initial:  ['<span>One</span>']
      expected: ['<div><span>One</span></div>']
    )

    groupTest.run('Wrap many spans', 
      initial: [
        '<div><span>One</span></div>'
        '<span>Two</span>'
        '<span>Three</span>'
        '<div><span>Four</span></div>'
      ]
      expected: [
        0, '<div><span>Two</span><span>Three</span></div>', 3
      ]
    )

    groupTest.run('Wrap break and span', 
      initial:  ['<br /><span>One</span>']
      expected: ['<div><br /><span>One</span></div>']
    )
  )

  describe('normalizeLine', ->
    lineTest = new Scribe.Test.HtmlTest(
      fn: (lineNode) ->
        Scribe.Normalizer.normalizeLine(lineNode)
        Scribe.Normalizer.optimizeLine(lineNode)
    )

    lineTest.run('merge adjacent equal nodes', 
      initial:  '<b>Bold1</b><b>Bold2</b>'
      expected: '<b>Bold1Bold2</b></div>'
    )

    lineTest.run('merge adjacent equal spans',
      initial:
        '<span class="color-red">
          <span class="background-blue">Red1</span>
        </span>
        <span class="color-red">
          <span class="background-blue">Red2</span>
        </span>'
      expected:
        '<span class="color-red">
          <span class="background-blue">Red1Red2</span>
        </span>'
    )

    lineTest.run('do not merge adjacent unequal spans',
      initial:  '<span class="size-huge">Huge</span><span class="size-large">Large</span>'
      expected: '<span class="size-huge">Huge</span><span class="size-large">Large</span>'
    )

    lineTest.run('preserve style attributes', 
      initial: 
        '<span style="font-size:32px">Huge</span>
        <span style="color:rgb(255, 0, 0)">Red</span>
        <span style="font-family:\'Times New Roman\', serif">Serif</span>
        <span style="font-family: Helvetica, Arial, san-serif; font-size: 18px; line-height: 22px; white-space: pre-wrap;">Large</span>'
      expected:
        '<span class="size-huge">Huge</span>
        <span class="color-red">Red</span>
        <span class="family-serif">Serif</span>
        <span class="size-large">Large</span>'
    )

    lineTest.run('remove redundant format elements', 
      initial:  '<b><i><b>Bolder</b></i></b>'
      expected: '<b><i>Bolder</i></b>'
    )

    lineTest.run('remove redundant elements 1', 
      initial:  '<span><br></span>'
      expected: '<br />'
    )

    lineTest.run('remove redundant elements 2', 
      initial:  '<span><span>Span</span></span>'
      expected: '<span>Span</span>'
    )

    lineTest.run('wrap text node', 
      initial:  'Hey'
      expected: '<span>Hey</span>'
    )

    lineTest.run('wrap text node next to element node', 
      initial:  'Hey<b>Bold</b>'
      expected: '<span>Hey</span><b>Bold</b>'
    )
  )

  describe('optimizeLine', ->
    lineTest = new Scribe.Test.HtmlTest(
      fn: (container) ->
        Scribe.Normalizer.optimizeLine(container)
    )

    lineTest.run('unnecessary break', 
      initial:  '<span>One</span><br>'
      expected: '<span>One</span>'
    )
  )

  describe('normalizeDoc', ->
    docTest = new Scribe.Test.HtmlTest(
      fn: (container) ->
        Scribe.Normalizer.normalizeDoc(container)
    )

    docTest.run('empty string', 
      initial:  ['']
      expected: ['<div><br></div>']
    )

    docTest.run('lone break', 
      initial:  ['<br>']
      expected: ['<div><br></div>']
    )

    docTest.run('correct break', 
      initial:  ['<div><br></div>']
      expected: [0]
    )

    docTest.run('handle nonstandard block tags', 
      initial: [
        '<h1>
          <dl><dt>One</dt></dl>
          <pre>Two</pre>
          <p><span>Three</span></p>
        </h1>'
      ]
      expected: [
        '<div><span>One</span></div>'
        '<div><span>Two</span></div>'
        '<div><span>Three</span></div>'
      ]
    )

    docTest.run('handle nonstandard break tags', 
      initial: [
        '<div><b>One<br><hr>Two</b></div>'
      ]
      expected: [
        '<div><b>One</b></div>'
        '<div><br></div>'
        '<div><b>Two</b></div>'
      ]
    )

    docTest.run('tranform equivalent styles',
      initial: [
        '<div>
          <strong>Strong</strong>
          <del>Deleted</del>
          <em>Emphasis</em>
          <strike>Strike</strike>
          <b>Bold</b>
          <i>Italic</i>
          <s>Strike</s>
          <u>Underline</u>
        </div>'
      ]
      expected: [
        '<div>
          <b>Strong</b>
          <s>Deleted</s>
          <i>Emphasis</i>
          <s>Strike</s>
          <b>Bold</b>
          <i>Italic</i>
          <s>Strike</s>
          <u>Underline</u>
        </div>'
      ]
    )
  )

  describe('normalizeTag', ->
    attrTest = new Scribe.Test.HtmlTest(
      fn: (lineNode) ->
        lineNode.firstChild.setAttribute('data-test', 'test')
        lineNode.firstChild.setAttribute('width', '100px')
        Scribe.Normalizer.normalizeLine(lineNode)
        Scribe.Normalizer.optimizeLine(lineNode)
    )

    attrTest.run('strip extraneous attributes', 
      initial:  '<span data-test="test" width="100px">One</span>'
      expected: '<span>One</span>'
    )
  )
)
