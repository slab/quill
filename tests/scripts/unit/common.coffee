runIt = (name, initial, expected, target, fn) ->
  fn = target unless fn?
  it(name, ->
    initial = Scribe.Utils.cleanHtml(initial, true)
    expected = Scribe.Utils.cleanHtml(expected, true)
    testContainer = $('#test-container').html(initial)
    expectedContainer = $('#expected-container').html(expected)
    targetNode = $("#test-container ##{target}").get(0) if _.isString(target)
    fn.call(null, testContainer.get(0), targetNode)
    testHtml = Scribe.Utils.cleanHtml(testContainer.html(), true)
    expectedHtml = Scribe.Utils.cleanHtml(expectedContainer.html(), true)
    expect(testHtml).to.equal(expectedHtml)
  )

buildString = (reference, arr) ->
  return _.map(arr, (elem) =>
    return if _.isNumber(elem) then reference[elem] else elem
  ).join('')


class ScribeLineTest
  # Function fn(DOMNode, DOMNode)
  constructor: (@fn) ->

  # String name, String initial, String expected
  run: (name, initial, expected, args...) ->
    runIt(name, "<div>#{initial}</div>", "<div>#{expected}</div>", (container, target) =>
      @fn.apply(null, [container.firstChild, target].concat(args))
    )


class ScribeHtmlTest
  @DEFAULTS:
    target: null
    template: []

  # Function fn(DOMNode, DOMNode)
  constructor: (@fn, options) ->
    @settings = _.extend({}, ScribeHtmlTest.DEFAULTS, options)

  # String name, [String|Number] initial, [String|Number]  expected
  # Integer elements in intial are indexes into the String in @template
  # Integer elements in expected are indexes into the String in initial
  run: (name, initial, expected) ->
    initialHtml = buildString(@settings.template, initial)
    expectedHtml = buildString(initial, expected)
    runIt(name, initialHtml, expectedHtml, @settings.target, @fn)


class ScribeDeltaTest extends ScribeHtmlTest
  constructor: ->
    super

  run: (name, initial, expected) ->
    it(name, =>
      if !Tandem.Delta.isDelta(initial)
        initialHtml = Scribe.Utils.cleanHtml(buildString(@settings.template, initial))
        $('#test-container').html(initialHtml)
      if !Tandem.Delta.isDelta(expected)
        expectedHtml = Scribe.Utils.cleanHtml(buildString(@settings.template, expected))
        $('#expected-container').html(expectedHtml)
      testEditor = new Scribe.Editor('test-container')
      expectedEditor = new Scribe.Editor('expected-container')
      if Tandem.Delta.isDelta(initial)
        testEditor.setDelta(initial)
      if Tandem.Delta.isDelta(expected)
        expectedEditor.setDelta(expected)
      @fn.call(null, testEditor)
      expect(testEditor.getDelta()).to.deep.equal(expectedEditor.getDelta())
      consistent = Scribe.Debug.checkDocumentConsistency(testEditor.doc)
      expect(consistent).to.be.true
    )


window.Scribe or= {}
window.Scribe.Test = 
  DeltaTest:  ScribeDeltaTest
  HtmlTest:   ScribeHtmlTest
  LineTest:   ScribeLineTest
