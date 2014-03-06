ScribeTestSuite = require('./lib/suite')

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

  describe('insertAt empty', ->
    insertSuite = new ScribeTestSuite.Insert({ initial: '<div><br></div>' })
    insertSuite.run()
  )

  describe('insertAt', ->
    insertSuite = new ScribeTestSuite.Insert({ initial: template })
    insertSuite.run()
  )

  describe('deleteAt', ->
    deleteSuite = new ScribeTestSuite.Delete({ initial: template })
    deleteSuite.run()
  )

  describe('formatAt', ->
    formatSuite = new ScribeTestSuite.Format({ initial: template })
    formatSuite.run()
  )
)
