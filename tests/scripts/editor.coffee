describe('Editor', ->
  template = '
    <div><br></div>
    <div>
      <i>
        <b>ab</b>
        <span>cd</span>
      </i>
      <s>ef</s>
      <span class="color-red">gh</span>
    </div>
    <div><br></div>
    <div><br></div>
    <div><b>ij</b></div>
    <div><span class="color-red">kl</span></div>
    <div><br></div>
  '

  describe('insertAt empty', ->
    insertSuite = new Scribe.Test.InsertTestSuite('')
    insertSuite.run()
  )

  describe('insertAt', ->
    insertSuite = new Scribe.Test.InsertTestSuite(template)
    insertSuite.run()
  )

  describe('deleteAt', ->
    deleteSuite = new Scribe.Test.DeleteTestSuite(template)
    deleteSuite.run()
  )

  describe('formatAt', ->
    formatSuite = new Scribe.Test.FormatTestSuite(template)
    formatSuite.run()
  )
)
