describe('Editor', ->
  template = '
    <div><br></div>
    <div>
      <i>
        <b>ab</b>
        <span>cd</span>
      </i>
      <s>ef</s>
      <span style="color: #F00;">gh</span>
    </div>
    <div><br></div>
    <div><br></div>
    <div><b>ij</b></div>
    <div><span style="color: #F00;">kl</span></div>
    <div><br></div>
  '

  describe('insertAt empty', ->
    insertSuite = new ScribeTest.InsertTestSuite({ initial: '<div><br></div>' })
    insertSuite.run()
  )

  describe('insertAt', ->
    insertSuite = new ScribeTest.InsertTestSuite({ initial: template })
    insertSuite.run()
  )

  describe('deleteAt', ->
    deleteSuite = new ScribeTest.DeleteTestSuite({ initial: template })
    deleteSuite.run()
  )

  describe('formatAt', ->
    formatSuite = new ScribeTest.FormatTestSuite({ initial: template })
    formatSuite.run()
  )
)
