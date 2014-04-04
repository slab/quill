QuillTestSuite = require('./lib/suite')

describe('Editor', ->
  template = '
    <div><br></div>
    <div>
      <i>
        <b>ab</b>
        <span>cd</span>
      </i>
      <s>ef</s>
      <span style="color: rgb(255, 0, 0);">gh</span>
    </div>
    <div><br></div>
    <div><br></div>
    <div><b>ij</b></div>
    <div><span style="color: rgb(255, 0, 0);">kl</span></div>
    <div><br></div>
  '

  describe('insertText empty', ->
    insertSuite = new QuillTestSuite.Insert({ initial: '<div><br></div>' })
    insertSuite.run()
  )

  describe('insertText', ->
    insertSuite = new QuillTestSuite.Insert({ initial: template })
    insertSuite.run()
  )

  describe('deleteText', ->
    deleteSuite = new QuillTestSuite.Delete({ initial: template })
    deleteSuite.run()
  )

  describe('formatText', ->
    formatSuite = new QuillTestSuite.Format({ initial: template })
    formatSuite.run()
  )
)
