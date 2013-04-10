runHtmlTest = (name, initial, expected, fn, checker) ->
  it(name, ->
    initial = Scribe.Utils.cleanHtml(initial, true)
    expected = Scribe.Utils.cleanHtml(expected, true)
    testContainer = $('#test-container').html(initial)
    expectedContainer = $('#expected-container').html(expected)
    targetNode = $("#test-container #target").get(0)
    fn.call(null, testContainer.get(0), targetNode)
    testHtml = Scribe.Utils.cleanHtml(testContainer.html(), true)
    expectedHtml = Scribe.Utils.cleanHtml(expectedContainer.html(), true)
    expect(testHtml).to.equal(expectedHtml)
    checker.call(null, testContainer.get(0), targetNode) if _.isFunction(checker)
  )

buildString = (reference, arr) ->
  return _.map(arr, (elem) =>
    return if _.isNumber(elem) then reference[elem] else elem
  ).join('')


class ScribeLineTest
  @DEFAULTS:
    checker: ->
    fn: ->
    template: []

  constructor: (options) ->
    @settings = _.extend({}, ScribeHtmlTest.DEFAULTS, options)

  # String name, String initial, String expected
  run: (name, options, args...) ->
    runHtmlTest(name, "<div>#{options.initial}</div>", "<div>#{options.expected}</div>", (container, target) =>
      @settings.fn.call(null, container.firstChild, target, args...)
    )


class ScribeHtmlTest extends ScribeLineTest
  constructor: ->
    super

  # String name, [String|Number] initial, [String|Number]  expected
  # Integer elements in intial are indexes into the String in @template
  # Integer elements in expected are indexes into the String in initial
  run: (name, options, args...) ->
    initialHtml = buildString(@settings.template, options.initial)
    expectedHtml = buildString(options.initial, options.expected)
    runHtmlTest(name, initialHtml, expectedHtml, @settings.fn, @settings.checker)


class ScribeDeltaTest extends ScribeHtmlTest
  constructor: ->
    super

  run: (name, options, args...) ->
    it(name, =>
      if !Tandem.Delta.isDelta(options.initial)
        initialHtml = Scribe.Utils.cleanHtml(buildString(@settings.template, options.initial))
        $('#test-container').html(initialHtml)
      else
        $('#test-container').html('')
      if !Tandem.Delta.isDelta(options.expected)
        expectedHtml = Scribe.Utils.cleanHtml(buildString(@settings.template, options.expected))
        $('#expected-container').html(expectedHtml)
      else
        $('#expected-container').html('')
      testEditor = new Scribe.Editor('test-container')
      expectedEditor = new Scribe.Editor('expected-container')
      if Tandem.Delta.isDelta(options.initial)
        testEditor.setDelta(options.initial)
      if Tandem.Delta.isDelta(options.expected)
        expectedEditor.setDelta(options.expected)
      @settings.fn.call(null, testEditor)
      expect(testEditor.getDelta()).to.deep.equal(expectedEditor.getDelta())
      editorHtml = Scribe.Utils.cleanHtml(testEditor.root.innerHTML)
      expect(editorHtml, expectedHtml)
      consistent = Scribe.Debug.checkDocumentConsistency(testEditor.doc)
      expect(consistent).to.be.true
    )
    

window.Scribe or= {}
window.Scribe.Test = 
  DeltaTest:  ScribeDeltaTest
  HtmlTest:   ScribeHtmlTest
  LineTest:   ScribeLineTest
