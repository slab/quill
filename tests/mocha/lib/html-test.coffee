buildString = (reference, arr) ->
  return _.map(arr, (elem) =>
    return if _.isNumber(elem) then reference[elem] else elem
  ).join('')


class ScribeHtmlTest
  @DEFAULTS:
    checker       : ->
    fn            : ->
    initial       : []
    expected      : []
    ignoreExpect  : false
    pre           : -> []

  @cleanHtml: (html, keepIdClass = false) ->
    html = Scribe.Normalizer.normalizeHtml(html)
    unless keepIdClass == true
      html = html.replace(/\ (class|id)="[a-z0-9\-_]+"/gi, '')
      html = html.replace(/\ (class|id)=[a-z0-9\-_]+ /gi, '')
      html = html.replace(/\ (class|id)=[a-z0-9\-_]+>/gi, '>')
    return html

  constructor: (options = {}) ->
    throw new Error("Invalid options passed into constructor") unless _.isObject(options)
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
    options.initial = ScribeHtmlTest.cleanHtml(options.initial, true)
    options.expected = ScribeHtmlTest.cleanHtml(options.expected, true)
    testContainer = $('#test-container').html(options.initial).get(0)
    expectedContainer = $('#expected-container').html(options.expected).get(0)
    newArgs = options.pre.call(this, testContainer, expectedContainer)
    newArgs = [newArgs] unless _.isArray(newArgs)
    options.fn.call(null, testContainer, expectedContainer, newArgs..., args...)
    testHtml = ScribeHtmlTest.cleanHtml(testContainer.innerHTML)
    expectedHtml = ScribeHtmlTest.cleanHtml(expectedContainer.innerHTML)
    expect(testHtml).to.equal(expectedHtml) unless options.ignoreExpect
    options.checker.call(null, testContainer, expectedContainer, newArgs..., args..., ->
      done()
    )
    done() if options.checker.length <= newArgs.length + args.length + 2


module.exports = ScribeHtmlTest
