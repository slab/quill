Selection = require('../../../src/selection')


describe('Selection', ->
  describe('Range', ->
    describe('shift()', ->
      tests =
        'before':
          initial: [10, 20]
          index: 5, length: 5
          expected: [15, 25]
        'between':
          initial: [10, 20]
          index: 15, length: 2
          expected: [10, 22]
        'after':
          initial: [10, 20]
          index: 25, length: 5
          expected: [10, 20]
        'on cursor':
          initial: [10, 10]
          index: 10, length: 5
          expected: [15, 15]
        'on start':
          initial: [10, 20]
          index: 10, length: 5
          expected: [15, 25]
        'on end':
          initial: [10, 20]
          index: 20, length: 5
          expected: [10, 25]
        'between remove':
          initial: [10, 20]
          index: 15, length: -2
          expected: [10, 18]
        'before remove beyond start':
          initial: [10, 20]
          index: 5, length: -10
          expected: [5, 10]
        'after remove':
          initial: [10, 20]
          index: 25, length: -20
          expected: [10, 20]
        'remove on cursor':
          initial: [10, 10]
          index: 10, length: -5
          expected: [10, 10]
        'after remove beyond start':
          initial: [10, 10]
          index: 5, length: -50
          expected: [5, 5]

      _.each(tests, (test, name) ->
        it(name, ->
          range = new Selection.Range(test.initial[0], test.initial[1])
          range.shift(test.index, test.length)
          expect(range.start).toEqual(test.expected[0])
          expect(range.end).toEqual(test.expected[1])
        )
      )
    )
  )
)
