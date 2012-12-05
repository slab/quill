# Tandem Operational Transform Engine - v0.1.0 - #2012-12-04
# https://www.stypi.com/
# Copyright (c) 2012
# Byron Milligan, Salesforce.com
# Jason Chen, Salesforce.com

if exports?
  _ = require('underscore')._
  diff_match_patch = require('../lib/diff_match_patch')
  dmp = new diff_match_patch.diff_match_patch
else
  _ = window._
  diff_match_patch = window.diff_match_patch
  diff_match_patch.DIFF_DELETE = -1
  diff_match_patch.DIFF_EQUAL = 0
  diff_match_patch.DIFF_INSERT = 1
  dmp = new diff_match_patch


class Op
  @compact: (ops) ->
    compacted = []
    _.each(Op.normalize(ops), (op) ->
      if compacted.length == 0
        compacted.push(op) unless RetainOp.isRetain(op) && op.start == op.end
      else
        if RetainOp.isRetain(op) && op.start == op.end
          return
        last = _.last(compacted)
        if Delta.isInsert(last) && Delta.isInsert(op) && last.attributesMatch(op)
          # If two neighboring inserts, combine
          last.value = last.value + op.value
        else if RetainOp.isRetain(last) && RetainOp.isRetain(op) && last.end == op.start && last.attributesMatch(op)
          # If two neighboring ranges first's end + 1 == second's start, combine
          last.end = op.end
        else
          # Cannot coalesce with previous
          compacted.push(op)
    )
    return compacted

  @normalize: (ops) ->
    normalizedOps = _.map(ops, (op) ->
      switch typeof op
        when 'string' then return new InsertOp(op)
        when 'number' then return new RetainOp(op, op + 1)
        when 'object'
          if op.value?
            return new InsertOp(op.value, op.attributes)
          else if op.start? && op.end?
            return new RetainOp(op.start, op.end, op.attributes)
        else
          return null
    )
    return _.reject(normalizedOps, (op) -> !op? || op.getLength() == 0)


  constructor: (attributes = {}) ->
    @attributes = _.clone(attributes)

  addAttributes: (attributes) ->
    addedAttributes = {}
    for key, value of attributes when @attributes[key] == undefined
      addedAttributes[key] = value
    return addedAttributes

  attributesMatch: (other) ->
    otherAttributes = other.attributes || {}
    return _.isEqual(@attributes, otherAttributes)

  composeAttributes: (attributes) ->
    that = this
    resolveAttributes = (oldAttrs, newAttrs) ->
      return oldAttrs if !newAttrs
      resolvedAttrs = _.clone(oldAttrs)
      for key, value of newAttrs
        if Delta.isInsert(that) && value == null
          delete resolvedAttrs[key]
        else if typeof value != 'undefined'
          if typeof resolvedAttrs[key] == 'object' and typeof value == 'object' and _.all([resolvedAttrs[key], newAttrs[key]], ((val) -> val != null))
            resolvedAttrs[key] = resolveAttributes(resolvedAttrs[key], value)
          else
            resolvedAttrs[key] = value
      return resolvedAttrs
    return resolveAttributes(@attributes, attributes)

  numAttributes: () ->
    _.keys(@attributes).length

  toString: ->
    printAttrs = (attrs) ->
      attr_str = ""
      for key, value of @attributes
        attr_str += key + ":"
        if typeof value == 'object' and value != null
          attr_str += "{" + printAttrs(value) + "},"
        else
          attr_str += value + ","
      return "{" + attr_str + "}"
    return printAttrs(@attributes)


# Used to represent retains in the delta. [inclusive, exclusive)
class RetainOp extends Op
  @copy: (subject) ->
    console.assert(RetainOp.isRetain(subject), "Copy called on non-retain", subject)
    return new RetainOp(subject.start, subject.end, subject.attributes)

  @isRetain: (r) ->
    return r? && typeof r.start == "number" && typeof r.end == "number"

  constructor: (@start, @end, attributes = {}) ->
    console.assert(@start >= 0, "RetainOp start cannot be negative!", @start)
    console.assert(@end >= @start, "RetainOp end must be >= start!", @start, @end)
    @attributes = _.clone(attributes)

  getAt: (start, length) ->
    return new RetainOp(@start + start, @start + start + length, @attributes)

  getLength: ->
    return @end - @start

  split: (offset) ->
    console.assert(offset <= @end, "Split called with offset beyond end of retain")
    left = new RetainOp(@start, @start + offset, @attributes)
    right = new RetainOp(@start + offset, @end, @attributes)
    return [left, right]

  toString: ->
    return "{{#{@start} - #{@end}), #{super()}}"


class InsertOp extends Op
  @copy: (subject) ->
    return new InsertOp(subject.value, subject.attributes)

  @isInsert: (i) ->
    return i? && typeof i.value == "string"

  constructor: (@value, attributes = {}) ->
    @attributes = _.clone(attributes)

  getAt: (start, length) ->
    return new InsertOp(@value.substr(start, length), @attributes)

  getLength: ->
    return @value.length

  join: (other) ->
    if _.isEqual(@attributes, other.attributes)
      return new InsertOp(@value + second.value, @attributes)
    else
      throw Error

  split: (offset) ->
    console.assert(offset <= @value.length, "Split called with offset beyond end of insert")
    left = new InsertOp(@value.substr(0, offset), @attributes)
    right = new InsertOp(@value.substr(offset), @attributes)
    return [left, right]

  toString: ->
    return "{#{@value}, #{super()}}"


class Delta
  @copy: (subject) ->
    changes = []
    for op in subject.ops
      if Delta.isRetain(op)
        changes.push(RetainOp.copy(op))
      else
        changes.push(InsertOp.copy(op))
    return new Delta(subject.startLength, subject.endLength, changes)

  @getIdentity: (length) ->
    delta = new Delta(length, length, [new RetainOp(0, length)])
    return delta

  @getInitial: (contents) ->
    return new Delta(0, contents.length, [new InsertOp(contents)])

  @isDelta: (delta) ->
    if (delta? && typeof delta == "object" && typeof delta.startLength == "number" &&
        typeof delta.endLength == "number" && typeof delta.ops == "object")
      for op in delta.ops
        if !Delta.isRetain(op) && !Delta.isInsert(op)
          return false
      return true
    return false

  @isInsert: (change) ->
    return InsertOp.isInsert(change)

  @isRetain: (change) ->
    return RetainOp.isRetain(change) || typeof(change) == "number"

  @makeDelta: (obj) ->
    return new Delta(obj.startLength, obj.endLength, obj.ops)

  constructor: (@startLength, @endLength, ops) ->
    unless ops?
      ops = @endLength
      @endLength = null
    @ops = Op.compact(ops)
    length = _.reduce(@ops, (count, op) ->
      return count + op.getLength()
    , 0)
    if @endLength?
      console.assert(length == @endLength, "Expecting end length of", length, this)
    else
      @endLength = length

  applyToText: (text) ->
    delta = this
    console.assert(text.length == delta.startLength, "Start length of delta: " + delta.startLength + " is not equal to the text: " + text.length)
    appliedText = []
    for elem in delta.ops
      if Delta.isInsert(elem)
        appliedText.push(elem.value)
      else
        appliedText.push(text.substring(elem.start, elem.end))
    result = appliedText.join("")
    if delta.endLength != result.length
      console.log "Delta", delta
      console.log "text", text
      console.log "result", result
      console.assert(false, "End length of delta: " + delta.endLength + " is not equal to result text: " + result.length )
    return result

  clearOpsCache: ->
    @savedOpOffset = @savedOpIndex = undefined

  # Inserts in deltaB are given priority. Retains in deltaB are indexes into A,
  # and we take whatever is there (insert or retain).
  compose: (deltaB) ->
    console.assert(Delta.isDelta(deltaB), "Compose called when deltaB is not a Delta, type: " + typeof deltaB)
    console.assert(@endLength == deltaB.startLength, "startLength #{deltaB.startLength} / endlength #{this.endLength} mismatch")

    deltaA = new Delta(@startLength, @endLength, Op.normalize(@ops))
    deltaB = new Delta(deltaB.startLength, deltaB.endLength, Op.normalize(deltaB.ops))

    composed = []
    for elem in deltaB.ops
      elem = new InsertOp(elem) if typeof elem == 'string'
      if Delta.isInsert(elem)
        composed.push(elem)
      else if Delta.isRetain(elem)
        opsInRange = deltaA.getOpsAt(elem.start, elem.end - elem.start)
        opsInRange = _.map(opsInRange, (op) ->
          if Delta.isInsert(op)
            return new InsertOp(op.value, op.composeAttributes(elem.attributes))
          else
            return new RetainOp(op.start, op.end, op.composeAttributes(elem.attributes))
        )
        composed = composed.concat(opsInRange)
      else
        console.assert(false, "Invalid op in deltaB when composing", deltaB)

    deltaC = new Delta(deltaA.startLength, deltaB.endLength, Op.compact(composed))
    console.assert(Delta.isDelta(deltaC), "Composed returning invalid Delta", deltaC)
    return deltaC

  # For each element in deltaC, compare it to the current element in deltaA in
  # order to construct deltaB. Given A and C, there is more than one valid B.
  # Its impossible to guarantee that decompose yields the actual B that was
  # used in the original composition. However, the function is deterministic in
  # which of the possible B's it chooses. How it works:
  # 1. Inserts in deltaC are matched against the current elem in deltaA. If
  #    there is a match, we create a corresponding retain in deltaB. Otherwise,
  #    we create an insertion in deltaB.
  # 2. Retains in deltaC become retains in deltaB, which reference the original
  #    retain in deltaA.
  decompose: (deltaA) ->
    deltaC = this
    console.assert(Delta.isDelta(deltaA), "Decompose2 called when deltaA is not a Delta, type: " + typeof deltaA)
    console.assert(deltaA.startLength == @startLength, "startLength #{deltaA.startLength} / startLength #{@startLength} mismatch")
    console.assert(_.all(deltaA.ops, ((op) -> return op.value?)), "DeltaA has retain in decompose")
    console.assert(_.all(deltaC.ops, ((op) -> return op.value?)), "DeltaC has retain in decompose")

    decomposeAttributes = (attrA, attrC) ->
      decomposedAttributes = {}
      for key, value of attrC
        if attrA[key] == undefined or attrA[key] != value
          if attrA[key] != null and typeof attrA[key] == 'object' and value != null and typeof value == 'object'
            decomposedAttributes[key] = decomposeAttributes(attrA[key], value)
          else
            decomposedAttributes[key] = value
      for key, value of attrA
        if attrC[key] == undefined
          decomposedAttributes[key] = null
      return decomposedAttributes

    insertDelta = deltaA.diff(deltaC)
    ops = []
    offset = 0
    _.each(insertDelta.ops, (op) ->
      opsInC = deltaC.getOpsAt(offset, op.getLength())
      offsetC = 0
      _.each(opsInC, (opInC) ->
        if Delta.isInsert(op)
          d = new InsertOp(op.value.substring(offsetC, offsetC + opInC.getLength()), opInC.attributes)
          ops.push(d)
        else if Delta.isRetain(op)
          opsInA = deltaA.getOpsAt(op.start + offsetC, opInC.getLength())
          offsetA = 0
          _.each(opsInA, (opInA) ->
            attributes = decomposeAttributes(opInA.attributes, opInC.attributes)
            start = op.start + offsetA + offsetC
            e = new RetainOp(start, start + opInA.getLength(), attributes)
            ops.push(e)
            offsetA += opInA.getLength()
          )
        else
          console.error("Invalid delta in deltaB when composing", deltaB)
        offsetC += opInC.getLength()
      )
      offset += op.getLength()
    )

    deltaB = new Delta(insertDelta.startLength, insertDelta.endLength, Op.compact(ops))
    return deltaB

  diff: (other) ->
    diffToDelta = (diff) ->
      console.assert(diff.length > 0, "diffToDelta called with diff with length <= 0")
      originalLength = 0
      finalLength = 0
      ops = []
      # For each difference apply them separately so we do not disrupt the cursor
      for [operation, value] in diff
        switch operation
          when diff_match_patch.DIFF_DELETE
            # Deletes implied
            originalLength += value.length
          when diff_match_patch.DIFF_INSERT
            ops.push(new InsertOp(value))
            finalLength += value.length
          when diff_match_patch.DIFF_EQUAL
            ops.push(new RetainOp(originalLength, originalLength + value.length))
            originalLength += value.length
            finalLength += value.length
      return new Delta(originalLength, finalLength, ops)

    deltaToText = (delta) ->
      return _.map(delta.ops, (op) ->
        return if op.value? then op.value else ""
      ).join('')

    diffTexts = (oldText, newText) ->
      diff = dmp.diff_main(oldText, newText)
      if (diff.length > 2)
        dmp.diff_cleanupEfficiency(diff)
      return diff

    textA = deltaToText(this)
    textC = deltaToText(other)
    unless textA == '' and textC == ''
      diff = diffTexts(textA, textC)
      insertDelta = diffToDelta(diff)
    else
      insertDelta = new Delta(0, 0, [])
    return insertDelta

  # We compute the follow according to the following rules:
  # 1. Insertions in deltaA become retained characters in the follow set
  # 2. Insertions in deltaB become inserted characters in the follow set
  # 3. Characters retained in deltaA and deltaB become retained characters in
  #    the follow set
  follows: (deltaA, aIsRemote) ->
    deltaB = this
    console.assert(Delta.isDelta(deltaA), "Follows called when deltaA is not a Delta, type: " + typeof deltaA, deltaA)
    console.assert(aIsRemote?, "Remote delta not specified")

    deltaA = new Delta(deltaA.startLength, deltaA.endLength, Op.normalize(deltaA.ops))
    deltaB = new Delta(deltaB.startLength, deltaB.endLength, Op.normalize(deltaB.ops))
    followStartLength = deltaA.endLength
    followSet = []
    indexA = indexB = 0 # Tracks character offset in the 'document'
    elemIndexA = elemIndexB = 0 # Tracks offset into the ops list
    while elemIndexA < deltaA.ops.length and elemIndexB < deltaB.ops.length
      elemA = deltaA.ops[elemIndexA]
      elemB = deltaB.ops[elemIndexB]

      if Delta.isInsert(elemA) and Delta.isInsert(elemB)
        length = Math.min(elemA.getLength(), elemB.getLength())
        if aIsRemote
          followSet.push(new RetainOp(indexA, indexA + length))
          indexA += length
          if length == elemA.getLength()
            elemIndexA++
          else
            console.assert(length < elemA.getLength())
            deltaA.ops[elemIndexA] = _.last(elemA.split(length))
        else
          followSet.push(_.first(elemB.split(length)))
          indexB += length
          if length == elemB.getLength()
            elemIndexB++
          else
            deltaB.ops[elemIndexB] = _.last(elemB.split(length))

      else if Delta.isRetain(elemA) and Delta.isRetain(elemB)
        if elemA.end < elemB.start
          # Not a match, can't save. Throw away lower and adv.
          indexA += elemA.getLength()
          elemIndexA++
        else if elemB.end < elemA.start
          # Not a match, can't save. Throw away lower and adv.
          indexB += elemB.getLength()
          elemIndexB++
        else
          # A subrange or the entire range matches
          if elemA.start < elemB.start
            indexA += elemB.start - elemA.start
            elemA = deltaA.ops[elemIndexA] = new RetainOp(elemB.start, elemA.end, elemA.attributes)
          else if elemB.start < elemA.start
            indexB += elemA.start - elemB.start
            elemB = deltaB.ops[elemIndexB] = new RetainOp(elemA.start, elemB.end, elemB.attributes)

          console.assert(elemA.start == elemB.start, "RetainOps must have same
          start length when propagating into followset", elemA, elemB)
          length = Math.min(elemA.end, elemB.end) - elemA.start
          addedAttributes = elemA.addAttributes(elemB.attributes)
          followSet.push(new RetainOp(indexA, indexA + length, addedAttributes)) # Keep the retain
          indexA += length
          indexB += length
          if (elemA.end == elemB.end)
            elemIndexA++
            elemIndexB++
          else if (elemA.end < elemB.end)
            elemIndexA++
            deltaB.ops[elemIndexB] = _.last(elemB.split(length))
          else
            deltaA.ops[elemIndexA] = _.last(elemA.split(length))
            elemIndexB++

      else if Delta.isInsert(elemA) and Delta.isRetain(elemB)
        followSet.push(new RetainOp(indexA, indexA + elemA.getLength()))
        indexA += elemA.getLength()
        elemIndexA++
      else if Delta.isRetain(elemA) and Delta.isInsert(elemB)
        followSet.push(elemB)
        indexB += elemB.getLength()
        elemIndexB++
      else
        console.warn("Mismatch. elemA is: " + typeof(elemA) + ", elemB is:  " + typeof(elemB))

    # Remaining loops account for different length ops, only inserts will be
    # accepted
    while elemIndexA < deltaA.ops.length
      elemA = deltaA.ops[elemIndexA]
      followSet.push(new RetainOp(indexA, indexA + elemA.getLength())) if Delta.isInsert(elemA) # retain elemA
      indexA += elemA.getLength()
      elemIndexA++

    while elemIndexB < deltaB.ops.length
      elemB = deltaB.ops[elemIndexB]
      followSet.push(elemB) if Delta.isInsert(elemB) # insert elemB
      indexB += elemB.getLength()
      elemIndexB++

    followEndLength = 0
    for elem in followSet
      followEndLength += elem.getLength()

    follow = new Delta(followStartLength, followEndLength, Op.compact(followSet))
    console.assert(Delta.isDelta(follow), "Follows returning invalid Delta", follow)
    return follow

  getOpsAt: (index, length) ->
    changes = []
    if @savedOpOffset? and @savedOpOffset < index
      offset = @savedOpOffset
    else
      offset = @savedOpOffset = @savedOpIndex = 0
    for op in @ops.slice(@savedOpIndex)
      break if offset >= index + length
      opLength = op.getLength()
      if index < offset + opLength
        start = Math.max(index - offset, 0)
        getLength = Math.min(opLength - start, index + length - offset - start)
        changes.push(op.getAt(start, getLength))
      offset += opLength
      @savedOpIndex += 1
      @savedOpOffset += opLength
    return changes

  isIdentity: ->
    if @startLength == @endLength
      if @ops.length == 0
        return true
      index = 0
      for op in @ops
        if !RetainOp.isRetain(op) then return false
        if op.start != index then return false
        if !(op.numAttributes() == 0 || (op.numAttributes() == 1 && _.has(op.attributes, 'authorId')))
          return false
        index = op.end
      if index != @endLength then return false
      return true
    return false

  toString: ->
    return "{(#{@startLength}->#{@endLength})[#{@ops.join(', ')}]}"


# Expose this code to other files
root = if (typeof exports != "undefined" && exports != null) then exports else window
root.Tandem = {
  Delta: Delta
  Op: Op
  InsertOp: InsertOp
  RetainOp: RetainOp
}
