# This library contains the synchronization code for clients' edits.
dmp = new diff_match_patch
diff_match_patch.DIFF_DELETE = -1
diff_match_patch.DIFF_INSERT = 1
diff_match_patch.DIFF_EQUAL = 0

class JetDeltaItem
  constructor: (@attributes = {})

  addAttributes: (attributes) ->
    addedAttributes = {}
    for key, value of attributes
      if @attributes[key] == undefined
        addedAttributes[key] = value
    return addedAttributes

  attributesMatch: (other) ->
    otherAttributes = other.attributes || {}
    return _.isEqual(@attributes, otherAttributes)

  composeAttributes: (attributes) ->
    return if !attributes?
    for key, value of attributes
      if JetDelta.isInsert(this) && value == null
        delete @attributes[key]
      else if typeof value != 'undefined'
        @attributes[key] = value

  numAttributes: () ->
    _.keys(@attributes).length

  toString: ->
    attr_str = ""
    for key,value of @attributes
      attr_str += "#{key}: #{value}, "
    return "{#{attr_str}}"

# Used to represent retains in the delta. [inclusive, exclusive)
class JetRetain extends JetDeltaItem
  constructor: (@start, @end, @attributes = {}) ->
    console.assert(@start >= 0, "JetRetain start cannot be negative!", @start)
    console.assert(@end >= @start, "JetRetain end must be >= start!", @start, @end)

  @copy: (subject) ->
    console.assert(JetRetain.isRetain(subject), "Copy called on non-retain", subject)
    attributes = _.clone(subject.attributes)
    return new JetRetain(subject.start, subject.end, attributes)

  # True if this retain contains part or all of other.
  contains: (other) ->
    return @start <= other.start and @end >= other.start

  getLength: ->
    return @end - @start

  toString: ->
    return "{{#{@start} - #{@end}), #{super()}}"

  @isRetain: (r) ->
    return r? && typeof r.start == "number" && typeof r.end == "number"


class JetInsert extends JetDeltaItem
  constructor: (@text, @attributes = {}) ->
    # console.assert(@text.length > 0)

  @copy: (subject) ->
    attributes = _.clone(subject.attributes)
    return new JetInsert(subject.text, attributes)

  getLength: ->
    return @text.length

  toString: ->
    return "{#{@text}, #{super()}}"

  @isInsert: (i) ->
    return i? && typeof i.text == "string"


class JetDelta
  constructor: (@startLength, @endLength, @deltas, skipNormalizing = false) ->
    if !skipNormalizing
      this.normalizeChanges()
      length = 0
      for delta in @deltas
        length += delta.getLength()
      console.assert(length == @endLength, "Given end length is incorrect", this)

  isIdentity: ->
    if @startLength == @endLength
      if @deltas.length == 0
        return true
      index = 0
      for delta in @deltas
        if !JetRetain.isRetain(delta) then return false
        if delta.start != index then return false
        if !(delta.numAttributes() == 0 || (delta.numAttributes() == 1 && _.has(delta.attributes, 'authorId')))
          return false
        index = delta.end
      if index != @endLength then return false
      return true
    return false

  normalizeChanges: ->
    return if @deltas.length == 0
    for i in [0..@deltas.length - 1]
      switch typeof @deltas[i]
        when 'string' then @deltas[i] = new JetInsert(@deltas[i])
        when 'number' then @deltas[i] = new JetRetain(@deltas[i], @deltas[i] + 1)
        when 'object'
          if @deltas[i].text?
            @deltas[i] = new JetInsert(@deltas[i].text, @deltas[i].attributes)
          else if @deltas[i].start? && @deltas[i].end?
            @deltas[i] = new JetRetain(@deltas[i].start, @deltas[i].end, @deltas[i].attributes)
      @deltas[i].attributes = {} unless @deltas[i].attributes?
    @deltas = _.reject(@deltas, (delta) -> delta.getLength() == 0)

  compact: ->
    this.normalizeChanges()
    compacted = []
    for delta in @deltas
      if compacted.length == 0
        compacted.push(delta) unless JetRetain.isRetain(delta) && delta.start == delta.end
      else
        if JetRetain.isRetain(delta) && delta.start == delta.end
          continue
        last = _.last(compacted)
        if JetDelta.isInsert(last) && JetDelta.isInsert(delta) && last.attributesMatch(delta)
          # If two neighboring inserts, combine
          last.text = last.text + delta.text
        else if JetRetain.isRetain(last) && JetRetain.isRetain(delta) && last.end == delta.start && last.attributesMatch(delta)
          # If two neighboring ranges first's end + 1 == second's start, combine
          last.end = delta.end
        else
          # Cannot coalesce with previous
          compacted.push(delta)
    @deltas = compacted

  getDeltasAt: (start, length) ->
    changes = []
    index = 0
    if typeof length == 'undefined'
      if typeof start == 'number'
        range = new JetRetain(start, start + 1)
      else
        range = JetRetain.copy(start)
    else
      range = new JetRetain(start, start + length)
    for delta in @deltas
      if range.start == range.end then break
      console.assert(JetDelta.isRetain(delta) || JetDelta.isInsert(delta), "Invalid change in delta", this)
      length = delta.getLength()
      if index <= range.start && range.start < index + length
        start = Math.max(index, range.start)
        end = Math.min(index + length, range.end)
        if JetDelta.isInsert(delta)
          changes.push(new JetInsert(delta.text.substring(start - index, end -
            index), _.clone(delta.attributes)))
        else
          changes.push(new JetRetain(start - index + delta.start, end - index +
            delta.start, _.clone(delta.attributes)))
        range.start = end
      index += length
    return changes

  getDocIndex: (elemIndex) ->
    return _.reduce(@deltas.slice(0, elemIndex), (length, elem) ->
      return length + elem.getLength()
    , 0)

  getElemIndexAndOffset: (docIndex) ->
    console.assert docIndex < @endLength, "docIndex of length #{docIndex} is
      greater than or equal to delta length #{@endLength}"
    count = 0
    elemIndex = 0
    for elem in @deltas
      if count + elem.getLength() > docIndex
        offset = docIndex - count
        return [elemIndex, offset]
      elemIndex += 1
      count += elem.getLength()

  @copy: (subject) ->
    changes = []
    for delta in subject.deltas
      if JetDelta.isRetain(delta)
        changes.push(JetRetain.copy(delta))
      else
        changes.push(JetInsert.copy(delta))
    return new JetDelta(subject.startLength, subject.endLength, changes, true)

  @getInitial: (contents) ->
    return new JetDelta(0, contents.length, [new JetInsert(contents)])

  @getIdentity: (length) ->
    delta = new JetDelta(length, length, [new JetRetain(0, length)])
    return delta

  @isDelta: (delta) ->
    if (delta? && typeof delta == "object" && typeof delta.startLength == "number" &&
        typeof delta.endLength == "number" && typeof delta.deltas == "object")
      for delta in delta.deltas
        if !JetDelta.isRetain(delta) && !JetDelta.isInsert(delta)
          return false
      return true
    return false

  @makeDelta: (obj, skipNormalizing = false) ->
    return new JetDelta(obj.startLength, obj.endLength, obj.deltas, skipNormalizing)

  @isInsert: (change) ->
    return JetInsert.isInsert(change)

  @isRetain: (change) ->
    return JetRetain.isRetain(change) || typeof(change) == "number"

  toString: ->
    return "{(#{@startLength}->#{@endLength})[#{@deltas.join(', ')}]}"

JetSync =
  # Inserts in deltaB are given priority. Retains in deltaB are indexes into A,
  # and we take whatever is there (insert or retain).
  compose: (deltaA, deltaB) ->
    console.assert(JetDelta.isDelta(deltaA), "Compose called when deltaA is not a JetDelta, type: " + typeof deltaA)
    console.assert(JetDelta.isDelta(deltaB), "Compose called when deltaB is not a JetDelta, type: " + typeof deltaB)
    console.assert(deltaA.endLength == deltaB.startLength, "startLength #{deltaB.startLength} / endlength #{deltaA.endLength} mismatch")

    deltaA = JetDelta.copy(deltaA)
    deltaB = JetDelta.copy(deltaB)
    deltaA.normalizeChanges()
    deltaB.normalizeChanges()

    composed = []
    for elem in deltaB.deltas
      elem = new JetInsert(elem) if typeof elem == 'string'
      if JetDelta.isInsert(elem)
        composed.push(elem)
      else if JetDelta.isRetain(elem)
        deltasInRange = deltaA.getDeltasAt(elem)
        for delta in deltasInRange
          delta.composeAttributes(elem.attributes)
        composed = composed.concat(deltasInRange)
      else
        console.assert(false, "Invalid delta in deltaB when composing", deltaB)
    deltaC = new JetDelta(deltaA.startLength, deltaB.endLength, composed)
    deltaC.compact()
    console.assert(JetDelta.isDelta(deltaC), "Composed returning invalid JetDelta", deltaC)
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
  decompose: (deltaA, deltaC) ->
    console.assert(JetDelta.isDelta(deltaA), "Decompose2 called when deltaA is not a JetDelta, type: " + typeof deltaA)
    console.assert(JetDelta.isDelta(deltaC), "Decompose2 called when deltaC is not a JetDelta, type: " + typeof deltaC)
    console.assert(deltaA.startLength == deltaC.startLength, "startLength #{deltaA.startLength} / startLength #{deltaC.startLength} mismatch")
    console.assert(_.all(deltaA.deltas, ((delta) -> return delta.text?)), "DeltA has retain in decompose")
    console.assert(_.all(deltaC.deltas, ((delta) -> return delta.text?)), "DeltC has retain in decompose")


    decomposeAttributes = (attrA, attrC) ->
      decomposedAttributes = {}
      for key, value of attrC
        if attrA[key] == undefined or attrA[key] != value
          decomposedAttributes[key] = value
      for key, value of attrA
        if attrC[key] == undefined
          decomposedAttributes[key] = null
      return decomposedAttributes

    deltaToText = (delta) ->
      return _.map(delta.deltas, (delta) ->
        return if delta.text? then delta.text else ""
      ).join('')

    diffTexts = (oldText, newText) ->
      diff = dmp.diff_main(oldText, newText)
      if (diff.length > 2)
        dmp.diff_cleanupSemantic(diff)
        dmp.diff_cleanupEfficiency(diff)
      return diff

    diffToDelta = (diff) ->
      console.assert(diff.length > 0, "diffToDelta called with diff with length <= 0")
      originalLength = 0
      finalLength = 0
      deltas = []
      # For each difference apply them separately so we do not disrupt the cursor
      for [operation, value] in diff
        switch operation
          when diff_match_patch.DIFF_DELETE
            # Deletes implied
            originalLength += value.length
          when diff_match_patch.DIFF_INSERT
            deltas.push(new JetInsert(value))
            finalLength += value.length
          when diff_match_patch.DIFF_EQUAL
            deltas.push(new JetRetain(originalLength, originalLength + value.length))
            originalLength += value.length
            finalLength += value.length
      return new JetDelta(originalLength, finalLength, deltas)

    textA = deltaToText(deltaA)
    textC = deltaToText(deltaC)
    unless textA == '' and textC == ''
      diff = diffTexts(textA, textC)
      insertDelta = diffToDelta(diff)
    else
      insertDelta = new JetDelta(0, 0, [])
    deltas = []
    offset = 0
    _.each(insertDelta.deltas, (delta) ->
      deltasInC = deltaC.getDeltasAt(offset, delta.getLength())
      offsetC = 0
      _.each(deltasInC, (deltaInC) ->
        if JetDelta.isInsert(delta)
          d = new JetInsert(delta.text.substring(offsetC, deltaInC.getLength()), deltaInC.attributes)
          deltas.push(d)
        else if JetDelta.isRetain(delta)
          deltasInA = deltaA.getDeltasAt(delta.start + offsetC, deltaInC.getLength())
          offsetA = 0
          _.each(deltasInA, (deltaInA) ->
            attributes = decomposeAttributes(deltaInA.attributes, deltaInC.attributes)
            start = delta.start + offsetA + offsetC
            e = new JetRetain(start, start + deltaInA.getLength(), attributes)
            deltas.push(e)
            offsetA += deltaInA.getLength()
          )
        else
          console.error("Invalid delta in deltaB when composing", deltaB)
        offsetC += deltaInC.getLength()
      )
      offset += delta.getLength()
    )

    deltaB = new JetDelta(insertDelta.startLength, insertDelta.endLength, deltas)
    deltaB.compact()
    return deltaB



  # We compute the follow according to the following rules:
  # 1. Insertions in deltaA become retained characters in the follow set
  # 2. Insertions in deltaB become inserted characters in the follow set
  # 3. Characters retained in deltaA and deltaB become retained characters in
  #    the follow set
  follows: (deltaA, deltaB, aIsRemote) ->
    console.assert(JetDelta.isDelta(deltaA), "Follows called when deltaA is not a JetDelta, type: " + typeof deltaA, deltaA)
    console.assert(JetDelta.isDelta(deltaB), "Follows called when deltaB is not a JetDelta, type: " + typeof deltaB, deltaB)
    console.assert(aIsRemote?, "Remote delta not specified")

    deltaA = JetDelta.copy(deltaA)
    deltaB = JetDelta.copy(deltaB)
    deltaA.normalizeChanges()
    deltaB.normalizeChanges()
    followStartLength = deltaA.endLength
    followSet = []
    indexA = indexB = 0 # Tracks character offset in the 'document'
    elemIndexA = elemIndexB = 0 # Tracks offset into the deltas list
    while elemIndexA < deltaA.deltas.length and elemIndexB < deltaB.deltas.length
      elemA = deltaA.deltas[elemIndexA]
      elemB = deltaB.deltas[elemIndexB]

      if JetDelta.isInsert(elemA) and JetDelta.isInsert(elemB)
        length = Math.min(elemA.getLength(), elemB.getLength())
        if aIsRemote
          followSet.push(new JetRetain(indexA, indexA + length))
          indexA += length
          if length == elemA.getLength()
            elemIndexA++
          else
            console.assert(length < elemA.getLength())
            deltaA.deltas[elemIndexA] = new JetInsert(elemA.text.substring(length), elemA.attributes)
        else
          followSet.push(new JetInsert(elemB.text.substring(0, length), elemB.attributes))
          indexB += length
          if length == elemB.getLength()
            elemIndexB++
          else
            deltaB.deltas[elemIndexB] = new JetInsert(elemB.text.substring(length), elemB.attributes)

      else if JetDelta.isRetain(elemA) and JetDelta.isRetain(elemB)
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
            elemA = deltaA.deltas[elemIndexA] = new JetRetain(elemB.start, elemA.end, elemA.attributes)
          else if elemB.start < elemA.start
            indexB += elemA.start - elemB.start
            elemB = deltaB.deltas[elemIndexB] = new JetRetain(elemA.start, elemB.end, elemB.attributes)

          console.assert(elemA.start == elemB.start, "JetRetains must have same
          start length when propagating into followset", elemA, elemB)
          length = Math.min(elemA.end, elemB.end) - elemA.start
          addedAttributes = elemA.addAttributes(elemB.attributes)
          followSet.push(new JetRetain(indexA, indexA + length, addedAttributes)) # Keep the retain
          indexA += length
          indexB += length
          if (elemA.end == elemB.end)
            elemIndexA++
            elemIndexB++
          else if (elemA.end < elemB.end)
            elemIndexA++
            deltaB.deltas[elemIndexB] = new JetRetain(elemB.start + length, elemB.end, elemB.attributes)
          else
            deltaA.deltas[elemIndexA] = new JetRetain(elemA.start + length, elemA.end, elemA.attributes)
            elemIndexB++

      else if JetDelta.isInsert(elemA) and JetDelta.isRetain(elemB)
        followSet.push(new JetRetain(indexA, indexA + elemA.getLength()))
        indexA += elemA.getLength()
        elemIndexA++
      else if JetDelta.isRetain(elemA) and JetDelta.isInsert(elemB)
        followSet.push(elemB)
        indexB += elemB.getLength()
        elemIndexB++
      else
        console.warn("Mismatch. elemA is: " + typeof(elemA) + ", elemB is:  " + typeof(elemB))

    # Remaining loops account for different length deltas, only inserts will be
    # accepted
    while elemIndexA < deltaA.deltas.length
      elemA = deltaA.deltas[elemIndexA]
      followSet.push(new JetRetain(indexA, indexA + elemA.getLength())) if JetDelta.isInsert(elemA) # retain elemA
      indexA += elemA.getLength()
      elemIndexA++

    while elemIndexB < deltaB.deltas.length
      elemB = deltaB.deltas[elemIndexB]
      followSet.push(elemB) if JetDelta.isInsert(elemB) # insert elemB
      indexB += elemB.getLength()
      elemIndexB++

    followEndLength = 0
    for elem in followSet
      followEndLength += elem.getLength()

    follow = new JetDelta(followStartLength, followEndLength, followSet, true)
    follow.compact()
    console.assert(JetDelta.isDelta(follow), "Follows returning invalid JetDelta", follow)
    return follow

  applyDeltaToText: (delta, text) ->
    console.assert(text.length == delta.startLength, "Start length of delta: " + delta.startLength + " is not equal to the text: " + text.length)
    appliedText = []
    for elem in delta.deltas
      if JetDelta.isInsert(elem)
        appliedText.push(elem.text)
      else
        appliedText.push(text.substring(elem.start, elem.end))
    result = appliedText.join("")
    if delta.endLength != result.length
      console.log "Delta", delta
      console.log "text", text
      console.log "result", result
      console.assert(false, "End length of delta: " + delta.endLength + " is not equal to result text: " + result.length )
    return result

# Expose this code to other files
root = if (typeof exports != "undefined" && exports != null) then exports else window
root.JetRetain = JetRetain
root.JetInsert = JetInsert
root.JetDelta = JetDelta
root.JetSync = JetSync