#= require mocha
#= require chai

describe('Array', ->
  describe('.push()', ->
    it('should append a value', ->
      arr = []
      arr.push('foo')
      arr.push('bar')
      expect(arr[0]).to.equal('foo')
      expect(arr[1]).to.equal('bar')
    )

    it('should return the length', ->
      arr = []
      n = arr.push('foo')
      expect(n).to.equal(1)
      n = arr.push('bar')
      expect(n).to.equal(2)
    )

    describe('with many arguments', ->
      it('should add the values', ->
        arr = []
        arr.push('foo', 'bar')
        expect(arr[0]).to.equal('foo')
        expect(arr[1]).to.equal('bar')
      )
    )
  )

  describe('.unshift()', ->
    it('should prepend a value', ->
      arr = [1,2,3]
      arr.unshift('foo')
      expect(arr[0]).to.equal('foo')
      expect(arr[1]).to.equal(1)
    )

    it('should return the length', ->
      arr = []
      n = arr.unshift('foo')
      expect(n).to.equal(1)
      n = arr.unshift('bar')
      expect(n).to.equal(2)
    )

    describe('with many arguments', ->
      it('should add the values', ->
        arr = []
        arr.unshift('foo', 'bar')
        expect(arr[0]).to.equal('foo')
        expect(arr[1]).to.equal('bar')
      )
    )
  )

  describe('.pop()', ->
    it('should remove and return the last value', ->
      arr = [1,2,3]
      expect(arr.pop()).to.equal(3)
      expect(arr.pop()).to.equal(2)
      expect(arr).to.have.length(1)
    )
  )

  describe('.shift()', ->
    it('should remove and return the first value', ->
      arr = [1,2,3]
      expect(arr.shift()).to.equal(1)
      expect(arr.shift()).to.equal(2)
      expect(arr).to.have.length(1)
    )
  )
)
