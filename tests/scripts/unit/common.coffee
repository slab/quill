buildString = (reference, arr) ->
  return _.map(arr, (elem) =>
    return if _.isNumber(elem) then reference[elem] else elem
  ).join('')


class ScribeHtmlTest
  @DEFAULTS:
    checker  : ->
    fn       : ->
    initial  : []
    expected : []

  constructor: (options) ->
    @settings = _.extend({}, ScribeHtmlTest.DEFAULTS, options)

  run: (name, options, args...) ->
    options = _.extend({}, @settings, options)
    options.initial = options.initial.join('') if _.isArray(options.initial)
    options.expected = buildString(options.initial, options.expected or @settings.expected)
    it(name, ->
      options.initial = Scribe.Utils.cleanHtml(options.initial, true)
      options.expected = Scribe.Utils.cleanHtml(options.expected, true)
      testContainer = $('#test-container').html(options.initial).get(0)
      expectedContainer = $('#expected-container').html(options.expected).get(0)
      targetNode = $("#test-container #target").get(0)
      options.fn.call(null, testContainer, expectedContainer, targetNode, args...)
      testHtml = Scribe.Utils.cleanHtml(testContainer.innerHTML, true)
      expectedHtml = Scribe.Utils.cleanHtml(expectedContainer.innerHTML, true)
      expect(testHtml).to.equal(expectedHtml)
      options.checker.call(null, testContainer, expectedContainer, targetNode, args...)
    )


class ScribeEditorTest extends ScribeHtmlTest
  constructor: ->
    super

  run: (name, options, args...) ->
    options = _.extend({}, @settings, options)
    savedOptions = _.clone(options)
    options.initial = '' if Tandem.Delta.isDelta(options.initial)
    options.expected = '' if Tandem.Delta.isDelta(options.expected)
    testEditor = null
    expectedEditor = null
    options.fn = (testContainer, expectedContainer, target, args...) ->
      testEditor = new Scribe.Editor(testContainer)
      expectedEditor = new Scribe.Editor(expectedContainer)
      testEditor.applyDelta(savedOptions.initial) if Tandem.Delta.isDelta(savedOptions.initial)
      expectedEditor.applyDelta(savedOptions.expected) if Tandem.Delta.isDelta(savedOptions.expected)
      savedOptions.fn.call(null, testEditor, expectedEditor, args...)
    options.checker = (testContainer, expectedContainer, target, args...) ->
      savedOptions.checker.call(null, testEditor, expectedEditor, args...)
      testHtml = Scribe.Utils.cleanHtml(testEditor.root.innerHTML)
      expectedHtml = Scribe.Utils.cleanHtml(expectedEditor.root.innerHTML)
      expect(testHtml).to.equal(expectedHtml)
      expect(testEditor.getDelta()).to.deep.equal(expectedEditor.getDelta())
      consistent = Scribe.Debug.checkDocumentConsistency(testEditor.doc)
      expect(consistent).to.be.true
    super(name, options, args...)
    

window.Scribe or= {}
window.Scribe.Test = 
  DeltaTest:  ScribeEditorTest
  HtmlTest:   ScribeHtmlTest
