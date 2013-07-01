buildString = (reference, arr) ->
  return _.map(arr, (elem) =>
    return if _.isNumber(elem) then reference[elem] else elem
  ).join('')


class ScribeHtmlTest
  @DEFAULTS:
    async         : false
    checker       : ->
    fn            : ->
    initial       : []
    expected      : []
    ignoreExpect  : false
    pre           : -> []

  constructor: (options = {}) ->
    console.assert(_.isObject(options), "Invalid options passed into constructor")
    @settings = _.defaults(options, ScribeHtmlTest.DEFAULTS)

  run: (name, options, args...) ->
    it(name, (done) =>
      this.runWithoutIt(options, args..., done)
    )

  runWithoutIt: (options, args..., done) ->
    options = _.defaults(options, @settings)
    options.initial = [options.initial] if _.isString(options.initial)
    options.expected = buildString(options.initial, if options.expected? then options.expected else @settings.expected)
    options.initial = options.initial.join('') if _.isArray(options.initial)
    options.initial = Scribe.Utils.cleanHtml(options.initial, true)
    options.expected = Scribe.Utils.cleanHtml(options.expected, true)
    testContainer = $('#test-container').html(options.initial).get(0)
    expectedContainer = $('#expected-container').html(options.expected).get(0)
    newArgs = options.pre.call(this, testContainer, expectedContainer)
    newArgs = [newArgs] unless _.isArray(newArgs)
    next = =>
      testHtml = Scribe.Utils.cleanHtml(testContainer.innerHTML)
      expectedHtml = Scribe.Utils.cleanHtml(expectedContainer.innerHTML)
      expect(testHtml).to.equal(expectedHtml) unless options.ignoreExpect
      options.checker.call(this, testContainer, expectedContainer, newArgs..., args...)
      done()
    options.fn.call(this, testContainer, expectedContainer, newArgs..., args..., next)
    next() unless options.async


class ScribeEditorTest extends ScribeHtmlTest
  @DEFAULTS:
    async         : true
    ignoreExpect  : true

  constructor: (options = {}) ->
    @settings = _.defaults(options, ScribeEditorTest.DEFAULTS)
    super(@settings)

  run: (name, options, args...) ->
    it(name, (done) =>
      this.runWithoutIt(options, args..., done)
    )

  runWithoutIt: (options, args..., done) ->
    console.assert(_.isObject(options), "Invalid options passed into run")
    @options = _.defaults(options, @settings)
    testEditor = expectedEditor = null
    htmlOptions = _.clone(@options)
    htmlOptions.initial = '' if Tandem.Delta.isDelta(htmlOptions.initial)
    htmlOptions.expected = '' if Tandem.Delta.isDelta(htmlOptions.expected)
    htmlOptions.fn = (testContainer, expectedContainer, args..., callback) =>
      async.map([testContainer, expectedContainer], (container, callback) =>
        editor = new Scribe.Editor(container, 
          onReady: _.once( ->
            _.defer( ->
              callback(null, editor)
            )
          )
        )
      , (err, editors) =>
        [testEditor, expectedEditor] = editors
        testEditor.setDelta(options.initial) if Tandem.Delta.isDelta(@options.initial)
        expectedEditor.setDelta(options.expected) if Tandem.Delta.isDelta(@options.expected)
        @options.fn.call(this, testEditor, expectedEditor, args...)
        callback()
      )
    htmlOptions.checker = (testContainer, expectedContainer, args...) =>
      @options.checker.call(this, testEditor, expectedEditor, args...)
      unless @options.ignoreExpect
        testDelta = testEditor.getDelta()
        expectedDelta = expectedEditor.getDelta()
        console.error testDelta, expectedDelta unless testDelta.isEqual(expectedDelta)
        expect(testEditor.getDelta()).to.deep.equal(expectedEditor.getDelta())
        consistent = Scribe.Debug.checkDocumentConsistency(testEditor.doc)
        expect(consistent).to.be.true
    super(htmlOptions, args..., done)

    

window.Scribe or= {}
window.Scribe.Test = 
  EditorTest  : ScribeEditorTest
  HtmlTest    : ScribeHtmlTest
