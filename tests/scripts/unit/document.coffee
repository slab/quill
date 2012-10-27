#= require mocha
#= require chai
#= require range
#= require jquery
#= require underscore

describe('Document', ->
  describe('toDelta', ->
    tests = 
      'basic':
        lines: ['<div><span>0123</span></div>']
        deltas: [new JetInsert('0123')]
      'format':
        lines: ['<div><b>0123</b></div>']
        deltas: [new JetInsert('0123', {bold:true})]
      'line format':
        lines: ['<ul class="indent-1"><li>0123</li></ul>']
        deltas: [new JetInsert('0123', {bullet:1})]
      'empty':
        lines: ['<div><br></div>']
        deltas: []
      'empty 2':
        lines: ['<div><ul><li><br></li></ul></div>']
        deltas: []
      'newline':
        lines: ['<div><br></div>', '<div><br></div>']
        deltas: [new JetInsert("\n")]
      'newline 2':
        lines: ['<div><br></div>', '<div><b></b></div>']
        deltas: [new JetInsert("\n")]
      'newline with format':
        lines: ['<div><b></b></div>', '<div><br></div>']
        deltas: [new JetInsert("\n", {bold:true})]
      'newline with line format':
        lines: ['<ul class="indent-1"><li><br></li></ul>', '<div><br></div>']
        deltas: [new JetInsert("\n", {bullet:1})]
      'text + newline':
        lines: ['<div><span>0</span></div>', '<div><br></div>']
        deltas: [new JetInsert("0\n")]
      'newline + text':
        lines: ['<div><br></div>', '<div><span>0</span></div>']
        deltas: [new JetInsert("\n0")]

    _.each(tests, (test, name) ->
      it(name, ->
        html = test.lines.join('')
        $('#editor-container').html(html)
        endLength = _.reduce(test.deltas, ((count, delta) -> return count + delta.getLength()), 0)
        delta = new JetDelta(0, endLength, test.deltas)
        editor = new Tandem.Editor('editor-container')
        editorDelta = editor.doc.toDelta()
        editor.destroy()
        expect(editorDelta).to.deep.equal(delta)
      )
    )
  )
)
