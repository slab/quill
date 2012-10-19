#= require mocha
#= require chai
#= require range
#= require jquery
#= require underscore

describe('Selection', ->
  describe('preserve', ->
    tests = 
      insertTests:
        'insert before':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(1, "A")
          expected: ['<div><span>0A123|45|6789</span></div>']

        'insert after':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(7, "A")
          expected: ['<div><span>0123|45|6A789</span></div>']

        'insert at beginning of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(4, "A")
          expected: ['<div><span>0123A|45|6789</span></div>']

        'insert at end of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(6, "A")
          expected: ['<div><span>0123|45|A6789</span></div>']

        'insert in middle of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(5, "A")
          expected: ['<div><span>0123|4A5|6789</span></div>']

        'insert newline at beginning of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(4, "\n")
          expected: ['<div><span>0123</span></div>', '<div><span>|45|6789</span></div>']

        'insert newline at end of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(6, "\n")
          expected: ['<div><span>0123|45|</span></div>', '<div><span>6789</span></div>']

        'insert newline at middle of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(5, "\n")
          expected: ['<div><span>0123|4</span></div>', '<div><span>5|6789</span></div>']
      
        'insert newline to previous line attribute':
          lines: ['<ol><li><span>0123456789</span></li></ol>', '<span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(10, "\n")
          expected: [0, '<ol><li><span><br></span></li></ol>', 1]

      deleteTests:
        'delete before':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteAt(1, 2)
          expected: ['<div><span>0123|45|6789</span></div>']

        'delete after':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteAt(7, 2)
          expected: ['<div><span>0123|45|69</span></div>']

        'delete at beginning of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteAt(2, 2)
          expected: ['<div><span>01|45|6789</span></div>']

        'delete at end of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteAt(6, 2)
          expected: ['<div><span>0123|45|89</span></div>']

        'delete middle of selection':
          lines: ['<div><span>012|3456|789</span></div>']
          fn: (editor) -> editor.deleteAt(4, 2)
          expected: ['<div><span>012|36|789</span></div>']

        'delete selection':
          lines: ['<div><span>012|3456|789</span></div>']
          fn: (editor) -> editor.deleteAt(4, 2)
          expected: ['<div><span>012||789</span></div>']

        'delete containing selection': 
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteAt(3, 4)
          expected: ['<div><span>012||789</span></div>']

        'delete beginning of leaf':
          lines: ['<div><span>01</span><b>23|45|67</b><span>89</span></div>']
          fn: (editor) -> editor.deleteAt(1, 2)
          expected: ['<div><span>0</span><b>3|45|67</b><span>89</span></div>']

        'delete end of leaf':
          lines: ['<div><span>01</span><b>23|45|67</b><span>89</span></div>']
          fn: (editor) -> editor.deleteAt(7, 2)
          expected: ['<div><span>01</span><b>23|45|6</b><span>9</span></div>']

        'delete entire leaf':
          lines: ['<div><span>01</span><b>23|45|67</b><span>89</span></div>']
          fn: (editor) -> editor.deleteAt(2, 6)
          expected: ['<div><span>01||89</span></div>']

      applyAttributeTests:
        'apply leaf attribute before': 
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(1, 2, 'bold', true)
          expected: ['<div><span>0</span><b>12</b><span>3|45|6789</span></div>']

        'apply leaf attribute after':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(7, 2, 'bold', true)
          expected: ['<div><span>0123|45|6</span><b>78</b><span>9</span></div>']

        'apply leaf attribute in middle':
          lines: ['<div><span>012|3456|789</span></div>']
          fn: (editor) -> editor.applyAttribute(4, 2, 'bold', true)
          expected: ['<div><span>012|3</span><b>45</b><span>6|789</span></div>']

        'apply leaf attribute overlapping beginning':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(3, 2, 'bold', true)
          expected: ['<div><span>012</span><b>3|4</b><span>5|6789</span></div>']

        'apply leaf attribute overlapping end':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(5, 2, 'bold', true)
          expected: ['<div><span>0123|4</span><b>5|6</b><span>789</span></div>']

        'apply leaf attribute overlapping beginning and end':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(3, 4, 'bold', true)
          expected: ['<div><span>012</span><b>3|45|6</b><span>789</span></div>']

        'apply leaf attribute to entire node':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(0, 10, 'bold', true)
          expected: ['<div><b>0123|45|6789</b></div>']

        'apply leaf attribute to entire node 2':
          lines: ['<div><b>0123|45|6789</b></div>']
          fn: (editor) -> editor.applyAttribute(0, 10, 'italic', true)
          expected: ['<div><i><b>0123|45|6789</b></i></div>']

        'apply line attribute':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(1, 2, 'list', 1)
          expected: ['<ol><li><span>0123|45|6789</span></li></ol>']

      removeAttributeTests:
        'remove leaf attribute before': 
          lines: ['<div><span>0</span><b>12</b><span>3|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(1, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']

        'remove leaf attribute after':
          lines: ['<div><span>0123|45|6</span><b>78</b><span>9</span></div>']
          fn: (editor) -> editor.applyAttribute(7, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']

        'remove leaf attribute in middle':
          lines: ['<div><span>012|3</span><b>45</b><span>6|789</span></div>']
          fn: (editor) -> editor.applyAttribute(4, 2, 'bold', false)
          expected: ['<div><span>012|3456|789</span></div>']

        'remove leaf attribute overlapping beginning':
          lines: ['<div><span>012</span><b>3|4</b><span>5|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(3, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']

        'remove leaf attribute overlapping end':
          lines: ['<div><span>0123|4</span><b>5|6</b><span>789</span></div>']
          fn: (editor) -> editor.applyAttribute(5, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']

        'remove leaf attribute overlapping beginning and end':
          lines: ['<div><span>012</span><b>3|45|6</b><span>789</span></div>']
          fn: (editor) -> editor.applyAttribute(3, 4, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']

        'remove leaf attribute from entire node':
          lines: ['<div><b>0123|45|6789</b></div>']
          fn: (editor) -> editor.applyAttribute(0, 10, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']

        'remove leaf attribute from entire node 2':
          lines: ['<div><i><b>0123|45|6789</b></i></div>']
          fn: (editor) -> editor.applyAttribute(0, 10, 'bold', false)
          expected: ['<div><i>0123|45|6789</i></div>']

        'remove leaf attribute from entire node 3':
          lines: ['<div><i><b>0123|45|6789</b></i></div>']
          fn: (editor) -> editor.applyAttribute(0, 10, 'italic', false)
          expected: ['<div><b>0123|45|6789</b></div>']

        'remove line attribute':
          lines: ['<ol><li><span>0123|45|6789</span></li></ol>']
          fn: (editor) -> editor.applyAttribute(1, 2, 'list', false)
          expected: ['<div><span>0123|45|6789</span></div>']


    _.each(tests, (testGroup, groupName) ->
      describe(groupName, ->
        _.each(testGroup, (test, name) ->
          it(name, ->
            expect(1).to.equal(1)
          )
        )
      )
    )
  )
)
