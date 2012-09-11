# This library contains the synchronization code for clients' edits.

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
    for attribute, value of @attributes
      if otherAttributes[attribute] != value
        return false
    for attribute, value of otherAttributes
      if @attributes[attribute] != value
        return false
    return true

  composeAttributes: (attributes) ->
    return if !attributes?
    for key, value of attributes
      if value?
        @attributes[key] = value
      else
        delete @attributes[key]

  numAttributes: () ->
    (key for key of @attributes).length

  toString: ->
    attr_str = ""
    for key,value of @attributes
      attr_str += "#{key}: #{value}, "
    return "{#{attr_str}}"

  @copyAttributes: (deltaItem) ->
    attributes = {}
    for attribute, value of deltaItem.attributes
      attributes[attribute] = value
    return attributes


# Used to represent retains in the delta. [inclusive, exclusive)
class JetRetain extends JetDeltaItem
  constructor: (@start, @end, @attributes = {}) ->
    console.assert(@start >= 0, "JetRetain start cannot be negative!", @start)
    console.assert(@end >= @start, "JetRetain end must be >= start!", @start, @end)

  @copy: (subject) ->
    console.assert(JetRetain.isRetain(subject), "Copy called on non-retain", subject)
    attributes = JetDeltaItem.copyAttributes(subject)
    return new JetRetain(subject.start, subject.end, attributes)

  isEqual: (other)->
    if !other
      return false
    return @start == other.start and @end == other.end and
      this.attributesMatch(other)

  toString: ->
    return "{{#{@start} - #{@end}), #{super()}}"

  @isRetain: (r) ->
    return r? && typeof r.start == "number" && typeof r.end == "number"


class JetInsert extends JetDeltaItem
  constructor: (@text, @attributes = {}) ->
    # console.assert(@text.length > 0)
    @length = @text.length

  @copy: (subject) ->
    attributes = JetDeltaItem.copyAttributes(subject)
    return new JetInsert(subject.text, attributes)

  isEqual: (other) ->
    if !other
      return false
    return @text == other.text and this.attributesMatch(other)

  toString: ->
    return "{#{@text}, #{super()}}"

  @isInsert: (i) ->
    return i? && typeof i.text == "string" && typeof i.length == "number"


class JetDelta
  constructor: (@startLength, @endLength, @deltas, skipNormalizing = false) ->
    if !skipNormalizing
      this.normalizeChanges()
      length = 0
      for delta in @deltas
        if JetDelta.isRetain(delta)
          length += delta.end - delta.start
        else
          length += delta.length
      console.assert(length == @endLength, "Given end length is incorrect", this)

  isIdentity: ->
    if @startLength == @endLength
      if @deltas.length == 0
        return true
      index = 0
      for delta in @deltas
        if !JetRetain.isRetain(delta) then return false
        if delta.start != index then return false
        if !(delta.numAttributes() == 0 || (delta.numAttributes() == 1 && 'authorId' of delta.attributes))
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
      @deltas[i].attributes = {} unless @deltas[i].attributes?

  compact: ->
    this.normalizeChanges()
    compacted = []
    for delta in @deltas
      if compacted.length == 0
        compacted.push(delta) unless JetRetain.isRetain(delta) && delta.start == delta.end
      else
        if JetRetain.isRetain(delta) && delta.start == delta.end
          continue
        last = compacted[compacted.length - 1]
        if JetDelta.isInsert(last) && JetDelta.isInsert(delta) && last.attributesMatch(delta)
          # If two neighboring inserts, combine
          last.text = last.text + delta.text
          last.length = last.text.length
        else if JetRetain.isRetain(last) && JetRetain.isRetain(delta) && last.end == delta.start && last.attributesMatch(delta)
          # If two neighboring ranges first's end + 1 == second's start, combine
          last.end = delta.end
        else
          # Cannot coalesce with previous
          compacted.push(delta)
    @deltas = compacted

  getDeltasAt: (range) ->
    changes = []
    index = 0
    if range.start == range.end
      return []
    if typeof range == 'number'
      range = new JetRetain(range, range + 1)
    else
      range = JetRetain.copy(range)
    for delta in @deltas
      console.assert(JetDelta.isRetain(delta) || JetDelta.isInsert(delta), "Invalid change in delta", this)
      length = if JetDelta.isInsert(delta) then delta.length else delta.end - delta.start
      if index <= range.start && range.start < index + length
        start = Math.max(index, range.start)
        end = Math.min(index + length, range.end)
        if JetDelta.isInsert(delta)
          changes.push(new JetInsert(delta.text.substring(start - index, end -
            index), JetDeltaItem.copyAttributes(delta)))
        else
          changes.push(new JetRetain(start - index + delta.start, end - index +
            delta.start, JetDeltaItem.copyAttributes(delta)))
        range.start = end
      index += length
    return changes

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


  isEqual: (other) ->
    # TODO: Check for existence of properties before checking their values
    if @startLength != other.startLength or @endLength != other.endLength
      console.warn("Start/end Len mismatch!")
      return false

    if @deltas.length != other.deltas.length
      console.warn("Array len mismatch: " + @deltas.join("/") + other.deltas.join(", "))
      return false

    if @deltas.length == 0
      return true

    for i in [0..@deltas.length - 1]
      if typeof(@deltas[i]) != "object"
        console.warn("Delta is not an object: #{@delta[i]}")
        return false

      if typeof(other.deltas[i]) != "object"
        console.warn("Other delta is not an object: #{@delta[i]}")
        return false

      if !@deltas[i].isEqual(other.deltas[i])
        console.warn("Mismatch!" + other.deltas.join(", "))
        return false
    return true

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
    console.assert(JetDelta.isDelta(deltaA), "Decompose called when deltaA is not a JetDelta, type: " + typeof deltaA)
    console.assert(JetDelta.isDelta(deltaC), "Decompose called when deltaC is not a JetDelta, type: " + typeof deltaC)
    console.assert(deltaA.startLength == deltaC.startLength, "startLength #{deltaA.startLength} / startLength #{deltaC.startLength} mismatch")

    deltaA = JetDelta.copy(deltaA)
    deltaC = JetDelta.copy(deltaC)
    deltaA.normalizeChanges()
    deltaC.normalizeChanges()

    getCommonPrefixLength = (a, b) ->
      i = count = 0
      len = Math.min(a.length, b.length)
      while i < len
        break if a.charAt(i) != b.charAt(i)
        i += 1
        count += 1
      return count

    advance = (elem, indexes, advanceBy, whichElem) ->
      console.assert JetDelta.isInsert(elem), "advance expected insert but got retain: #{elem}"
      if advanceBy == elem.length
        indexes["elem#{whichElem}"] += 1
      else
        elem.text = elem.text.substring(advanceBy)
        elem.length = elem.text.length

    # XXX: Define this on JetDelta?
    decomposeAttributes = (elemA, elemC) ->
      decomposedAttributes = {}
      attributes = elemA.attributes
      for key, value of elemC.attributes
        if attributes[key] == undefined or attributes[key] != value
          decomposedAttributes[key] = value

      attributes = elemC.attributes
      for key, value of elemA.attributes
        if attributes[key] == undefined
          decomposedAttributes[key] = null

      return decomposedAttributes

    decomposed = []
    indexes =
      doc:   0 # Index into document after deltaA was applied
      elemA: 0 # Index into the elemA deltas list
      elemC: 0 # Index into the elemC deltas list
    while indexes.elemC < deltaC.deltas.length and indexes.elemA < deltaA.deltas.length
      elemA = deltaA.deltas[indexes.elemA]
      elemC = deltaC.deltas[indexes.elemC]
      if JetDelta.isInsert(elemC)
        commonPrefixLength = 0
        lookAhead = 0
        if JetDelta.isInsert(elemA)
          while lookAhead < elemA.text.length
            commonPrefixLength = getCommonPrefixLength(elemC.text, elemA.text.substring(lookAhead))
            if commonPrefixLength != 0 then break
            lookAhead += 1
        if commonPrefixLength > 0
          indexes.doc += lookAhead
          decomposed = decomposed.concat(new JetRetain(indexes.doc, indexes.doc + commonPrefixLength, decomposeAttributes(elemA, elemC)))
          indexes.doc += commonPrefixLength
          advance(elemA, indexes, lookAhead + commonPrefixLength, "A")
          advance(elemC, indexes, commonPrefixLength, "C")
        else
          # Take as much as we can while still leaving enough to cover the
          # remainder of deltaA
          take = elemC.length - (deltaA.endLength - indexes.doc)
          # If deltaA is longer than elemC, take all of elemC.
          if take <= 0 then take = elemC.length
          decomposed = decomposed.concat(new JetInsert(elemC.text.substr(0, take), decomposeAttributes(elemA, elemC)))
          advance(elemC, indexes, take, "C")
      else
        decomposed = decomposed.concat(new JetRetain(indexes.doc, indexes.doc + elemC.end - elemC.start, decomposeAttributes(elemA, elemC)))
        indexes.doc += (elemC.end - elemC.start)
        indexes.elemC += 1
        if elemC.end - elemC.start == elemA.end - elemA.start
          indexes.elemA += 1
        else
          elemA.start += elemC.end - elemC.start
    while (indexes.elemC < deltaC.deltas.length)
      elemC = deltaC.deltas[indexes.elemC]
      console.assert(JetDelta.isInsert(elemC), "Received Retain when expecting insert: #{elemC}")
      decomposed = decomposed.concat(elemC)
      indexes.elemC += 1
    deltaB = new JetDelta(deltaA.endLength, deltaC.endLength, decomposed)
    deltaB.compact()
    console.assert(JetDelta.isDelta(deltaB), "Decomposed returning invalid JetDelta", deltaB)
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
        length = Math.min(elemA.length, elemB.length)
        if aIsRemote
          followSet.push(new JetRetain(indexA, indexA + length))
          indexA += length
          if length == elemA.length
            elemIndexA++
          else
            console.assert(length < elemA.length)
            deltaA.deltas[elemIndexA] = new JetInsert(elemA.text.substring(length), elemA.attributes)
        else
          followSet.push(new JetInsert(elemB.text.substring(0, length), elemB.attributes))
          indexB += length
          if length == elemB.length
            elemIndexB++
          else
            deltaB.deltas[elemIndexB] = new JetInsert(elemB.text.substring(length), elemB.attributes)

      else if JetDelta.isRetain(elemA) and JetDelta.isRetain(elemB)
        if elemA.end < elemB.start
          # Not a match, can't save. Throw away lower and adv.
          indexA += elemA.end - elemA.start
          elemIndexA++
        else if elemB.end < elemA.start
          # Not a match, can't save. Throw away lower and adv.
          indexB += elemB.end - elemB.start
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
        followSet.push(new JetRetain(indexA, indexA + elemA.length))
        indexA += elemA.length
        elemIndexA++
      else if JetDelta.isRetain(elemA) and JetDelta.isInsert(elemB)
        followSet.push(elemB)
        indexB += elemB.length
        elemIndexB++
      else
        console.warn("Mismatch. elemA is: " + typeof(elemA) + ", elemB is:  " + typeof(elemB))

    # Remaining loops account for different length deltas, only inserts will be
    # accepted
    while elemIndexA < deltaA.deltas.length
      elemA = deltaA.deltas[elemIndexA]
      followSet.push(new JetRetain(indexA, indexA + elemA.length)) if JetDelta.isInsert(elemA) # retain elemA
      if JetDelta.isInsert(elemA) then indexA += elemA.length else indexA += elemA.end - elemA.start
      elemIndexA++

    while elemIndexB < deltaB.deltas.length
      elemB = deltaB.deltas[elemIndexB]
      followSet.push(elemB) if JetDelta.isInsert(elemB) # insert elemB
      if JetDelta.isInsert(elemB) then indexB += elemB.length else indexB += elemB.end - elemB.start
      elemIndexB++

    followEndLength = 0
    for elem in followSet
      if JetDelta.isInsert(elem)
        followEndLength += elem.length
      else
        followEndLength += elem.end - elem.start

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