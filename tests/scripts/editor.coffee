describe('Editor', ->
  describe('insertAt', ->
    insertSuite = new Scribe.Test.InsertTestSuite()
    insertSuite.run()
  )

  describe('deleteAt', ->
    deleteSuite = new Scribe.Test.DeleteTestSuite()
    deleteSuite.run()
  )

  describe('formatAt', ->
    formatSuite = new Scribe.Test.FormatTestSuite()
    formatSuite.run()
  )
)
