/*! Stypi Editor - v0.10.5 - 2014-02-03
 *  https://www.stypi.com/
 *  Copyright (c) 2014
 *  Jason Chen, Salesforce.com
 */

//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.2'

!function(root, String){
  'use strict';

  // Defining helper functions.

  var nativeTrim = String.prototype.trim;
  var nativeTrimRight = String.prototype.trimRight;
  var nativeTrimLeft = String.prototype.trimLeft;

  var parseNumber = function(source) { return source * 1 || 0; };

  var strRepeat = function(str, qty){
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
      if (qty & 1) result += str;
      qty >>= 1, str += str;
    }
    return result;
  };

  var slice = [].slice;

  var defaultToWhiteSpace = function(characters) {
    if (characters == null)
      return '\\s';
    else if (characters.source)
      return characters.source;
    else
      return '[' + _s.escapeRegExp(characters) + ']';
  };

  // Helper for toBoolean
  function boolMatch(s, matchers) {
    var i, matcher, down = s.toLowerCase();
    matchers = [].concat(matchers);
    for (i = 0; i < matchers.length; i += 1) {
      matcher = matchers[i];
      if (!matcher) continue;
      if (matcher.test && matcher.test(s)) return true;
      if (matcher.toLowerCase() === down) return true;
    }
  }

  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'"
  };

  var reversedEscapeChars = {};
  for(var key in escapeChars) reversedEscapeChars[escapeChars[key]] = key;
  reversedEscapeChars["'"] = '#39';

  // sprintf() for JavaScript 0.7-beta1
  // http://www.diveintojavascript.com/projects/javascript-sprintf
  //
  // Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
  // All rights reserved.

  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    var str_repeat = strRepeat;

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          } else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
          }
          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw new Error('[_.sprintf] huh?');
                }
              }
            }
            else {
              throw new Error('[_.sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw new Error('[_.sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();



  // Defining underscore.string

  var _s = {

    VERSION: '2.3.0',

    isBlank: function(str){
      if (str == null) str = '';
      return (/^\s*$/).test(str);
    },

    stripTags: function(str){
      if (str == null) return '';
      return String(str).replace(/<\/?[^>]+>/g, '');
    },

    capitalize : function(str){
      str = str == null ? '' : String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    chop: function(str, step){
      if (str == null) return [];
      str = String(str);
      step = ~~step;
      return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];
    },

    clean: function(str){
      return _s.strip(str).replace(/\s+/g, ' ');
    },

    count: function(str, substr){
      if (str == null || substr == null) return 0;

      str = String(str);
      substr = String(substr);

      var count = 0,
        pos = 0,
        length = substr.length;

      while (true) {
        pos = str.indexOf(substr, pos);
        if (pos === -1) break;
        count++;
        pos += length;
      }

      return count;
    },

    chars: function(str) {
      if (str == null) return [];
      return String(str).split('');
    },

    swapCase: function(str) {
      if (str == null) return '';
      return String(str).replace(/\S/g, function(c){
        return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
      });
    },

    escapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
    },

    unescapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      });
    },

    escapeRegExp: function(str){
      if (str == null) return '';
      return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    },

    splice: function(str, i, howmany, substr){
      var arr = _s.chars(str);
      arr.splice(~~i, ~~howmany, substr);
      return arr.join('');
    },

    insert: function(str, i, substr){
      return _s.splice(str, i, 0, substr);
    },

    include: function(str, needle){
      if (needle === '') return true;
      if (str == null) return false;
      return String(str).indexOf(needle) !== -1;
    },

    join: function() {
      var args = slice.call(arguments),
        separator = args.shift();

      if (separator == null) separator = '';

      return args.join(separator);
    },

    lines: function(str) {
      if (str == null) return [];
      return String(str).split("\n");
    },

    reverse: function(str){
      return _s.chars(str).reverse().join('');
    },

    startsWith: function(str, starts){
      if (starts === '') return true;
      if (str == null || starts == null) return false;
      str = String(str); starts = String(starts);
      return str.length >= starts.length && str.slice(0, starts.length) === starts;
    },

    endsWith: function(str, ends){
      if (ends === '') return true;
      if (str == null || ends == null) return false;
      str = String(str); ends = String(ends);
      return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
    },

    succ: function(str){
      if (str == null) return '';
      str = String(str);
      return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length-1) + 1);
    },

    titleize: function(str){
      if (str == null) return '';
      str  = String(str).toLowerCase();
      return str.replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); });
    },

    camelize: function(str){
      return _s.trim(str).replace(/[-_\s]+(.)?/g, function(match, c){ return c ? c.toUpperCase() : ""; });
    },

    underscored: function(str){
      return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    },

    dasherize: function(str){
      return _s.trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
    },

    classify: function(str){
      return _s.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
    },

    humanize: function(str){
      return _s.capitalize(_s.underscored(str).replace(/_id$/,'').replace(/_/g, ' '));
    },

    trim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrim) return nativeTrim.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
    },

    ltrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('^' + characters + '+'), '');
    },

    rtrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp(characters + '+$'), '');
    },

    truncate: function(str, length, truncateStr){
      if (str == null) return '';
      str = String(str); truncateStr = truncateStr || '...';
      length = ~~length;
      return str.length > length ? str.slice(0, length) + truncateStr : str;
    },

    /**
     * _s.prune: a more elegant version of truncate
     * prune extra chars, never leaving a half-chopped word.
     * @author github.com/rwz
     */
    prune: function(str, length, pruneStr){
      if (str == null) return '';

      str = String(str); length = ~~length;
      pruneStr = pruneStr != null ? String(pruneStr) : '...';

      if (str.length <= length) return str;

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = _s.rtrim(template.slice(0, template.length-1));

      return (template+pruneStr).length > str.length ? str : str.slice(0, template.length)+pruneStr;
    },

    words: function(str, delimiter) {
      if (_s.isBlank(str)) return [];
      return _s.trim(str, delimiter).split(delimiter || /\s+/);
    },

    pad: function(str, length, padStr, type) {
      str = str == null ? '' : String(str);
      length = ~~length;

      var padlen  = 0;

      if (!padStr)
        padStr = ' ';
      else if (padStr.length > 1)
        padStr = padStr.charAt(0);

      switch(type) {
        case 'right':
          padlen = length - str.length;
          return str + strRepeat(padStr, padlen);
        case 'both':
          padlen = length - str.length;
          return strRepeat(padStr, Math.ceil(padlen/2)) + str
                  + strRepeat(padStr, Math.floor(padlen/2));
        default: // 'left'
          padlen = length - str.length;
          return strRepeat(padStr, padlen) + str;
        }
    },

    lpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr);
    },

    rpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'right');
    },

    lrpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'both');
    },

    sprintf: sprintf,

    vsprintf: function(fmt, argv){
      argv.unshift(fmt);
      return sprintf.apply(null, argv);
    },

    toNumber: function(str, decimals) {
      if (!str) return 0;
      str = _s.trim(str);
      if (!str.match(/^-?\d+(?:\.\d+)?$/)) return NaN;
      return parseNumber(parseNumber(str).toFixed(~~decimals));
    },

    numberFormat : function(number, dec, dsep, tsep) {
      if (isNaN(number) || number == null) return '';

      number = number.toFixed(~~dec);
      tsep = typeof tsep == 'string' ? tsep : ',';

      var parts = number.split('.'), fnums = parts[0],
        decimals = parts[1] ? (dsep || '.') + parts[1] : '';

      return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    },

    strRight: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strRightBack: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.lastIndexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strLeft: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    strLeftBack: function(str, sep){
      if (str == null) return '';
      str += ''; sep = sep != null ? ''+sep : sep;
      var pos = str.lastIndexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    toSentence: function(array, separator, lastSeparator, serial) {
      separator = separator || ', ';
      lastSeparator = lastSeparator || ' and ';
      var a = array.slice(), lastMember = a.pop();

      if (array.length > 2 && serial) lastSeparator = _s.rtrim(separator) + lastSeparator;

      return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;
    },

    toSentenceSerial: function() {
      var args = slice.call(arguments);
      args[3] = true;
      return _s.toSentence.apply(_s, args);
    },

    slugify: function(str) {
      if (str == null) return '';

      var from  = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",
          to    = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",
          regex = new RegExp(defaultToWhiteSpace(from), 'g');

      str = String(str).toLowerCase().replace(regex, function(c){
        var index = from.indexOf(c);
        return to.charAt(index) || '-';
      });

      return _s.dasherize(str.replace(/[^\w\s-]/g, ''));
    },

    surround: function(str, wrapper) {
      return [wrapper, str, wrapper].join('');
    },

    quote: function(str, quoteChar) {
      return _s.surround(str, quoteChar || '"');
    },

    unquote: function(str, quoteChar) {
      quoteChar = quoteChar || '"';
      if (str[0] === quoteChar && str[str.length-1] === quoteChar)
        return str.slice(1,str.length-1);
      else return str;
    },

    exports: function() {
      var result = {};

      for (var prop in this) {
        if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse)$/)) continue;
        result[prop] = this[prop];
      }

      return result;
    },

    repeat: function(str, qty, separator){
      if (str == null) return '';

      qty = ~~qty;

      // using faster implementation if separator is not needed;
      if (separator == null) return strRepeat(String(str), qty);

      // this one is about 300x slower in Google Chrome
      for (var repeat = []; qty > 0; repeat[--qty] = str) {}
      return repeat.join(separator);
    },

    naturalCmp: function(str1, str2){
      if (str1 == str2) return 0;
      if (!str1) return -1;
      if (!str2) return 1;

      var cmpRegex = /(\.\d+)|(\d+)|(\D+)/g,
        tokens1 = String(str1).toLowerCase().match(cmpRegex),
        tokens2 = String(str2).toLowerCase().match(cmpRegex),
        count = Math.min(tokens1.length, tokens2.length);

      for(var i = 0; i < count; i++) {
        var a = tokens1[i], b = tokens2[i];

        if (a !== b){
          var num1 = parseInt(a, 10);
          if (!isNaN(num1)){
            var num2 = parseInt(b, 10);
            if (!isNaN(num2) && num1 - num2)
              return num1 - num2;
          }
          return a < b ? -1 : 1;
        }
      }

      if (tokens1.length === tokens2.length)
        return tokens1.length - tokens2.length;

      return str1 < str2 ? -1 : 1;
    },

    levenshtein: function(str1, str2) {
      if (str1 == null && str2 == null) return 0;
      if (str1 == null) return String(str2).length;
      if (str2 == null) return String(str1).length;

      str1 = String(str1); str2 = String(str2);

      var current = [], prev, value;

      for (var i = 0; i <= str2.length; i++)
        for (var j = 0; j <= str1.length; j++) {
          if (i && j)
            if (str1.charAt(j - 1) === str2.charAt(i - 1))
              value = prev;
            else
              value = Math.min(current[j], current[j - 1], prev) + 1;
          else
            value = i + j;

          prev = current[j];
          current[j] = value;
        }

      return current.pop();
    },

    toBoolean: function(str, trueValues, falseValues) {
      if (typeof str === "number") str = "" + str;
      if (typeof str !== "string") return !!str;
      str = _s.trim(str);
      if (boolMatch(str, trueValues || ["true", "1"])) return true;
      if (boolMatch(str, falseValues || ["false", "0"])) return false;
    }
  };

  // Aliases

  _s.strip    = _s.trim;
  _s.lstrip   = _s.ltrim;
  _s.rstrip   = _s.rtrim;
  _s.center   = _s.lrpad;
  _s.rjust    = _s.lpad;
  _s.ljust    = _s.rpad;
  _s.contains = _s.include;
  _s.q        = _s.quote;
  _s.toBool   = _s.toBoolean;

  // Exporting

  // CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = _s;

    exports._s = _s;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.string', [], function(){ return _s; });


  // Integrate with Underscore.js if defined
  // or create our own underscore object.
  root._ = root._ || {};
  root._.string = root._.str = _s;
}(this, String);

/**
 * @license Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Copyright 2012, Tim Down
 * Licensed under the MIT license.
 * Version: 1.2.3
 * Build date: 26 February 2012
 */
window['rangy'] = (function() {


    var OBJECT = "object", FUNCTION = "function", UNDEFINED = "undefined";

    var domRangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer", "START_TO_START", "START_TO_END", "END_TO_START", "END_TO_END"];

    var domRangeMethods = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore",
        "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents",
        "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"];

    var textRangeProperties = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"];

    // Subset of TextRange's full set of methods that we're interested in
    var textRangeMethods = ["collapse", "compareEndPoints", "duplicate", "getBookmark", "moveToBookmark",
        "moveToElementText", "parentElement", "pasteHTML", "select", "setEndPoint", "getBoundingClientRect"];

    /*----------------------------------------------------------------------------------------------------------------*/

    // Trio of functions taken from Peter Michaux's article:
    // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
    function isHostMethod(o, p) {
        var t = typeof o[p];
        return t == FUNCTION || (!!(t == OBJECT && o[p])) || t == "unknown";
    }

    function isHostObject(o, p) {
        return !!(typeof o[p] == OBJECT && o[p]);
    }

    function isHostProperty(o, p) {
        return typeof o[p] != UNDEFINED;
    }

    // Creates a convenience function to save verbose repeated calls to tests functions
    function createMultiplePropertyTest(testFunc) {
        return function(o, props) {
            var i = props.length;
            while (i--) {
                if (!testFunc(o, props[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // Next trio of functions are a convenience to save verbose repeated calls to previous two functions
    var areHostMethods = createMultiplePropertyTest(isHostMethod);
    var areHostObjects = createMultiplePropertyTest(isHostObject);
    var areHostProperties = createMultiplePropertyTest(isHostProperty);

    function isTextRange(range) {
        return range && areHostMethods(range, textRangeMethods) && areHostProperties(range, textRangeProperties);
    }

    var api = {
        version: "1.2.3",
        initialized: false,
        supported: true,

        util: {
            isHostMethod: isHostMethod,
            isHostObject: isHostObject,
            isHostProperty: isHostProperty,
            areHostMethods: areHostMethods,
            areHostObjects: areHostObjects,
            areHostProperties: areHostProperties,
            isTextRange: isTextRange
        },

        features: {},

        modules: {},
        config: {
            alertOnWarn: false,
            preferTextRange: false
        }
    };

    function fail(reason) {
        window.alert("Rangy not supported in your browser. Reason: " + reason);
        api.initialized = true;
        api.supported = false;
    }

    api.fail = fail;

    function warn(msg) {
        var warningMessage = "Rangy warning: " + msg;
        if (api.config.alertOnWarn) {
            window.alert(warningMessage);
        } else if (typeof window.console != UNDEFINED && typeof window.console.log != UNDEFINED) {
            window.console.log(warningMessage);
        }
    }

    api.warn = warn;

    if ({}.hasOwnProperty) {
        api.util.extend = function(o, props) {
            for (var i in props) {
                if (props.hasOwnProperty(i)) {
                    o[i] = props[i];
                }
            }
        };
    } else {
        fail("hasOwnProperty not supported");
    }

    var initListeners = [];
    var moduleInitializers = [];

    // Initialization
    function init() {
        if (api.initialized) {
            return;
        }
        var testRange;
        var implementsDomRange = false, implementsTextRange = false;

        // First, perform basic feature tests

        if (isHostMethod(document, "createRange")) {
            testRange = document.createRange();
            if (areHostMethods(testRange, domRangeMethods) && areHostProperties(testRange, domRangeProperties)) {
                implementsDomRange = true;
            }
            testRange.detach();
        }

        var body = isHostObject(document, "body") ? document.body : document.getElementsByTagName("body")[0];

        if (body && isHostMethod(body, "createTextRange")) {
            testRange = body.createTextRange();
            if (isTextRange(testRange)) {
                implementsTextRange = true;
            }
        }

        if (!implementsDomRange && !implementsTextRange) {
            fail("Neither Range nor TextRange are implemented");
        }

        api.initialized = true;
        api.features = {
            implementsDomRange: implementsDomRange,
            implementsTextRange: implementsTextRange
        };

        // Initialize modules and call init listeners
        var allListeners = moduleInitializers.concat(initListeners);
        for (var i = 0, len = allListeners.length; i < len; ++i) {
            try {
                allListeners[i](api);
            } catch (ex) {
                if (isHostObject(window, "console") && isHostMethod(window.console, "log")) {
                    window.console.log("Init listener threw an exception. Continuing.", ex);
                }

            }
        }
    }

    // Allow external scripts to initialize this library in case it's loaded after the document has loaded
    api.init = init;

    // Execute listener immediately if already initialized
    api.addInitListener = function(listener) {
        if (api.initialized) {
            listener(api);
        } else {
            initListeners.push(listener);
        }
    };

    var createMissingNativeApiListeners = [];

    api.addCreateMissingNativeApiListener = function(listener) {
        createMissingNativeApiListeners.push(listener);
    };

    function createMissingNativeApi(win) {
        win = win || window;
        init();

        // Notify listeners
        for (var i = 0, len = createMissingNativeApiListeners.length; i < len; ++i) {
            createMissingNativeApiListeners[i](win);
        }
    }

    api.createMissingNativeApi = createMissingNativeApi;

    /**
     * @constructor
     */
    function Module(name) {
        this.name = name;
        this.initialized = false;
        this.supported = false;
    }

    Module.prototype.fail = function(reason) {
        this.initialized = true;
        this.supported = false;

        throw new Error("Module '" + this.name + "' failed to load: " + reason);
    };

    Module.prototype.warn = function(msg) {
        api.warn("Module " + this.name + ": " + msg);
    };

    Module.prototype.createError = function(msg) {
        return new Error("Error in Rangy " + this.name + " module: " + msg);
    };

    api.createModule = function(name, initFunc) {
        var module = new Module(name);
        api.modules[name] = module;

        moduleInitializers.push(function(api) {
            initFunc(api, module);
            module.initialized = true;
            module.supported = true;
        });
    };

    api.requireModules = function(modules) {
        for (var i = 0, len = modules.length, module, moduleName; i < len; ++i) {
            moduleName = modules[i];
            module = api.modules[moduleName];
            if (!module || !(module instanceof Module)) {
                throw new Error("Module '" + moduleName + "' not found");
            }
            if (!module.supported) {
                throw new Error("Module '" + moduleName + "' not supported");
            }
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Wait for document to load before running tests

    var docReady = false;

    var loadHandler = function(e) {

        if (!docReady) {
            docReady = true;
            if (!api.initialized) {
                init();
            }
        }
    };

    // Test whether we have window and document objects that we will need
    if (typeof window == UNDEFINED) {
        fail("No window found");
        return;
    }
    if (typeof document == UNDEFINED) {
        fail("No document found");
        return;
    }

    if (isHostMethod(document, "addEventListener")) {
        document.addEventListener("DOMContentLoaded", loadHandler, false);
    }

    // Add a fallback in case the DOMContentLoaded event isn't supported
    if (isHostMethod(window, "addEventListener")) {
        window.addEventListener("load", loadHandler, false);
    } else if (isHostMethod(window, "attachEvent")) {
        window.attachEvent("onload", loadHandler);
    } else {
        fail("Window does not have required addEventListener or attachEvent method");
    }

    return api;
})();
rangy.createModule("DomUtil", function(api, module) {

    var UNDEF = "undefined";
    var util = api.util;

    // Perform feature tests
    if (!util.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"])) {
        module.fail("document missing a Node creation method");
    }

    if (!util.isHostMethod(document, "getElementsByTagName")) {
        module.fail("document missing getElementsByTagName method");
    }

    var el = document.createElement("div");
    if (!util.areHostMethods(el, ["insertBefore", "appendChild", "cloneNode"] ||
            !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]))) {
        module.fail("Incomplete Element implementation");
    }

    // innerHTML is required for Range's createContextualFragment method
    if (!util.isHostProperty(el, "innerHTML")) {
        module.fail("Element is missing innerHTML property");
    }

    var textNode = document.createTextNode("test");
    if (!util.areHostMethods(textNode, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"] ||
            !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]) ||
            !util.areHostProperties(textNode, ["data"]))) {
        module.fail("Incomplete Text Node implementation");
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Removed use of indexOf because of a bizarre bug in Opera that is thrown in one of the Acid3 tests. I haven't been
    // able to replicate it outside of the test. The bug is that indexOf returns -1 when called on an Array that
    // contains just the document as a single element and the value searched for is the document.
    var arrayContains = /*Array.prototype.indexOf ?
        function(arr, val) {
            return arr.indexOf(val) > -1;
        }:*/

        function(arr, val) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) {
                    return true;
                }
            }
            return false;
        };

    // Opera 11 puts HTML elements in the null namespace, it seems, and IE 7 has undefined namespaceURI
    function isHtmlNamespace(node) {
        var ns;
        return typeof node.namespaceURI == UNDEF || ((ns = node.namespaceURI) === null || ns == "http://www.w3.org/1999/xhtml");
    }

    function parentElement(node) {
        var parent = node.parentNode;
        return (parent.nodeType == 1) ? parent : null;
    }

    function getNodeIndex(node) {
        var i = 0;
        while( (node = node.previousSibling) ) {
            i++;
        }
        return i;
    }

    function getNodeLength(node) {
        var childNodes;
        return isCharacterDataNode(node) ? node.length : ((childNodes = node.childNodes) ? childNodes.length : 0);
    }

    function getCommonAncestor(node1, node2) {
        var ancestors = [], n;
        for (n = node1; n; n = n.parentNode) {
            ancestors.push(n);
        }

        for (n = node2; n; n = n.parentNode) {
            if (arrayContains(ancestors, n)) {
                return n;
            }
        }

        return null;
    }

    function isAncestorOf(ancestor, descendant, selfIsAncestor) {
        var n = selfIsAncestor ? descendant : descendant.parentNode;
        while (n) {
            if (n === ancestor) {
                return true;
            } else {
                n = n.parentNode;
            }
        }
        return false;
    }

    function getClosestAncestorIn(node, ancestor, selfIsAncestor) {
        var p, n = selfIsAncestor ? node : node.parentNode;
        while (n) {
            p = n.parentNode;
            if (p === ancestor) {
                return n;
            }
            n = p;
        }
        return null;
    }

    function isCharacterDataNode(node) {
        var t = node.nodeType;
        return t == 3 || t == 4 || t == 8 ; // Text, CDataSection or Comment
    }

    function insertAfter(node, precedingNode) {
        var nextNode = precedingNode.nextSibling, parent = precedingNode.parentNode;
        if (nextNode) {
            parent.insertBefore(node, nextNode);
        } else {
            parent.appendChild(node);
        }
        return node;
    }

    // Note that we cannot use splitText() because it is bugridden in IE 9.
    function splitDataNode(node, index) {
        var newNode = node.cloneNode(false);
        newNode.deleteData(0, index);
        node.deleteData(index, node.length - index);
        insertAfter(newNode, node);
        return newNode;
    }

    function getDocument(node) {
        if (node.nodeType == 9) {
            return node;
        } else if (typeof node.ownerDocument != UNDEF) {
            return node.ownerDocument;
        } else if (typeof node.document != UNDEF) {
            return node.document;
        } else if (node.parentNode) {
            return getDocument(node.parentNode);
        } else {
            throw new Error("getDocument: no document found for node");
        }
    }

    function getWindow(node) {
        var doc = getDocument(node);
        if (typeof doc.defaultView != UNDEF) {
            return doc.defaultView;
        } else if (typeof doc.parentWindow != UNDEF) {
            return doc.parentWindow;
        } else {
            throw new Error("Cannot get a window object for node");
        }
    }

    function getIframeDocument(iframeEl) {
        if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument;
        } else if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow.document;
        } else {
            throw new Error("getIframeWindow: No Document object found for iframe element");
        }
    }

    function getIframeWindow(iframeEl) {
        if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow;
        } else if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument.defaultView;
        } else {
            throw new Error("getIframeWindow: No Window object found for iframe element");
        }
    }

    function getBody(doc) {
        return util.isHostObject(doc, "body") ? doc.body : doc.getElementsByTagName("body")[0];
    }

    function getRootContainer(node) {
        var parent;
        while ( (parent = node.parentNode) ) {
            node = parent;
        }
        return node;
    }

    function comparePoints(nodeA, offsetA, nodeB, offsetB) {
        // See http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Comparing
        var nodeC, root, childA, childB, n;
        if (nodeA == nodeB) {

            // Case 1: nodes are the same
            return offsetA === offsetB ? 0 : (offsetA < offsetB) ? -1 : 1;
        } else if ( (nodeC = getClosestAncestorIn(nodeB, nodeA, true)) ) {

            // Case 2: node C (container B or an ancestor) is a child node of A
            return offsetA <= getNodeIndex(nodeC) ? -1 : 1;
        } else if ( (nodeC = getClosestAncestorIn(nodeA, nodeB, true)) ) {

            // Case 3: node C (container A or an ancestor) is a child node of B
            return getNodeIndex(nodeC) < offsetB  ? -1 : 1;
        } else {

            // Case 4: containers are siblings or descendants of siblings
            root = getCommonAncestor(nodeA, nodeB);
            childA = (nodeA === root) ? root : getClosestAncestorIn(nodeA, root, true);
            childB = (nodeB === root) ? root : getClosestAncestorIn(nodeB, root, true);

            if (childA === childB) {
                // This shouldn't be possible

                throw new Error("comparePoints got to case 4 and childA and childB are the same!");
            } else {
                n = root.firstChild;
                while (n) {
                    if (n === childA) {
                        return -1;
                    } else if (n === childB) {
                        return 1;
                    }
                    n = n.nextSibling;
                }
                throw new Error("Should not be here!");
            }
        }
    }

    function fragmentFromNodeChildren(node) {
        var fragment = getDocument(node).createDocumentFragment(), child;
        while ( (child = node.firstChild) ) {
            fragment.appendChild(child);
        }
        return fragment;
    }

    function inspectNode(node) {
        if (!node) {
            return "[No node]";
        }
        if (isCharacterDataNode(node)) {
            return '"' + node.data + '"';
        } else if (node.nodeType == 1) {
            var idAttr = node.id ? ' id="' + node.id + '"' : "";
            return "<" + node.nodeName + idAttr + ">[" + node.childNodes.length + "]";
        } else {
            return node.nodeName;
        }
    }

    /**
     * @constructor
     */
    function NodeIterator(root) {
        this.root = root;
        this._next = root;
    }

    NodeIterator.prototype = {
        _current: null,

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            var n = this._current = this._next;
            var child, next;
            if (this._current) {
                child = n.firstChild;
                if (child) {
                    this._next = child;
                } else {
                    next = null;
                    while ((n !== this.root) && !(next = n.nextSibling)) {
                        n = n.parentNode;
                    }
                    this._next = next;
                }
            }
            return this._current;
        },

        detach: function() {
            this._current = this._next = this.root = null;
        }
    };

    function createIterator(root) {
        return new NodeIterator(root);
    }

    /**
     * @constructor
     */
    function DomPosition(node, offset) {
        this.node = node;
        this.offset = offset;
    }

    DomPosition.prototype = {
        equals: function(pos) {
            return this.node === pos.node & this.offset == pos.offset;
        },

        inspect: function() {
            return "[DomPosition(" + inspectNode(this.node) + ":" + this.offset + ")]";
        }
    };

    /**
     * @constructor
     */
    function DOMException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "DOMException: " + this.codeName;
    }

    DOMException.prototype = {
        INDEX_SIZE_ERR: 1,
        HIERARCHY_REQUEST_ERR: 3,
        WRONG_DOCUMENT_ERR: 4,
        NO_MODIFICATION_ALLOWED_ERR: 7,
        NOT_FOUND_ERR: 8,
        NOT_SUPPORTED_ERR: 9,
        INVALID_STATE_ERR: 11
    };

    DOMException.prototype.toString = function() {
        return this.message;
    };

    api.dom = {
        arrayContains: arrayContains,
        isHtmlNamespace: isHtmlNamespace,
        parentElement: parentElement,
        getNodeIndex: getNodeIndex,
        getNodeLength: getNodeLength,
        getCommonAncestor: getCommonAncestor,
        isAncestorOf: isAncestorOf,
        getClosestAncestorIn: getClosestAncestorIn,
        isCharacterDataNode: isCharacterDataNode,
        insertAfter: insertAfter,
        splitDataNode: splitDataNode,
        getDocument: getDocument,
        getWindow: getWindow,
        getIframeWindow: getIframeWindow,
        getIframeDocument: getIframeDocument,
        getBody: getBody,
        getRootContainer: getRootContainer,
        comparePoints: comparePoints,
        inspectNode: inspectNode,
        fragmentFromNodeChildren: fragmentFromNodeChildren,
        createIterator: createIterator,
        DomPosition: DomPosition
    };

    api.DOMException = DOMException;
});rangy.createModule("DomRange", function(api, module) {
    api.requireModules( ["DomUtil"] );


    var dom = api.dom;
    var DomPosition = dom.DomPosition;
    var DOMException = api.DOMException;
    
    /*----------------------------------------------------------------------------------------------------------------*/

    // Utility functions

    function isNonTextPartiallySelected(node, range) {
        return (node.nodeType != 3) &&
               (dom.isAncestorOf(node, range.startContainer, true) || dom.isAncestorOf(node, range.endContainer, true));
    }

    function getRangeDocument(range) {
        return dom.getDocument(range.startContainer);
    }

    function dispatchEvent(range, type, args) {
        var listeners = range._listeners[type];
        if (listeners) {
            for (var i = 0, len = listeners.length; i < len; ++i) {
                listeners[i].call(range, {target: range, args: args});
            }
        }
    }

    function getBoundaryBeforeNode(node) {
        return new DomPosition(node.parentNode, dom.getNodeIndex(node));
    }

    function getBoundaryAfterNode(node) {
        return new DomPosition(node.parentNode, dom.getNodeIndex(node) + 1);
    }

    function insertNodeAtPosition(node, n, o) {
        var firstNodeInserted = node.nodeType == 11 ? node.firstChild : node;
        if (dom.isCharacterDataNode(n)) {
            if (o == n.length) {
                dom.insertAfter(node, n);
            } else {
                n.parentNode.insertBefore(node, o == 0 ? n : dom.splitDataNode(n, o));
            }
        } else if (o >= n.childNodes.length) {
            n.appendChild(node);
        } else {
            n.insertBefore(node, n.childNodes[o]);
        }
        return firstNodeInserted;
    }

    function cloneSubtree(iterator) {
        var partiallySelected;
        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {
            partiallySelected = iterator.isPartiallySelectedSubtree();

            node = node.cloneNode(!partiallySelected);
            if (partiallySelected) {
                subIterator = iterator.getSubtreeIterator();
                node.appendChild(cloneSubtree(subIterator));
                subIterator.detach(true);
            }

            if (node.nodeType == 10) { // DocumentType
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }
            frag.appendChild(node);
        }
        return frag;
    }

    function iterateSubtree(rangeIterator, func, iteratorState) {
        var it, n;
        iteratorState = iteratorState || { stop: false };
        for (var node, subRangeIterator; node = rangeIterator.next(); ) {
            //log.debug("iterateSubtree, partially selected: " + rangeIterator.isPartiallySelectedSubtree(), nodeToString(node));
            if (rangeIterator.isPartiallySelectedSubtree()) {
                // The node is partially selected by the Range, so we can use a new RangeIterator on the portion of the
                // node selected by the Range.
                if (func(node) === false) {
                    iteratorState.stop = true;
                    return;
                } else {
                    subRangeIterator = rangeIterator.getSubtreeIterator();
                    iterateSubtree(subRangeIterator, func, iteratorState);
                    subRangeIterator.detach(true);
                    if (iteratorState.stop) {
                        return;
                    }
                }
            } else {
                // The whole node is selected, so we can use efficient DOM iteration to iterate over the node and its
                // descendant
                it = dom.createIterator(node);
                while ( (n = it.next()) ) {
                    if (func(n) === false) {
                        iteratorState.stop = true;
                        return;
                    }
                }
            }
        }
    }

    function deleteSubtree(iterator) {
        var subIterator;
        while (iterator.next()) {
            if (iterator.isPartiallySelectedSubtree()) {
                subIterator = iterator.getSubtreeIterator();
                deleteSubtree(subIterator);
                subIterator.detach(true);
            } else {
                iterator.remove();
            }
        }
    }

    function extractSubtree(iterator) {

        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {


            if (iterator.isPartiallySelectedSubtree()) {
                node = node.cloneNode(false);
                subIterator = iterator.getSubtreeIterator();
                node.appendChild(extractSubtree(subIterator));
                subIterator.detach(true);
            } else {
                iterator.remove();
            }
            if (node.nodeType == 10) { // DocumentType
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }
            frag.appendChild(node);
        }
        return frag;
    }

    function getNodesInRange(range, nodeTypes, filter) {
        //log.info("getNodesInRange, " + nodeTypes.join(","));
        var filterNodeTypes = !!(nodeTypes && nodeTypes.length), regex;
        var filterExists = !!filter;
        if (filterNodeTypes) {
            regex = new RegExp("^(" + nodeTypes.join("|") + ")$");
        }

        var nodes = [];
        iterateSubtree(new RangeIterator(range, false), function(node) {
            if ((!filterNodeTypes || regex.test(node.nodeType)) && (!filterExists || filter(node))) {
                nodes.push(node);
            }
        });
        return nodes;
    }

    function inspect(range) {
        var name = (typeof range.getName == "undefined") ? "Range" : range.getName();
        return "[" + name + "(" + dom.inspectNode(range.startContainer) + ":" + range.startOffset + ", " +
                dom.inspectNode(range.endContainer) + ":" + range.endOffset + ")]";
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // RangeIterator code partially borrows from IERange by Tim Ryan (http://github.com/timcameronryan/IERange)

    /**
     * @constructor
     */
    function RangeIterator(range, clonePartiallySelectedTextNodes) {
        this.range = range;
        this.clonePartiallySelectedTextNodes = clonePartiallySelectedTextNodes;



        if (!range.collapsed) {
            this.sc = range.startContainer;
            this.so = range.startOffset;
            this.ec = range.endContainer;
            this.eo = range.endOffset;
            var root = range.commonAncestorContainer;

            if (this.sc === this.ec && dom.isCharacterDataNode(this.sc)) {
                this.isSingleCharacterDataNode = true;
                this._first = this._last = this._next = this.sc;
            } else {
                this._first = this._next = (this.sc === root && !dom.isCharacterDataNode(this.sc)) ?
                    this.sc.childNodes[this.so] : dom.getClosestAncestorIn(this.sc, root, true);
                this._last = (this.ec === root && !dom.isCharacterDataNode(this.ec)) ?
                    this.ec.childNodes[this.eo - 1] : dom.getClosestAncestorIn(this.ec, root, true);
            }

        }
    }

    RangeIterator.prototype = {
        _current: null,
        _next: null,
        _first: null,
        _last: null,
        isSingleCharacterDataNode: false,

        reset: function() {
            this._current = null;
            this._next = this._first;
        },

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            // Move to next node
            var current = this._current = this._next;
            if (current) {
                this._next = (current !== this._last) ? current.nextSibling : null;

                // Check for partially selected text nodes
                if (dom.isCharacterDataNode(current) && this.clonePartiallySelectedTextNodes) {
                    if (current === this.ec) {

                        (current = current.cloneNode(true)).deleteData(this.eo, current.length - this.eo);
                    }
                    if (this._current === this.sc) {

                        (current = current.cloneNode(true)).deleteData(0, this.so);
                    }
                }
            }

            return current;
        },

        remove: function() {
            var current = this._current, start, end;

            if (dom.isCharacterDataNode(current) && (current === this.sc || current === this.ec)) {
                start = (current === this.sc) ? this.so : 0;
                end = (current === this.ec) ? this.eo : current.length;
                if (start != end) {
                    current.deleteData(start, end - start);
                }
            } else {
                if (current.parentNode) {
                    current.parentNode.removeChild(current);
                } else {

                }
            }
        },

        // Checks if the current node is partially selected
        isPartiallySelectedSubtree: function() {
            var current = this._current;
            return isNonTextPartiallySelected(current, this.range);
        },

        getSubtreeIterator: function() {
            var subRange;
            if (this.isSingleCharacterDataNode) {
                subRange = this.range.cloneRange();
                subRange.collapse();
            } else {
                subRange = new Range(getRangeDocument(this.range));
                var current = this._current;
                var startContainer = current, startOffset = 0, endContainer = current, endOffset = dom.getNodeLength(current);

                if (dom.isAncestorOf(current, this.sc, true)) {
                    startContainer = this.sc;
                    startOffset = this.so;
                }
                if (dom.isAncestorOf(current, this.ec, true)) {
                    endContainer = this.ec;
                    endOffset = this.eo;
                }

                updateBoundaries(subRange, startContainer, startOffset, endContainer, endOffset);
            }
            return new RangeIterator(subRange, this.clonePartiallySelectedTextNodes);
        },

        detach: function(detachRange) {
            if (detachRange) {
                this.range.detach();
            }
            this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null;
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Exceptions

    /**
     * @constructor
     */
    function RangeException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "RangeException: " + this.codeName;
    }

    RangeException.prototype = {
        BAD_BOUNDARYPOINTS_ERR: 1,
        INVALID_NODE_TYPE_ERR: 2
    };

    RangeException.prototype.toString = function() {
        return this.message;
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    /**
     * Currently iterates through all nodes in the range on creation until I think of a decent way to do it
     * TODO: Look into making this a proper iterator, not requiring preloading everything first
     * @constructor
     */
    function RangeNodeIterator(range, nodeTypes, filter) {
        this.nodes = getNodesInRange(range, nodeTypes, filter);
        this._next = this.nodes[0];
        this._position = 0;
    }

    RangeNodeIterator.prototype = {
        _current: null,

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            this._current = this._next;
            this._next = this.nodes[ ++this._position ];
            return this._current;
        },

        detach: function() {
            this._current = this._next = this.nodes = null;
        }
    };

    var beforeAfterNodeTypes = [1, 3, 4, 5, 7, 8, 10];
    var rootContainerNodeTypes = [2, 9, 11];
    var readonlyNodeTypes = [5, 6, 10, 12];
    var insertableNodeTypes = [1, 3, 4, 5, 7, 8, 10, 11];
    var surroundNodeTypes = [1, 3, 4, 5, 7, 8];

    function createAncestorFinder(nodeTypes) {
        return function(node, selfIsAncestor) {
            var t, n = selfIsAncestor ? node : node.parentNode;
            while (n) {
                t = n.nodeType;
                if (dom.arrayContains(nodeTypes, t)) {
                    return n;
                }
                n = n.parentNode;
            }
            return null;
        };
    }

    var getRootContainer = dom.getRootContainer;
    var getDocumentOrFragmentContainer = createAncestorFinder( [9, 11] );
    var getReadonlyAncestor = createAncestorFinder(readonlyNodeTypes);
    var getDocTypeNotationEntityAncestor = createAncestorFinder( [6, 10, 12] );

    function assertNoDocTypeNotationEntityAncestor(node, allowSelf) {
        if (getDocTypeNotationEntityAncestor(node, allowSelf)) {
            throw new RangeException("INVALID_NODE_TYPE_ERR");
        }
    }

    function assertNotDetached(range) {
        if (!range.startContainer) {
            throw new DOMException("INVALID_STATE_ERR");
        }
    }

    function assertValidNodeType(node, invalidTypes) {
        if (!dom.arrayContains(invalidTypes, node.nodeType)) {
            throw new RangeException("INVALID_NODE_TYPE_ERR");
        }
    }

    function assertValidOffset(node, offset) {
        if (offset < 0 || offset > (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length)) {
            throw new DOMException("INDEX_SIZE_ERR");
        }
    }

    function assertSameDocumentOrFragment(node1, node2) {
        if (getDocumentOrFragmentContainer(node1, true) !== getDocumentOrFragmentContainer(node2, true)) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }
    }

    function assertNodeNotReadOnly(node) {
        if (getReadonlyAncestor(node, true)) {
            throw new DOMException("NO_MODIFICATION_ALLOWED_ERR");
        }
    }

    function assertNode(node, codeName) {
        if (!node) {
            throw new DOMException(codeName);
        }
    }

    function isOrphan(node) {
        return !dom.arrayContains(rootContainerNodeTypes, node.nodeType) && !getDocumentOrFragmentContainer(node, true);
    }

    function isValidOffset(node, offset) {
        return offset <= (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length);
    }

    function isRangeValid(range) {
        return (!!range.startContainer && !!range.endContainer
                && !isOrphan(range.startContainer)
                && !isOrphan(range.endContainer)
                && isValidOffset(range.startContainer, range.startOffset)
                && isValidOffset(range.endContainer, range.endOffset));
    }

    function assertRangeValid(range) {
        assertNotDetached(range);
        if (!isRangeValid(range)) {
            throw new Error("Range error: Range is no longer valid after DOM mutation (" + range.inspect() + ")");
        }
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Test the browser's innerHTML support to decide how to implement createContextualFragment
    var styleEl = document.createElement("style");
    var htmlParsingConforms = false;
    try {
        styleEl.innerHTML = "<b>x</b>";
        htmlParsingConforms = (styleEl.firstChild.nodeType == 3); // Opera incorrectly creates an element node
    } catch (e) {
        // IE 6 and 7 throw
    }

    api.features.htmlParsingConforms = htmlParsingConforms;

    var createContextualFragment = htmlParsingConforms ?

        // Implementation as per HTML parsing spec, trusting in the browser's implementation of innerHTML. See
        // discussion and base code for this implementation at issue 67.
        // Spec: http://html5.org/specs/dom-parsing.html#extensions-to-the-range-interface
        // Thanks to Aleks Williams.
        function(fragmentStr) {
            // "Let node the context object's start's node."
            var node = this.startContainer;
            var doc = dom.getDocument(node);

            // "If the context object's start's node is null, raise an INVALID_STATE_ERR
            // exception and abort these steps."
            if (!node) {
                throw new DOMException("INVALID_STATE_ERR");
            }

            // "Let element be as follows, depending on node's interface:"
            // Document, Document Fragment: null
            var el = null;

            // "Element: node"
            if (node.nodeType == 1) {
                el = node;

            // "Text, Comment: node's parentElement"
            } else if (dom.isCharacterDataNode(node)) {
                el = dom.parentElement(node);
            }

            // "If either element is null or element's ownerDocument is an HTML document
            // and element's local name is "html" and element's namespace is the HTML
            // namespace"
            if (el === null || (
                el.nodeName == "HTML"
                && dom.isHtmlNamespace(dom.getDocument(el).documentElement)
                && dom.isHtmlNamespace(el)
            )) {

            // "let element be a new Element with "body" as its local name and the HTML
            // namespace as its namespace.""
                el = doc.createElement("body");
            } else {
                el = el.cloneNode(false);
            }

            // "If the node's document is an HTML document: Invoke the HTML fragment parsing algorithm."
            // "If the node's document is an XML document: Invoke the XML fragment parsing algorithm."
            // "In either case, the algorithm must be invoked with fragment as the input
            // and element as the context element."
            el.innerHTML = fragmentStr;

            // "If this raises an exception, then abort these steps. Otherwise, let new
            // children be the nodes returned."

            // "Let fragment be a new DocumentFragment."
            // "Append all new children to fragment."
            // "Return fragment."
            return dom.fragmentFromNodeChildren(el);
        } :

        // In this case, innerHTML cannot be trusted, so fall back to a simpler, non-conformant implementation that
        // previous versions of Rangy used (with the exception of using a body element rather than a div)
        function(fragmentStr) {
            assertNotDetached(this);
            var doc = getRangeDocument(this);
            var el = doc.createElement("body");
            el.innerHTML = fragmentStr;

            return dom.fragmentFromNodeChildren(el);
        };

    /*----------------------------------------------------------------------------------------------------------------*/

    var rangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer"];

    var s2s = 0, s2e = 1, e2e = 2, e2s = 3;
    var n_b = 0, n_a = 1, n_b_a = 2, n_i = 3;

    function RangePrototype() {}

    RangePrototype.prototype = {
        attachListener: function(type, listener) {
            this._listeners[type].push(listener);
        },

        compareBoundaryPoints: function(how, range) {
            assertRangeValid(this);
            assertSameDocumentOrFragment(this.startContainer, range.startContainer);

            var nodeA, offsetA, nodeB, offsetB;
            var prefixA = (how == e2s || how == s2s) ? "start" : "end";
            var prefixB = (how == s2e || how == s2s) ? "start" : "end";
            nodeA = this[prefixA + "Container"];
            offsetA = this[prefixA + "Offset"];
            nodeB = range[prefixB + "Container"];
            offsetB = range[prefixB + "Offset"];
            return dom.comparePoints(nodeA, offsetA, nodeB, offsetB);
        },

        insertNode: function(node) {
            assertRangeValid(this);
            assertValidNodeType(node, insertableNodeTypes);
            assertNodeNotReadOnly(this.startContainer);

            if (dom.isAncestorOf(node, this.startContainer, true)) {
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }

            // No check for whether the container of the start of the Range is of a type that does not allow
            // children of the type of node: the browser's DOM implementation should do this for us when we attempt
            // to add the node

            var firstNodeInserted = insertNodeAtPosition(node, this.startContainer, this.startOffset);
            this.setStartBefore(firstNodeInserted);
        },

        cloneContents: function() {
            assertRangeValid(this);

            var clone, frag;
            if (this.collapsed) {
                return getRangeDocument(this).createDocumentFragment();
            } else {
                if (this.startContainer === this.endContainer && dom.isCharacterDataNode(this.startContainer)) {
                    clone = this.startContainer.cloneNode(true);
                    clone.data = clone.data.slice(this.startOffset, this.endOffset);
                    frag = getRangeDocument(this).createDocumentFragment();
                    frag.appendChild(clone);
                    return frag;
                } else {
                    var iterator = new RangeIterator(this, true);
                    clone = cloneSubtree(iterator);
                    iterator.detach();
                }
                return clone;
            }
        },

        canSurroundContents: function() {
            assertRangeValid(this);
            assertNodeNotReadOnly(this.startContainer);
            assertNodeNotReadOnly(this.endContainer);

            // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
            // no non-text nodes.
            var iterator = new RangeIterator(this, true);
            var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                    (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
            iterator.detach();
            return !boundariesInvalid;
        },

        surroundContents: function(node) {
            assertValidNodeType(node, surroundNodeTypes);

            if (!this.canSurroundContents()) {
                throw new RangeException("BAD_BOUNDARYPOINTS_ERR");
            }

            // Extract the contents
            var content = this.extractContents();

            // Clear the children of the node
            if (node.hasChildNodes()) {
                while (node.lastChild) {
                    node.removeChild(node.lastChild);
                }
            }

            // Insert the new node and add the extracted contents
            insertNodeAtPosition(node, this.startContainer, this.startOffset);
            node.appendChild(content);

            this.selectNode(node);
        },

        cloneRange: function() {
            assertRangeValid(this);
            var range = new Range(getRangeDocument(this));
            var i = rangeProperties.length, prop;
            while (i--) {
                prop = rangeProperties[i];
                range[prop] = this[prop];
            }
            return range;
        },

        toString: function() {
            assertRangeValid(this);
            var sc = this.startContainer;
            if (sc === this.endContainer && dom.isCharacterDataNode(sc)) {
                return (sc.nodeType == 3 || sc.nodeType == 4) ? sc.data.slice(this.startOffset, this.endOffset) : "";
            } else {
                var textBits = [], iterator = new RangeIterator(this, true);

                iterateSubtree(iterator, function(node) {
                    // Accept only text or CDATA nodes, not comments

                    if (node.nodeType == 3 || node.nodeType == 4) {
                        textBits.push(node.data);
                    }
                });
                iterator.detach();
                return textBits.join("");
            }
        },

        // The methods below are all non-standard. The following batch were introduced by Mozilla but have since
        // been removed from Mozilla.

        compareNode: function(node) {
            assertRangeValid(this);

            var parent = node.parentNode;
            var nodeIndex = dom.getNodeIndex(node);

            if (!parent) {
                throw new DOMException("NOT_FOUND_ERR");
            }

            var startComparison = this.comparePoint(parent, nodeIndex),
                endComparison = this.comparePoint(parent, nodeIndex + 1);

            if (startComparison < 0) { // Node starts before
                return (endComparison > 0) ? n_b_a : n_b;
            } else {
                return (endComparison > 0) ? n_a : n_i;
            }
        },

        comparePoint: function(node, offset) {
            assertRangeValid(this);
            assertNode(node, "HIERARCHY_REQUEST_ERR");
            assertSameDocumentOrFragment(node, this.startContainer);

            if (dom.comparePoints(node, offset, this.startContainer, this.startOffset) < 0) {
                return -1;
            } else if (dom.comparePoints(node, offset, this.endContainer, this.endOffset) > 0) {
                return 1;
            }
            return 0;
        },

        createContextualFragment: createContextualFragment,

        toHtml: function() {
            assertRangeValid(this);
            var container = getRangeDocument(this).createElement("div");
            container.appendChild(this.cloneContents());
            return container.innerHTML;
        },

        // touchingIsIntersecting determines whether this method considers a node that borders a range intersects
        // with it (as in WebKit) or not (as in Gecko pre-1.9, and the default)
        intersectsNode: function(node, touchingIsIntersecting) {
            assertRangeValid(this);
            assertNode(node, "NOT_FOUND_ERR");
            if (dom.getDocument(node) !== getRangeDocument(this)) {
                return false;
            }

            var parent = node.parentNode, offset = dom.getNodeIndex(node);
            assertNode(parent, "NOT_FOUND_ERR");

            var startComparison = dom.comparePoints(parent, offset, this.endContainer, this.endOffset),
                endComparison = dom.comparePoints(parent, offset + 1, this.startContainer, this.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },


        isPointInRange: function(node, offset) {
            assertRangeValid(this);
            assertNode(node, "HIERARCHY_REQUEST_ERR");
            assertSameDocumentOrFragment(node, this.startContainer);

            return (dom.comparePoints(node, offset, this.startContainer, this.startOffset) >= 0) &&
                   (dom.comparePoints(node, offset, this.endContainer, this.endOffset) <= 0);
        },

        // The methods below are non-standard and invented by me.

        // Sharing a boundary start-to-end or end-to-start does not count as intersection.
        intersectsRange: function(range, touchingIsIntersecting) {
            assertRangeValid(this);

            if (getRangeDocument(range) != getRangeDocument(this)) {
                throw new DOMException("WRONG_DOCUMENT_ERR");
            }

            var startComparison = dom.comparePoints(this.startContainer, this.startOffset, range.endContainer, range.endOffset),
                endComparison = dom.comparePoints(this.endContainer, this.endOffset, range.startContainer, range.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },

        intersection: function(range) {
            if (this.intersectsRange(range)) {
                var startComparison = dom.comparePoints(this.startContainer, this.startOffset, range.startContainer, range.startOffset),
                    endComparison = dom.comparePoints(this.endContainer, this.endOffset, range.endContainer, range.endOffset);

                var intersectionRange = this.cloneRange();

                if (startComparison == -1) {
                    intersectionRange.setStart(range.startContainer, range.startOffset);
                }
                if (endComparison == 1) {
                    intersectionRange.setEnd(range.endContainer, range.endOffset);
                }
                return intersectionRange;
            }
            return null;
        },

        union: function(range) {
            if (this.intersectsRange(range, true)) {
                var unionRange = this.cloneRange();
                if (dom.comparePoints(range.startContainer, range.startOffset, this.startContainer, this.startOffset) == -1) {
                    unionRange.setStart(range.startContainer, range.startOffset);
                }
                if (dom.comparePoints(range.endContainer, range.endOffset, this.endContainer, this.endOffset) == 1) {
                    unionRange.setEnd(range.endContainer, range.endOffset);
                }
                return unionRange;
            } else {
                throw new RangeException("Ranges do not intersect");
            }
        },

        containsNode: function(node, allowPartial) {
            if (allowPartial) {
                return this.intersectsNode(node, false);
            } else {
                return this.compareNode(node) == n_i;
            }
        },

        containsNodeContents: function(node) {
            return this.comparePoint(node, 0) >= 0 && this.comparePoint(node, dom.getNodeLength(node)) <= 0;
        },

        containsRange: function(range) {
            return this.intersection(range).equals(range);
        },

        containsNodeText: function(node) {
            var nodeRange = this.cloneRange();
            nodeRange.selectNode(node);
            var textNodes = nodeRange.getNodes([3]);
            if (textNodes.length > 0) {
                nodeRange.setStart(textNodes[0], 0);
                var lastTextNode = textNodes.pop();
                nodeRange.setEnd(lastTextNode, lastTextNode.length);
                var contains = this.containsRange(nodeRange);
                nodeRange.detach();
                return contains;
            } else {
                return this.containsNodeContents(node);
            }
        },

        createNodeIterator: function(nodeTypes, filter) {
            assertRangeValid(this);
            return new RangeNodeIterator(this, nodeTypes, filter);
        },

        getNodes: function(nodeTypes, filter) {
            assertRangeValid(this);
            return getNodesInRange(this, nodeTypes, filter);
        },

        getDocument: function() {
            return getRangeDocument(this);
        },

        collapseBefore: function(node) {
            assertNotDetached(this);

            this.setEndBefore(node);
            this.collapse(false);
        },

        collapseAfter: function(node) {
            assertNotDetached(this);

            this.setStartAfter(node);
            this.collapse(true);
        },

        getName: function() {
            return "DomRange";
        },

        equals: function(range) {
            return Range.rangesEqual(this, range);
        },

        isValid: function() {
            return isRangeValid(this);
        },

        inspect: function() {
            return inspect(this);
        }
    };

    function copyComparisonConstantsToObject(obj) {
        obj.START_TO_START = s2s;
        obj.START_TO_END = s2e;
        obj.END_TO_END = e2e;
        obj.END_TO_START = e2s;

        obj.NODE_BEFORE = n_b;
        obj.NODE_AFTER = n_a;
        obj.NODE_BEFORE_AND_AFTER = n_b_a;
        obj.NODE_INSIDE = n_i;
    }

    function copyComparisonConstants(constructor) {
        copyComparisonConstantsToObject(constructor);
        copyComparisonConstantsToObject(constructor.prototype);
    }

    function createRangeContentRemover(remover, boundaryUpdater) {
        return function() {
            assertRangeValid(this);

            var sc = this.startContainer, so = this.startOffset, root = this.commonAncestorContainer;

            var iterator = new RangeIterator(this, true);

            // Work out where to position the range after content removal
            var node, boundary;
            if (sc !== root) {
                node = dom.getClosestAncestorIn(sc, root, true);
                boundary = getBoundaryAfterNode(node);
                sc = boundary.node;
                so = boundary.offset;
            }

            // Check none of the range is read-only
            iterateSubtree(iterator, assertNodeNotReadOnly);

            iterator.reset();

            // Remove the content
            var returnValue = remover(iterator);
            iterator.detach();

            // Move to the new position
            boundaryUpdater(this, sc, so, sc, so);

            return returnValue;
        };
    }

    function createPrototypeRange(constructor, boundaryUpdater, detacher) {
        function createBeforeAfterNodeSetter(isBefore, isStart) {
            return function(node) {
                assertNotDetached(this);
                assertValidNodeType(node, beforeAfterNodeTypes);
                assertValidNodeType(getRootContainer(node), rootContainerNodeTypes);

                var boundary = (isBefore ? getBoundaryBeforeNode : getBoundaryAfterNode)(node);
                (isStart ? setRangeStart : setRangeEnd)(this, boundary.node, boundary.offset);
            };
        }

        function setRangeStart(range, node, offset) {
            var ec = range.endContainer, eo = range.endOffset;
            if (node !== range.startContainer || offset !== range.startOffset) {
                // Check the root containers of the range and the new boundary, and also check whether the new boundary
                // is after the current end. In either case, collapse the range to the new position
                if (getRootContainer(node) != getRootContainer(ec) || dom.comparePoints(node, offset, ec, eo) == 1) {
                    ec = node;
                    eo = offset;
                }
                boundaryUpdater(range, node, offset, ec, eo);
            }
        }

        function setRangeEnd(range, node, offset) {
            var sc = range.startContainer, so = range.startOffset;
            if (node !== range.endContainer || offset !== range.endOffset) {
                // Check the root containers of the range and the new boundary, and also check whether the new boundary
                // is after the current end. In either case, collapse the range to the new position
                if (getRootContainer(node) != getRootContainer(sc) || dom.comparePoints(node, offset, sc, so) == -1) {
                    sc = node;
                    so = offset;
                }
                boundaryUpdater(range, sc, so, node, offset);
            }
        }

        function setRangeStartAndEnd(range, node, offset) {
            if (node !== range.startContainer || offset !== range.startOffset || node !== range.endContainer || offset !== range.endOffset) {
                boundaryUpdater(range, node, offset, node, offset);
            }
        }

        constructor.prototype = new RangePrototype();

        api.util.extend(constructor.prototype, {
            setStart: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeStart(this, node, offset);
            },

            setEnd: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeEnd(this, node, offset);
            },

            setStartBefore: createBeforeAfterNodeSetter(true, true),
            setStartAfter: createBeforeAfterNodeSetter(false, true),
            setEndBefore: createBeforeAfterNodeSetter(true, false),
            setEndAfter: createBeforeAfterNodeSetter(false, false),

            collapse: function(isStart) {
                assertRangeValid(this);
                if (isStart) {
                    boundaryUpdater(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset);
                } else {
                    boundaryUpdater(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset);
                }
            },

            selectNodeContents: function(node) {
                // This doesn't seem well specified: the spec talks only about selecting the node's contents, which
                // could be taken to mean only its children. However, browsers implement this the same as selectNode for
                // text nodes, so I shall do likewise
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);

                boundaryUpdater(this, node, 0, node, dom.getNodeLength(node));
            },

            selectNode: function(node) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, false);
                assertValidNodeType(node, beforeAfterNodeTypes);

                var start = getBoundaryBeforeNode(node), end = getBoundaryAfterNode(node);
                boundaryUpdater(this, start.node, start.offset, end.node, end.offset);
            },

            extractContents: createRangeContentRemover(extractSubtree, boundaryUpdater),

            deleteContents: createRangeContentRemover(deleteSubtree, boundaryUpdater),

            canSurroundContents: function() {
                assertRangeValid(this);
                assertNodeNotReadOnly(this.startContainer);
                assertNodeNotReadOnly(this.endContainer);

                // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
                // no non-text nodes.
                var iterator = new RangeIterator(this, true);
                var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                        (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
                iterator.detach();
                return !boundariesInvalid;
            },

            detach: function() {
                detacher(this);
            },

            splitBoundaries: function() {
                assertRangeValid(this);


                var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;
                var startEndSame = (sc === ec);

                if (dom.isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
                    dom.splitDataNode(ec, eo);

                }

                if (dom.isCharacterDataNode(sc) && so > 0 && so < sc.length) {

                    sc = dom.splitDataNode(sc, so);
                    if (startEndSame) {
                        eo -= so;
                        ec = sc;
                    } else if (ec == sc.parentNode && eo >= dom.getNodeIndex(sc)) {
                        eo++;
                    }
                    so = 0;

                }
                boundaryUpdater(this, sc, so, ec, eo);
            },

            normalizeBoundaries: function() {
                assertRangeValid(this);

                var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;

                var mergeForward = function(node) {
                    var sibling = node.nextSibling;
                    if (sibling && sibling.nodeType == node.nodeType) {
                        ec = node;
                        eo = node.length;
                        node.appendData(sibling.data);
                        sibling.parentNode.removeChild(sibling);
                    }
                };

                var mergeBackward = function(node) {
                    var sibling = node.previousSibling;
                    if (sibling && sibling.nodeType == node.nodeType) {
                        sc = node;
                        var nodeLength = node.length;
                        so = sibling.length;
                        node.insertData(0, sibling.data);
                        sibling.parentNode.removeChild(sibling);
                        if (sc == ec) {
                            eo += so;
                            ec = sc;
                        } else if (ec == node.parentNode) {
                            var nodeIndex = dom.getNodeIndex(node);
                            if (eo == nodeIndex) {
                                ec = node;
                                eo = nodeLength;
                            } else if (eo > nodeIndex) {
                                eo--;
                            }
                        }
                    }
                };

                var normalizeStart = true;

                if (dom.isCharacterDataNode(ec)) {
                    if (ec.length == eo) {
                        mergeForward(ec);
                    }
                } else {
                    if (eo > 0) {
                        var endNode = ec.childNodes[eo - 1];
                        if (endNode && dom.isCharacterDataNode(endNode)) {
                            mergeForward(endNode);
                        }
                    }
                    normalizeStart = !this.collapsed;
                }

                if (normalizeStart) {
                    if (dom.isCharacterDataNode(sc)) {
                        if (so == 0) {
                            mergeBackward(sc);
                        }
                    } else {
                        if (so < sc.childNodes.length) {
                            var startNode = sc.childNodes[so];
                            if (startNode && dom.isCharacterDataNode(startNode)) {
                                mergeBackward(startNode);
                            }
                        }
                    }
                } else {
                    sc = ec;
                    so = eo;
                }

                boundaryUpdater(this, sc, so, ec, eo);
            },

            collapseToPoint: function(node, offset) {
                assertNotDetached(this);

                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeStartAndEnd(this, node, offset);
            }
        });

        copyComparisonConstants(constructor);
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Updates commonAncestorContainer and collapsed after boundary change
    function updateCollapsedAndCommonAncestor(range) {
        range.collapsed = (range.startContainer === range.endContainer && range.startOffset === range.endOffset);
        range.commonAncestorContainer = range.collapsed ?
            range.startContainer : dom.getCommonAncestor(range.startContainer, range.endContainer);
    }

    function updateBoundaries(range, startContainer, startOffset, endContainer, endOffset) {
        var startMoved = (range.startContainer !== startContainer || range.startOffset !== startOffset);
        var endMoved = (range.endContainer !== endContainer || range.endOffset !== endOffset);

        range.startContainer = startContainer;
        range.startOffset = startOffset;
        range.endContainer = endContainer;
        range.endOffset = endOffset;

        updateCollapsedAndCommonAncestor(range);
        dispatchEvent(range, "boundarychange", {startMoved: startMoved, endMoved: endMoved});
    }

    function detach(range) {
        assertNotDetached(range);
        range.startContainer = range.startOffset = range.endContainer = range.endOffset = null;
        range.collapsed = range.commonAncestorContainer = null;
        dispatchEvent(range, "detach", null);
        range._listeners = null;
    }

    /**
     * @constructor
     */
    function Range(doc) {
        this.startContainer = doc;
        this.startOffset = 0;
        this.endContainer = doc;
        this.endOffset = 0;
        this._listeners = {
            boundarychange: [],
            detach: []
        };
        updateCollapsedAndCommonAncestor(this);
    }

    createPrototypeRange(Range, updateBoundaries, detach);

    api.rangePrototype = RangePrototype.prototype;

    Range.rangeProperties = rangeProperties;
    Range.RangeIterator = RangeIterator;
    Range.copyComparisonConstants = copyComparisonConstants;
    Range.createPrototypeRange = createPrototypeRange;
    Range.inspect = inspect;
    Range.getRangeDocument = getRangeDocument;
    Range.rangesEqual = function(r1, r2) {
        return r1.startContainer === r2.startContainer &&
               r1.startOffset === r2.startOffset &&
               r1.endContainer === r2.endContainer &&
               r1.endOffset === r2.endOffset;
    };

    api.DomRange = Range;
    api.RangeException = RangeException;
});rangy.createModule("WrappedRange", function(api, module) {
    api.requireModules( ["DomUtil", "DomRange"] );

    /**
     * @constructor
     */
    var WrappedRange;
    var dom = api.dom;
    var DomPosition = dom.DomPosition;
    var DomRange = api.DomRange;



    /*----------------------------------------------------------------------------------------------------------------*/

    /*
    This is a workaround for a bug where IE returns the wrong container element from the TextRange's parentElement()
    method. For example, in the following (where pipes denote the selection boundaries):

    <ul id="ul"><li id="a">| a </li><li id="b"> b |</li></ul>

    var range = document.selection.createRange();
    alert(range.parentElement().id); // Should alert "ul" but alerts "b"

    This method returns the common ancestor node of the following:
    - the parentElement() of the textRange
    - the parentElement() of the textRange after calling collapse(true)
    - the parentElement() of the textRange after calling collapse(false)
     */
    function getTextRangeContainerElement(textRange) {
        var parentEl = textRange.parentElement();

        var range = textRange.duplicate();
        range.collapse(true);
        var startEl = range.parentElement();
        range = textRange.duplicate();
        range.collapse(false);
        var endEl = range.parentElement();
        var startEndContainer = (startEl == endEl) ? startEl : dom.getCommonAncestor(startEl, endEl);

        return startEndContainer == parentEl ? startEndContainer : dom.getCommonAncestor(parentEl, startEndContainer);
    }

    function textRangeIsCollapsed(textRange) {
        return textRange.compareEndPoints("StartToEnd", textRange) == 0;
    }

    // Gets the boundary of a TextRange expressed as a node and an offset within that node. This function started out as
    // an improved version of code found in Tim Cameron Ryan's IERange (http://code.google.com/p/ierange/) but has
    // grown, fixing problems with line breaks in preformatted text, adding workaround for IE TextRange bugs, handling
    // for inputs and images, plus optimizations.
    function getTextRangeBoundaryPosition(textRange, wholeRangeContainerElement, isStart, isCollapsed) {
        var workingRange = textRange.duplicate();

        workingRange.collapse(isStart);
        var containerElement = workingRange.parentElement();

        // Sometimes collapsing a TextRange that's at the start of a text node can move it into the previous node, so
        // check for that
        // TODO: Find out when. Workaround for wholeRangeContainerElement may break this
        if (!dom.isAncestorOf(wholeRangeContainerElement, containerElement, true)) {
            containerElement = wholeRangeContainerElement;

        }



        // Deal with nodes that cannot "contain rich HTML markup". In practice, this means form inputs, images and
        // similar. See http://msdn.microsoft.com/en-us/library/aa703950%28VS.85%29.aspx
        if (!containerElement.canHaveHTML) {
            return new DomPosition(containerElement.parentNode, dom.getNodeIndex(containerElement));
        }

        var workingNode = dom.getDocument(containerElement).createElement("span");
        var comparison, workingComparisonType = isStart ? "StartToStart" : "StartToEnd";
        var previousNode, nextNode, boundaryPosition, boundaryNode;

        // Move the working range through the container's children, starting at the end and working backwards, until the
        // working range reaches or goes past the boundary we're interested in
        do {
            containerElement.insertBefore(workingNode, workingNode.previousSibling);
            workingRange.moveToElementText(workingNode);
        } while ( (comparison = workingRange.compareEndPoints(workingComparisonType, textRange)) > 0 &&
                workingNode.previousSibling);

        // We've now reached or gone past the boundary of the text range we're interested in
        // so have identified the node we want
        boundaryNode = workingNode.nextSibling;

        if (comparison == -1 && boundaryNode && dom.isCharacterDataNode(boundaryNode)) {
            // This is a character data node (text, comment, cdata). The working range is collapsed at the start of the
            // node containing the text range's boundary, so we move the end of the working range to the boundary point
            // and measure the length of its text to get the boundary's offset within the node.
            workingRange.setEndPoint(isStart ? "EndToStart" : "EndToEnd", textRange);


            var offset;

            if (/[\r\n]/.test(boundaryNode.data)) {
                /*
                For the particular case of a boundary within a text node containing line breaks (within a <pre> element,
                for example), we need a slightly complicated approach to get the boundary's offset in IE. The facts:

                - Each line break is represented as \r in the text node's data/nodeValue properties
                - Each line break is represented as \r\n in the TextRange's 'text' property
                - The 'text' property of the TextRange does not contain trailing line breaks

                To get round the problem presented by the final fact above, we can use the fact that TextRange's
                moveStart() and moveEnd() methods return the actual number of characters moved, which is not necessarily
                the same as the number of characters it was instructed to move. The simplest approach is to use this to
                store the characters moved when moving both the start and end of the range to the start of the document
                body and subtracting the start offset from the end offset (the "move-negative-gazillion" method).
                However, this is extremely slow when the document is large and the range is near the end of it. Clearly
                doing the mirror image (i.e. moving the range boundaries to the end of the document) has the same
                problem.

                Another approach that works is to use moveStart() to move the start boundary of the range up to the end
                boundary one character at a time and incrementing a counter with the value returned by the moveStart()
                call. However, the check for whether the start boundary has reached the end boundary is expensive, so
                this method is slow (although unlike "move-negative-gazillion" is largely unaffected by the location of
                the range within the document).

                The method below is a hybrid of the two methods above. It uses the fact that a string containing the
                TextRange's 'text' property with each \r\n converted to a single \r character cannot be longer than the
                text of the TextRange, so the start of the range is moved that length initially and then a character at
                a time to make up for any trailing line breaks not contained in the 'text' property. This has good
                performance in most situations compared to the previous two methods.
                */
                var tempRange = workingRange.duplicate();
                var rangeLength = tempRange.text.replace(/\r\n/g, "\r").length;

                offset = tempRange.moveStart("character", rangeLength);
                while ( (comparison = tempRange.compareEndPoints("StartToEnd", tempRange)) == -1) {
                    offset++;
                    tempRange.moveStart("character", 1);
                }
            } else {
                offset = workingRange.text.length;
            }
            boundaryPosition = new DomPosition(boundaryNode, offset);
        } else {


            // If the boundary immediately follows a character data node and this is the end boundary, we should favour
            // a position within that, and likewise for a start boundary preceding a character data node
            previousNode = (isCollapsed || !isStart) && workingNode.previousSibling;
            nextNode = (isCollapsed || isStart) && workingNode.nextSibling;



            if (nextNode && dom.isCharacterDataNode(nextNode)) {
                boundaryPosition = new DomPosition(nextNode, 0);
            } else if (previousNode && dom.isCharacterDataNode(previousNode)) {
                boundaryPosition = new DomPosition(previousNode, previousNode.length);
            } else {
                boundaryPosition = new DomPosition(containerElement, dom.getNodeIndex(workingNode));
            }
        }

        // Clean up
        workingNode.parentNode.removeChild(workingNode);

        return boundaryPosition;
    }

    // Returns a TextRange representing the boundary of a TextRange expressed as a node and an offset within that node.
    // This function started out as an optimized version of code found in Tim Cameron Ryan's IERange
    // (http://code.google.com/p/ierange/)
    function createBoundaryTextRange(boundaryPosition, isStart) {
        var boundaryNode, boundaryParent, boundaryOffset = boundaryPosition.offset;
        var doc = dom.getDocument(boundaryPosition.node);
        var workingNode, childNodes, workingRange = doc.body.createTextRange();
        var nodeIsDataNode = dom.isCharacterDataNode(boundaryPosition.node);

        if (nodeIsDataNode) {
            boundaryNode = boundaryPosition.node;
            boundaryParent = boundaryNode.parentNode;
        } else {
            childNodes = boundaryPosition.node.childNodes;
            boundaryNode = (boundaryOffset < childNodes.length) ? childNodes[boundaryOffset] : null;
            boundaryParent = boundaryPosition.node;
        }

        // Position the range immediately before the node containing the boundary
        workingNode = doc.createElement("span");

        // Making the working element non-empty element persuades IE to consider the TextRange boundary to be within the
        // element rather than immediately before or after it, which is what we want
        workingNode.innerHTML = "&#feff;";

        // insertBefore is supposed to work like appendChild if the second parameter is null. However, a bug report
        // for IERange suggests that it can crash the browser: http://code.google.com/p/ierange/issues/detail?id=12
        if (boundaryNode) {
            boundaryParent.insertBefore(workingNode, boundaryNode);
        } else {
            boundaryParent.appendChild(workingNode);
        }

        workingRange.moveToElementText(workingNode);
        workingRange.collapse(!isStart);

        // Clean up
        boundaryParent.removeChild(workingNode);

        // Move the working range to the text offset, if required
        if (nodeIsDataNode) {
            workingRange[isStart ? "moveStart" : "moveEnd"]("character", boundaryOffset);
        }

        return workingRange;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    if (api.features.implementsDomRange && (!api.features.implementsTextRange || !api.config.preferTextRange)) {
        // This is a wrapper around the browser's native DOM Range. It has two aims:
        // - Provide workarounds for specific browser bugs
        // - provide convenient extensions, which are inherited from Rangy's DomRange

        (function() {
            var rangeProto;
            var rangeProperties = DomRange.rangeProperties;
            var canSetRangeStartAfterEnd;

            function updateRangeProperties(range) {
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = range.nativeRange[prop];
                }
            }

            function updateNativeRange(range, startContainer, startOffset, endContainer,endOffset) {
                var startMoved = (range.startContainer !== startContainer || range.startOffset != startOffset);
                var endMoved = (range.endContainer !== endContainer || range.endOffset != endOffset);

                // Always set both boundaries for the benefit of IE9 (see issue 35)
                if (startMoved || endMoved) {
                    range.setEnd(endContainer, endOffset);
                    range.setStart(startContainer, startOffset);
                }
            }

            function detach(range) {
                range.nativeRange.detach();
                range.detached = true;
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = null;
                }
            }

            var createBeforeAfterNodeSetter;

            WrappedRange = function(range) {
                if (!range) {
                    throw new Error("Range must be specified");
                }
                this.nativeRange = range;
                updateRangeProperties(this);
            };

            DomRange.createPrototypeRange(WrappedRange, updateNativeRange, detach);

            rangeProto = WrappedRange.prototype;

            rangeProto.selectNode = function(node) {
                this.nativeRange.selectNode(node);
                updateRangeProperties(this);
            };

            rangeProto.deleteContents = function() {
                this.nativeRange.deleteContents();
                updateRangeProperties(this);
            };

            rangeProto.extractContents = function() {
                var frag = this.nativeRange.extractContents();
                updateRangeProperties(this);
                return frag;
            };

            rangeProto.cloneContents = function() {
                return this.nativeRange.cloneContents();
            };

            // TODO: Until I can find a way to programmatically trigger the Firefox bug (apparently long-standing, still
            // present in 3.6.8) that throws "Index or size is negative or greater than the allowed amount" for
            // insertNode in some circumstances, all browsers will have to use the Rangy's own implementation of
            // insertNode, which works but is almost certainly slower than the native implementation.
/*
            rangeProto.insertNode = function(node) {
                this.nativeRange.insertNode(node);
                updateRangeProperties(this);
            };
*/

            rangeProto.surroundContents = function(node) {
                this.nativeRange.surroundContents(node);
                updateRangeProperties(this);
            };

            rangeProto.collapse = function(isStart) {
                this.nativeRange.collapse(isStart);
                updateRangeProperties(this);
            };

            rangeProto.cloneRange = function() {
                return new WrappedRange(this.nativeRange.cloneRange());
            };

            rangeProto.refresh = function() {
                updateRangeProperties(this);
            };

            rangeProto.toString = function() {
                return this.nativeRange.toString();
            };

            // Create test range and node for feature detection

            var testTextNode = document.createTextNode("test");
            dom.getBody(document).appendChild(testTextNode);
            var range = document.createRange();

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for Firefox 2 bug that prevents moving the start of a Range to a point after its current end and
            // correct for it

            range.setStart(testTextNode, 0);
            range.setEnd(testTextNode, 0);

            try {
                range.setStart(testTextNode, 1);
                canSetRangeStartAfterEnd = true;

                rangeProto.setStart = function(node, offset) {
                    this.nativeRange.setStart(node, offset);
                    updateRangeProperties(this);
                };

                rangeProto.setEnd = function(node, offset) {
                    this.nativeRange.setEnd(node, offset);
                    updateRangeProperties(this);
                };

                createBeforeAfterNodeSetter = function(name) {
                    return function(node) {
                        this.nativeRange[name](node);
                        updateRangeProperties(this);
                    };
                };

            } catch(ex) {


                canSetRangeStartAfterEnd = false;

                rangeProto.setStart = function(node, offset) {
                    try {
                        this.nativeRange.setStart(node, offset);
                    } catch (ex) {
                        this.nativeRange.setEnd(node, offset);
                        this.nativeRange.setStart(node, offset);
                    }
                    updateRangeProperties(this);
                };

                rangeProto.setEnd = function(node, offset) {
                    try {
                        this.nativeRange.setEnd(node, offset);
                    } catch (ex) {
                        this.nativeRange.setStart(node, offset);
                        this.nativeRange.setEnd(node, offset);
                    }
                    updateRangeProperties(this);
                };

                createBeforeAfterNodeSetter = function(name, oppositeName) {
                    return function(node) {
                        try {
                            this.nativeRange[name](node);
                        } catch (ex) {
                            this.nativeRange[oppositeName](node);
                            this.nativeRange[name](node);
                        }
                        updateRangeProperties(this);
                    };
                };
            }

            rangeProto.setStartBefore = createBeforeAfterNodeSetter("setStartBefore", "setEndBefore");
            rangeProto.setStartAfter = createBeforeAfterNodeSetter("setStartAfter", "setEndAfter");
            rangeProto.setEndBefore = createBeforeAfterNodeSetter("setEndBefore", "setStartBefore");
            rangeProto.setEndAfter = createBeforeAfterNodeSetter("setEndAfter", "setStartAfter");

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for and correct Firefox 2 behaviour with selectNodeContents on text nodes: it collapses the range to
            // the 0th character of the text node
            range.selectNodeContents(testTextNode);
            if (range.startContainer == testTextNode && range.endContainer == testTextNode &&
                    range.startOffset == 0 && range.endOffset == testTextNode.length) {
                rangeProto.selectNodeContents = function(node) {
                    this.nativeRange.selectNodeContents(node);
                    updateRangeProperties(this);
                };
            } else {
                rangeProto.selectNodeContents = function(node) {
                    this.setStart(node, 0);
                    this.setEnd(node, DomRange.getEndOffset(node));
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for WebKit bug that has the beahviour of compareBoundaryPoints round the wrong way for constants
            // START_TO_END and END_TO_START: https://bugs.webkit.org/show_bug.cgi?id=20738

            range.selectNodeContents(testTextNode);
            range.setEnd(testTextNode, 3);

            var range2 = document.createRange();
            range2.selectNodeContents(testTextNode);
            range2.setEnd(testTextNode, 4);
            range2.setStart(testTextNode, 2);

            if (range.compareBoundaryPoints(range.START_TO_END, range2) == -1 &
                    range.compareBoundaryPoints(range.END_TO_START, range2) == 1) {
                // This is the wrong way round, so correct for it


                rangeProto.compareBoundaryPoints = function(type, range) {
                    range = range.nativeRange || range;
                    if (type == range.START_TO_END) {
                        type = range.END_TO_START;
                    } else if (type == range.END_TO_START) {
                        type = range.START_TO_END;
                    }
                    return this.nativeRange.compareBoundaryPoints(type, range);
                };
            } else {
                rangeProto.compareBoundaryPoints = function(type, range) {
                    return this.nativeRange.compareBoundaryPoints(type, range.nativeRange || range);
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for existence of createContextualFragment and delegate to it if it exists
            if (api.util.isHostMethod(range, "createContextualFragment")) {
                rangeProto.createContextualFragment = function(fragmentStr) {
                    return this.nativeRange.createContextualFragment(fragmentStr);
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Clean up
            dom.getBody(document).removeChild(testTextNode);
            range.detach();
            range2.detach();
        })();

        api.createNativeRange = function(doc) {
            doc = doc || document;
            return doc.createRange();
        };
    } else if (api.features.implementsTextRange) {
        // This is a wrapper around a TextRange, providing full DOM Range functionality using rangy's DomRange as a
        // prototype

        WrappedRange = function(textRange) {
            this.textRange = textRange;
            this.refresh();
        };

        WrappedRange.prototype = new DomRange(document);

        WrappedRange.prototype.refresh = function() {
            var start, end;

            // TextRange's parentElement() method cannot be trusted. getTextRangeContainerElement() works around that.
            var rangeContainerElement = getTextRangeContainerElement(this.textRange);

            if (textRangeIsCollapsed(this.textRange)) {
                end = start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, true);
            } else {

                start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, false);
                end = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, false, false);
            }

            this.setStart(start.node, start.offset);
            this.setEnd(end.node, end.offset);
        };

        DomRange.copyComparisonConstants(WrappedRange);

        // Add WrappedRange as the Range property of the global object to allow expression like Range.END_TO_END to work
        var globalObj = (function() { return this; })();
        if (typeof globalObj.Range == "undefined") {
            globalObj.Range = WrappedRange;
        }

        api.createNativeRange = function(doc) {
            doc = doc || document;
            return doc.body.createTextRange();
        };
    }

    if (api.features.implementsTextRange) {
        WrappedRange.rangeToTextRange = function(range) {
            if (range.collapsed) {
                var tr = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);



                return tr;

                //return createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
            } else {
                var startRange = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
                var endRange = createBoundaryTextRange(new DomPosition(range.endContainer, range.endOffset), false);
                var textRange = dom.getDocument(range.startContainer).body.createTextRange();
                textRange.setEndPoint("StartToStart", startRange);
                textRange.setEndPoint("EndToEnd", endRange);
                return textRange;
            }
        };
    }

    WrappedRange.prototype.getName = function() {
        return "WrappedRange";
    };

    api.WrappedRange = WrappedRange;

    api.createRange = function(doc) {
        doc = doc || document;
        return new WrappedRange(api.createNativeRange(doc));
    };

    api.createRangyRange = function(doc) {
        doc = doc || document;
        return new DomRange(doc);
    };

    api.createIframeRange = function(iframeEl) {
        return api.createRange(dom.getIframeDocument(iframeEl));
    };

    api.createIframeRangyRange = function(iframeEl) {
        return api.createRangyRange(dom.getIframeDocument(iframeEl));
    };

    api.addCreateMissingNativeApiListener(function(win) {
        var doc = win.document;
        if (typeof doc.createRange == "undefined") {
            doc.createRange = function() {
                return api.createRange(this);
            };
        }
        doc = win = null;
    });
});rangy.createModule("WrappedSelection", function(api, module) {
    // This will create a selection object wrapper that follows the Selection object found in the WHATWG draft DOM Range
    // spec (http://html5.org/specs/dom-range.html)

    api.requireModules( ["DomUtil", "DomRange", "WrappedRange"] );

    api.config.checkSelectionRanges = true;

    var BOOLEAN = "boolean",
        windowPropertyName = "_rangySelection",
        dom = api.dom,
        util = api.util,
        DomRange = api.DomRange,
        WrappedRange = api.WrappedRange,
        DOMException = api.DOMException,
        DomPosition = dom.DomPosition,
        getSelection,
        selectionIsCollapsed,
        CONTROL = "Control";



    function getWinSelection(winParam) {
        return (winParam || window).getSelection();
    }

    function getDocSelection(winParam) {
        return (winParam || window).document.selection;
    }

    // Test for the Range/TextRange and Selection features required
    // Test for ability to retrieve selection
    var implementsWinGetSelection = api.util.isHostMethod(window, "getSelection"),
        implementsDocSelection = api.util.isHostObject(document, "selection");

    var useDocumentSelection = implementsDocSelection && (!implementsWinGetSelection || api.config.preferTextRange);

    if (useDocumentSelection) {
        getSelection = getDocSelection;
        api.isSelectionValid = function(winParam) {
            var doc = (winParam || window).document, nativeSel = doc.selection;

            // Check whether the selection TextRange is actually contained within the correct document
            return (nativeSel.type != "None" || dom.getDocument(nativeSel.createRange().parentElement()) == doc);
        };
    } else if (implementsWinGetSelection) {
        getSelection = getWinSelection;
        api.isSelectionValid = function() {
            return true;
        };
    } else {
        module.fail("Neither document.selection or window.getSelection() detected.");
    }

    api.getNativeSelection = getSelection;

    var testSelection = getSelection();
    var testRange = api.createNativeRange(document);
    var body = dom.getBody(document);

    // Obtaining a range from a selection
    var selectionHasAnchorAndFocus = util.areHostObjects(testSelection, ["anchorNode", "focusNode"] &&
                                     util.areHostProperties(testSelection, ["anchorOffset", "focusOffset"]));
    api.features.selectionHasAnchorAndFocus = selectionHasAnchorAndFocus;

    // Test for existence of native selection extend() method
    var selectionHasExtend = util.isHostMethod(testSelection, "extend");
    api.features.selectionHasExtend = selectionHasExtend;

    // Test if rangeCount exists
    var selectionHasRangeCount = (typeof testSelection.rangeCount == "number");
    api.features.selectionHasRangeCount = selectionHasRangeCount;

    var selectionSupportsMultipleRanges = false;
    var collapsedNonEditableSelectionsSupported = true;

    if (util.areHostMethods(testSelection, ["addRange", "getRangeAt", "removeAllRanges"]) &&
            typeof testSelection.rangeCount == "number" && api.features.implementsDomRange) {

        (function() {
            var iframe = document.createElement("iframe");
            iframe.frameBorder = 0;
            iframe.style.position = "absolute";
            iframe.style.left = "-10000px";
            body.appendChild(iframe);

            var iframeDoc = dom.getIframeDocument(iframe);
            iframeDoc.open();
            iframeDoc.write("<html><head></head><body>12</body></html>");
            iframeDoc.close();

            var sel = dom.getIframeWindow(iframe).getSelection();
            var docEl = iframeDoc.documentElement;
            var iframeBody = docEl.lastChild, textNode = iframeBody.firstChild;

            // Test whether the native selection will allow a collapsed selection within a non-editable element
            var r1 = iframeDoc.createRange();
            r1.setStart(textNode, 1);
            r1.collapse(true);
            sel.addRange(r1);
            collapsedNonEditableSelectionsSupported = (sel.rangeCount == 1);
            sel.removeAllRanges();

            // Test whether the native selection is capable of supporting multiple ranges
            var r2 = r1.cloneRange();
            r1.setStart(textNode, 0);
            r2.setEnd(textNode, 2);
            sel.addRange(r1);
            sel.addRange(r2);

            selectionSupportsMultipleRanges = (sel.rangeCount == 2);

            // Clean up
            r1.detach();
            r2.detach();

            body.removeChild(iframe);
        })();
    }

    api.features.selectionSupportsMultipleRanges = selectionSupportsMultipleRanges;
    api.features.collapsedNonEditableSelectionsSupported = collapsedNonEditableSelectionsSupported;

    // ControlRanges
    var implementsControlRange = false, testControlRange;

    if (body && util.isHostMethod(body, "createControlRange")) {
        testControlRange = body.createControlRange();
        if (util.areHostProperties(testControlRange, ["item", "add"])) {
            implementsControlRange = true;
        }
    }
    api.features.implementsControlRange = implementsControlRange;

    // Selection collapsedness
    if (selectionHasAnchorAndFocus) {
        selectionIsCollapsed = function(sel) {
            return sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset;
        };
    } else {
        selectionIsCollapsed = function(sel) {
            return sel.rangeCount ? sel.getRangeAt(sel.rangeCount - 1).collapsed : false;
        };
    }

    function updateAnchorAndFocusFromRange(sel, range, backwards) {
        var anchorPrefix = backwards ? "end" : "start", focusPrefix = backwards ? "start" : "end";
        sel.anchorNode = range[anchorPrefix + "Container"];
        sel.anchorOffset = range[anchorPrefix + "Offset"];
        sel.focusNode = range[focusPrefix + "Container"];
        sel.focusOffset = range[focusPrefix + "Offset"];
    }

    function updateAnchorAndFocusFromNativeSelection(sel) {
        var nativeSel = sel.nativeSelection;
        sel.anchorNode = nativeSel.anchorNode;
        sel.anchorOffset = nativeSel.anchorOffset;
        sel.focusNode = nativeSel.focusNode;
        sel.focusOffset = nativeSel.focusOffset;
    }

    function updateEmptySelection(sel) {
        sel.anchorNode = sel.focusNode = null;
        sel.anchorOffset = sel.focusOffset = 0;
        sel.rangeCount = 0;
        sel.isCollapsed = true;
        sel._ranges.length = 0;
    }

    function getNativeRange(range) {
        var nativeRange;
        if (range instanceof DomRange) {
            nativeRange = range._selectionNativeRange;
            if (!nativeRange) {
                nativeRange = api.createNativeRange(dom.getDocument(range.startContainer));
                nativeRange.setEnd(range.endContainer, range.endOffset);
                nativeRange.setStart(range.startContainer, range.startOffset);
                range._selectionNativeRange = nativeRange;
                range.attachListener("detach", function() {

                    this._selectionNativeRange = null;
                });
            }
        } else if (range instanceof WrappedRange) {
            nativeRange = range.nativeRange;
        } else if (api.features.implementsDomRange && (range instanceof dom.getWindow(range.startContainer).Range)) {
            nativeRange = range;
        }
        return nativeRange;
    }

    function rangeContainsSingleElement(rangeNodes) {
        if (!rangeNodes.length || rangeNodes[0].nodeType != 1) {
            return false;
        }
        for (var i = 1, len = rangeNodes.length; i < len; ++i) {
            if (!dom.isAncestorOf(rangeNodes[0], rangeNodes[i])) {
                return false;
            }
        }
        return true;
    }

    function getSingleElementFromRange(range) {
        var nodes = range.getNodes();
        if (!rangeContainsSingleElement(nodes)) {
            throw new Error("getSingleElementFromRange: range " + range.inspect() + " did not consist of a single element");
        }
        return nodes[0];
    }

    function isTextRange(range) {
        return !!range && typeof range.text != "undefined";
    }

    function updateFromTextRange(sel, range) {
        // Create a Range from the selected TextRange
        var wrappedRange = new WrappedRange(range);
        sel._ranges = [wrappedRange];

        updateAnchorAndFocusFromRange(sel, wrappedRange, false);
        sel.rangeCount = 1;
        sel.isCollapsed = wrappedRange.collapsed;
    }

    function updateControlSelection(sel) {
        // Update the wrapped selection based on what's now in the native selection
        sel._ranges.length = 0;
        if (sel.docSelection.type == "None") {
            updateEmptySelection(sel);
        } else {
            var controlRange = sel.docSelection.createRange();
            if (isTextRange(controlRange)) {
                // This case (where the selection type is "Control" and calling createRange() on the selection returns
                // a TextRange) can happen in IE 9. It happens, for example, when all elements in the selected
                // ControlRange have been removed from the ControlRange and removed from the document.
                updateFromTextRange(sel, controlRange);
            } else {
                sel.rangeCount = controlRange.length;
                var range, doc = dom.getDocument(controlRange.item(0));
                for (var i = 0; i < sel.rangeCount; ++i) {
                    range = api.createRange(doc);
                    range.selectNode(controlRange.item(i));
                    sel._ranges.push(range);
                }
                sel.isCollapsed = sel.rangeCount == 1 && sel._ranges[0].collapsed;
                updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], false);
            }
        }
    }

    function addRangeToControlSelection(sel, range) {
        var controlRange = sel.docSelection.createRange();
        var rangeElement = getSingleElementFromRange(range);

        // Create a new ControlRange containing all the elements in the selected ControlRange plus the element
        // contained by the supplied range
        var doc = dom.getDocument(controlRange.item(0));
        var newControlRange = dom.getBody(doc).createControlRange();
        for (var i = 0, len = controlRange.length; i < len; ++i) {
            newControlRange.add(controlRange.item(i));
        }
        try {
            newControlRange.add(rangeElement);
        } catch (ex) {
            throw new Error("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
        }
        newControlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    var getSelectionRangeAt;

    if (util.isHostMethod(testSelection,  "getRangeAt")) {
        getSelectionRangeAt = function(sel, index) {
            try {
                return sel.getRangeAt(index);
            } catch(ex) {
                return null;
            }
        };
    } else if (selectionHasAnchorAndFocus) {
        getSelectionRangeAt = function(sel) {
            var doc = dom.getDocument(sel.anchorNode);
            var range = api.createRange(doc);
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);

            // Handle the case when the selection was selected backwards (from the end to the start in the
            // document)
            if (range.collapsed !== this.isCollapsed) {
                range.setStart(sel.focusNode, sel.focusOffset);
                range.setEnd(sel.anchorNode, sel.anchorOffset);
            }

            return range;
        };
    }

    /**
     * @constructor
     */
    function WrappedSelection(selection, docSelection, win) {
        this.nativeSelection = selection;
        this.docSelection = docSelection;
        this._ranges = [];
        this.win = win;
        this.refresh();
    }

    api.getSelection = function(win) {
        win = win || window;
        var sel = win[windowPropertyName];
        var nativeSel = getSelection(win), docSel = implementsDocSelection ? getDocSelection(win) : null;
        if (sel) {
            sel.nativeSelection = nativeSel;
            sel.docSelection = docSel;
            sel.refresh(win);
        } else {
            sel = new WrappedSelection(nativeSel, docSel, win);
            win[windowPropertyName] = sel;
        }
        return sel;
    };

    api.getIframeSelection = function(iframeEl) {
        return api.getSelection(dom.getIframeWindow(iframeEl));
    };

    var selProto = WrappedSelection.prototype;

    function createControlSelection(sel, ranges) {
        // Ensure that the selection becomes of type "Control"
        var doc = dom.getDocument(ranges[0].startContainer);
        var controlRange = dom.getBody(doc).createControlRange();
        for (var i = 0, el; i < rangeCount; ++i) {
            el = getSingleElementFromRange(ranges[i]);
            try {
                controlRange.add(el);
            } catch (ex) {
                throw new Error("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)");
            }
        }
        controlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    // Selecting a range
    if (!useDocumentSelection && selectionHasAnchorAndFocus && util.areHostMethods(testSelection, ["removeAllRanges", "addRange"])) {
        selProto.removeAllRanges = function() {
            this.nativeSelection.removeAllRanges();
            updateEmptySelection(this);
        };

        var addRangeBackwards = function(sel, range) {
            var doc = DomRange.getRangeDocument(range);
            var endRange = api.createRange(doc);
            endRange.collapseToPoint(range.endContainer, range.endOffset);
            sel.nativeSelection.addRange(getNativeRange(endRange));
            sel.nativeSelection.extend(range.startContainer, range.startOffset);
            sel.refresh();
        };

        if (selectionHasRangeCount) {
            selProto.addRange = function(range, backwards) {
                if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
                    addRangeToControlSelection(this, range);
                } else {
                    if (backwards && selectionHasExtend) {
                        addRangeBackwards(this, range);
                    } else {
                        var previousRangeCount;
                        if (selectionSupportsMultipleRanges) {
                            previousRangeCount = this.rangeCount;
                        } else {
                            this.removeAllRanges();
                            previousRangeCount = 0;
                        }
                        this.nativeSelection.addRange(getNativeRange(range));

                        // Check whether adding the range was successful
                        this.rangeCount = this.nativeSelection.rangeCount;

                        if (this.rangeCount == previousRangeCount + 1) {
                            // The range was added successfully

                            // Check whether the range that we added to the selection is reflected in the last range extracted from
                            // the selection
                            if (api.config.checkSelectionRanges) {
                                var nativeRange = getSelectionRangeAt(this.nativeSelection, this.rangeCount - 1);
                                if (nativeRange && !DomRange.rangesEqual(nativeRange, range)) {
                                    // Happens in WebKit with, for example, a selection placed at the start of a text node
                                    range = new WrappedRange(nativeRange);
                                }
                            }
                            this._ranges[this.rangeCount - 1] = range;
                            updateAnchorAndFocusFromRange(this, range, selectionIsBackwards(this.nativeSelection));
                            this.isCollapsed = selectionIsCollapsed(this);
                        } else {
                            // The range was not added successfully. The simplest thing is to refresh
                            this.refresh();
                        }
                    }
                }
            };
        } else {
            selProto.addRange = function(range, backwards) {
                if (backwards && selectionHasExtend) {
                    addRangeBackwards(this, range);
                } else {
                    this.nativeSelection.addRange(getNativeRange(range));
                    this.refresh();
                }
            };
        }

        selProto.setRanges = function(ranges) {
            if (implementsControlRange && ranges.length > 1) {
                createControlSelection(this, ranges);
            } else {
                this.removeAllRanges();
                for (var i = 0, len = ranges.length; i < len; ++i) {
                    this.addRange(ranges[i]);
                }
            }
        };
    } else if (util.isHostMethod(testSelection, "empty") && util.isHostMethod(testRange, "select") &&
               implementsControlRange && useDocumentSelection) {

        selProto.removeAllRanges = function() {
            // Added try/catch as fix for issue #21
            try {
                this.docSelection.empty();

                // Check for empty() not working (issue #24)
                if (this.docSelection.type != "None") {
                    // Work around failure to empty a control selection by instead selecting a TextRange and then
                    // calling empty()
                    var doc;
                    if (this.anchorNode) {
                        doc = dom.getDocument(this.anchorNode);
                    } else if (this.docSelection.type == CONTROL) {
                        var controlRange = this.docSelection.createRange();
                        if (controlRange.length) {
                            doc = dom.getDocument(controlRange.item(0)).body.createTextRange();
                        }
                    }
                    if (doc) {
                        var textRange = doc.body.createTextRange();
                        textRange.select();
                        this.docSelection.empty();
                    }
                }
            } catch(ex) {}
            updateEmptySelection(this);
        };

        selProto.addRange = function(range) {
            if (this.docSelection.type == CONTROL) {
                addRangeToControlSelection(this, range);
            } else {
                WrappedRange.rangeToTextRange(range).select();
                this._ranges[0] = range;
                this.rangeCount = 1;
                this.isCollapsed = this._ranges[0].collapsed;
                updateAnchorAndFocusFromRange(this, range, false);
            }
        };

        selProto.setRanges = function(ranges) {
            this.removeAllRanges();
            var rangeCount = ranges.length;
            if (rangeCount > 1) {
                createControlSelection(this, ranges);
            } else if (rangeCount) {
                this.addRange(ranges[0]);
            }
        };
    } else {
        module.fail("No means of selecting a Range or TextRange was found");
        return false;
    }

    selProto.getRangeAt = function(index) {
        if (index < 0 || index >= this.rangeCount) {
            throw new DOMException("INDEX_SIZE_ERR");
        } else {
            return this._ranges[index];
        }
    };

    var refreshSelection;

    if (useDocumentSelection) {
        refreshSelection = function(sel) {
            var range;
            if (api.isSelectionValid(sel.win)) {
                range = sel.docSelection.createRange();
            } else {
                range = dom.getBody(sel.win.document).createTextRange();
                range.collapse(true);
            }


            if (sel.docSelection.type == CONTROL) {
                updateControlSelection(sel);
            } else if (isTextRange(range)) {
                updateFromTextRange(sel, range);
            } else {
                updateEmptySelection(sel);
            }
        };
    } else if (util.isHostMethod(testSelection, "getRangeAt") && typeof testSelection.rangeCount == "number") {
        refreshSelection = function(sel) {
            if (implementsControlRange && implementsDocSelection && sel.docSelection.type == CONTROL) {
                updateControlSelection(sel);
            } else {
                sel._ranges.length = sel.rangeCount = sel.nativeSelection.rangeCount;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        sel._ranges[i] = new api.WrappedRange(sel.nativeSelection.getRangeAt(i));
                    }
                    updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], selectionIsBackwards(sel.nativeSelection));
                    sel.isCollapsed = selectionIsCollapsed(sel);
                } else {
                    updateEmptySelection(sel);
                }
            }
        };
    } else if (selectionHasAnchorAndFocus && typeof testSelection.isCollapsed == BOOLEAN && typeof testRange.collapsed == BOOLEAN && api.features.implementsDomRange) {
        refreshSelection = function(sel) {
            var range, nativeSel = sel.nativeSelection;
            if (nativeSel.anchorNode) {
                range = getSelectionRangeAt(nativeSel, 0);
                sel._ranges = [range];
                sel.rangeCount = 1;
                updateAnchorAndFocusFromNativeSelection(sel);
                sel.isCollapsed = selectionIsCollapsed(sel);
            } else {
                updateEmptySelection(sel);
            }
        };
    } else {
        module.fail("No means of obtaining a Range or TextRange from the user's selection was found");
        return false;
    }

    selProto.refresh = function(checkForChanges) {
        var oldRanges = checkForChanges ? this._ranges.slice(0) : null;
        refreshSelection(this);
        if (checkForChanges) {
            var i = oldRanges.length;
            if (i != this._ranges.length) {
                return false;
            }
            while (i--) {
                if (!DomRange.rangesEqual(oldRanges[i], this._ranges[i])) {
                    return false;
                }
            }
            return true;
        }
    };

    // Removal of a single range
    var removeRangeManually = function(sel, range) {
        var ranges = sel.getAllRanges(), removed = false;
        sel.removeAllRanges();
        for (var i = 0, len = ranges.length; i < len; ++i) {
            if (removed || range !== ranges[i]) {
                sel.addRange(ranges[i]);
            } else {
                // According to the draft WHATWG Range spec, the same range may be added to the selection multiple
                // times. removeRange should only remove the first instance, so the following ensures only the first
                // instance is removed
                removed = true;
            }
        }
        if (!sel.rangeCount) {
            updateEmptySelection(sel);
        }
    };

    if (implementsControlRange) {
        selProto.removeRange = function(range) {
            if (this.docSelection.type == CONTROL) {
                var controlRange = this.docSelection.createRange();
                var rangeElement = getSingleElementFromRange(range);

                // Create a new ControlRange containing all the elements in the selected ControlRange minus the
                // element contained by the supplied range
                var doc = dom.getDocument(controlRange.item(0));
                var newControlRange = dom.getBody(doc).createControlRange();
                var el, removed = false;
                for (var i = 0, len = controlRange.length; i < len; ++i) {
                    el = controlRange.item(i);
                    if (el !== rangeElement || removed) {
                        newControlRange.add(controlRange.item(i));
                    } else {
                        removed = true;
                    }
                }
                newControlRange.select();

                // Update the wrapped selection based on what's now in the native selection
                updateControlSelection(this);
            } else {
                removeRangeManually(this, range);
            }
        };
    } else {
        selProto.removeRange = function(range) {
            removeRangeManually(this, range);
        };
    }

    // Detecting if a selection is backwards
    var selectionIsBackwards;
    if (!useDocumentSelection && selectionHasAnchorAndFocus && api.features.implementsDomRange) {
        selectionIsBackwards = function(sel) {
            var backwards = false;
            if (sel.anchorNode) {
                backwards = (dom.comparePoints(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset) == 1);
            }
            return backwards;
        };

        selProto.isBackwards = function() {
            return selectionIsBackwards(this);
        };
    } else {
        selectionIsBackwards = selProto.isBackwards = function() {
            return false;
        };
    }

    // Selection text
    // This is conformant to the new WHATWG DOM Range draft spec but differs from WebKit and Mozilla's implementation
    selProto.toString = function() {

        var rangeTexts = [];
        for (var i = 0, len = this.rangeCount; i < len; ++i) {
            rangeTexts[i] = "" + this._ranges[i];
        }
        return rangeTexts.join("");
    };

    function assertNodeInSameDocument(sel, node) {
        if (sel.anchorNode && (dom.getDocument(sel.anchorNode) !== dom.getDocument(node))) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }
    }

    // No current browsers conform fully to the HTML 5 draft spec for this method, so Rangy's own method is always used
    selProto.collapse = function(node, offset) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(dom.getDocument(node));
        range.collapseToPoint(node, offset);
        this.removeAllRanges();
        this.addRange(range);
        this.isCollapsed = true;
    };

    selProto.collapseToStart = function() {
        if (this.rangeCount) {
            var range = this._ranges[0];
            this.collapse(range.startContainer, range.startOffset);
        } else {
            throw new DOMException("INVALID_STATE_ERR");
        }
    };

    selProto.collapseToEnd = function() {
        if (this.rangeCount) {
            var range = this._ranges[this.rangeCount - 1];
            this.collapse(range.endContainer, range.endOffset);
        } else {
            throw new DOMException("INVALID_STATE_ERR");
        }
    };

    // The HTML 5 spec is very specific on how selectAllChildren should be implemented so the native implementation is
    // never used by Rangy.
    selProto.selectAllChildren = function(node) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(dom.getDocument(node));
        range.selectNodeContents(node);
        this.removeAllRanges();
        this.addRange(range);
    };

    selProto.deleteFromDocument = function() {
        // Sepcial behaviour required for Control selections
        if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
            var controlRange = this.docSelection.createRange();
            var element;
            while (controlRange.length) {
                element = controlRange.item(0);
                controlRange.remove(element);
                element.parentNode.removeChild(element);
            }
            this.refresh();
        } else if (this.rangeCount) {
            var ranges = this.getAllRanges();
            this.removeAllRanges();
            for (var i = 0, len = ranges.length; i < len; ++i) {
                ranges[i].deleteContents();
            }
            // The HTML5 spec says nothing about what the selection should contain after calling deleteContents on each
            // range. Firefox moves the selection to where the final selected range was, so we emulate that
            this.addRange(ranges[len - 1]);
        }
    };

    // The following are non-standard extensions
    selProto.getAllRanges = function() {
        return this._ranges.slice(0);
    };

    selProto.setSingleRange = function(range) {
        this.setRanges( [range] );
    };

    selProto.containsNode = function(node, allowPartial) {
        for (var i = 0, len = this._ranges.length; i < len; ++i) {
            if (this._ranges[i].containsNode(node, allowPartial)) {
                return true;
            }
        }
        return false;
    };

    selProto.toHtml = function() {
        var html = "";
        if (this.rangeCount) {
            var container = DomRange.getRangeDocument(this._ranges[0]).createElement("div");
            for (var i = 0, len = this._ranges.length; i < len; ++i) {
                container.appendChild(this._ranges[i].cloneContents());
            }
            html = container.innerHTML;
        }
        return html;
    };

    function inspect(sel) {
        var rangeInspects = [];
        var anchor = new DomPosition(sel.anchorNode, sel.anchorOffset);
        var focus = new DomPosition(sel.focusNode, sel.focusOffset);
        var name = (typeof sel.getName == "function") ? sel.getName() : "Selection";

        if (typeof sel.rangeCount != "undefined") {
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                rangeInspects[i] = DomRange.inspect(sel.getRangeAt(i));
            }
        }
        return "[" + name + "(Ranges: " + rangeInspects.join(", ") +
                ")(anchor: " + anchor.inspect() + ", focus: " + focus.inspect() + "]";

    }

    selProto.getName = function() {
        return "WrappedSelection";
    };

    selProto.inspect = function() {
        return inspect(this);
    };

    selProto.detach = function() {
        this.win[windowPropertyName] = null;
        this.win = this.anchorNode = this.focusNode = null;
    };

    WrappedSelection.inspect = inspect;

    api.Selection = WrappedSelection;

    api.selectionPrototype = selProto;

    api.addCreateMissingNativeApiListener(function(win) {
        if (typeof win.getSelection == "undefined") {
            win.getSelection = function() {
                return api.getSelection(this);
            };
        }
        win = null;
    });
});

;!function(exports, undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = new Object;
  }

  function configure(conf) {
    if (conf) {
      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.wildcard && (this.wildcard = conf.wildcard);
      if (this.wildcard) {
        this.listenerTree = new Object;
      }
    }
  }

  function EventEmitter(conf) {
    this._events = new Object;
    configure.call(this, conf);
  }

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }
    
    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }
        
        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
    
    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = new Object;
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = defaultMaxListeners;
            
            if (typeof this._events.maxListeners !== 'undefined') {
              m = this._events.maxListeners;
            }

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              console.trace();
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  };

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._events || init.call(this);
    this._events.maxListeners = n;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    };

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {
    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener') {
      if (!this._events.newListener) { return false; }
    }

    // Loop through the *_all* functions and invoke them.
    if (this._all) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        this._all[i].apply(this, args);
      }
    }

    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      
      if (!this._all && 
        !this._events.error && 
        !(this.wildcard && this.listenerTree.error)) {

        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    var handler;

    if(this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    }
    else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      if (arguments.length === 1) {
        handler.call(this);
      }
      else if (arguments.length > 1)
        switch (arguments.length) {
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            var l = arguments.length;
            var args = new Array(l - 1);
            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
            handler.apply(this, args);
        }
      return true;
    }
    else if (handler) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        this.event = type;
        listeners[i].apply(this, args);
      }
      return (listeners.length > 0) || this._all;
    }
    else {
      return this._all;
    }

  };

  EventEmitter.prototype.on = function(type, listener) {
    
    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
    else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (!this._events[type].warned) {

        var m = defaultMaxListeners;
        
        if (typeof this._events.maxListeners !== 'undefined') {
          m = this._events.maxListeners;
        }

        if (m > 0 && this._events[type].length > m) {

          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          console.trace();
        }
      }
    }
    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {

    if(!this._all) {
      this._all = [];
    }

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          return this;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1)
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          return this;
        }
      }
    } else {
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else {
      if (!this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
    define(function() {
      return EventEmitter;
    });
  } else {
    exports.EventEmitter2 = EventEmitter; 
  }

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);
// Inspired by http://blog.jcoglan.com/2007/07/23/writing-a-linked-list-in-javascript/

function LinkedList() {}
LinkedList.prototype = {
  length: 0,
  first: null,
  last: null
};

LinkedList.prototype.append = function(node) {
  if (typeof this.first === 'undefined' || this.first === null) {
    this.first = node;
  } else {
    node.next = null;
    this.last.next = node;
  }
  node.prev = this.last;
  this.last = node;
  this.length++;
};

LinkedList.prototype.insertAfter = function(node, newNode) {
  newNode.prev = node;
  if (node) {
    newNode.next = node.next;
    if (typeof node.next != 'undefined' && node.next !== null) {
      node.next.prev = newNode;
    }
    node.next = newNode;
    if (node === this.last) {
      this.last = newNode;
    }
  }
  else {
    // Insert after null implies inserting at position 0
    newNode.next = this.first;
    this.first.prev = newNode;
    this.first = newNode;
  }
  this.length++;
};

LinkedList.prototype.remove = function(node) {
  if (this.length > 1) {
    if (typeof node.prev !== 'undefined' && node.prev !== null) {
      node.prev.next = node.next;
    }
    if (typeof node.next !== 'undefined' && node.next !== null) {
      node.next.prev = node.prev;
    }
    if (node == this.first) { this.first = node.next; }
    if (node == this.last) { this.last = node.prev; }
  } else {
    this.first = null;
    this.last = null;
  }
  node.prev = null;
  node.next = null;
  this.length--;
};

LinkedList.prototype.toArray = function() {
  var arr = [];
  var cur = this.first;
  while (cur) {
    arr.push(cur);
    cur = cur.next;
  }
  return arr;
}

LinkedList.Node = function(data) {
  this.prev = null; this.next = null;
  this.data = data;
};

(function() {
  var _ = window._.noConflict();
  var EventEmitter2 = window.EventEmitter2;
  var LinkedList = window.LinkedList;
  var rangy = window.rangy;
  window.rangy = window.LinkedList = window.EventEmitter2 = undefined;
  
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ScribeDOM, ScribeDefaultTheme, ScribeEditor, ScribeSnowTheme, pjson;

pjson = require('./package.json');

ScribeDOM = require('./src/dom');

ScribeEditor = require('./src/editor');

ScribeDefaultTheme = require('./src/themes/default');

ScribeSnowTheme = require('./src/themes/snow');

window.Scribe = {
  version: pjson.version,
  DOM: ScribeDOM,
  Editor: ScribeEditor,
  Themes: {
    Default: ScribeDefaultTheme,
    Snow: ScribeSnowTheme
  }
};


},{"./package.json":10,"./src/dom":12,"./src/editor":13,"./src/themes/default":32,"./src/themes/snow":34}],2:[function(require,module,exports){
var Delta, InsertOp, Op, RetainOp, diff_match_patch, dmp;

diff_match_patch = require('./diff_match_patch');

Op = require('./op');

InsertOp = require('./insert');

RetainOp = require('./retain');

dmp = new diff_match_patch();

Delta = (function() {
  Delta.getIdentity = function(length) {
    return new Delta(length, length, [new RetainOp(0, length)]);
  };

  Delta.getInitial = function(contents) {
    return new Delta(0, contents.length, [new InsertOp(contents)]);
  };

  Delta.isDelta = function(delta) {
    var op, _i, _len, _ref;
    if ((delta != null) && typeof delta === "object" && typeof delta.startLength === "number" && typeof delta.endLength === "number" && typeof delta.ops === "object") {
      _ref = delta.ops;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        op = _ref[_i];
        if (!(Delta.isRetain(op) || Delta.isInsert(op))) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  Delta.isInsert = function(op) {
    return InsertOp.isInsert(op);
  };

  Delta.isRetain = function(op) {
    return RetainOp.isRetain(op);
  };

  Delta.makeDelta = function(obj) {
    return new Delta(obj.startLength, obj.endLength, _.map(obj.ops, function(op) {
      if (InsertOp.isInsert(op)) {
        return new InsertOp(op.value, op.attributes);
      } else if (RetainOp.isRetain(op)) {
        return new RetainOp(op.start, op.end, op.attributes);
      } else {
        return null;
      }
    }));
  };

  Delta.makeDeleteDelta = function(startLength, index, length) {
    var ops;
    ops = [];
    if (0 < index) {
      ops.push(new RetainOp(0, index));
    }
    if (index + length < startLength) {
      ops.push(new RetainOp(index + length, startLength));
    }
    return new Delta(startLength, ops);
  };

  Delta.makeInsertDelta = function(startLength, index, value, attributes) {
    var ops;
    ops = [new InsertOp(value, attributes)];
    if (0 < index) {
      ops.unshift(new RetainOp(0, index));
    }
    if (index < startLength) {
      ops.push(new RetainOp(index, startLength));
    }
    return new Delta(startLength, ops);
  };

  Delta.makeRetainDelta = function(startLength, index, length, attributes) {
    var ops;
    ops = [new RetainOp(index, index + length, attributes)];
    if (0 < index) {
      ops.unshift(new RetainOp(0, index));
    }
    if (index + length < startLength) {
      ops.push(new RetainOp(index + length, startLength));
    }
    return new Delta(startLength, ops);
  };

  function Delta(startLength, endLength, ops) {
    var length;
    this.startLength = startLength;
    this.endLength = endLength;
    this.ops = ops;
    if (this.ops == null) {
      this.ops = this.endLength;
      this.endLength = null;
    }
    this.ops = _.map(this.ops, function(op) {
      if (RetainOp.isRetain(op)) {
        return op;
      } else if (InsertOp.isInsert(op)) {
        return op;
      } else {
        throw new Error("Creating delta with invalid op. Expecting an insert or retain.");
      }
    });
    this.compact();
    length = _.reduce(this.ops, function(count, op) {
      return count + op.getLength();
    }, 0);
    if ((this.endLength != null) && length !== this.endLength) {
      throw new Error("Expecting end length of " + length);
    } else {
      this.endLength = length;
    }
  }

  Delta.prototype.apply = function(insertFn, deleteFn, applyAttrFn, context) {
    var index, offset, retains,
      _this = this;
    if (insertFn == null) {
      insertFn = (function() {});
    }
    if (deleteFn == null) {
      deleteFn = (function() {});
    }
    if (applyAttrFn == null) {
      applyAttrFn = (function() {});
    }
    if (context == null) {
      context = null;
    }
    if (this.isIdentity()) {
      return;
    }
    index = 0;
    offset = 0;
    retains = [];
    _.each(this.ops, function(op) {
      if (Delta.isInsert(op)) {
        insertFn.call(context, index + offset, op.value, op.attributes);
        return offset += op.getLength();
      } else if (Delta.isRetain(op)) {
        if (op.start > index) {
          deleteFn.call(context, index + offset, op.start - index);
          offset -= op.start - index;
        }
        retains.push(new RetainOp(op.start + offset, op.end + offset, op.attributes));
        return index = op.end;
      }
    });
    if (this.endLength < this.startLength + offset) {
      deleteFn.call(context, this.endLength, this.startLength + offset - this.endLength);
    }
    return _.each(retains, function(op) {
      _.each(op.attributes, function(value, format) {
        if (value === null) {
          return applyAttrFn.call(context, op.start, op.end - op.start, format, value);
        }
      });
      return _.each(op.attributes, function(value, format) {
        if (value != null) {
          return applyAttrFn.call(context, op.start, op.end - op.start, format, value);
        }
      });
    });
  };

  Delta.prototype.applyToText = function(text) {
    var appliedText, delta, op, result, _i, _len, _ref;
    delta = this;
    if (text.length !== delta.startLength) {
      throw new Error("Start length of delta: " + delta.startLength + " is not equal to the text: " + text.length);
    }
    appliedText = [];
    _ref = delta.ops;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      op = _ref[_i];
      if (Delta.isInsert(op)) {
        appliedText.push(op.value);
      } else {
        appliedText.push(text.substring(op.start, op.end));
      }
    }
    result = appliedText.join("");
    if (delta.endLength !== result.length) {
      throw new Error("End length of delta: " + delta.endLength + " is not equal to result text: " + result.length);
    }
    return result;
  };

  Delta.prototype.canCompose = function(delta) {
    return Delta.isDelta(delta) && this.endLength === delta.startLength;
  };

  Delta.prototype.compact = function() {
    var compacted;
    compacted = [];
    _.each(this.ops, function(op) {
      var last;
      if (op.getLength() === 0) {
        return;
      }
      if (compacted.length === 0) {
        return compacted.push(op);
      } else {
        last = _.last(compacted);
        if (InsertOp.isInsert(last) && InsertOp.isInsert(op) && last.attributesMatch(op)) {
          return compacted[compacted.length - 1] = new InsertOp(last.value + op.value, op.attributes);
        } else if (RetainOp.isRetain(last) && RetainOp.isRetain(op) && last.end === op.start && last.attributesMatch(op)) {
          return compacted[compacted.length - 1] = new RetainOp(last.start, op.end, op.attributes);
        } else {
          return compacted.push(op);
        }
      }
    });
    return this.ops = compacted;
  };

  Delta.prototype.compose = function(deltaB) {
    var composed, deltaA, opInB, opsInRange, _i, _len, _ref;
    if (!this.canCompose(deltaB)) {
      throw new Error('Cannot compose delta');
    }
    deltaA = this;
    composed = [];
    _ref = deltaB.ops;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      opInB = _ref[_i];
      if (Delta.isInsert(opInB)) {
        composed.push(opInB);
      } else if (Delta.isRetain(opInB)) {
        opsInRange = deltaA.getOpsAt(opInB.start, opInB.getLength());
        opsInRange = _.map(opsInRange, function(opInA) {
          if (Delta.isInsert(opInA)) {
            return new InsertOp(opInA.value, opInA.composeAttributes(opInB.attributes));
          } else {
            return new RetainOp(opInA.start, opInA.end, opInA.composeAttributes(opInB.attributes));
          }
        });
        composed = composed.concat(opsInRange);
      } else {
        throw new Error('Invalid op in deltaB when composing');
      }
    }
    return new Delta(deltaA.startLength, deltaB.endLength, composed);
  };

  Delta.prototype.decompose = function(deltaA) {
    var decomposeAttributes, deltaB, deltaC, insertDelta, offset, ops;
    deltaC = this;
    if (!Delta.isDelta(deltaA)) {
      throw new Error("Decompose called when deltaA is not a Delta, type: " + typeof deltaA);
    }
    if (deltaA.startLength !== this.startLength) {
      throw new Error("startLength " + deltaA.startLength + " / startLength " + this.startLength + " mismatch");
    }
    if (!_.all(deltaA.ops, (function(op) {
      return Delta.isInsert(op);
    }))) {
      throw new Error("DeltaA has retain in decompose");
    }
    if (!_.all(deltaC.ops, (function(op) {
      return Delta.isInsert(op);
    }))) {
      throw new Error("DeltaC has retain in decompose");
    }
    decomposeAttributes = function(attrA, attrC) {
      var decomposedAttributes, key, value;
      decomposedAttributes = {};
      for (key in attrC) {
        value = attrC[key];
        if (attrA[key] === void 0 || attrA[key] !== value) {
          if (attrA[key] !== null && typeof attrA[key] === 'object' && value !== null && typeof value === 'object') {
            decomposedAttributes[key] = decomposeAttributes(attrA[key], value);
          } else {
            decomposedAttributes[key] = value;
          }
        }
      }
      for (key in attrA) {
        value = attrA[key];
        if (attrC[key] === void 0) {
          decomposedAttributes[key] = null;
        }
      }
      return decomposedAttributes;
    };
    insertDelta = deltaA.diff(deltaC);
    ops = [];
    offset = 0;
    _.each(insertDelta.ops, function(op) {
      var offsetC, opsInC;
      opsInC = deltaC.getOpsAt(offset, op.getLength());
      offsetC = 0;
      _.each(opsInC, function(opInC) {
        var d, offsetA, opsInA;
        if (Delta.isInsert(op)) {
          d = new InsertOp(op.value.substring(offsetC, offsetC + opInC.getLength()), opInC.attributes);
          ops.push(d);
        } else if (Delta.isRetain(op)) {
          opsInA = deltaA.getOpsAt(op.start + offsetC, opInC.getLength());
          offsetA = 0;
          _.each(opsInA, function(opInA) {
            var attributes, e, start;
            attributes = decomposeAttributes(opInA.attributes, opInC.attributes);
            start = op.start + offsetA + offsetC;
            e = new RetainOp(start, start + opInA.getLength(), attributes);
            ops.push(e);
            return offsetA += opInA.getLength();
          });
        } else {
          throw new Error("Invalid delta in deltaB when composing");
        }
        return offsetC += opInC.getLength();
      });
      return offset += op.getLength();
    });
    deltaB = new Delta(insertDelta.startLength, insertDelta.endLength, ops);
    return deltaB;
  };

  Delta.prototype.diff = function(other) {
    var diff, finalLength, insertDelta, operation, ops, originalLength, textA, textC, value, _i, _len, _ref, _ref1;
    _ref = _.map([this, other], function(delta) {
      return _.map(delta.ops, function(op) {
        if (op.value != null) {
          return op.value;
        } else {
          return "";
        }
      }).join('');
    }), textA = _ref[0], textC = _ref[1];
    if (!(textA === '' && textC === '')) {
      diff = dmp.diff_main(textA, textC);
      if (diff.length <= 0) {
        throw new Error("diffToDelta called with diff with length <= 0");
      }
      originalLength = 0;
      finalLength = 0;
      ops = [];
      for (_i = 0, _len = diff.length; _i < _len; _i++) {
        _ref1 = diff[_i], operation = _ref1[0], value = _ref1[1];
        switch (operation) {
          case diff_match_patch.DIFF_DELETE:
            originalLength += value.length;
            break;
          case diff_match_patch.DIFF_INSERT:
            ops.push(new InsertOp(value));
            finalLength += value.length;
            break;
          case diff_match_patch.DIFF_EQUAL:
            ops.push(new RetainOp(originalLength, originalLength + value.length));
            originalLength += value.length;
            finalLength += value.length;
        }
      }
      insertDelta = new Delta(originalLength, finalLength, ops);
    } else {
      insertDelta = new Delta(0, 0, []);
    }
    return insertDelta;
  };

  Delta.prototype.follows = function(deltaA, aIsRemote) {
    var addedAttributes, deltaB, elem, elemA, elemB, elemIndexA, elemIndexB, follow, followEndLength, followSet, followStartLength, indexA, indexB, length, _i, _len;
    if (aIsRemote == null) {
      aIsRemote = false;
    }
    deltaB = this;
    if (!Delta.isDelta(deltaA)) {
      throw new Error("Follows called when deltaA is not a Delta, type: " + typeof deltaA);
    }
    deltaA = new Delta(deltaA.startLength, deltaA.endLength, deltaA.ops);
    deltaB = new Delta(deltaB.startLength, deltaB.endLength, deltaB.ops);
    followStartLength = deltaA.endLength;
    followSet = [];
    indexA = indexB = 0;
    elemIndexA = elemIndexB = 0;
    while (elemIndexA < deltaA.ops.length && elemIndexB < deltaB.ops.length) {
      elemA = deltaA.ops[elemIndexA];
      elemB = deltaB.ops[elemIndexB];
      if (Delta.isInsert(elemA) && Delta.isInsert(elemB)) {
        length = Math.min(elemA.getLength(), elemB.getLength());
        if (aIsRemote) {
          followSet.push(new RetainOp(indexA, indexA + length));
          indexA += length;
          if (length === elemA.getLength()) {
            elemIndexA++;
          } else {
            if (!(length < elemA.getLength())) {
              throw new Error("Invalid elem length in follows");
            }
            deltaA.ops[elemIndexA] = _.last(elemA.split(length));
          }
        } else {
          followSet.push(_.first(elemB.split(length)));
          indexB += length;
          if (length === elemB.getLength()) {
            elemIndexB++;
          } else {
            deltaB.ops[elemIndexB] = _.last(elemB.split(length));
          }
        }
      } else if (Delta.isRetain(elemA) && Delta.isRetain(elemB)) {
        if (elemA.end < elemB.start) {
          indexA += elemA.getLength();
          elemIndexA++;
        } else if (elemB.end < elemA.start) {
          indexB += elemB.getLength();
          elemIndexB++;
        } else {
          if (elemA.start < elemB.start) {
            indexA += elemB.start - elemA.start;
            elemA = deltaA.ops[elemIndexA] = new RetainOp(elemB.start, elemA.end, elemA.attributes);
          } else if (elemB.start < elemA.start) {
            indexB += elemA.start - elemB.start;
            elemB = deltaB.ops[elemIndexB] = new RetainOp(elemA.start, elemB.end, elemB.attributes);
          }
          if (elemA.start !== elemB.start) {
            throw new Error("RetainOps must have same start length in follow set");
          }
          length = Math.min(elemA.end, elemB.end) - elemA.start;
          addedAttributes = elemA.addAttributes(elemB.attributes);
          followSet.push(new RetainOp(indexA, indexA + length, addedAttributes));
          indexA += length;
          indexB += length;
          if (elemA.end === elemB.end) {
            elemIndexA++;
            elemIndexB++;
          } else if (elemA.end < elemB.end) {
            elemIndexA++;
            deltaB.ops[elemIndexB] = _.last(elemB.split(length));
          } else {
            deltaA.ops[elemIndexA] = _.last(elemA.split(length));
            elemIndexB++;
          }
        }
      } else if (Delta.isInsert(elemA) && Delta.isRetain(elemB)) {
        followSet.push(new RetainOp(indexA, indexA + elemA.getLength()));
        indexA += elemA.getLength();
        elemIndexA++;
      } else if (Delta.isRetain(elemA) && Delta.isInsert(elemB)) {
        followSet.push(elemB);
        indexB += elemB.getLength();
        elemIndexB++;
      }
    }
    while (elemIndexA < deltaA.ops.length) {
      elemA = deltaA.ops[elemIndexA];
      if (Delta.isInsert(elemA)) {
        followSet.push(new RetainOp(indexA, indexA + elemA.getLength()));
      }
      indexA += elemA.getLength();
      elemIndexA++;
    }
    while (elemIndexB < deltaB.ops.length) {
      elemB = deltaB.ops[elemIndexB];
      if (Delta.isInsert(elemB)) {
        followSet.push(elemB);
      }
      indexB += elemB.getLength();
      elemIndexB++;
    }
    followEndLength = 0;
    for (_i = 0, _len = followSet.length; _i < _len; _i++) {
      elem = followSet[_i];
      followEndLength += elem.getLength();
    }
    follow = new Delta(followStartLength, followEndLength, followSet);
    return follow;
  };

  Delta.prototype.getOpsAt = function(index, length) {
    var changes, getLength, offset, op, opLength, start, _i, _len, _ref;
    changes = [];
    if ((this.savedOpOffset != null) && this.savedOpOffset < index) {
      offset = this.savedOpOffset;
    } else {
      offset = this.savedOpOffset = this.savedOpIndex = 0;
    }
    _ref = this.ops.slice(this.savedOpIndex);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      op = _ref[_i];
      if (offset >= index + length) {
        break;
      }
      opLength = op.getLength();
      if (index < offset + opLength) {
        start = Math.max(index - offset, 0);
        getLength = Math.min(opLength - start, index + length - offset - start);
        changes.push(op.getAt(start, getLength));
      }
      offset += opLength;
      this.savedOpIndex += 1;
      this.savedOpOffset += opLength;
    }
    return changes;
  };

  Delta.prototype.invert = function(deltaB) {
    var deltaA, deltaC, inverse;
    if (!this.isInsertsOnly()) {
      throw new Error("Invert called on invalid delta containing non-insert ops");
    }
    deltaA = this;
    deltaC = deltaA.compose(deltaB);
    inverse = deltaA.decompose(deltaC);
    return inverse;
  };

  Delta.prototype.isEqual = function(other) {
    if (!other) {
      return false;
    }
    if (this.startLength !== other.startLength || this.endLength !== other.endLength) {
      return false;
    }
    if (!_.isArray(other.ops) || this.ops.length !== other.ops.length) {
      return false;
    }
    return _.all(this.ops, function(op, i) {
      return op.isEqual(other.ops[i]);
    });
  };

  Delta.prototype.isIdentity = function() {
    var index, op, _i, _len, _ref;
    if (this.startLength === this.endLength) {
      if (this.ops.length === 0) {
        return true;
      }
      index = 0;
      _ref = this.ops;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        op = _ref[_i];
        if (!RetainOp.isRetain(op)) {
          return false;
        }
        if (op.start !== index) {
          return false;
        }
        if (!(op.numAttributes() === 0 || (op.numAttributes() === 1 && _.has(op.attributes, 'authorId')))) {
          return false;
        }
        index = op.end;
      }
      if (index !== this.endLength) {
        return false;
      }
      return true;
    }
    return false;
  };

  Delta.prototype.isInsertsOnly = function() {
    return _.every(this.ops, function(op) {
      return Delta.isInsert(op);
    });
  };

  Delta.prototype.merge = function(other) {
    var ops,
      _this = this;
    ops = _.map(other.ops, function(op) {
      if (RetainOp.isRetain(op)) {
        return new RetainOp(op.start + _this.startLength, op.end + _this.startLength, op.attributes);
      } else {
        return op;
      }
    });
    ops = this.ops.concat(ops);
    return new Delta(this.startLength + other.startLength, ops);
  };

  Delta.prototype.split = function(index) {
    var leftOps, rightOps;
    if (!this.isInsertsOnly()) {
      throw new Error("Split only implemented for inserts only");
    }
    if (!(0 <= index && index <= this.endLength)) {
      throw new Error("Split at invalid index");
    }
    leftOps = [];
    rightOps = [];
    _.reduce(this.ops, function(offset, op) {
      var left, right, _ref;
      if (offset + op.getLength() <= index) {
        leftOps.push(op);
      } else if (offset >= index) {
        rightOps.push(op);
      } else {
        _ref = op.split(index - offset), left = _ref[0], right = _ref[1];
        leftOps.push(left);
        rightOps.push(right);
      }
      return offset + op.getLength();
    }, 0);
    return [new Delta(0, leftOps), new Delta(0, rightOps)];
  };

  Delta.prototype.toString = function() {
    return "{(" + this.startLength + "->" + this.endLength + ") [" + (this.ops.join(', ')) + "]}";
  };

  return Delta;

})();

module.exports = Delta;


},{"./diff_match_patch":4,"./insert":5,"./op":6,"./retain":7}],3:[function(require,module,exports){
var Delta, DeltaGenerator, InsertOp, RetainOp;

Delta = require('./delta');

InsertOp = require('./insert');

RetainOp = require('./retain');

DeltaGenerator = (function() {
  var formatBooleanAttribute, formatNonBooleanAttribute, limitScope, splitOpInThree,
    _this = this;

  function DeltaGenerator() {}

  DeltaGenerator.constants = {
    attributes: {
      'bold': [true, false],
      'italic': [true, false],
      'strike': [true, false],
      'font-face': ['monospace', 'serif'],
      'fore-color': ['white', 'black', 'red', 'blue', 'lime', 'teal', 'magenta', 'yellow'],
      'font-size': ['huge', 'large', 'small'],
      'back-color': ['white', 'black', 'red', 'blue', 'lime', 'teal', 'magenta', 'yellow']
    },
    default_attribute_value: {
      'back-color': 'white',
      'fore-color': 'black',
      'font-face': 'san-serif',
      'font-size': 'normal'
    },
    alphabet: "abcdefghijklmnopqrstuvwxyz\n\n\n\n  "
  };

  DeltaGenerator.getRandomString = function(alphabet, length) {
    var _i, _ref, _results;
    return _.map((function() {
      _results = [];
      for (var _i = 0, _ref = length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this), function() {
      return alphabet[_.random(0, alphabet.length - 1)];
    }).join('');
  };

  DeltaGenerator.getRandomLength = function() {
    var rand;
    rand = Math.random();
    if (rand < 0.6) {
      return _.random(1, 2);
    } else if (rand < 0.8) {
      return _.random(3, 4);
    } else if (rand < 0.9) {
      return _.random(5, 9);
    } else {
      return _.random(10, 50);
    }
  };

  DeltaGenerator.insertAt = function(delta, insertionPoint, insertions) {
    var charIndex, head, op, opIndex, tail, _i, _len, _ref, _ref1;
    charIndex = opIndex = 0;
    _ref = delta.ops;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      op = _ref[_i];
      if (charIndex === insertionPoint) {
        break;
      }
      if (insertionPoint < charIndex + op.getLength()) {
        _ref1 = op.split(insertionPoint - charIndex), head = _ref1[0], tail = _ref1[1];
        delta.ops.splice(opIndex, 1, head, tail);
        opIndex++;
        break;
      }
      charIndex += op.getLength();
      opIndex++;
    }
    delta.ops.splice(opIndex, 0, new InsertOp(insertions));
    delta.endLength += insertions.length;
    return delta.compact();
  };

  DeltaGenerator.deleteAt = function(delta, deletionPoint, numToDelete) {
    var charIndex, curDelete, head, newText, op, ops, reachedDeletionPoint, tail, _i, _len, _ref;
    charIndex = 0;
    ops = [];
    _ref = delta.ops;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      op = _ref[_i];
      reachedDeletionPoint = charIndex === deletionPoint || deletionPoint < charIndex + op.getLength();
      if (numToDelete > 0 && reachedDeletionPoint) {
        curDelete = Math.min(numToDelete, op.getLength() - (deletionPoint - charIndex));
        numToDelete -= curDelete;
        if (Delta.isInsert(op)) {
          newText = op.value.substring(0, deletionPoint - charIndex) + op.value.substring(deletionPoint - charIndex + curDelete);
          if (newText.length > 0) {
            ops.push(new InsertOp(newText));
          }
        } else {
          if (!Delta.isRetain(op)) {
            throw new Error("Expected retain but got " + op);
          }
          head = new RetainOp(op.start, op.start + deletionPoint - charIndex, _.clone(op.attributes));
          tail = new RetainOp(op.start + deletionPoint - charIndex + curDelete, op.end, _.clone(op.attributes));
          if (head.start < head.end) {
            ops.push(head);
          }
          if (tail.start < tail.end) {
            ops.push(tail);
          }
        }
        deletionPoint += curDelete;
      } else {
        ops.push(op);
      }
      charIndex += op.getLength();
    }
    delta.ops = ops;
    return delta.endLength = _.reduce(ops, function(length, op) {
      return length + op.getLength();
    }, 0);
  };

  splitOpInThree = function(elem, splitAt, length, reference) {
    var cur, curStr, head, headStr, marker, newCur, op, origOps, tail, tailStr, _i, _len;
    if (Delta.isInsert(elem)) {
      headStr = elem.value.substring(0, splitAt);
      head = new InsertOp(headStr, _.clone(elem.attributes));
      curStr = elem.value.substring(splitAt, splitAt + length);
      cur = new InsertOp(curStr, _.clone(elem.attributes));
      tailStr = elem.value.substring(splitAt + length);
      tail = new InsertOp(tailStr, _.clone(elem.attributes));
      if (curStr.indexOf('\n') !== -1) {
        newCur = curStr.substring(0, curStr.indexOf('\n'));
        tailStr = curStr.substring(curStr.indexOf('\n')) + tailStr;
        cur = new InsertOp(newCur, _.clone(elem.attributes));
        tail = new InsertOp(tailStr, _.clone(elem.attributes));
      }
    } else {
      if (!Delta.isRetain(elem)) {
        throw new Error("Expected retain but got " + elem);
      }
      head = new RetainOp(elem.start, elem.start + splitAt, _.clone(elem.attributes));
      cur = new RetainOp(head.end, head.end + length, _.clone(elem.attributes));
      tail = new RetainOp(cur.end, elem.end, _.clone(elem.attributes));
      origOps = reference.getOpsAt(cur.start, cur.getLength());
      if (!_.every(origOps, function(op) {
        return Delta.isInsert(op);
      })) {
        throw new Error("Non insert op in backref");
      }
      marker = cur.start;
      for (_i = 0, _len = origOps.length; _i < _len; _i++) {
        op = origOps[_i];
        if (Delta.isInsert(op)) {
          if (op.value.indexOf('\n') !== -1) {
            cur = new RetainOp(cur.start, marker + op.value.indexOf('\n'), _.clone(cur.attributes));
            tail = new RetainOp(marker + op.value.indexOf('\n'), tail.end, _.clone(tail.attributes));
            break;
          } else {
            marker += op.getLength();
          }
        } else {
          throw new Error("Got retainOp in reference delta!");
        }
      }
    }
    return [head, cur, tail];
  };

  limitScope = function(op, tail, attr, referenceOps) {
    var length, refOp, val, _i, _len, _results;
    length = 0;
    val = referenceOps[0].attributes[attr];
    _results = [];
    for (_i = 0, _len = referenceOps.length; _i < _len; _i++) {
      refOp = referenceOps[_i];
      if (refOp.attributes[attr] !== val) {
        op.end = op.start + length;
        tail.start = op.end;
        break;
      } else {
        _results.push(length += refOp.getLength());
      }
    }
    return _results;
  };

  formatBooleanAttribute = function(op, tail, attr, reference) {
    var referenceOps;
    if (Delta.isInsert(op)) {
      if (op.attributes[attr] != null) {
        return delete op.attributes[attr];
      } else {
        return op.attributes[attr] = true;
      }
    } else {
      if (!Delta.isRetain(op)) {
        throw new Error("Expected retain but got " + op);
      }
      if (op.attributes[attr] != null) {
        return delete op.attributes[attr];
      } else {
        referenceOps = reference.getOpsAt(op.start, op.getLength());
        if (!_.every(referenceOps, function(op) {
          return Delta.isInsert(op);
        })) {
          throw new Error("Formatting a retain that does not refer to an insert.");
        }
        if (referenceOps.length > 0) {
          limitScope(op, tail, attr, referenceOps);
          if (referenceOps[0].attributes[attr] != null) {
            if (!referenceOps[0].attributes[attr]) {
              throw new Error("Boolean attribute on reference delta should only be true!");
            }
            return op.attributes[attr] = null;
          } else {
            return op.attributes[attr] = true;
          }
        }
      }
    }
  };

  formatNonBooleanAttribute = function(op, tail, attr, reference) {
    var getNewAttrVal, referenceOps;
    getNewAttrVal = function(prevVal) {
      if (prevVal != null) {
        return _.first(_.shuffle(_.without(DeltaGenerator.constants.attributes[attr], prevVal)));
      } else {
        return _.first(_.shuffle(_.without(DeltaGenerator.constants.attributes[attr], DeltaGenerator.constants.default_attribute_value[attr])));
      }
    };
    if (Delta.isInsert(op)) {
      return op.attributes[attr] = getNewAttrVal(attr, op.attributes[attr]);
    } else {
      if (!Delta.isRetain(op)) {
        throw new Error("Expected retain but got " + op);
      }
      referenceOps = reference.getOpsAt(op.start, op.getLength());
      if (!_.every(referenceOps, function(op) {
        return Delta.isInsert(op);
      })) {
        throw new Error("Formatting a retain that does not refer to an insert.");
      }
      if (referenceOps.length > 0) {
        limitScope(op, tail, attr, referenceOps);
        if ((op.attributes[attr] != null) && Math.random() < 0.5) {
          return delete op.attributes[attr];
        } else {
          return op.attributes[attr] = getNewAttrVal(op.attributes[attr]);
        }
      }
    }
  };

  DeltaGenerator.formatAt = function(delta, formatPoint, numToFormat, attrs, reference) {
    var attr, charIndex, cur, curFormat, head, op, ops, reachedFormatPoint, tail, _i, _j, _len, _len1, _ref, _ref1;
    charIndex = 0;
    ops = [];
    _ref = delta.ops;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      op = _ref[_i];
      reachedFormatPoint = charIndex === formatPoint || charIndex + op.getLength() > formatPoint;
      if (numToFormat > 0 && reachedFormatPoint) {
        curFormat = Math.min(numToFormat, op.getLength() - (formatPoint - charIndex));
        numToFormat -= curFormat;
        _ref1 = splitOpInThree(op, formatPoint - charIndex, curFormat, reference), head = _ref1[0], cur = _ref1[1], tail = _ref1[2];
        ops.push(head);
        ops.push(cur);
        ops.push(tail);
        for (_j = 0, _len1 = attrs.length; _j < _len1; _j++) {
          attr = attrs[_j];
          switch (attr) {
            case 'bold':
            case 'italic':
            case 'underline':
            case 'strike':
            case 'link':
              formatBooleanAttribute(cur, tail, attr, reference);
              break;
            case 'font-size':
            case 'font-face':
            case 'fore-color':
            case 'back-color':
              formatNonBooleanAttribute(cur, tail, attr, reference);
              break;
            default:
              throw new Error("Received unknown attribute: " + attr);
          }
        }
        formatPoint += curFormat;
      } else {
        ops.push(op);
      }
      charIndex += op.getLength();
    }
    delta.endLength = _.reduce(ops, function(length, delta) {
      return length + delta.getLength();
    }, 0);
    delta.ops = ops;
    return delta.compact();
  };

  DeltaGenerator.addRandomOp = function(newDelta, referenceDelta) {
    var attrs, finalIndex, numAttrs, opIndex, opLength, rand, shuffled_attrs;
    finalIndex = referenceDelta.endLength - 1;
    opIndex = _.random(0, finalIndex);
    rand = Math.random();
    if (rand < 0.5) {
      opLength = this.getRandomLength();
      this.insertAt(newDelta, opIndex, this.getRandomString(this.constants.alphabet, opLength));
    } else if (rand < 0.75) {
      if (referenceDelta.endLength <= 1) {
        return newDelta;
      }
      opIndex = _.random(0, finalIndex - 1);
      opLength = _.random(1, finalIndex - opIndex);
      this.deleteAt(newDelta, opIndex, opLength);
    } else {
      shuffled_attrs = _.shuffle(_.keys(this.constants.attributes));
      numAttrs = _.random(1, shuffled_attrs.length);
      attrs = shuffled_attrs.slice(0, numAttrs);
      opLength = _.random(1, finalIndex - opIndex);
      this.formatAt(newDelta, opIndex, opLength, attrs, referenceDelta);
    }
    return newDelta;
  };

  DeltaGenerator.getRandomDelta = function(referenceDelta, numOps) {
    var i, newDelta, _i;
    newDelta = new Delta(referenceDelta.endLength, referenceDelta.endLength, [new RetainOp(0, referenceDelta.endLength)]);
    numOps || (numOps = _.random(1, 10));
    for (i = _i = 0; 0 <= numOps ? _i < numOps : _i > numOps; i = 0 <= numOps ? ++_i : --_i) {
      this.addRandomOp(newDelta, referenceDelta);
    }
    return newDelta;
  };

  return DeltaGenerator;

}).call(this);

module.exports = DeltaGenerator;


},{"./delta":2,"./insert":5,"./retain":7}],4:[function(require,module,exports){
/**
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Class containing the diff, match and patch methods.
 * @constructor
 */
function diff_match_patch() {

  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up (0 for infinity).
  this.Diff_Timeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  this.Diff_EditCost = 4;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  this.Match_Threshold = 0.5;
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  this.Match_Distance = 1000;
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
  // end points of a delete need to match.
  this.Patch_DeleteThreshold = 0.5;
  // Chunk size for context length.
  this.Patch_Margin = 4;

  // The number of bits in an int.
  this.Match_MaxBits = 32;
}


//  DIFF FUNCTIONS


/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/** @typedef {{0: number, 1: string}} */
diff_match_patch.Diff;


/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
 *     then don't run a line-level diff first to identify the changed areas.
 *     Defaults to true, which does a faster, slightly less optimal diff.
 * @param {number} opt_deadline Optional time when the diff should be complete
 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
 *     instead.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 */
diff_match_patch.prototype.diff_main = function(text1, text2, opt_checklines,
    opt_deadline) {
  // Set a deadline by which time the diff must be complete.
  if (typeof opt_deadline == 'undefined') {
    if (this.Diff_Timeout <= 0) {
      opt_deadline = Number.MAX_VALUE;
    } else {
      opt_deadline = (new Date).getTime() + this.Diff_Timeout * 1000;
    }
  }
  var deadline = opt_deadline;

  // Check for null inputs.
  if (text1 == null || text2 == null) {
    throw new Error('Null input. (diff_main)');
  }

  // Check for equality (speedup).
  if (text1 == text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }

  if (typeof opt_checklines == 'undefined') {
    opt_checklines = true;
  }
  var checklines = opt_checklines;

  // Trim off common prefix (speedup).
  var commonlength = this.diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = this.diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = this.diff_compute_(text1, text2, checklines, deadline);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  this.diff_cleanupMerge(diffs);
  return diffs;
};


/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean} checklines Speedup flag.  If false, then don't run a
 *     line-level diff first to identify the changed areas.
 *     If true, then run a faster, slightly less optimal diff.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_compute_ = function(text1, text2, checklines,
    deadline) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
             [DIFF_EQUAL, shorttext],
             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length == 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }

  // Check to see if the problem can be split in two.
  var hm = this.diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  if (checklines && text1.length > 100 && text2.length > 100) {
    return this.diff_lineMode_(text1, text2, deadline);
  }

  return this.diff_bisect_(text1, text2, deadline);
};


/**
 * Do a quick line-level diff on both strings, then rediff the parts for
 * greater accuracy.
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_lineMode_ = function(text1, text2, deadline) {
  // Scan the text on a line-by-line basis first.
  var a = this.diff_linesToChars_(text1, text2);
  text1 = a.chars1;
  text2 = a.chars2;
  var linearray = a.lineArray;

  var diffs = this.diff_main(text1, text2, false, deadline);

  // Convert the diff back to original text.
  this.diff_charsToLines_(diffs, linearray);
  // Eliminate freak matches (e.g. blank lines)
  this.diff_cleanupSemantic(diffs);

  // Rediff any replacement blocks, this time character-by-character.
  // Add a dummy entry at the end.
  diffs.push([DIFF_EQUAL, '']);
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete >= 1 && count_insert >= 1) {
          // Delete the offending records and add the merged ones.
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert);
          pointer = pointer - count_delete - count_insert;
          var a = this.diff_main(text_delete, text_insert, false, deadline);
          for (var j = a.length - 1; j >= 0; j--) {
            diffs.splice(pointer, 0, a[j]);
          }
          pointer = pointer + a.length;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
    pointer++;
  }
  diffs.pop();  // Remove the dummy entry at the end.

  return diffs;
};


/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisect_ = function(text1, text2, deadline) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = (delta % 2 != 0);
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Bail out if deadline is reached.
    if ((new Date()).getTime() > deadline) {
      break;
    }

    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length &&
             text1.charAt(x1) == text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length &&
             text1.charAt(text1_length - x2 - 1) ==
             text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
};


/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisectSplit_ = function(text1, text2, x, y,
    deadline) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = this.diff_main(text1a, text2a, false, deadline);
  var diffsb = this.diff_main(text1b, text2b, false, deadline);

  return diffs.concat(diffsb);
};


/**
 * Split two texts into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
 *     An object containing the encoded text1, the encoded text2 and
 *     the array of unique strings.
 *     The zeroth element of the array of unique strings is intentionally blank.
 * @private
 */
diff_match_patch.prototype.diff_linesToChars_ = function(text1, text2) {
  var lineArray = [];  // e.g. lineArray[4] == 'Hello\n'
  var lineHash = {};   // e.g. lineHash['Hello\n'] == 4

  // '\x00' is a valid character, but various debuggers don't like it.
  // So we'll insert a junk entry to avoid generating a null character.
  lineArray[0] = '';

  /**
   * Split a text into an array of strings.  Reduce the texts to a string of
   * hashes where each Unicode character represents one line.
   * Modifies linearray and linehash through being a closure.
   * @param {string} text String to encode.
   * @return {string} Encoded string.
   * @private
   */
  function diff_linesToCharsMunge_(text) {
    var chars = '';
    // Walk the text, pulling out a substring for each line.
    // text.split('\n') would would temporarily double our memory footprint.
    // Modifying text would create many large strings to garbage collect.
    var lineStart = 0;
    var lineEnd = -1;
    // Keeping our own length variable is faster than looking it up.
    var lineArrayLength = lineArray.length;
    while (lineEnd < text.length - 1) {
      lineEnd = text.indexOf('\n', lineStart);
      if (lineEnd == -1) {
        lineEnd = text.length - 1;
      }
      var line = text.substring(lineStart, lineEnd + 1);
      lineStart = lineEnd + 1;

      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) :
          (lineHash[line] !== undefined)) {
        chars += String.fromCharCode(lineHash[line]);
      } else {
        chars += String.fromCharCode(lineArrayLength);
        lineHash[line] = lineArrayLength;
        lineArray[lineArrayLength++] = line;
      }
    }
    return chars;
  }

  var chars1 = diff_linesToCharsMunge_(text1);
  var chars2 = diff_linesToCharsMunge_(text2);
  return {chars1: chars1, chars2: chars2, lineArray: lineArray};
};


/**
 * Rehydrate the text in a diff from a string of line hashes to real lines of
 * text.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {!Array.<string>} lineArray Array of unique strings.
 * @private
 */
diff_match_patch.prototype.diff_charsToLines_ = function(diffs, lineArray) {
  for (var x = 0; x < diffs.length; x++) {
    var chars = diffs[x][1];
    var text = [];
    for (var y = 0; y < chars.length; y++) {
      text[y] = lineArray[chars.charCodeAt(y)];
    }
    diffs[x][1] = text.join('');
  }
};


/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) ==
        text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 ||
      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
diff_match_patch.prototype.diff_commonOverlap_ = function(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) ==
        text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
};


/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 * @private
 */
diff_match_patch.prototype.diff_halfMatch_ = function(text1, text2) {
  if (this.Diff_Timeout <= 0) {
    // Don't risk returning a non-optimal diff if we have unlimited time.
    return null;
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null;  // Pointless.
  }
  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i),
                                               shorttext.substring(j));
      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i),
                                               shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) +
            shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b,
              best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};


/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (lastequality && (lastequality.length <=
          Math.max(length_insertions1, length_deletions1)) &&
          (lastequality.length <= Math.max(length_insertions2,
                                           length_deletions2))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0;  // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
  this.diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] == DIFF_DELETE &&
        diffs[pointer][0] == DIFF_INSERT) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 ||
            overlap_length1 >= insertion.length / 2) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
          diffs[pointer - 1][1] =
              deletion.substring(0, deletion.length - overlap_length1);
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 ||
            overlap_length2 >= insertion.length / 2) {
          // Reverse overlap found.
          // Insert an equality and swap and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] =
              insertion.substring(0, insertion.length - overlap_length2);
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] =
              deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
};


/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6;
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 &&
        char1.match(diff_match_patch.whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 &&
        char2.match(diff_match_patch.whitespaceRegex_);
    var lineBreak1 = whitespace1 &&
        char1.match(diff_match_patch.linebreakRegex_);
    var lineBreak2 = whitespace2 &&
        char2.match(diff_match_patch.linebreakRegex_);
    var blankLine1 = lineBreak1 &&
        one.match(diff_match_patch.blanklineEndRegex_);
    var blankLine2 = lineBreak2 &&
        two.match(diff_match_patch.blanklineStartRegex_);

    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3;
    } else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1;
    }
    return 0;
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = this.diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore_(equality1, edit) +
          diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore_(equality1, edit) +
            diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
};

// Define some regex patterns for matching boundaries.
diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
diff_match_patch.whitespaceRegex_ = /\s/;
diff_match_patch.linebreakRegex_ = /[\r\n]/;
diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Reduce the number of edits by eliminating operationally trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Is there an insertion operation before the last equality.
  var pre_ins = false;
  // Is there a deletion operation before the last equality.
  var pre_del = false;
  // Is there an insertion operation after the last equality.
  var post_ins = false;
  // Is there a deletion operation after the last equality.
  var post_del = false;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      if (diffs[pointer][1].length < this.Diff_EditCost &&
          (post_ins || post_del)) {
        // Candidate found.
        equalities[equalitiesLength++] = pointer;
        pre_ins = post_ins;
        pre_del = post_del;
        lastequality = diffs[pointer][1];
      } else {
        // Not a candidate, and can never become one.
        equalitiesLength = 0;
        lastequality = null;
      }
      post_ins = post_del = false;
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_DELETE) {
        post_del = true;
      } else {
        post_ins = true;
      }
      /*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
      if (lastequality && ((pre_ins && pre_del && post_ins && post_del) ||
                           ((lastequality.length < this.Diff_EditCost / 2) &&
                            (pre_ins + pre_del + post_ins + post_del) == 3))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--;  // Throw away the equality we just deleted;
        lastequality = null;
        if (pre_ins && pre_del) {
          // No changes made which could affect previous entry, keep going.
          post_ins = post_del = true;
          equalitiesLength = 0;
        } else {
          equalitiesLength--;  // Throw away the previous equality.
          pointer = equalitiesLength > 0 ?
              equalities[equalitiesLength - 1] : -1;
          post_ins = post_del = false;
        }
        changes = true;
      }
    }
    pointer++;
  }

  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            // Factor out any common prefixies.
            commonlength = this.diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if ((pointer - count_delete - count_insert) > 0 &&
                  diffs[pointer - count_delete - count_insert - 1][0] ==
                  DIFF_EQUAL) {
                diffs[pointer - count_delete - count_insert - 1][1] +=
                    text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, [DIFF_EQUAL,
                                    text_insert.substring(0, commonlength)]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixies.
            commonlength = this.diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length -
                  commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length -
                  commonlength);
              text_delete = text_delete.substring(0, text_delete.length -
                  commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          if (count_delete === 0) {
            diffs.splice(pointer - count_insert,
                count_delete + count_insert, [DIFF_INSERT, text_insert]);
          } else if (count_insert === 0) {
            diffs.splice(pointer - count_delete,
                count_delete + count_insert, [DIFF_DELETE, text_delete]);
          } else {
            diffs.splice(pointer - count_delete - count_insert,
                count_delete + count_insert, [DIFF_DELETE, text_delete],
                [DIFF_INSERT, text_insert]);
          }
          pointer = pointer - count_delete - count_insert +
                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop();  // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length -
          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] +
            diffs[pointer][1].substring(0, diffs[pointer][1].length -
                                        diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
          diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
            diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * loc is a location in text1, compute and return the equivalent location in
 * text2.
 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {number} loc Location within text1.
 * @return {number} Location within text2.
 */
diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
  var chars1 = 0;
  var chars2 = 0;
  var last_chars1 = 0;
  var last_chars2 = 0;
  var x;
  for (x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {  // Equality or deletion.
      chars1 += diffs[x][1].length;
    }
    if (diffs[x][0] !== DIFF_DELETE) {  // Equality or insertion.
      chars2 += diffs[x][1].length;
    }
    if (chars1 > loc) {  // Overshot the location.
      break;
    }
    last_chars1 = chars1;
    last_chars2 = chars2;
  }
  // Was the location was deleted?
  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
    return last_chars2;
  }
  // Add the remaining character length.
  return last_chars2 + (loc - last_chars1);
};


/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} HTML representation.
 */
diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
  var html = [];
  var pattern_amp = /&/g;
  var pattern_lt = /</g;
  var pattern_gt = />/g;
  var pattern_para = /\n/g;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];    // Operation (insert, delete, equal)
    var data = diffs[x][1];  // Text of change.
    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
        .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
    switch (op) {
      case DIFF_INSERT:
        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
        break;
      case DIFF_DELETE:
        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
        break;
      case DIFF_EQUAL:
        html[x] = '<span>' + text + '</span>';
        break;
    }
  }
  return html.join('');
};


/**
 * Compute and return the source text (all equalities and deletions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Source text.
 */
diff_match_patch.prototype.diff_text1 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute and return the destination text (all equalities and insertions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Destination text.
 */
diff_match_patch.prototype.diff_text2 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_DELETE) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute the Levenshtein distance; the number of inserted, deleted or
 * substituted characters.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {number} Number of changes.
 */
diff_match_patch.prototype.diff_levenshtein = function(diffs) {
  var levenshtein = 0;
  var insertions = 0;
  var deletions = 0;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];
    var data = diffs[x][1];
    switch (op) {
      case DIFF_INSERT:
        insertions += data.length;
        break;
      case DIFF_DELETE:
        deletions += data.length;
        break;
      case DIFF_EQUAL:
        // A deletion and an insertion is one substitution.
        levenshtein += Math.max(insertions, deletions);
        insertions = 0;
        deletions = 0;
        break;
    }
  }
  levenshtein += Math.max(insertions, deletions);
  return levenshtein;
};


/**
 * Crush the diff into an encoded string which describes the operations
 * required to transform text1 into text2.
 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Delta text.
 */
diff_match_patch.prototype.diff_toDelta = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    switch (diffs[x][0]) {
      case DIFF_INSERT:
        text[x] = '+' + encodeURI(diffs[x][1]);
        break;
      case DIFF_DELETE:
        text[x] = '-' + diffs[x][1].length;
        break;
      case DIFF_EQUAL:
        text[x] = '=' + diffs[x][1].length;
        break;
    }
  }
  return text.join('\t').replace(/%20/g, ' ');
};


/**
 * Given the original text1, and an encoded string which describes the
 * operations required to transform text1 into text2, compute the full diff.
 * @param {string} text1 Source string for the diff.
 * @param {string} delta Delta text.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
  var diffs = [];
  var diffsLength = 0;  // Keeping our own length var is faster in JS.
  var pointer = 0;  // Cursor in text1
  var tokens = delta.split(/\t/g);
  for (var x = 0; x < tokens.length; x++) {
    // Each token begins with a one character parameter which specifies the
    // operation of this token (delete, insert, equality).
    var param = tokens[x].substring(1);
    switch (tokens[x].charAt(0)) {
      case '+':
        try {
          diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
        } catch (ex) {
          // Malformed URI sequence.
          throw new Error('Illegal escape in diff_fromDelta: ' + param);
        }
        break;
      case '-':
        // Fall through.
      case '=':
        var n = parseInt(param, 10);
        if (isNaN(n) || n < 0) {
          throw new Error('Invalid number in diff_fromDelta: ' + param);
        }
        var text = text1.substring(pointer, pointer += n);
        if (tokens[x].charAt(0) == '=') {
          diffs[diffsLength++] = [DIFF_EQUAL, text];
        } else {
          diffs[diffsLength++] = [DIFF_DELETE, text];
        }
        break;
      default:
        // Blank tokens are ok (from a trailing \t).
        // Anything else is an error.
        if (tokens[x]) {
          throw new Error('Invalid diff operation in diff_fromDelta: ' +
                          tokens[x]);
        }
    }
  }
  if (pointer != text1.length) {
    throw new Error('Delta length (' + pointer +
        ') does not equal source text length (' + text1.length + ').');
  }
  return diffs;
};


//  MATCH FUNCTIONS


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc'.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 */
diff_match_patch.prototype.match_main = function(text, pattern, loc) {
  // Check for null inputs.
  if (text == null || pattern == null || loc == null) {
    throw new Error('Null input. (match_main)');
  }

  loc = Math.max(0, Math.min(loc, text.length));
  if (text == pattern) {
    // Shortcut (potentially not guaranteed by the algorithm)
    return 0;
  } else if (!text.length) {
    // Nothing to match.
    return -1;
  } else if (text.substring(loc, loc + pattern.length) == pattern) {
    // Perfect match at the perfect spot!  (Includes case of null pattern)
    return loc;
  } else {
    // Do a fuzzy compare.
    return this.match_bitap_(text, pattern, loc);
  }
};


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
 * Bitap algorithm.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 * @private
 */
diff_match_patch.prototype.match_bitap_ = function(text, pattern, loc) {
  if (pattern.length > this.Match_MaxBits) {
    throw new Error('Pattern too long for this browser.');
  }

  // Initialise the alphabet.
  var s = this.match_alphabet_(pattern);

  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Compute and return the score for a match with e errors and x location.
   * Accesses loc and pattern through being a closure.
   * @param {number} e Number of errors in match.
   * @param {number} x Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length;
    var proximity = Math.abs(loc - x);
    if (!dmp.Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }
    return accuracy + (proximity / dmp.Match_Distance);
  }

  // Highest score beyond which we give up.
  var score_threshold = this.Match_Threshold;
  // Is there a nearby exact match? (speedup)
  var best_loc = text.indexOf(pattern, loc);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
    if (best_loc != -1) {
      score_threshold =
          Math.min(match_bitapScore_(0, best_loc), score_threshold);
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1);
  best_loc = -1;

  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {  // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
      } else {  // Subsequent passes: fuzzy match.
        rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) |
                (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
                last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break;
    }
    last_rd = rd;
  }
  return best_loc;
};


/**
 * Initialise the alphabet for the Bitap algorithm.
 * @param {string} pattern The text to encode.
 * @return {!Object} Hash of character locations.
 * @private
 */
diff_match_patch.prototype.match_alphabet_ = function(pattern) {
  var s = {};
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] = 0;
  }
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
  }
  return s;
};


//  PATCH FUNCTIONS


/**
 * Increase the context until it is unique,
 * but don't let the pattern expand beyond Match_MaxBits.
 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
 * @param {string} text Source text.
 * @private
 */
diff_match_patch.prototype.patch_addContext_ = function(patch, text) {
  if (text.length == 0) {
    return;
  }
  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
  var padding = 0;

  // Look for the first and last matches of pattern in text.  If two different
  // matches are found, increase the pattern length.
  while (text.indexOf(pattern) != text.lastIndexOf(pattern) &&
         pattern.length < this.Match_MaxBits - this.Patch_Margin -
         this.Patch_Margin) {
    padding += this.Patch_Margin;
    pattern = text.substring(patch.start2 - padding,
                             patch.start2 + patch.length1 + padding);
  }
  // Add one chunk for good luck.
  padding += this.Patch_Margin;

  // Add the prefix.
  var prefix = text.substring(patch.start2 - padding, patch.start2);
  if (prefix) {
    patch.diffs.unshift([DIFF_EQUAL, prefix]);
  }
  // Add the suffix.
  var suffix = text.substring(patch.start2 + patch.length1,
                              patch.start2 + patch.length1 + padding);
  if (suffix) {
    patch.diffs.push([DIFF_EQUAL, suffix]);
  }

  // Roll back the start points.
  patch.start1 -= prefix.length;
  patch.start2 -= prefix.length;
  // Extend the lengths.
  patch.length1 += prefix.length + suffix.length;
  patch.length2 += prefix.length + suffix.length;
};


/**
 * Compute a list of patches to turn text1 into text2.
 * Use diffs if provided, otherwise compute it ourselves.
 * There are four ways to call this function, depending on what data is
 * available to the caller:
 * Method 1:
 * a = text1, b = text2
 * Method 2:
 * a = diffs
 * Method 3 (optimal):
 * a = text1, b = diffs
 * Method 4 (deprecated, use method 3):
 * a = text1, b = text2, c = diffs
 *
 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
 * Array of diff tuples for text1 to text2 (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_make = function(a, opt_b, opt_c) {
  var text1, diffs;
  if (typeof a == 'string' && typeof opt_b == 'string' &&
      typeof opt_c == 'undefined') {
    // Method 1: text1, text2
    // Compute diffs from text1 and text2.
    text1 = /** @type {string} */(a);
    diffs = this.diff_main(text1, /** @type {string} */(opt_b), true);
    if (diffs.length > 2) {
      this.diff_cleanupSemantic(diffs);
      this.diff_cleanupEfficiency(diffs);
    }
  } else if (a && typeof a == 'object' && typeof opt_b == 'undefined' &&
      typeof opt_c == 'undefined') {
    // Method 2: diffs
    // Compute text1 from diffs.
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(a);
    text1 = this.diff_text1(diffs);
  } else if (typeof a == 'string' && opt_b && typeof opt_b == 'object' &&
      typeof opt_c == 'undefined') {
    // Method 3: text1, diffs
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_b);
  } else if (typeof a == 'string' && typeof opt_b == 'string' &&
      opt_c && typeof opt_c == 'object') {
    // Method 4: text1, text2, diffs
    // text2 is not used.
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_c);
  } else {
    throw new Error('Unknown call format to patch_make.');
  }

  if (diffs.length === 0) {
    return [];  // Get rid of the null case.
  }
  var patches = [];
  var patch = new diff_match_patch.patch_obj();
  var patchDiffLength = 0;  // Keeping our own length var is faster in JS.
  var char_count1 = 0;  // Number of characters into the text1 string.
  var char_count2 = 0;  // Number of characters into the text2 string.
  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
  // text2 (postpatch_text).  We recreate the patches one by one to determine
  // context info.
  var prepatch_text = text1;
  var postpatch_text = text1;
  for (var x = 0; x < diffs.length; x++) {
    var diff_type = diffs[x][0];
    var diff_text = diffs[x][1];

    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
      // A new patch starts here.
      patch.start1 = char_count1;
      patch.start2 = char_count2;
    }

    switch (diff_type) {
      case DIFF_INSERT:
        patch.diffs[patchDiffLength++] = diffs[x];
        patch.length2 += diff_text.length;
        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text +
                         postpatch_text.substring(char_count2);
        break;
      case DIFF_DELETE:
        patch.length1 += diff_text.length;
        patch.diffs[patchDiffLength++] = diffs[x];
        postpatch_text = postpatch_text.substring(0, char_count2) +
                         postpatch_text.substring(char_count2 +
                             diff_text.length);
        break;
      case DIFF_EQUAL:
        if (diff_text.length <= 2 * this.Patch_Margin &&
            patchDiffLength && diffs.length != x + 1) {
          // Small equality inside a patch.
          patch.diffs[patchDiffLength++] = diffs[x];
          patch.length1 += diff_text.length;
          patch.length2 += diff_text.length;
        } else if (diff_text.length >= 2 * this.Patch_Margin) {
          // Time for a new patch.
          if (patchDiffLength) {
            this.patch_addContext_(patch, prepatch_text);
            patches.push(patch);
            patch = new diff_match_patch.patch_obj();
            patchDiffLength = 0;
            // Unlike Unidiff, our patch lists have a rolling context.
            // http://code.google.com/p/google-diff-match-patch/wiki/Unidiff
            // Update prepatch text & pos to reflect the application of the
            // just completed patch.
            prepatch_text = postpatch_text;
            char_count1 = char_count2;
          }
        }
        break;
    }

    // Update the current character count.
    if (diff_type !== DIFF_INSERT) {
      char_count1 += diff_text.length;
    }
    if (diff_type !== DIFF_DELETE) {
      char_count2 += diff_text.length;
    }
  }
  // Pick up the leftover patch if not empty.
  if (patchDiffLength) {
    this.patch_addContext_(patch, prepatch_text);
    patches.push(patch);
  }

  return patches;
};


/**
 * Given an array of patches, return another array that is identical.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_deepCopy = function(patches) {
  // Making deep copies is hard in JavaScript.
  var patchesCopy = [];
  for (var x = 0; x < patches.length; x++) {
    var patch = patches[x];
    var patchCopy = new diff_match_patch.patch_obj();
    patchCopy.diffs = [];
    for (var y = 0; y < patch.diffs.length; y++) {
      patchCopy.diffs[y] = patch.diffs[y].slice();
    }
    patchCopy.start1 = patch.start1;
    patchCopy.start2 = patch.start2;
    patchCopy.length1 = patch.length1;
    patchCopy.length2 = patch.length2;
    patchesCopy[x] = patchCopy;
  }
  return patchesCopy;
};


/**
 * Merge a set of patches onto the text.  Return a patched text, as well
 * as a list of true/false values indicating which patches were applied.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @param {string} text Old text.
 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
 *      new text and an array of boolean values.
 */
diff_match_patch.prototype.patch_apply = function(patches, text) {
  if (patches.length == 0) {
    return [text, []];
  }

  // Deep copy the patches so that no changes are made to originals.
  patches = this.patch_deepCopy(patches);

  var nullPadding = this.patch_addPadding(patches);
  text = nullPadding + text + nullPadding;

  this.patch_splitMax(patches);
  // delta keeps track of the offset between the expected and actual location
  // of the previous patch.  If there are patches expected at positions 10 and
  // 20, but the first patch was found at 12, delta is 2 and the second patch
  // has an effective expected position of 22.
  var delta = 0;
  var results = [];
  for (var x = 0; x < patches.length; x++) {
    var expected_loc = patches[x].start2 + delta;
    var text1 = this.diff_text1(patches[x].diffs);
    var start_loc;
    var end_loc = -1;
    if (text1.length > this.Match_MaxBits) {
      // patch_splitMax will only provide an oversized pattern in the case of
      // a monster delete.
      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits),
                                  expected_loc);
      if (start_loc != -1) {
        end_loc = this.match_main(text,
            text1.substring(text1.length - this.Match_MaxBits),
            expected_loc + text1.length - this.Match_MaxBits);
        if (end_loc == -1 || start_loc >= end_loc) {
          // Can't find valid trailing context.  Drop this patch.
          start_loc = -1;
        }
      }
    } else {
      start_loc = this.match_main(text, text1, expected_loc);
    }
    if (start_loc == -1) {
      // No match found.  :(
      results[x] = false;
      // Subtract the delta for this failed patch from subsequent patches.
      delta -= patches[x].length2 - patches[x].length1;
    } else {
      // Found a match.  :)
      results[x] = true;
      delta = start_loc - expected_loc;
      var text2;
      if (end_loc == -1) {
        text2 = text.substring(start_loc, start_loc + text1.length);
      } else {
        text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
      }
      if (text1 == text2) {
        // Perfect match, just shove the replacement text in.
        text = text.substring(0, start_loc) +
               this.diff_text2(patches[x].diffs) +
               text.substring(start_loc + text1.length);
      } else {
        // Imperfect match.  Run a diff to get a framework of equivalent
        // indices.
        var diffs = this.diff_main(text1, text2, false);
        if (text1.length > this.Match_MaxBits &&
            this.diff_levenshtein(diffs) / text1.length >
            this.Patch_DeleteThreshold) {
          // The end points match, but the content is unacceptably bad.
          results[x] = false;
        } else {
          this.diff_cleanupSemanticLossless(diffs);
          var index1 = 0;
          var index2;
          for (var y = 0; y < patches[x].diffs.length; y++) {
            var mod = patches[x].diffs[y];
            if (mod[0] !== DIFF_EQUAL) {
              index2 = this.diff_xIndex(diffs, index1);
            }
            if (mod[0] === DIFF_INSERT) {  // Insertion
              text = text.substring(0, start_loc + index2) + mod[1] +
                     text.substring(start_loc + index2);
            } else if (mod[0] === DIFF_DELETE) {  // Deletion
              text = text.substring(0, start_loc + index2) +
                     text.substring(start_loc + this.diff_xIndex(diffs,
                         index1 + mod[1].length));
            }
            if (mod[0] !== DIFF_DELETE) {
              index1 += mod[1].length;
            }
          }
        }
      }
    }
  }
  // Strip the padding off.
  text = text.substring(nullPadding.length, text.length - nullPadding.length);
  return [text, results];
};


/**
 * Add some padding on text start and end so that edges can match something.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} The padding string added to each side.
 */
diff_match_patch.prototype.patch_addPadding = function(patches) {
  var paddingLength = this.Patch_Margin;
  var nullPadding = '';
  for (var x = 1; x <= paddingLength; x++) {
    nullPadding += String.fromCharCode(x);
  }

  // Bump all the patches forward.
  for (var x = 0; x < patches.length; x++) {
    patches[x].start1 += paddingLength;
    patches[x].start2 += paddingLength;
  }

  // Add some padding on start of first diff.
  var patch = patches[0];
  var diffs = patch.diffs;
  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.unshift([DIFF_EQUAL, nullPadding]);
    patch.start1 -= paddingLength;  // Should be 0.
    patch.start2 -= paddingLength;  // Should be 0.
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[0][1].length) {
    // Grow first equality.
    var extraLength = paddingLength - diffs[0][1].length;
    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
    patch.start1 -= extraLength;
    patch.start2 -= extraLength;
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  // Add some padding on end of last diff.
  patch = patches[patches.length - 1];
  diffs = patch.diffs;
  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.push([DIFF_EQUAL, nullPadding]);
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[diffs.length - 1][1].length) {
    // Grow last equality.
    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  return nullPadding;
};


/**
 * Look through the patches and break up any which are longer than the maximum
 * limit of the match algorithm.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 */
diff_match_patch.prototype.patch_splitMax = function(patches) {
  var patch_size = this.Match_MaxBits;
  for (var x = 0; x < patches.length; x++) {
    if (patches[x].length1 <= patch_size) {
      continue;
    }
    var bigpatch = patches[x];
    // Remove the big old patch.
    patches.splice(x--, 1);
    var start1 = bigpatch.start1;
    var start2 = bigpatch.start2;
    var precontext = '';
    while (bigpatch.diffs.length !== 0) {
      // Create one of several smaller patches.
      var patch = new diff_match_patch.patch_obj();
      var empty = true;
      patch.start1 = start1 - precontext.length;
      patch.start2 = start2 - precontext.length;
      if (precontext !== '') {
        patch.length1 = patch.length2 = precontext.length;
        patch.diffs.push([DIFF_EQUAL, precontext]);
      }
      while (bigpatch.diffs.length !== 0 &&
             patch.length1 < patch_size - this.Patch_Margin) {
        var diff_type = bigpatch.diffs[0][0];
        var diff_text = bigpatch.diffs[0][1];
        if (diff_type === DIFF_INSERT) {
          // Insertions are harmless.
          patch.length2 += diff_text.length;
          start2 += diff_text.length;
          patch.diffs.push(bigpatch.diffs.shift());
          empty = false;
        } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 &&
                   patch.diffs[0][0] == DIFF_EQUAL &&
                   diff_text.length > 2 * patch_size) {
          // This is a large deletion.  Let it pass in one chunk.
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          empty = false;
          patch.diffs.push([diff_type, diff_text]);
          bigpatch.diffs.shift();
        } else {
          // Deletion or equality.  Only take as much as we can stomach.
          diff_text = diff_text.substring(0,
              patch_size - patch.length1 - this.Patch_Margin);
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          if (diff_type === DIFF_EQUAL) {
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
          } else {
            empty = false;
          }
          patch.diffs.push([diff_type, diff_text]);
          if (diff_text == bigpatch.diffs[0][1]) {
            bigpatch.diffs.shift();
          } else {
            bigpatch.diffs[0][1] =
                bigpatch.diffs[0][1].substring(diff_text.length);
          }
        }
      }
      // Compute the head context for the next patch.
      precontext = this.diff_text2(patch.diffs);
      precontext =
          precontext.substring(precontext.length - this.Patch_Margin);
      // Append the end context for this patch.
      var postcontext = this.diff_text1(bigpatch.diffs)
                            .substring(0, this.Patch_Margin);
      if (postcontext !== '') {
        patch.length1 += postcontext.length;
        patch.length2 += postcontext.length;
        if (patch.diffs.length !== 0 &&
            patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
          patch.diffs[patch.diffs.length - 1][1] += postcontext;
        } else {
          patch.diffs.push([DIFF_EQUAL, postcontext]);
        }
      }
      if (!empty) {
        patches.splice(++x, 0, patch);
      }
    }
  }
};


/**
 * Take a list of patches and return a textual representation.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} Text representation of patches.
 */
diff_match_patch.prototype.patch_toText = function(patches) {
  var text = [];
  for (var x = 0; x < patches.length; x++) {
    text[x] = patches[x];
  }
  return text.join('');
};


/**
 * Parse a textual representation of patches and return a list of Patch objects.
 * @param {string} textline Text representation of patches.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.patch_fromText = function(textline) {
  var patches = [];
  if (!textline) {
    return patches;
  }
  var text = textline.split('\n');
  var textPointer = 0;
  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
  while (textPointer < text.length) {
    var m = text[textPointer].match(patchHeader);
    if (!m) {
      throw new Error('Invalid patch string: ' + text[textPointer]);
    }
    var patch = new diff_match_patch.patch_obj();
    patches.push(patch);
    patch.start1 = parseInt(m[1], 10);
    if (m[2] === '') {
      patch.start1--;
      patch.length1 = 1;
    } else if (m[2] == '0') {
      patch.length1 = 0;
    } else {
      patch.start1--;
      patch.length1 = parseInt(m[2], 10);
    }

    patch.start2 = parseInt(m[3], 10);
    if (m[4] === '') {
      patch.start2--;
      patch.length2 = 1;
    } else if (m[4] == '0') {
      patch.length2 = 0;
    } else {
      patch.start2--;
      patch.length2 = parseInt(m[4], 10);
    }
    textPointer++;

    while (textPointer < text.length) {
      var sign = text[textPointer].charAt(0);
      try {
        var line = decodeURI(text[textPointer].substring(1));
      } catch (ex) {
        // Malformed URI sequence.
        throw new Error('Illegal escape in patch_fromText: ' + line);
      }
      if (sign == '-') {
        // Deletion.
        patch.diffs.push([DIFF_DELETE, line]);
      } else if (sign == '+') {
        // Insertion.
        patch.diffs.push([DIFF_INSERT, line]);
      } else if (sign == ' ') {
        // Minor equality.
        patch.diffs.push([DIFF_EQUAL, line]);
      } else if (sign == '@') {
        // Start of next patch.
        break;
      } else if (sign === '') {
        // Blank line?  Whatever.
      } else {
        // WTF?
        throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
      }
      textPointer++;
    }
  }
  return patches;
};


/**
 * Class representing one patch operation.
 * @constructor
 */
diff_match_patch.patch_obj = function() {
  /** @type {!Array.<!diff_match_patch.Diff>} */
  this.diffs = [];
  /** @type {?number} */
  this.start1 = null;
  /** @type {?number} */
  this.start2 = null;
  /** @type {number} */
  this.length1 = 0;
  /** @type {number} */
  this.length2 = 0;
};


/**
 * Emmulate GNU diff's format.
 * Header: @@ -382,8 +481,9 @@
 * Indicies are printed as 1-based, not 0-based.
 * @return {string} The GNU diff string.
 */
diff_match_patch.patch_obj.prototype.toString = function() {
  var coords1, coords2;
  if (this.length1 === 0) {
    coords1 = this.start1 + ',0';
  } else if (this.length1 == 1) {
    coords1 = this.start1 + 1;
  } else {
    coords1 = (this.start1 + 1) + ',' + this.length1;
  }
  if (this.length2 === 0) {
    coords2 = this.start2 + ',0';
  } else if (this.length2 == 1) {
    coords2 = this.start2 + 1;
  } else {
    coords2 = (this.start2 + 1) + ',' + this.length2;
  }
  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
  var op;
  // Escape the body of the patch with %xx notation.
  for (var x = 0; x < this.diffs.length; x++) {
    switch (this.diffs[x][0]) {
      case DIFF_INSERT:
        op = '+';
        break;
      case DIFF_DELETE:
        op = '-';
        break;
      case DIFF_EQUAL:
        op = ' ';
        break;
    }
    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
  }
  return text.join('').replace(/%20/g, ' ');
};

// Export these global variables so that they survive Google's JS compiler.
// In a browser, 'this' will be 'window'.
// Users of node.js should 'require' the uncompressed version since Google's
// JS compiler may break the following exports for non-browser environments.
//this['diff_match_patch'] = diff_match_patch;
//this['DIFF_DELETE'] = DIFF_DELETE;
//this['DIFF_INSERT'] = DIFF_INSERT;
//this['DIFF_EQUAL'] = DIFF_EQUAL;

// Changed by Stypi
diff_match_patch.DIFF_EQUAL = DIFF_EQUAL
diff_match_patch.DIFF_DELETE = DIFF_DELETE
diff_match_patch.DIFF_INSERT = DIFF_INSERT
module.exports = diff_match_patch


},{}],5:[function(require,module,exports){
var InsertOp, Op,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Op = require('./op');

InsertOp = (function(_super) {
  __extends(InsertOp, _super);

  InsertOp.isInsert = function(i) {
    return (i != null) && typeof i.value === "string";
  };

  function InsertOp(value, attributes) {
    this.value = value;
    if (attributes == null) {
      attributes = {};
    }
    this.attributes = _.clone(attributes);
  }

  InsertOp.prototype.getAt = function(start, length) {
    return new InsertOp(this.value.substr(start, length), this.attributes);
  };

  InsertOp.prototype.getLength = function() {
    return this.value.length;
  };

  InsertOp.prototype.isEqual = function(other) {
    return (other != null) && this.value === other.value && _.isEqual(this.attributes, other.attributes);
  };

  InsertOp.prototype.join = function(other) {
    if (_.isEqual(this.attributes, other.attributes)) {
      return new InsertOp(this.value + second.value, this.attributes);
    } else {
      throw Error;
    }
  };

  InsertOp.prototype.split = function(offset) {
    var left, right;
    left = new InsertOp(this.value.substr(0, offset), this.attributes);
    right = new InsertOp(this.value.substr(offset), this.attributes);
    return [left, right];
  };

  InsertOp.prototype.toString = function() {
    return "{" + this.value + ", " + (this.printAttributes()) + "}";
  };

  return InsertOp;

})(Op);

module.exports = InsertOp;


},{"./op":6}],6:[function(require,module,exports){
var Op, isInsert;

isInsert = function(i) {
  return (i != null) && typeof i.value === "string";
};

Op = (function() {
  function Op(attributes) {
    if (attributes == null) {
      attributes = {};
    }
    this.attributes = _.clone(attributes);
  }

  Op.prototype.addAttributes = function(attributes) {
    var addedAttributes, key, value;
    addedAttributes = {};
    for (key in attributes) {
      value = attributes[key];
      if (this.attributes[key] === void 0) {
        addedAttributes[key] = value;
      }
    }
    return addedAttributes;
  };

  Op.prototype.attributesMatch = function(other) {
    var otherAttributes;
    otherAttributes = other.attributes || {};
    return _.isEqual(this.attributes, otherAttributes);
  };

  Op.prototype.composeAttributes = function(attributes) {
    var resolveAttributes,
      _this = this;
    resolveAttributes = function(oldAttrs, newAttrs) {
      var key, resolvedAttrs, value;
      if (!newAttrs) {
        return oldAttrs;
      }
      resolvedAttrs = _.clone(oldAttrs);
      for (key in newAttrs) {
        value = newAttrs[key];
        if (isInsert(_this) && value === null) {
          delete resolvedAttrs[key];
        } else if (typeof value !== 'undefined') {
          if (typeof resolvedAttrs[key] === 'object' && typeof value === 'object' && _.all([resolvedAttrs[key], newAttrs[key]], (function(val) {
            return val !== null;
          }))) {
            resolvedAttrs[key] = resolveAttributes(resolvedAttrs[key], value);
          } else {
            resolvedAttrs[key] = value;
          }
        }
      }
      return resolvedAttrs;
    };
    return resolveAttributes(this.attributes, attributes);
  };

  Op.prototype.numAttributes = function() {
    return _.keys(this.attributes).length;
  };

  Op.prototype.printAttributes = function() {
    return JSON.stringify(this.attributes);
  };

  return Op;

})();

module.exports = Op;


},{}],7:[function(require,module,exports){
var Op, RetainOp,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Op = require('./op');

RetainOp = (function(_super) {
  __extends(RetainOp, _super);

  RetainOp.isRetain = function(r) {
    return (r != null) && typeof r.start === "number" && typeof r.end === "number";
  };

  function RetainOp(start, end, attributes) {
    this.start = start;
    this.end = end;
    if (attributes == null) {
      attributes = {};
    }
    this.attributes = _.clone(attributes);
  }

  RetainOp.prototype.getAt = function(start, length) {
    return new RetainOp(this.start + start, this.start + start + length, this.attributes);
  };

  RetainOp.prototype.getLength = function() {
    return this.end - this.start;
  };

  RetainOp.prototype.isEqual = function(other) {
    return (other != null) && this.start === other.start && this.end === other.end && _.isEqual(this.attributes, other.attributes);
  };

  RetainOp.prototype.split = function(offset) {
    var left, right;
    left = new RetainOp(this.start, this.start + offset, this.attributes);
    right = new RetainOp(this.start + offset, this.end, this.attributes);
    return [left, right];
  };

  RetainOp.prototype.toString = function() {
    return "{{" + this.start + " - " + this.end + "), " + (this.printAttributes()) + "}";
  };

  return RetainOp;

})(Op);

module.exports = RetainOp;


},{"./op":6}],"tandem-core":[function(require,module,exports){
module.exports=require('PDczpc');
},{}],"PDczpc":[function(require,module,exports){
module.exports = {
  Delta: require('./delta'),
  DeltaGen: require('./delta_generator'),
  Op: require('./op'),
  InsertOp: require('./insert'),
  RetainOp: require('./retain')
};


},{"./delta":2,"./delta_generator":3,"./insert":5,"./op":6,"./retain":7}],10:[function(require,module,exports){
module.exports={
  "name": "scribe",
  "version": "0.10.5",
  "description": "Cross browser rich text editor",
  "contributors": [{
    "name": "Jason Chen",
    "email": "jhchen7@gmail.com"
  }, {
    "name": "Byron Milligan",
    "email": "byronner@gmail.com"  
  }],
  "dependencies": {
    "tandem-core"          : "0.4.x",
    "underscore"           : "1.5.x",
    "underscore.string"    : "2.3.x"
  },
  "devDependencies": {
    "async"                : "0.2.x",
    "expect.js"            : "0.2.x",
    "grunt"                : "0.4.x",
    "grunt-browserify"     : "1.2.x",
    "coffeeify"            : "0.5.x",
    "grunt-contrib-clean"  : "0.5.x",
    "grunt-contrib-coffee" : "0.7.x",
    "grunt-contrib-concat" : "0.3.x",
    "grunt-contrib-copy"   : "0.4.x",
    "grunt-contrib-jade"   : "0.8.x",
    "grunt-contrib-stylus" : "0.11.x",
    "grunt-contrib-watch"  : "0.5.x",
    "grunt-image-embed"    : "0.3.x",
    "grunt-string-replace" : "0.2.x",
    "karma"                : "0.10.x",
    "karma-coverage"       : "0.1.x",
    "karma-mocha"          : "0.1.x",
    "karma-browserstack-launcher" : "0.0.x",
    "karma-safari-launcher"       : "0.1.x",
    "mocha"                : "1.12.x"
  },
  "engine": {
    "node": ">=0.8"
  },
  "license": {
    "type": "BSD",
    "url": "https://github.com/stypi/scribe/blob/master/LICENSE"  
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/stypi/scribe"
  },
  "scripts": {
    "test": "make test-remote"
  }
}

},{}],11:[function(require,module,exports){
var ScribeDOM, ScribeDocument, ScribeFormatManager, ScribeLine, ScribeNormalizer, ScribeUtils, Tandem;

ScribeDOM = require('./dom');

ScribeFormatManager = require('./format-manager');

ScribeLine = require('./line');

ScribeNormalizer = require('./normalizer');

ScribeUtils = require('./utils');

Tandem = require('tandem-core');

ScribeDocument = (function() {
  function ScribeDocument(root, options) {
    var _this = this;
    this.root = root;
    if (options == null) {
      options = {};
    }
    this.formatManager = new ScribeFormatManager(this.root, options);
    this.normalizer = new ScribeNormalizer(this.root, this.formatManager);
    this.root.innerHTML = ScribeNormalizer.normalizeHtml(this.root.innerHTML);
    this.lines = new LinkedList();
    this.lineMap = {};
    this.normalizer.normalizeDoc();
    _.each(this.root.childNodes, function(node) {
      return _this.appendLine(node);
    });
  }

  ScribeDocument.prototype.appendLine = function(lineNode) {
    return this.insertLineBefore(lineNode, null);
  };

  ScribeDocument.prototype.findLeaf = function(node) {
    var line, lineNode;
    lineNode = node.parentNode;
    while ((lineNode != null) && !ScribeUtils.isLineNode(lineNode)) {
      lineNode = lineNode.parentNode;
    }
    if (lineNode == null) {
      return null;
    }
    line = this.findLine(lineNode);
    return line.findLeaf(node);
  };

  ScribeDocument.prototype.findLine = function(node) {
    node = this.findLineNode(node);
    if (node != null) {
      return this.lineMap[node.id];
    } else {
      return null;
    }
  };

  ScribeDocument.prototype.findLineAtOffset = function(offset) {
    var retLine,
      _this = this;
    retLine = this.lines.first;
    _.all(this.lines.toArray(), function(line, index) {
      retLine = line;
      if (offset < line.length) {
        return false;
      } else {
        if (index < _this.lines.length - 1) {
          offset -= line.length;
        }
        return true;
      }
    });
    return [retLine, offset];
  };

  ScribeDocument.prototype.findLineNode = function(node) {
    while ((node != null) && !ScribeUtils.isLineNode(node)) {
      node = node.parentNode;
    }
    return node;
  };

  ScribeDocument.prototype.insertLineBefore = function(newLineNode, refLine) {
    var line;
    line = new ScribeLine(this, newLineNode);
    if (refLine !== null) {
      this.lines.insertAfter(refLine.prev, line);
    } else {
      this.lines.append(line);
    }
    this.lineMap[line.id] = line;
    return line;
  };

  ScribeDocument.prototype.mergeLines = function(line, lineToMerge) {
    if (!((line != null) && (lineToMerge != null))) {
      return;
    }
    _.each(_.clone(lineToMerge.node.childNodes), function(child) {
      return line.node.appendChild(child);
    });
    ScribeDOM.removeNode(lineToMerge.node);
    this.removeLine(lineToMerge);
    line.trailingNewline = lineToMerge.trailingNewline;
    return line.rebuild();
  };

  ScribeDocument.prototype.removeLine = function(line) {
    delete this.lineMap[line.id];
    return this.lines.remove(line);
  };

  ScribeDocument.prototype.splitLine = function(line, offset) {
    var lineNode1, lineNode2, newLine, trailingNewline, _ref;
    if (offset !== line.length || line.trailingNewline) {
      _ref = ScribeUtils.splitNode(line.node, offset, true), lineNode1 = _ref[0], lineNode2 = _ref[1];
      line.node = lineNode1;
      trailingNewline = line.trailingNewline;
      line.trailingNewline = true;
      this.updateLine(line);
      newLine = this.insertLineBefore(lineNode2, line.next);
      newLine.trailingNewline = trailingNewline;
      newLine.resetContent();
      return newLine;
    } else {
      line.trailingNewline = true;
      line.resetContent();
      return line;
    }
  };

  ScribeDocument.prototype.toDelta = function() {
    var delta, lines, ops;
    lines = this.lines.toArray();
    ops = _.flatten(_.map(lines, function(line, index) {
      return line.delta.ops;
    }), true);
    delta = new Tandem.Delta(0, ops);
    return delta;
  };

  ScribeDocument.prototype.updateLine = function(line) {
    return line.rebuild();
  };

  return ScribeDocument;

})();

module.exports = ScribeDocument;


},{"./dom":12,"./format-manager":14,"./line":19,"./normalizer":25,"./utils":36,"tandem-core":"PDczpc"}],12:[function(require,module,exports){
var ScribeDOM;

ScribeDOM = {
  ELEMENT_NODE: 1,
  NOBREAK_SPACE: "&nbsp;",
  TEXT_NODE: 3,
  ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF",
  addClass: function(node, cssClass) {
    if (ScribeDOM.hasClass(node, cssClass)) {
      return;
    }
    if (node.classList != null) {
      return node.classList.add(cssClass);
    } else if (node.className != null) {
      return node.className += ' ' + cssClass;
    }
  },
  addEventListener: function(node, eventName, listener) {
    var callback, names;
    names = eventName.split(' ');
    if (names.length > 1) {
      return _.each(names, function(name) {
        return ScribeDOM.addEventListener(node, name, listener);
      });
    }
    callback = function(event) {
      var bubbles;
      if (event == null) {
        event = ScribeDOM.getWindow(node).event;
      }
      if (event.target == null) {
        event.target = event.srcElement;
      }
      if (event.which == null) {
        event.which = event.keyCode;
      }
      bubbles = listener.call(null, event);
      if (bubbles === false) {
        if (event.preventDefault != null) {
          event.preventDefault();
        } else {
          event.returnValue = false;
        }
        if (event.stopPropagation != null) {
          event.stopPropagation();
        } else {
          event.cancelBubble = true;
        }
      }
      return bubbles;
    };
    if (node.addEventListener != null) {
      return node.addEventListener(eventName, callback);
    } else if (node.attachEvent != null) {
      return node.attachEvent("on" + eventName, callback);
    } else {
      throw new Error("No add event support");
    }
  },
  getChildIndex: function(node) {
    var index;
    index = 0;
    while (node.previousSibling != null) {
      node = previousSibling;
      index += 1;
    }
    return index;
  },
  getClasses: function(node) {
    if (node.classList) {
      return _.clone(node.classList);
    } else if (node.className != null) {
      return node.className.split(' ');
    }
  },
  getDefaultOption: function(select) {
    var i, o, option, _i, _len, _ref;
    option = select.querySelector('option[selected]');
    if (option != null) {
      return option;
    } else {
      _ref = select.options;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        o = _ref[i];
        if (o.defaultSelected) {
          return o;
        }
      }
    }
    return null;
  },
  getText: function(node) {
    switch (node.nodeType) {
      case ScribeDOM.ELEMENT_NODE:
        if (node.tagName === "BR") {
          return "";
        } else {
          return node.textContent || node.innerText || "";
        }
      case ScribeDOM.TEXT_NODE:
        return node.data || "";
      default:
        return "";
    }
  },
  getWindow: function(node) {
    return node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
  },
  hasClass: function(node, cssClass) {
    if (node.classList != null) {
      return node.classList.contains(cssClass);
    } else if (node.className != null) {
      return _.indexOf(ScribeDOM.getClasses(node), cssClass) > -1;
    }
    return false;
  },
  mergeNodes: function(node1, node2) {
    if (node1 == null) {
      return node2;
    }
    if (node2 == null) {
      return node1;
    }
    this.moveChildren(node1, node2);
    node2.parentNode.removeChild(node2);
    if ((node1.tagName === 'OL' || node1.tagName === 'UL') && node1.childNodes.length === 2) {
      ScribeDOM.mergeNodes(node1.firstChild, node1.lastChild);
    }
    return node1;
  },
  moveChildren: function(newParent, oldParent) {
    return _.each(_.clone(oldParent.childNodes), function(child) {
      return newParent.appendChild(child);
    });
  },
  normalize: function(node) {
    var child, nextChild, _results;
    child = node.firstChild;
    _results = [];
    while (child) {
      if (child.nodeType === 3) {
        while ((nextChild = child.nextSibling) && nextChild.nodeType === 3) {
          child.appendData(nextChild.data);
          node.removeChild(nextChild);
        }
      }
      _results.push(child = child.nextSibling);
    }
    return _results;
  },
  removeAttributes: function(node, exception) {
    if (exception == null) {
      exception = [];
    }
    if (_.isString(exception)) {
      exception = [exception];
    }
    return _.each(_.clone(node.attributes), function(attrNode, value) {
      if (!(_.indexOf(exception, attrNode.name) > -1)) {
        return node.removeAttribute(attrNode.name);
      }
    });
  },
  removeClass: function(node, cssClass) {
    var classArray;
    if (!ScribeDOM.hasClass(node, cssClass)) {
      return;
    }
    if (node.classList != null) {
      return node.classList.remove(cssClass);
    } else if (node.className != null) {
      classArray = ScribeDOM.getClasses(node);
      classArray.splice(_.indexOf(classArray, cssClass), 1);
      return node.className = classArray.join(' ');
    }
  },
  removeNode: function(node) {
    var _ref;
    return (_ref = node.parentNode) != null ? _ref.removeChild(node) : void 0;
  },
  resetSelect: function(select) {
    var option;
    option = ScribeDOM.getDefaultOption(select);
    if (option != null) {
      option.selected = true;
      return ScribeDOM.triggerEvent(select, 'change');
    } else {
      return select.selectedIndex = null;
    }
  },
  setText: function(node, text) {
    switch (node.nodeType) {
      case ScribeDOM.ELEMENT_NODE:
        if (node.textContent != null) {
          return node.textContent = text;
        } else {
          return node.innerText = text;
        }
        break;
      case ScribeDOM.TEXT_NODE:
        return node.data = text;
    }
  },
  switchTag: function(node, newTag) {
    var newNode;
    if (node.tagName === newTag) {
      return;
    }
    newNode = node.ownerDocument.createElement(newTag);
    this.moveChildren(newNode, node);
    node.parentNode.replaceChild(newNode, node);
    if (node.className) {
      newNode.className = node.className;
    }
    if (node.id) {
      newNode.id = node.id;
    }
    return newNode;
  },
  toggleClass: function(node, className, state) {
    if (state == null) {
      state = !ScribeDOM.hasClass(node, className);
    }
    if (state) {
      return ScribeDOM.addClass(node, className);
    } else {
      return ScribeDOM.removeClass(node, className);
    }
  },
  triggerEvent: function(elem, eventName, bubble, cancels) {
    var evt;
    if (elem.ownerDocument.createEvent) {
      evt = elem.ownerDocument.createEvent("HTMLEvents");
      evt.initEvent(eventName, bubble, cancels);
      return elem.dispatchEvent(evt);
    } else {
      return elem.fireEvent("on" + eventName, cancels);
    }
  },
  unwrap: function(node) {
    var next, ret;
    ret = node.firstChild;
    next = node.nextSibling;
    _.each(_.clone(node.childNodes), function(child) {
      return node.parentNode.insertBefore(child, next);
    });
    node.parentNode.removeChild(node);
    return ret;
  },
  wrap: function(wrapper, node) {
    node.parentNode.insertBefore(wrapper, node);
    wrapper.appendChild(node);
    return wrapper;
  }
};

module.exports = ScribeDOM;


},{}],13:[function(require,module,exports){
var DEFAULT_API_OPTIONS, ScribeDOM, ScribeDefaultTheme, ScribeDocument, ScribeEditor, ScribeKeyboard, ScribeLine, ScribeLogger, ScribeNormalizer, ScribePasteManager, ScribeRenderer, ScribeSelection, ScribeUndoManager, ScribeUtils, Tandem, _deleteAt, _forceTrailingNewline, _formatAt, _insertAt, _preformat, _trackDelta, _update,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

ScribeDOM = require('./dom');

ScribeDefaultTheme = require('./themes/default');

ScribeDocument = require('./document');

ScribeKeyboard = require('./keyboard');

ScribeLine = require('./line');

ScribeLogger = require('./logger');

ScribeNormalizer = require('./normalizer');

ScribePasteManager = require('./paste-manager');

ScribeRenderer = require('./renderer');

ScribeSelection = require('./selection');

ScribeUndoManager = require('./undo-manager');

ScribeUtils = require('./utils');

Tandem = require('tandem-core');

DEFAULT_API_OPTIONS = {
  silent: false,
  source: 'api'
};

_deleteAt = function(index, length) {
  var _this = this;
  if (length <= 0) {
    return;
  }
  return this.selection.preserve(index, -1 * length, function() {
    var curLine, deleteLength, firstLine, nextLine, offset, _ref;
    _ref = _this.doc.findLineAtOffset(index), firstLine = _ref[0], offset = _ref[1];
    curLine = firstLine;
    while ((curLine != null) && length > 0) {
      deleteLength = Math.min(length, curLine.length - offset);
      nextLine = curLine.next;
      if (curLine.length === deleteLength) {
        if (curLine === _this.doc.lines.first && curLine === _this.doc.lines.last) {
          curLine.node.innerHTML = '';
          curLine.trailingNewline = false;
          curLine.rebuild();
        } else {
          ScribeDOM.removeNode(curLine.node);
          _this.doc.removeLine(curLine);
        }
      } else {
        curLine.deleteText(offset, deleteLength);
      }
      length -= deleteLength;
      curLine = nextLine;
      offset = 0;
    }
    if ((firstLine != null) && !firstLine.trailingNewline) {
      return _this.doc.mergeLines(firstLine, firstLine.next);
    }
  });
};

_forceTrailingNewline = function() {
  var _ref;
  if (!((_ref = this.doc.lines.last) != null ? _ref.trailingNewline : void 0)) {
    return this.insertAt(this.getLength(), "\n");
  }
};

_formatAt = function(index, length, name, value) {
  var _this = this;
  return this.selection.preserve(index, 0, function() {
    var line, offset, _ref, _results;
    _ref = _this.doc.findLineAtOffset(index), line = _ref[0], offset = _ref[1];
    _results = [];
    while ((line != null) && length > 0) {
      if (ScribeLine.FORMATS[name] != null) {
        if (length > line.length - offset) {
          line.format(name, value);
        }
      } else {
        line.formatText(offset, Math.min(length, line.length - offset), name, value);
      }
      length -= line.length - offset;
      offset = 0;
      _results.push(line = line.next);
    }
    return _results;
  });
};

_insertAt = function(index, text, formatting) {
  var _this = this;
  if (formatting == null) {
    formatting = {};
  }
  return this.selection.preserve(index, text.length, function() {
    var line, lineTexts, offset, _ref;
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\r/g, '\n');
    lineTexts = text.split('\n');
    _ref = _this.doc.findLineAtOffset(index), line = _ref[0], offset = _ref[1];
    if (line === _this.doc.lines.last && offset >= line.length && line.trailingNewline) {
      line = _this.doc.splitLine(line, line.length);
      line.trailingNewline = false;
      line.resetContent();
      offset = 0;
    }
    return _.each(lineTexts, function(lineText, i) {
      line.insertText(offset, lineText, formatting);
      if (i < lineTexts.length - 1) {
        line = _this.doc.splitLine(line, offset + lineText.length);
        return offset = 0;
      }
    });
  });
};

_preformat = function(name, value) {
  var format;
  format = this.doc.formatManager.formats[name];
  if (format == null) {
    throw new Error("Unsupported format " + name + " " + value);
  }
  return format.preformat(value);
};

_trackDelta = function(fn, options) {
  var decompose, decomposeA, decomposeB, decomposeLeft, decomposeRight, ignored, newDelta, newIndex, newLeftDelta, newRightDelta, oldIndex, oldLeftDelta, oldRightDelta, _ref, _ref1, _ref2, _ref3;
  oldIndex = (_ref = this.savedRange) != null ? _ref.start.index : void 0;
  fn();
  newDelta = this.doc.toDelta();
  try {
    newIndex = (_ref1 = this.selection.getRange()) != null ? _ref1.start.index : void 0;
    if ((oldIndex != null) && (newIndex != null) && oldIndex <= this.delta.endLength && newIndex <= newDelta.endLength) {
      _ref2 = this.delta.split(oldIndex), oldLeftDelta = _ref2[0], oldRightDelta = _ref2[1];
      _ref3 = newDelta.split(newIndex), newLeftDelta = _ref3[0], newRightDelta = _ref3[1];
      decomposeLeft = newLeftDelta.decompose(oldLeftDelta);
      decomposeRight = newRightDelta.decompose(oldRightDelta);
      decomposeA = decomposeLeft.merge(decomposeRight);
    }
  } catch (_error) {
    ignored = _error;
  }
  decomposeB = newDelta.decompose(this.delta);
  if (decomposeA && decomposeB) {
    decompose = decomposeA.ops.length < decomposeB.ops.length ? decomposeA : decomposeB;
  } else {
    decompose = decomposeA || decomposeB;
  }
  return decompose;
};

_update = function() {
  var delta,
    _this = this;
  delta = _trackDelta.call(this, function() {
    return _this.doSilently(function() {
      ScribeNormalizer.normalizeEmptyDoc(_this.root);
      ScribeNormalizer.normalizeEmptyLines(_this.root);
      return _this.selection.preserve(function() {
        var lineNode, lines, newLine, _results;
        ScribeNormalizer.breakBlocks(_this.root);
        lines = _this.doc.lines.toArray();
        lineNode = _this.root.firstChild;
        _.each(lines, function(line, index) {
          var newLine;
          while (line.node !== lineNode) {
            if (line.node.parentNode === _this.root) {
              _this.doc.normalizer.normalizeLine(lineNode);
              newLine = _this.doc.insertLineBefore(lineNode, line);
              lineNode = lineNode.nextSibling;
            } else {
              return _this.doc.removeLine(line);
            }
          }
          _this.doc.updateLine(line);
          return lineNode = lineNode.nextSibling;
        });
        _results = [];
        while (lineNode !== null) {
          _this.doc.normalizer.normalizeLine(lineNode);
          newLine = _this.doc.appendLine(lineNode);
          _results.push(lineNode = lineNode.nextSibling);
        }
        return _results;
      });
    });
  });
  if (delta.isIdentity()) {
    return false;
  } else {
    return delta;
  }
};

ScribeEditor = (function(_super) {
  __extends(ScribeEditor, _super);

  ScribeEditor.editors = [];

  ScribeEditor.ID_PREFIX = 'editor-';

  ScribeEditor.DEFAULTS = {
    cursor: 0,
    enabled: true,
    logLevel: false,
    pollInterval: 100,
    formatManager: {},
    renderer: {},
    undoManager: {},
    modules: {},
    theme: ScribeDefaultTheme
  };

  ScribeEditor.events = {
    API_TEXT_CHANGE: 'api-text-change',
    FOCUS_CHANGE: 'focus-change',
    PRE_EVENT: 'pre-event',
    POST_EVENT: 'post-event',
    SELECTION_CHANGE: 'selection-change',
    USER_TEXT_CHANGE: 'user-text-change'
  };

  function ScribeEditor(iframeContainer, options) {
    var _this = this;
    this.iframeContainer = iframeContainer;
    if (options == null) {
      options = {};
    }
    this.id = _.uniqueId(ScribeEditor.ID_PREFIX);
    this.options = _.defaults(options, ScribeEditor.DEFAULTS);
    this.options.renderer['id'] = this.id;
    if (_.isString(this.iframeContainer)) {
      this.iframeContainer = document.querySelector(this.iframeContainer);
    }
    this.logger = new ScribeLogger(this, this.options.logLevel);
    this.reset(true);
    this.theme = new this.options.theme(this);
    this.modules = _.reduce(this.options.modules, function(modules, options, name) {
      modules[name] = _this.theme.addModule(name, options);
      return modules;
    }, {});
    setInterval(function() {
      return _this.checkUpdate();
    }, this.options.pollInterval);
    this.on(ScribeEditor.events.SELECTION_CHANGE, function(range) {
      return _this.savedRange = range;
    });
    if (this.options.enabled) {
      this.enable();
    }
  }

  ScribeEditor.prototype.disable = function() {
    var _this = this;
    return this.doSilently(function() {
      return _this.root.setAttribute('contenteditable', false);
    });
  };

  ScribeEditor.prototype.enable = function() {
    var _this = this;
    return this.doSilently(function() {
      return _this.root.setAttribute('contenteditable', true);
    });
  };

  ScribeEditor.prototype.reset = function(keepHTML) {
    if (keepHTML == null) {
      keepHTML = false;
    }
    this.ignoreDomChanges = true;
    this.options.renderer.keepHTML = keepHTML;
    if (this.root != null) {
      this.iframeContainer.innerHTML = this.root.innerHTML;
    }
    this.renderer = new ScribeRenderer(this.iframeContainer, this.options);
    this.contentWindow = this.renderer.iframe.contentWindow;
    this.root = this.renderer.root;
    this.doc = new ScribeDocument(this.root, this.options);
    this.delta = this.doc.toDelta();
    this.keyboard = new ScribeKeyboard(this);
    this.selection = new ScribeSelection(this);
    this.undoManager = new ScribeUndoManager(this, this.options);
    this.pasteManager = new ScribePasteManager(this);
    this.ignoreDomChanges = false;
    return ScribeEditor.editors.push(this);
  };

  ScribeEditor.prototype.applyDelta = function(delta, options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    options = _.defaults(options, DEFAULT_API_OPTIONS);
    if (delta.isIdentity()) {
      return;
    }
    if (delta.startLength === 0 && this.getLength() === 1) {
      return this.setDelta(delta, options);
    }
    return this.doSilently(function() {
      var eventName, localDelta, oldDelta, tempDelta;
      localDelta = _this.update();
      if (localDelta) {
        _this.delta = _this.delta.compose(localDelta);
        tempDelta = localDelta;
        localDelta = localDelta.follows(delta, true);
        delta = delta.follows(tempDelta, false);
      }
      if (!delta.isIdentity()) {
        if (delta.startLength !== _this.delta.endLength) {
          throw new Error("Trying to apply delta to incorrect doc length");
        }
        delta.apply(_insertAt, _deleteAt, _formatAt, _this);
        oldDelta = _this.delta;
        _this.delta = oldDelta.compose(delta);
        if (!options.silent) {
          eventName = options.source === 'api' ? ScribeEditor.events.API_TEXT_CHANGE : ScribeEditor.events.USER_TEXT_CHANGE;
          _this.emit(eventName, delta);
        }
      }
      if (localDelta && !localDelta.isIdentity()) {
        _this.emit(ScribeEditor.events.USER_TEXT_CHANGE, localDelta);
      }
      _this.innerHTML = _this.root.innerHTML;
      return _forceTrailingNewline.call(_this);
    });
  };

  ScribeEditor.prototype.checkUpdate = function() {
    var delta, oldDelta;
    delta = this.update();
    if (delta) {
      oldDelta = this.delta;
      this.delta = oldDelta.compose(delta);
      this.emit(ScribeEditor.events.USER_TEXT_CHANGE, delta);
    }
    return this.selection.update(delta !== false);
  };

  ScribeEditor.prototype.emit = function() {
    var args, eventName, _ref;
    eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ScribeEditor.__super__.emit.apply(this, [ScribeEditor.events.PRE_EVENT, eventName].concat(__slice.call(args)));
    if (_.indexOf(_.values(ScribeEditor.events), eventName) > -1) {
      (_ref = this.logger).info.apply(_ref, [eventName].concat(__slice.call(args)));
    }
    ScribeEditor.__super__.emit.apply(this, [eventName].concat(__slice.call(args)));
    return ScribeEditor.__super__.emit.apply(this, [ScribeEditor.events.POST_EVENT, eventName].concat(__slice.call(args)));
  };

  ScribeEditor.prototype.deleteAt = function(index, length, options) {
    if (options == null) {
      options = {};
    }
    return this.applyDelta(Tandem.Delta.makeDeleteDelta(this.delta.endLength, index, length), options);
  };

  ScribeEditor.prototype.doSilently = function(fn) {
    var oldIgnoreDomChange;
    oldIgnoreDomChange = this.ignoreDomChanges;
    this.ignoreDomChanges = true;
    fn();
    return this.ignoreDomChanges = oldIgnoreDomChange;
  };

  ScribeEditor.prototype.formatAt = function(index, length, name, value, options) {
    var attribute;
    if (options == null) {
      options = {};
    }
    if (length > 0) {
      attribute = {};
      attribute[name] = value;
      return this.applyDelta(Tandem.Delta.makeRetainDelta(this.delta.endLength, index, length, attribute), options);
    } else {
      return _preformat.call(this, name, value);
    }
  };

  ScribeEditor.prototype.getAt = function(index, length) {
    if (index == null) {
      index = 0;
    }
    if (length == null) {
      length = null;
    }
    if (length == null) {
      length = this.getLength() - index;
    }
    return _.map(this.getDelta().getOpsAt(index, length), function(op) {
      return op.value;
    }).join('');
  };

  ScribeEditor.prototype.getDelta = function() {
    return this.delta;
  };

  ScribeEditor.prototype.getLength = function() {
    return this.delta.endLength;
  };

  ScribeEditor.prototype.getSelection = function() {
    return this.selection.getRange();
  };

  ScribeEditor.prototype.insertAt = function(index, text, formatting, options) {
    if (formatting == null) {
      formatting = {};
    }
    if (options == null) {
      options = {};
    }
    return this.applyDelta(Tandem.Delta.makeInsertDelta(this.delta.endLength, index, text, formatting), options);
  };

  ScribeEditor.prototype.setDelta = function(delta) {
    var oldLength;
    oldLength = delta.startLength;
    delta.startLength = this.getLength();
    this.applyDelta(delta, {
      silent: true
    });
    this.undoManager.clear();
    return delta.startLength = oldLength;
  };

  ScribeEditor.prototype.setSelection = function(range, silent) {
    if (silent == null) {
      silent = false;
    }
    return this.selection.setRange(range, silent);
  };

  ScribeEditor.prototype.update = function() {
    var delta;
    if (this.innerHTML !== this.root.innerHTML) {
      delta = _update.call(this);
      this.innerHTML = this.root.innerHTML;
      return delta;
    } else {
      return false;
    }
  };

  return ScribeEditor;

})(EventEmitter2);

module.exports = ScribeEditor;


},{"./document":11,"./dom":12,"./keyboard":16,"./line":19,"./logger":20,"./normalizer":25,"./paste-manager":26,"./renderer":29,"./selection":30,"./themes/default":32,"./undo-manager":35,"./utils":36,"tandem-core":"PDczpc"}],14:[function(require,module,exports){
var ScribeFormat, ScribeFormatManager;

ScribeFormat = require('./format');

ScribeFormatManager = (function() {
  ScribeFormatManager.DEFAULTS = {
    formats: ['bold', 'italic', 'strike', 'underline', 'link', 'back-color', 'font-name', 'fore-color', 'font-size']
  };

  function ScribeFormatManager(container, options) {
    var _this = this;
    this.container = container;
    if (options == null) {
      options = {};
    }
    this.options = _.defaults(options.formatManager || {}, ScribeFormatManager.DEFAULTS);
    this.formats = {};
    _.each(this.options.formats, function(formatName) {
      var className;
      className = _.str.classify(formatName);
      return _this.addFormat(formatName, new ScribeFormat[className](_this.container));
    });
  }

  ScribeFormatManager.prototype.addFormat = function(name, format) {
    return this.formats[name] = format;
  };

  ScribeFormatManager.prototype.createFormatContainer = function(name, value) {
    if (this.formats[name]) {
      return this.formats[name].createContainer(value);
    } else {
      return this.container.ownerDocument.createElement('SPAN');
    }
  };

  ScribeFormatManager.prototype.getFormat = function(container) {
    var format, formats, name, names, value, _ref;
    names = [];
    formats = [];
    _ref = this.formats;
    for (name in _ref) {
      format = _ref[name];
      value = format.matchContainer(container);
      if (value) {
        names.push(name);
        formats.push(value);
      }
    }
    switch (names.length) {
      case 0:
        return [];
      case 1:
        return [names[0], formats[0]];
      default:
        return [names, formats];
    }
  };

  return ScribeFormatManager;

})();

module.exports = ScribeFormatManager;


},{"./format":15}],15:[function(require,module,exports){
var ScribeBackColorFormat, ScribeBoldFormat, ScribeClassFormat, ScribeColorFormat, ScribeDOM, ScribeFontNameFormat, ScribeFontSizeFormat, ScribeForeColorFormat, ScribeItalicFormat, ScribeLeafFormat, ScribeLinkFormat, ScribeSpanFormat, ScribeStrikeFormat, ScribeStyleFormat, ScribeTagFormat, ScribeUnderlineFormat, ScribeUtils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ScribeDOM = require('./dom');

ScribeUtils = require('./utils');

ScribeLeafFormat = (function() {
  function ScribeLeafFormat(root, keyName) {
    this.root = root;
    this.keyName = keyName;
  }

  ScribeLeafFormat.prototype.clean = function(node) {
    ScribeDOM.removeAttributes(node);
    return node;
  };

  ScribeLeafFormat.prototype.createContainer = function() {
    throw new Error("Descendants should implement");
  };

  ScribeLeafFormat.prototype.matchContainer = function(container) {
    throw new Error("Descendants should implement");
  };

  ScribeLeafFormat.prototype.preformat = function(value) {
    throw new Error("Descendants should implement");
  };

  return ScribeLeafFormat;

})();

ScribeTagFormat = (function(_super) {
  __extends(ScribeTagFormat, _super);

  function ScribeTagFormat(root, keyName, tagName) {
    this.root = root;
    this.keyName = keyName;
    this.tagName = tagName;
    ScribeTagFormat.__super__.constructor.apply(this, arguments);
  }

  ScribeTagFormat.prototype.approximate = function(value) {
    if (!value) {
      throw new Error('Tag format must have truthy value');
    }
    return true;
  };

  ScribeTagFormat.prototype.clean = function(node) {
    node = ScribeTagFormat.__super__.clean.call(this, node);
    if (node.tagName !== this.tagName) {
      node = ScribeDOM.switchTag(node, this.tagName);
    }
    return node;
  };

  ScribeTagFormat.prototype.createContainer = function() {
    return this.root.ownerDocument.createElement(this.tagName);
  };

  ScribeTagFormat.prototype.matchContainer = function(container) {
    return container.tagName === this.tagName;
  };

  ScribeTagFormat.prototype.preformat = function(value) {
    return this.root.ownerDocument.execCommand(this.keyName, false, value);
  };

  return ScribeTagFormat;

})(ScribeLeafFormat);

ScribeSpanFormat = (function(_super) {
  __extends(ScribeSpanFormat, _super);

  function ScribeSpanFormat(root, keyName) {
    this.root = root;
    this.keyName = keyName;
    ScribeSpanFormat.__super__.constructor.call(this, this.root, this.keyName, 'SPAN');
  }

  ScribeSpanFormat.prototype.clean = function(node) {
    if (node.tagName !== this.tagName) {
      node = ScribeDOM.switchTag(node, this.tagName);
    }
    return node;
  };

  ScribeSpanFormat.prototype.approximate = function(value) {
    throw new Error("Descendants should implement");
  };

  return ScribeSpanFormat;

})(ScribeTagFormat);

ScribeClassFormat = (function(_super) {
  __extends(ScribeClassFormat, _super);

  function ScribeClassFormat(root, keyName) {
    this.root = root;
    this.keyName = keyName;
    ScribeClassFormat.__super__.constructor.apply(this, arguments);
  }

  ScribeClassFormat.prototype.approximate = function(value) {
    var parts;
    parts = value.split('-');
    if (parts.length > 1 && parts[0] === this.keyName) {
      return parts.slice(1).join('-');
    }
    return false;
  };

  ScribeClassFormat.prototype.clean = function(node) {
    ScribeDOM.removeAttributes(node, 'class');
    return node;
  };

  ScribeClassFormat.prototype.createContainer = function(value) {
    var container;
    container = ScribeClassFormat.__super__.createContainer.call(this, value);
    ScribeDOM.addClass(container, "" + this.keyName + "-" + value);
    return container;
  };

  ScribeClassFormat.prototype.matchContainer = function(container) {
    var classList, css, value, _i, _len;
    if (ScribeClassFormat.__super__.matchContainer.call(this, container)) {
      classList = ScribeDOM.getClasses(container);
      for (_i = 0, _len = classList.length; _i < _len; _i++) {
        css = classList[_i];
        value = this.approximate(css);
        if (value) {
          return value;
        }
      }
    }
    return false;
  };

  return ScribeClassFormat;

})(ScribeSpanFormat);

ScribeStyleFormat = (function(_super) {
  __extends(ScribeStyleFormat, _super);

  ScribeStyleFormat.getStyleObject = function(container) {
    var obj, styleString;
    styleString = container.getAttribute('style') || '';
    obj = _.reduce(styleString.split(';'), function(styles, str) {
      var name, value, _ref;
      _ref = str.split(':'), name = _ref[0], value = _ref[1];
      if (name && value) {
        name = _.str.trim(name);
        value = _.str.trim(value);
        styles[name.toLowerCase()] = value;
      }
      return styles;
    }, {});
    return obj;
  };

  function ScribeStyleFormat(root, keyName, cssName, defaultStyle, styles) {
    this.root = root;
    this.keyName = keyName;
    this.cssName = cssName;
    this.defaultStyle = defaultStyle;
    this.styles = styles;
    ScribeStyleFormat.__super__.constructor.apply(this, arguments);
  }

  ScribeStyleFormat.prototype.approximate = function(cssValue) {
    var key, value, _ref;
    _ref = this.styles;
    for (key in _ref) {
      value = _ref[key];
      if (value.toUpperCase() === cssValue.toUpperCase()) {
        if (key === this.defaultStyle) {
          return false;
        } else {
          return key;
        }
      }
    }
    return false;
  };

  ScribeStyleFormat.prototype.clean = function(node) {
    var style, styleObj;
    node = ScribeStyleFormat.__super__.clean.call(this, node);
    ScribeDOM.removeAttributes(node, 'style');
    styleObj = ScribeStyleFormat.getStyleObject(node);
    node.removeAttribute('style');
    if (styleObj[this.cssName]) {
      style = this.approximate(styleObj[this.cssName]);
      if (style) {
        node.setAttribute('style', "" + this.cssName + ": " + this.styles[style] + ";");
      }
    }
    return node;
  };

  ScribeStyleFormat.prototype.createContainer = function(value) {
    var container, cssName, style;
    container = ScribeStyleFormat.__super__.createContainer.call(this, value);
    cssName = _.str.camelize(this.cssName);
    style = this.approximate(value);
    if (style) {
      container.setAttribute('style', "" + this.cssName + ": " + this.styles[style] + ";");
    }
    return container;
  };

  ScribeStyleFormat.prototype.matchContainer = function(container) {
    var style, _ref;
    style = (_ref = container.style) != null ? _ref[_.str.camelize(this.cssName)] : void 0;
    if (style) {
      return this.approximate(style);
    } else {
      return false;
    }
  };

  ScribeStyleFormat.prototype.preformat = function(value) {
    value = this.approximate(value) || this.defaultStyle;
    return this.root.ownerDocument.execCommand(_.str.camelize(this.keyName), false, this.styles[value]);
  };

  return ScribeStyleFormat;

})(ScribeSpanFormat);

ScribeBoldFormat = (function(_super) {
  __extends(ScribeBoldFormat, _super);

  function ScribeBoldFormat(root) {
    this.root = root;
    ScribeBoldFormat.__super__.constructor.call(this, this.root, 'bold', 'B');
  }

  ScribeBoldFormat.prototype.matchContainer = function(container) {
    var _ref;
    return ScribeBoldFormat.__super__.matchContainer.call(this, container) || ((_ref = container.style) != null ? _ref.fontWeight : void 0) === 'bold';
  };

  return ScribeBoldFormat;

})(ScribeTagFormat);

ScribeItalicFormat = (function(_super) {
  __extends(ScribeItalicFormat, _super);

  function ScribeItalicFormat(root) {
    this.root = root;
    ScribeItalicFormat.__super__.constructor.call(this, this.root, 'italic', 'I');
  }

  ScribeItalicFormat.prototype.matchContainer = function(container) {
    var _ref;
    return ScribeItalicFormat.__super__.matchContainer.call(this, container) || ((_ref = container.style) != null ? _ref.fontStyle : void 0) === 'italic';
  };

  return ScribeItalicFormat;

})(ScribeTagFormat);

ScribeStrikeFormat = (function(_super) {
  __extends(ScribeStrikeFormat, _super);

  function ScribeStrikeFormat(root) {
    this.root = root;
    ScribeStrikeFormat.__super__.constructor.call(this, this.root, 'strike', 'S');
  }

  ScribeStrikeFormat.prototype.matchContainer = function(container) {
    var _ref;
    return ScribeStrikeFormat.__super__.matchContainer.call(this, container) || ((_ref = container.style) != null ? _ref.textDecoration : void 0) === 'line-through';
  };

  ScribeStrikeFormat.prototype.preformat = function(value) {
    return this.root.ownerDocument.execCommand('strikeThrough', false, value);
  };

  return ScribeStrikeFormat;

})(ScribeTagFormat);

ScribeUnderlineFormat = (function(_super) {
  __extends(ScribeUnderlineFormat, _super);

  function ScribeUnderlineFormat(root) {
    this.root = root;
    ScribeUnderlineFormat.__super__.constructor.call(this, this.root, 'underline', 'U');
  }

  ScribeUnderlineFormat.prototype.matchContainer = function(container) {
    var _ref;
    return ScribeUnderlineFormat.__super__.matchContainer.call(this, container) || ((_ref = container.style) != null ? _ref.textDecoration : void 0) === 'underline';
  };

  return ScribeUnderlineFormat;

})(ScribeTagFormat);

ScribeLinkFormat = (function(_super) {
  __extends(ScribeLinkFormat, _super);

  function ScribeLinkFormat(root) {
    this.root = root;
    ScribeLinkFormat.__super__.constructor.call(this, this.root, 'link', 'A');
  }

  ScribeLinkFormat.prototype.approximate = function(value) {
    if (!value.match(/^https?:\/\//)) {
      value = 'http://' + value;
    }
    return value;
  };

  ScribeLinkFormat.prototype.clean = function(node) {
    ScribeDOM.removeAttributes(node, ['href', 'title']);
    return node;
  };

  ScribeLinkFormat.prototype.createContainer = function(value) {
    var link;
    link = ScribeLinkFormat.__super__.createContainer.call(this, value);
    link.href = this.approximate(value);
    link.title = link.href;
    return link;
  };

  ScribeLinkFormat.prototype.matchContainer = function(container) {
    if (ScribeLinkFormat.__super__.matchContainer.call(this, container)) {
      return container.getAttribute('href');
    } else {
      return false;
    }
  };

  return ScribeLinkFormat;

})(ScribeTagFormat);

ScribeColorFormat = (function(_super) {
  __extends(ScribeColorFormat, _super);

  ScribeColorFormat.COLORS = {
    'black': 'rgb(0, 0, 0)',
    'red': 'rgb(255, 0, 0)',
    'blue': 'rgb(0, 0, 255)',
    'lime': 'rgb(0, 255, 0)',
    'teal': 'rgb(0, 255, 255)',
    'magenta': 'rgb(255, 0, 255)',
    'yellow': 'rgb(255, 255, 0)',
    'white': 'rgb(255, 255, 255)'
  };

  ScribeColorFormat.normalizeColor = function(value) {
    var colors;
    value = value.replace(/\ /g, '');
    if (value[0] === '#' && value.length === 4) {
      return _.map(value.slice(1), function(letter) {
        return parseInt(letter + letter, 16);
      });
    } else if (value[0] === '#' && value.length === 7) {
      return [parseInt(value.slice(1, 3), 16), parseInt(value.slice(3, 5), 16), parseInt(value.slice(5, 7), 16)];
    } else if (value.indexOf('rgb') === 0) {
      colors = value.slice(value.indexOf('(') + 1, value.indexOf(')')).split(',');
      return _.map(colors, function(color) {
        return parseInt(color);
      });
    } else {
      return [0, 0, 0];
    }
  };

  function ScribeColorFormat(root, keyName, cssName, defaultStyle, styles) {
    this.root = root;
    this.keyName = keyName;
    this.cssName = cssName;
    this.defaultStyle = defaultStyle;
    this.styles = styles;
    ScribeColorFormat.__super__.constructor.apply(this, arguments);
  }

  ScribeColorFormat.prototype.approximate = function(value) {
    var color;
    if (!value) {
      return false;
    }
    if (this.styles[value] != null) {
      return value;
    }
    color = ScribeUtils.findClosestPoint(value, this.styles, ScribeColorFormat.normalizeColor);
    if (color === this.defaultStyle) {
      return false;
    } else {
      return color;
    }
  };

  return ScribeColorFormat;

})(ScribeStyleFormat);

ScribeBackColorFormat = (function(_super) {
  __extends(ScribeBackColorFormat, _super);

  function ScribeBackColorFormat(root) {
    this.root = root;
    ScribeBackColorFormat.__super__.constructor.call(this, this.root, 'back-color', 'background-color', 'white', ScribeColorFormat.COLORS);
  }

  return ScribeBackColorFormat;

})(ScribeColorFormat);

ScribeFontNameFormat = (function(_super) {
  __extends(ScribeFontNameFormat, _super);

  ScribeFontNameFormat.normalizeFont = function(fontStr) {
    return _.map(fontStr.toUpperCase().split(','), function(font) {
      return _.str.trim(font, "'\" ");
    });
  };

  function ScribeFontNameFormat(root) {
    this.root = root;
    ScribeFontNameFormat.__super__.constructor.call(this, this.root, 'font-name', 'font-family', 'sans-serif', {
      'sans-serif': "'Helvetica', 'Arial', sans-serif",
      'serif': "'Times New Roman', serif",
      'monospace': "'Courier New', monospace"
    });
  }

  ScribeFontNameFormat.prototype.approximate = function(value) {
    var fonts, key, values, _ref;
    values = ScribeFontNameFormat.normalizeFont(value);
    _ref = this.styles;
    for (key in _ref) {
      fonts = _ref[key];
      fonts = ScribeFontNameFormat.normalizeFont(fonts);
      if (_.intersection(fonts, values).length > 0) {
        return key;
      }
    }
    return false;
  };

  return ScribeFontNameFormat;

})(ScribeStyleFormat);

ScribeFontSizeFormat = (function(_super) {
  __extends(ScribeFontSizeFormat, _super);

  ScribeFontSizeFormat.SCALE = 6.75;

  function ScribeFontSizeFormat(root) {
    this.root = root;
    ScribeFontSizeFormat.__super__.constructor.call(this, this.root, 'font-size', 'font-size', 'normal', {
      'huge': '32px',
      'large': '18px',
      'normal': '13px',
      'small': '10px'
    });
  }

  ScribeFontSizeFormat.prototype.approximate = function(value) {
    var size;
    if (this.styles[value] != null) {
      return value;
    }
    if (_.isString(value) && value.indexOf('px') > -1) {
      value = parseInt(value);
    } else {
      value = parseInt(value) * ScribeFontSizeFormat.SCALE;
    }
    size = ScribeUtils.findClosestPoint(value, this.styles, parseInt);
    if (size === this.defaultStyle) {
      return false;
    } else {
      return size;
    }
  };

  ScribeFontSizeFormat.prototype.preformat = function(value) {
    var size;
    value = this.approximate(value) || this.defaultStyle;
    size = Math.round(parseInt(this.styles[value]) / ScribeFontSizeFormat.SCALE);
    return this.root.ownerDocument.execCommand(_.str.camelize(this.keyName), false, size);
  };

  return ScribeFontSizeFormat;

})(ScribeStyleFormat);

ScribeForeColorFormat = (function(_super) {
  __extends(ScribeForeColorFormat, _super);

  function ScribeForeColorFormat(root) {
    this.root = root;
    ScribeForeColorFormat.__super__.constructor.call(this, this.root, 'fore-color', 'color', 'black', ScribeColorFormat.COLORS);
  }

  return ScribeForeColorFormat;

})(ScribeColorFormat);

module.exports = {
  Leaf: ScribeLeafFormat,
  Tag: ScribeTagFormat,
  Span: ScribeSpanFormat,
  Class: ScribeClassFormat,
  Style: ScribeStyleFormat,
  Bold: ScribeBoldFormat,
  Italic: ScribeItalicFormat,
  Link: ScribeLinkFormat,
  Strike: ScribeStrikeFormat,
  Underline: ScribeUnderlineFormat,
  BackColor: ScribeBackColorFormat,
  FontName: ScribeFontNameFormat,
  FontSize: ScribeFontSizeFormat,
  ForeColor: ScribeForeColorFormat
};


},{"./dom":12,"./utils":36}],16:[function(require,module,exports){
var ScribeDOM, ScribeKeyboard, ScribeLine, ScribePosition, ScribeRange, _initDeletes, _initHotkeys, _initListeners, _onTab;

ScribeDOM = require('./dom');

ScribeLine = require('./line');

ScribePosition = require('./position');

ScribeRange = require('./range');

_initDeletes = function() {
  var _this = this;
  return _.each([ScribeKeyboard.keys.DELETE, ScribeKeyboard.keys.BACKSPACE], function(key) {
    return _this.addHotkey(key, function() {
      return _this.editor.getLength() > 1;
    });
  });
};

_initHotkeys = function() {
  var _this = this;
  this.addHotkey(ScribeKeyboard.hotkeys.OUTDENT, function(range) {
    _onTab.call(_this, range, true);
    return false;
  });
  this.addHotkey(ScribeKeyboard.hotkeys.INDENT, function(range) {
    _onTab.call(_this, range, false);
    return false;
  });
  return _.each(['bold', 'italic', 'underline'], function(format) {
    return _this.addHotkey(ScribeKeyboard.hotkeys[format.toUpperCase()], function(range) {
      _this.toggleFormat(range, format);
      return false;
    });
  });
};

_initListeners = function() {
  var _this = this;
  return ScribeDOM.addEventListener(this.editor.root, 'keydown', function(event) {
    var prevent;
    if (_this.hotkeys[event.which] != null) {
      prevent = false;
      _.each(_this.hotkeys[event.which], function(hotkey) {
        var selection;
        if ((hotkey.meta != null) && (event.metaKey !== hotkey.meta && event.ctrlKey !== hotkey.meta)) {
          return;
        }
        if ((hotkey.shift != null) && event.shiftKey !== hotkey.shift) {
          return;
        }
        _this.editor.selection.update(true);
        selection = _this.editor.getSelection();
        if (selection == null) {
          return;
        }
        return prevent = hotkey.callback.call(null, selection) === false || prevent;
      });
    }
    return !prevent;
  });
};

_onTab = function(range, shift) {
  var end, index, lines, offsetChange, start,
    _this = this;
  if (shift == null) {
    shift = false;
  }
  lines = range.getLines();
  if (lines.length > 1) {
    index = ScribePosition.getIndex(lines[0].node);
    start = range.start.index + (shift ? -1 : 1);
    offsetChange = 0;
    _.each(lines, function(line) {
      if (!shift) {
        _this.editor.insertAt(index, '\t', {}, {
          source: 'user'
        });
        offsetChange += 1;
      } else if (line.leaves.first.text[0] === '\t') {
        _this.editor.deleteAt(index, 1, {
          source: 'user'
        });
        offsetChange -= 1;
      } else if (line === lines[0]) {
        start = range.start.index;
      }
      return index += line.length;
    });
    end = range.end.index + offsetChange;
    return this.editor.setSelection(new ScribeRange(this.editor, start, end));
  } else {
    range.deleteContents({
      source: 'user'
    });
    range.insertContents(0, "\t", {}, {
      source: 'user'
    });
    return this.editor.setSelection(new ScribeRange(this.editor, range.start.index + 1, range.start.index + 1));
  }
};

ScribeKeyboard = (function() {
  ScribeKeyboard.keys = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  };

  ScribeKeyboard.hotkeys = {
    BOLD: {
      key: 'B',
      meta: true
    },
    INDENT: {
      key: ScribeKeyboard.keys.TAB,
      shift: false
    },
    ITALIC: {
      key: 'I',
      meta: true
    },
    OUTDENT: {
      key: ScribeKeyboard.keys.TAB,
      shift: true
    },
    UNDERLINE: {
      key: 'U',
      meta: true
    },
    UNDO: {
      key: 'Z',
      meta: true,
      shift: false
    },
    REDO: {
      key: 'Z',
      meta: true,
      shift: true
    },
    SELECT_ALL: {
      key: 'A',
      meta: true
    }
  };

  ScribeKeyboard.NAVIGATION = [ScribeKeyboard.keys.UP, ScribeKeyboard.keys.DOWN, ScribeKeyboard.keys.LEFT, ScribeKeyboard.keys.RIGHT];

  function ScribeKeyboard(editor) {
    this.editor = editor;
    this.hotkeys = {};
    _initListeners.call(this);
    _initHotkeys.call(this);
    _initDeletes.call(this);
  }

  ScribeKeyboard.prototype.addHotkey = function(hotkey, callback) {
    var _base, _name;
    hotkey = _.isObject(hotkey) ? _.clone(hotkey) : {
      key: hotkey
    };
    if (_.isString(hotkey.key)) {
      hotkey.key = hotkey.key.toUpperCase().charCodeAt(0);
    }
    hotkey.callback = callback;
    if ((_base = this.hotkeys)[_name = hotkey.key] == null) {
      _base[_name] = [];
    }
    return this.hotkeys[hotkey.key].push(hotkey);
  };

  ScribeKeyboard.prototype.indent = function(selection, increment) {
    var applyIndent, lines,
      _this = this;
    lines = selection.getLines();
    applyIndent = function(line, format) {
      var indent, index;
      if (increment) {
        indent = _.isNumber(line.formats[format]) ? line.formats[format] : (line.formats[format] ? 1 : 0);
        indent += increment;
        indent = Math.min(Math.max(indent, ScribeLine.MIN_INDENT), ScribeLine.MAX_INDENT);
      } else {
        indent = false;
      }
      index = Position.getIndex(line.node, 0);
      return _this.editor.formatAt(index, 0, format, indent);
    };
    return _.each(lines, function(line) {
      if (line.formats.bullet != null) {
        return applyIndent(line, 'bullet');
      } else if (line.formats.list != null) {
        return applyIndent(line, 'list');
      } else {
        return applyIndent(line, 'indent');
      }
    });
  };

  ScribeKeyboard.prototype.toggleFormat = function(range, format) {
    var formats, value;
    formats = range.getFormats();
    value = !formats[format];
    return range.format(format, value, {
      source: 'user'
    });
  };

  return ScribeKeyboard;

})();

module.exports = ScribeKeyboard;


},{"./dom":12,"./line":19,"./position":27,"./range":28}],17:[function(require,module,exports){
var ScribeLeafIterator;

ScribeLeafIterator = (function() {
  function ScribeLeafIterator(start, end) {
    this.start = start;
    this.end = end;
    this.cur = this.start;
  }

  ScribeLeafIterator.prototype.next = function() {
    var line, ret;
    ret = this.cur;
    if (this.cur === this.end || this.cur === null) {
      this.cur = null;
    } else if (this.cur.next != null) {
      this.cur = this.cur.next;
    } else {
      line = this.cur.line.next;
      while ((line != null) && line.leaves.length === 0) {
        line = line.next;
      }
      this.cur = line != null ? line.leaves.first : null;
    }
    return ret;
  };

  ScribeLeafIterator.prototype.toArray = function() {
    var arr, itr, next;
    arr = [];
    itr = new ScribeLeafIterator(this.start, this.end);
    while (next = itr.next()) {
      arr.push(next);
    }
    return arr;
  };

  return ScribeLeafIterator;

})();

module.exports = ScribeLeafIterator;


},{}],18:[function(require,module,exports){
var ScribeDOM, ScribeLeaf, ScribePosition, ScribeUtils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ScribeDOM = require('./dom');

ScribePosition = require('./position');

ScribeUtils = require('./utils');

ScribeLeaf = (function(_super) {
  __extends(ScribeLeaf, _super);

  ScribeLeaf.ID_PREFIX = 'leaf-';

  ScribeLeaf.isLeafNode = function(node) {
    if ((node != null ? node.nodeType : void 0) !== ScribeDOM.ELEMENT_NODE) {
      return false;
    }
    if (node.tagName === 'BR') {
      return true;
    }
    if (node.childNodes.length === 1 && node.firstChild.nodeType === ScribeDOM.TEXT_NODE) {
      return true;
    }
    return false;
  };

  ScribeLeaf.isLeafParent = function(node) {
    if ((node != null ? node.nodeType : void 0) !== ScribeDOM.ELEMENT_NODE) {
      return false;
    }
    if (node.childNodes.length === 0) {
      return false;
    }
    if (node.childNodes.length > 1 || node.firstChild.nodeType !== ScribeDOM.TEXT_NODE) {
      return true;
    }
    return false;
  };

  function ScribeLeaf(line, node, formats) {
    this.line = line;
    this.node = node;
    this.formats = _.clone(formats);
    this.id = _.uniqueId(ScribeLeaf.ID_PREFIX);
    this.text = ScribeDOM.getText(this.node);
    this.length = this.text.length;
  }

  ScribeLeaf.prototype.getFormats = function() {
    return _.extend({}, this.formats, this.line.formats);
  };

  ScribeLeaf.prototype.getLineOffset = function() {
    return ScribePosition.getIndex(this.node, 0, this.line.node);
  };

  ScribeLeaf.prototype.insertText = function(index, text) {
    var nodeText, offset, textNode, _ref;
    this.text = this.text.substring(0, index) + text + this.text.substring(index);
    _ref = ScribeUtils.findDeepestNode(this.node, index), textNode = _ref[0], offset = _ref[1];
    nodeText = ScribeDOM.getText(textNode);
    ScribeDOM.setText(textNode, nodeText.substring(0, offset) + text + nodeText.substring(offset));
    return this.length = this.text.length;
  };

  return ScribeLeaf;

})(LinkedList.Node);

module.exports = ScribeLeaf;


},{"./dom":12,"./position":27,"./utils":36}],19:[function(require,module,exports){
var ScribeDOM, ScribeLeaf, ScribeLine, ScribeUtils, Tandem,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ScribeDOM = require('./dom');

ScribeLeaf = require('./leaf');

ScribeLine = require('./line');

ScribeUtils = require('./utils');

Tandem = require('tandem-core');

ScribeLine = (function(_super) {
  __extends(ScribeLine, _super);

  ScribeLine.CLASS_NAME = 'line';

  ScribeLine.ID_PREFIX = 'line-';

  ScribeLine.FORMATS = ['center', 'justify', 'left', 'right'];

  ScribeLine.MAX_INDENT = 9;

  ScribeLine.MIN_INDENT = 1;

  function ScribeLine(doc, node) {
    this.doc = doc;
    this.node = node;
    this.id = _.uniqueId(ScribeLine.ID_PREFIX);
    this.node.id = this.id;
    ScribeDOM.addClass(this.node, ScribeLine.CLASS_NAME);
    this.trailingNewline = true;
    this.rebuild();
    ScribeLine.__super__.constructor.call(this, this.node);
  }

  ScribeLine.prototype.applyToContents = function(offset, length, fn) {
    var endNode, nextNode, prevNode, startNode, _ref, _ref1;
    if (length <= 0) {
      return;
    }
    _ref = this.splitContents(offset), prevNode = _ref[0], startNode = _ref[1];
    _ref1 = this.splitContents(offset + length), endNode = _ref1[0], nextNode = _ref1[1];
    return ScribeUtils.traverseSiblings(startNode, endNode, fn);
  };

  ScribeLine.prototype.buildLeaves = function(node, formats) {
    var _this = this;
    return _.each(node.childNodes, function(node) {
      var formatName, formatValue, nodeFormats, _ref;
      nodeFormats = _.clone(formats);
      _ref = _this.doc.formatManager.getFormat(node), formatName = _ref[0], formatValue = _ref[1];
      if (formatName != null) {
        nodeFormats[formatName] = formatValue;
      }
      if (ScribeLeaf.isLeafNode(node)) {
        _this.leaves.append(new ScribeLeaf(_this, node, nodeFormats));
      }
      if (ScribeLeaf.isLeafParent(node)) {
        return _this.buildLeaves(node, nodeFormats);
      }
    });
  };

  ScribeLine.prototype.deleteText = function(offset, length) {
    if (!(length > 0)) {
      return;
    }
    this.applyToContents(offset, length, function(node) {
      return ScribeDOM.removeNode(node);
    });
    if (this.length === offset + length) {
      this.trailingNewline = false;
    }
    return this.rebuild();
  };

  ScribeLine.prototype.findLeaf = function(leafNode) {
    var curLeaf;
    curLeaf = this.leaves.first;
    while (curLeaf != null) {
      if (curLeaf.node === leafNode) {
        return curLeaf;
      }
      curLeaf = curLeaf.next;
    }
    return null;
  };

  ScribeLine.prototype.findLeafAtOffset = function(offset) {
    var leaf, _i, _len, _ref;
    _ref = this.leaves.toArray();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      leaf = _ref[_i];
      if (offset <= leaf.length) {
        return [leaf, offset];
      } else {
        offset -= leaf.length;
      }
    }
    return [leaf, offset];
  };

  ScribeLine.prototype.format = function(name, value) {
    throw new Error("Unimplemented");
  };

  ScribeLine.prototype.formatText = function(offset, length, name, value) {
    var format, formatNode, op, refNode,
      _this = this;
    while (length > 0) {
      op = _.first(this.delta.getOpsAt(offset, 1));
      if ((value && op.attributes[name] !== value) || (!value && (op.attributes[name] != null))) {
        break;
      }
      offset += 1;
      length -= 1;
    }
    while (length > 0) {
      op = _.first(this.delta.getOpsAt(offset + length - 1, 1));
      if ((value && op.attributes[name] !== value) || (!value && (op.attributes[name] != null))) {
        break;
      }
      length -= 1;
    }
    if (!(length > 0)) {
      return;
    }
    format = this.doc.formatManager.formats[name];
    if (format == null) {
      throw new Error("Unrecognized format " + name);
    }
    if (value) {
      refNode = null;
      formatNode = this.doc.formatManager.createFormatContainer(name, value);
      this.applyToContents(offset, length, function(node) {
        refNode = node.nextSibling;
        formatNode.appendChild(node);
        return ScribeUtils.removeFormatFromSubtree(node, format);
      });
      this.node.insertBefore(formatNode, refNode);
    } else {
      this.applyToContents(offset, length, function(node) {
        return ScribeUtils.removeFormatFromSubtree(node, format);
      });
    }
    return this.rebuild();
  };

  ScribeLine.prototype.insertText = function(offset, text, formats) {
    var leaf, leafOffset, nextNode, parentNode, prevNode, span, _ref, _ref1,
      _this = this;
    if (formats == null) {
      formats = {};
    }
    if (!((text != null ? text.length : void 0) > 0)) {
      return;
    }
    _ref = this.findLeafAtOffset(offset), leaf = _ref[0], leafOffset = _ref[1];
    if (_.isEqual(leaf.formats, formats) && this.length > 1 && offset > 0) {
      leaf.insertText(leafOffset, text);
      return this.resetContent();
    } else {
      span = this.node.ownerDocument.createElement('span');
      ScribeDOM.setText(span, text);
      if (offset === 0) {
        this.node.insertBefore(span, this.node.firstChild);
      } else {
        _ref1 = this.splitContents(offset), prevNode = _ref1[0], nextNode = _ref1[1];
        parentNode = (prevNode != null ? prevNode.parentNode : void 0) || (nextNode != null ? nextNode.parentNode : void 0);
        parentNode.insertBefore(span, nextNode);
      }
      this.rebuild();
      return _.each(formats, function(value, name) {
        return _this.formatText(offset, text.length, name, value);
      });
    }
  };

  ScribeLine.prototype.rebuild = function(force) {
    var _ref;
    if (force == null) {
      force = false;
    }
    if (this.node.parentNode === this.doc.root) {
      if (!force && (this.outerHTML != null) && this.outerHTML === this.node.outerHTML) {
        return false;
      }
      while (((_ref = this.leaves) != null ? _ref.length : void 0) > 0) {
        this.leaves.remove(this.leaves.first);
      }
      this.leaves = new LinkedList();
      this.doc.normalizer.normalizeLine(this.node);
      this.buildLeaves(this.node, {});
      this.resetContent();
    } else {
      this.doc.removeLine(this);
    }
    return true;
  };

  ScribeLine.prototype.resetContent = function() {
    var formatName, formatValue, ops, _ref;
    this.length = _.reduce(this.leaves.toArray(), (function(length, leaf) {
      return leaf.length + length;
    }), 0);
    if (this.trailingNewline) {
      this.length += 1;
    }
    this.outerHTML = this.node.outerHTML;
    this.formats = {};
    _ref = this.doc.formatManager.getFormat(this.node), formatName = _ref[0], formatValue = _ref[1];
    if (formatName != null) {
      this.formats[formatName] = formatValue;
    }
    ops = _.map(this.leaves.toArray(), function(leaf) {
      return new Tandem.InsertOp(leaf.text, leaf.getFormats(true));
    });
    if (this.trailingNewline) {
      ops.push(new Tandem.InsertOp("\n", this.formats));
    }
    return this.delta = new Tandem.Delta(0, this.length, ops);
  };

  ScribeLine.prototype.splitContents = function(offset) {
    var node, _ref, _ref1;
    _ref = ScribeUtils.getChildAtOffset(this.node, offset), node = _ref[0], offset = _ref[1];
    if (this.node.tagName === 'OL' || this.node.tagName === 'UL') {
      _ref1 = ScribeUtils.getChildAtOffset(node, offset), node = _ref1[0], offset = _ref1[1];
    }
    return ScribeUtils.splitNode(node, offset);
  };

  return ScribeLine;

})(LinkedList.Node);

module.exports = ScribeLine;


},{"./dom":12,"./leaf":18,"./line":19,"./utils":36,"tandem-core":"PDczpc"}],20:[function(require,module,exports){
var ScribeLogger,
  __slice = [].slice;

ScribeLogger = (function() {
  function ScribeLogger(editor, logLevel) {
    this.editor = editor;
    this.logLevel = logLevel;
    switch (this.logLevel) {
      case 'debug':
        this.logLevel = 3;
        break;
      case 'info':
        this.logLevel = 2;
        break;
      case 'warn':
        this.logLevel = 1;
        break;
      case 'error':
        this.logLevel = 0;
        break;
      case false:
        this.logLevel = -1;
    }
  }

  return ScribeLogger;

})();

_.each(['error', 'warn', 'info', 'debug'], function(level, index) {
  return ScribeLogger.prototype[level] = function() {
    var args, fn;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (!((typeof console !== "undefined" && console !== null) && this.logLevel >= index)) {
      return;
    }
    fn = level === 'debug' ? 'log' : level;
    if (this.editor.constructor.editors.length > 1) {
      args.unshift(this.editor.id);
    }
    if (console[fn].apply != null) {
      return console[fn].apply(console, args);
    } else {
      switch (args.length) {
        case 1:
          return console[fn](args[0]);
        case 2:
          return console[fn](args[0], args[1]);
        case 3:
          return console[fn](args[0], args[1], args[2]);
        case 4:
          return console[fn](args[0], args[1], args[2], args[3]);
        case 5:
          return console[fn](args[0], args[1], args[2], args[3], args[4]);
        default:
          return console[fn](args[0], args[1], args[2], args[3], args[4], args.slice(5));
      }
    }
  };
});

module.exports = ScribeLogger;


},{}],21:[function(require,module,exports){
var ScribeAttribution, ScribeDOM, ScribeFormat, Tandem;

ScribeDOM = require('../dom');

ScribeFormat = require('../format');

Tandem = require('tandem-core');

ScribeAttribution = (function() {
  ScribeAttribution.prototype.DEFAULTS = {
    authorId: null,
    color: 'blue',
    enabled: false
  };

  function ScribeAttribution(editor, options) {
    var _base,
      _this = this;
    this.editor = editor;
    this.options = _.defaults(options, ScribeAttribution.DEFAULTS);
    (_base = this.options).authorId || (_base.authorId = this.editor.id);
    this.editor.on(this.editor.constructor.events.PRE_EVENT, function(eventName, delta) {
      var attribute, authorDelta;
      if (eventName === _this.editor.constructor.events.USER_TEXT_CHANGE) {
        _.each(delta.ops, function(op) {
          if (Tandem.InsertOp.isInsert(op) || _.keys(op.attributes).length > 0) {
            return op.attributes['author'] = _this.options.authorId;
          }
        });
        authorDelta = new Tandem.Delta(delta.endLength, [new Tandem.RetainOp(0, delta.endLength)]);
        attribute = {};
        attribute['author'] = _this.options.authorId;
        delta.apply(function(index, text) {
          return _.each(text.split('\n'), function(text) {
            authorDelta = authorDelta.compose(Tandem.Delta.makeRetainDelta(delta.endLength, index, text.length, attribute));
            return index += text.length + 1;
          });
        }, (function() {}), function(index, length, name, value) {
          return authorDelta = authorDelta.compose(Tandem.Delta.makeRetainDelta(delta.endLength, index, length, attribute));
        });
        return _this.editor.applyDelta(authorDelta, {
          silent: true
        });
      }
    });
    this.editor.doc.formatManager.addFormat('author', new ScribeFormat.Class(this.editor.renderer.root, 'author'));
    this.addAuthor(this.options.authorId, this.options.color);
    if (this.options.enabled) {
      this.enable();
    }
  }

  ScribeAttribution.prototype.addAuthor = function(id, color) {
    var styles;
    styles = {};
    styles[".editor.attribution .author-" + id] = {
      "background-color": "" + color
    };
    return this.editor.renderer.addStyles(styles);
  };

  ScribeAttribution.prototype.enable = function() {
    return ScribeDOM.addClass(this.editor.root, 'attribution');
  };

  ScribeAttribution.prototype.disable = function() {
    return ScribeDOM.removeClass(this.editor.root, 'attribution');
  };

  return ScribeAttribution;

})();

module.exports = ScribeAttribution;


},{"../dom":12,"../format":15,"tandem-core":"PDczpc"}],22:[function(require,module,exports){
var ScribeDOM, ScribeKeyboard, ScribeLinkTooltip, ScribePosition, ScribeRange, enterEditMode, exitEditMode, formatLink, hideTooltip, initListeners, initTooltip, normalizeUrl, showTooltip;

ScribeDOM = require('../dom');

ScribeKeyboard = require('../keyboard');

ScribePosition = require('../position');

ScribeRange = require('../range');

enterEditMode = function(url) {
  url = normalizeUrl(url);
  ScribeDOM.addClass(this.tooltip, 'editing');
  this.tooltipInput.focus();
  return this.tooltipInput.value = url;
};

exitEditMode = function() {
  var url;
  if ((this.savedLink != null) || ScribeDOM.getText(this.tooltipLink) !== this.tooltipInput.value) {
    url = normalizeUrl(this.tooltipInput.value);
    this.tooltipLink.href = url;
    ScribeDOM.setText(this.tooltipLink, url);
    if (this.savedLink != null) {
      this.savedLink.href = url;
      this.savedLink = null;
    } else {
      formatLink.call(this, this.tooltipInput.value);
    }
  }
  return ScribeDOM.removeClass(this.tooltip, 'editing');
};

formatLink = function(value) {
  this.editor.setSelection(this.savedRange, true);
  return this.savedRange.format('link', value, {
    source: 'user'
  });
};

hideTooltip = function() {
  return this.tooltip.style.left = '-10000px';
};

initListeners = function() {
  var _this = this;
  ScribeDOM.addEventListener(this.editor.root, 'mouseup', function(event) {
    var link, url;
    link = event.target;
    while ((link != null) && link.tagName !== 'DIV' && link.tagName !== 'BODY') {
      if (link.tagName === 'A') {
        url = normalizeUrl(link.href);
        _this.tooltipLink.href = url;
        ScribeDOM.setText(_this.tooltipLink, url);
        ScribeDOM.removeClass(_this.tooltip, 'editing');
        showTooltip.call(_this, link.getBoundingClientRect());
        _this.savedLink = link;
        return;
      }
      link = link.parentNode;
    }
    return hideTooltip.call(_this);
  });
  ScribeDOM.addEventListener(this.options.button, 'click', function() {
    var url;
    _this.savedRange = _this.editor.getSelection();
    if (!((_this.savedRange != null) && !_this.savedRange.isCollapsed())) {
      return;
    }
    if (ScribeDOM.hasClass(_this.options.button, 'active')) {
      formatLink.call(_this, false);
      return hideTooltip.call(_this);
    } else {
      url = normalizeUrl(_this.savedRange.getText());
      if (/\w+\.\w+/.test(url)) {
        _this.editor.root.focus();
        return formatLink.call(_this, url);
      } else {
        ScribeDOM.addClass(_this.tooltip, 'editing');
        showTooltip.call(_this, _this.editor.selection.getDimensions());
        return enterEditMode.call(_this, url);
      }
    }
  });
  ScribeDOM.addEventListener(this.tooltipChange, 'click', function() {
    return enterEditMode.call(_this, ScribeDOM.getText(_this.tooltipLink));
  });
  ScribeDOM.addEventListener(this.tooltipDone, 'click', function() {
    return exitEditMode.call(_this);
  });
  return ScribeDOM.addEventListener(this.tooltipInput, 'keyup', function(event) {
    if (event.which === ScribeKeyboard.keys.ENTER) {
      return exitEditMode.call(_this);
    }
  });
};

initTooltip = function() {
  this.tooltip = this.options.button.ownerDocument.createElement('div');
  this.tooltip.id = 'link-tooltip';
  this.tooltip.innerHTML = '<span class="title">Visit URL:</span>\
    <a href="#" class="url" target="_blank" href="about:blank"></a>\
    <input class="input" type="text">\
    <span>&#45;</span>\
    <a href="javascript:;" class="change">Change</a>\
    <a href="javascript:;" class="done">Done</a>';
  this.tooltipLink = this.tooltip.querySelector('.url');
  this.tooltipInput = this.tooltip.querySelector('.input');
  this.tooltipChange = this.tooltip.querySelector('.change');
  this.tooltipDone = this.tooltip.querySelector('.done');
  this.editor.renderer.addStyles({
    '#link-tooltip': {
      'background-color': '#fff',
      'border': '1px solid #000',
      'height': '23px',
      'padding': '5px 10px',
      'position': 'absolute',
      'white-space': 'nowrap'
    },
    '#link-tooltip a': {
      'cursor': 'pointer',
      'text-decoration': 'none'
    },
    '#link-tooltip > a, #link-tooltip > span': {
      'display': 'inline-block',
      'line-height': '23px'
    },
    '#link-tooltip .input': {
      'display': 'none',
      'width': '170px'
    },
    '#link-tooltip .done': {
      'display': 'none'
    },
    '#link-tooltip.editing .input': {
      'display': 'inline-block'
    },
    '#link-tooltip.editing .done': {
      'display': 'inline-block'
    },
    '#link-tooltip.editing .url': {
      'display': 'none'
    },
    '#link-tooltip.editing .change': {
      'display': 'none'
    }
  });
  this.tooltip.style.left = '-10000px';
  return this.editor.renderer.addContainer(this.tooltip);
};

normalizeUrl = function(url) {
  if (!/^https?:\/\//.test(url)) {
    url = 'http://' + url;
  }
  if (url.slice(url.length - 1) === '/') {
    url = url.slice(0, url.length - 1);
  }
  return url;
};

showTooltip = function(target, subjectDist) {
  var left, limit, tooltip, tooltipHeight, tooltipWidth, top;
  if (subjectDist == null) {
    subjectDist = 5;
  }
  tooltip = this.tooltip.getBoundingClientRect();
  tooltipHeight = tooltip.bottom - tooltip.top;
  tooltipWidth = tooltip.right - tooltip.left;
  limit = this.editor.root.getBoundingClientRect();
  left = Math.max(limit.left, target.left + (target.right - target.left) / 2 - tooltipWidth / 2);
  if (left + tooltipWidth > limit.right && limit.right - tooltipWidth > limit.left) {
    left = limit.right - tooltipWidth;
  }
  top = target.bottom + subjectDist;
  if (top + tooltipHeight > limit.bottom && target.top - tooltipHeight - subjectDist > limit.top) {
    top = target.top - tooltipHeight - subjectDist;
  }
  this.tooltip.style.left = left + 'px';
  return this.tooltip.style.top = (top + (this.tooltip.offsetTop - tooltip.top)) + 'px';
};

ScribeLinkTooltip = (function() {
  ScribeLinkTooltip.DEFAULTS = {
    button: null
  };

  function ScribeLinkTooltip(editor, options) {
    this.editor = editor;
    if (options == null) {
      options = {};
    }
    this.options = _.defaults(options, ScribeLinkTooltip.DEFAULTS);
    initTooltip.call(this);
    initListeners.call(this);
  }

  return ScribeLinkTooltip;

})();

module.exports = ScribeLinkTooltip;


},{"../dom":12,"../keyboard":16,"../position":27,"../range":28}],23:[function(require,module,exports){
var ScribeDOM, ScribeMultiCursor, ScribePosition, ScribeRenderer, ScribeUtils, _applyDelta, _buildCursor, _moveCursor, _updateCursor;

ScribeDOM = require('../dom');

ScribePosition = require('../position');

ScribeRenderer = require('../renderer');

ScribeUtils = require('../utils');

_applyDelta = function(delta) {
  var _this = this;
  delta.apply(function(index, text, formatting) {
    return _this.shiftCursors(index, text.length, formatting['author'], false);
  }, function(index, length) {
    return _this.shiftCursors(index, -1 * length, null, false);
  }, function(index, length, name, value) {
    return _this.shiftCursors(index, 0, null, false);
  });
  return this.update();
};

_buildCursor = function(name, color) {
  var cursor, cursorCaret, cursorFlag, cursorName;
  cursor = this.container.ownerDocument.createElement('span');
  ScribeDOM.addClass(cursor, 'cursor');
  cursor.innerHTML = this.options.template;
  cursorFlag = cursor.querySelector('.cursor-flag');
  cursorName = cursor.querySelector('.cursor-name');
  ScribeDOM.setText(cursorName, name);
  cursorCaret = cursor.querySelector('.cursor-caret');
  cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color;
  this.container.appendChild(cursor);
  return cursor;
};

_moveCursor = function(cursor, referenceNode) {
  cursor.elem.style.top = referenceNode.offsetTop + 'px';
  cursor.elem.style.left = referenceNode.offsetLeft + 'px';
  cursor.elem.style.height = referenceNode.offsetHeight + 'px';
  if (parseInt(cursor.elem.style.top) < parseInt(cursor.elem.style.height)) {
    return ScribeDOM.addClass(cursor.elem, 'top');
  } else {
    return ScribeDOM.removeClass(cursor.elem, 'top');
  }
};

_updateCursor = function(cursor) {
  var _this = this;
  this.editor.doSilently(function() {
    var didSplit, guide, leftText, position, rightText, _ref;
    position = new ScribePosition(_this.editor, cursor.index);
    guide = _this.container.ownerDocument.createElement('span');
    if (position.leafNode.firstChild == null) {
      ScribeDOM.setText(guide, ScribeDOM.NOBREAK_SPACE);
      position.leafNode.parentNode.insertBefore(guide, position.leafNode);
      _moveCursor.call(_this, cursor, guide);
    } else {
      ScribeDOM.setText(guide, ScribeDOM.ZERO_WIDTH_NOBREAK_SPACE);
      _ref = ScribeUtils.splitNode(position.leafNode.firstChild, position.offset), leftText = _ref[0], rightText = _ref[1], didSplit = _ref[2];
      if (rightText != null) {
        rightText.parentNode.insertBefore(guide, rightText);
        _moveCursor.call(_this, cursor, guide);
      } else if (leftText != null) {
        leftText.parentNode.appendChild(guide);
        _moveCursor.call(_this, cursor, guide);
      }
    }
    guide.parentNode.removeChild(guide);
    if (didSplit) {
      return ScribeDOM.normalize(position.leafNode);
    }
  });
  return cursor.dirty = false;
};

ScribeMultiCursor = (function() {
  ScribeMultiCursor.DEFAULTS = {
    template: '<span class="cursor-flag">\
        <span class="cursor-name"></span>\
      </span>\
      <span class="cursor-caret"></span>',
    timeout: 2500
  };

  function ScribeMultiCursor(editor, options) {
    var _this = this;
    this.editor = editor;
    if (options == null) {
      options = {};
    }
    this.options = _.defaults(options, ScribeMultiCursor.DEFAULTS);
    this.cursors = {};
    this.container = this.editor.root.ownerDocument.createElement('div');
    this.container.id = 'cursor-container';
    this.editor.renderer.addContainer(this.container, true);
    this.editor.renderer.addStyles({
      '#cursor-container': {
        'position': 'absolute',
        'z-index': '1000'
      },
      '.cursor': {
        'margin-left': '-1px',
        'position': 'absolute'
      },
      '.cursor-flag': {
        'bottom': '100%',
        'position': 'absolute',
        'white-space': 'nowrap'
      },
      '.cursor-name': {
        'display': 'inline-block',
        'color': 'white',
        'padding': '2px 8px'
      },
      '.cursor-caret': {
        'height': '100%',
        'position': 'absolute',
        'width': '2px'
      },
      '.cursor.hidden .cursor-flag': {
        'display': 'none'
      },
      '.cursor.top > .cursor-flag': {
        'bottom': 'auto',
        'top': '100%'
      }
    });
    this.editor.renderer.on(ScribeRenderer.events.UPDATE, function() {
      return _.defer(function() {
        _this.container.style.top = _this.editor.root.offsetTop + 'px';
        return _this.container.style.left = _this.editor.root.offsetLeft + 'px';
      });
    });
    this.initListeners();
  }

  ScribeMultiCursor.prototype.initListeners = function() {
    var _this = this;
    return this.editor.on(this.editor.constructor.events.API_TEXT_CHANGE, function(delta) {
      return _applyDelta.call(_this, delta);
    }).on(this.editor.constructor.events.USER_TEXT_CHANGE, function(delta) {
      return _applyDelta.call(_this, delta);
    });
  };

  ScribeMultiCursor.prototype.shiftCursors = function(index, length, authorId, update) {
    var _this = this;
    if (authorId == null) {
      authorId = null;
    }
    if (update == null) {
      update = true;
    }
    _.each(this.cursors, function(cursor, id) {
      if (!(cursor && (cursor.index > index || cursor.userId === authorId))) {
        return;
      }
      cursor.index += Math.max(length, index - cursor.index);
      return cursor.dirty = true;
    });
    if (update) {
      return this.update();
    }
  };

  ScribeMultiCursor.prototype.setCursor = function(userId, index, name, color, update) {
    var cursor,
      _this = this;
    if (update == null) {
      update = true;
    }
    cursor = this.cursors[userId];
    if (cursor == null) {
      this.cursors[userId] = cursor = {
        userId: userId,
        index: index,
        elem: _buildCursor.call(this, name, color)
      };
    }
    cursor.index = index;
    cursor.dirty = true;
    ScribeDOM.removeClass(cursor.elem, 'hidden');
    clearTimeout(cursor.timer);
    cursor.timer = setTimeout(function() {
      ScribeDOM.addClass(cursor.elem, 'hidden');
      return cursor.timer = null;
    }, this.options.timeout);
    if (update) {
      _updateCursor.call(this, cursor);
    }
    return cursor;
  };

  ScribeMultiCursor.prototype.clearCursors = function() {
    var _this = this;
    _.each(_.keys(this.cursors), function(id) {
      return _this.removeCursor(id);
    });
    return this.cursors = {};
  };

  ScribeMultiCursor.prototype.removeCursor = function(userId) {
    var cursor;
    cursor = this.cursors[userId];
    cursor.elem.parentNode.removeChild(cursor.elem) in (cursor != null);
    return delete this.cursors[userId];
  };

  ScribeMultiCursor.prototype.update = function() {
    var _this = this;
    return _.each(this.cursors, function(cursor, id) {
      if (cursor != null ? cursor.dirty : void 0) {
        return _updateCursor.call(_this, cursor);
      }
    });
  };

  return ScribeMultiCursor;

})();

module.exports = ScribeMultiCursor;


},{"../dom":12,"../position":27,"../renderer":29,"../utils":36}],24:[function(require,module,exports){
var ScribeDOM, ScribeKeyboard, ScribeLinkTooltip, ScribeRange, ScribeToolbar, ScribeUtils, _findInput, _initFormats;

ScribeDOM = require('../dom');

ScribeKeyboard = require('../keyboard');

ScribeRange = require('../range');

ScribeLinkTooltip = require('./link-tooltip');

ScribeUtils = require('../utils');

_findInput = function(format) {
  var input, selector;
  selector = "." + format;
  if (_.indexOf(ScribeToolbar.formats.SELECT, format) > -1) {
    selector = 'select' + selector;
  }
  return input = this.container.querySelector(selector);
};

_initFormats = function() {
  var _this = this;
  _.each(ScribeToolbar.formats, function(formats, formatGroup) {
    return _.each(formats, function(format) {
      var eventName, input;
      input = _findInput.call(_this, format);
      if (input == null) {
        return;
      }
      _this.editor.logger.debug('Toolbar binding', format, input);
      if (format === 'link') {
        return _this.editor.theme.addModule('link-tooltip', {
          button: input
        });
      }
      if (format === 'link') {
        return;
      }
      eventName = formatGroup === 'SELECT' ? 'change' : 'click';
      ScribeDOM.addEventListener(input, eventName, function() {
        var activeFormats, range, value;
        if (_this.triggering) {
          return;
        }
        _this.editor.logger.debug('Toolbar event', eventName, format, input);
        value = input.tagName === 'SELECT' ? input.options[input.selectedIndex].value : !ScribeDOM.hasClass(input, 'active');
        range = _this.editor.getSelection();
        if (range != null) {
          if (ScribeUtils.isIE(8)) {
            _this.editor.root.focus();
            _this.editor.setSelection(range);
          }
          range.format(format, value, {
            source: 'user'
          });
        }
        activeFormats = {};
        activeFormats[format] = value;
        _this.updateActive(activeFormats);
        return false;
      });
      return ScribeDOM.addEventListener(input, 'mousedown', function() {
        _this.editor.checkUpdate();
        return false;
      });
    });
  });
  return _.each(['BOLD', 'ITALIC', 'UNDERLINE'], function(key) {
    return _this.editor.keyboard.addHotkey(ScribeKeyboard.hotkeys[key], function() {
      var activeFormats, input;
      activeFormats = {};
      input = _findInput.call(_this, key.toLowerCase());
      if (input != null) {
        activeFormats[key.toLowerCase()] = !ScribeDOM.hasClass(input, 'active');
      }
      return _this.updateActive(activeFormats);
    });
  });
};

ScribeToolbar = (function() {
  ScribeToolbar.DEFAULTS = {
    container: null
  };

  ScribeToolbar.formats = {
    BUTTON: ['bold', 'italic', 'strike', 'underline', 'link', 'indent', 'outdent'],
    SELECT: ['back-color', 'fore-color', 'font-name', 'font-size']
  };

  function ScribeToolbar(editor, options) {
    var _this = this;
    this.editor = editor;
    if (options == null) {
      options = {};
    }
    this.options = _.defaults(options, ScribeToolbar.DEFAULTS);
    this.container = _.isString(this.options.container) ? document.querySelector(this.options.container) : this.options.container;
    _initFormats.call(this);
    this.editor.on(this.editor.constructor.events.POST_EVENT, function(eventName) {
      if (!(eventName === _this.editor.constructor.events.API_TEXT_CHANGE || eventName === _this.editor.constructor.events.USER_TEXT_CHANGE || eventName === _this.editor.constructor.events.SELECTION_CHANGE)) {
        return;
      }
      return _this.updateActive();
    });
  }

  ScribeToolbar.prototype.updateActive = function(activeFormats) {
    var range,
      _this = this;
    if (activeFormats == null) {
      activeFormats = {};
    }
    this.triggering = true;
    range = this.editor.getSelection();
    _.each(this.container.querySelectorAll('.active'), function(button) {
      return ScribeDOM.removeClass(button, 'active');
    });
    _.each(this.container.querySelectorAll('select'), function(select) {
      return ScribeDOM.resetSelect(select);
    });
    if (range != null) {
      _.each(_.extend(range.getFormats(), activeFormats), function(value, key) {
        var elem;
        if (value) {
          elem = _findInput.call(_this, key);
          if (elem == null) {
            return;
          }
          if (elem.tagName === 'SELECT') {
            if (_.isArray(value)) {
              value = '';
            }
            elem.value = value;
            return ScribeDOM.triggerEvent(elem, 'change');
          } else {
            return ScribeDOM.addClass(elem, 'active');
          }
        }
      });
    }
    return this.triggering = false;
  };

  return ScribeToolbar;

})();

module.exports = ScribeToolbar;


},{"../dom":12,"../keyboard":16,"../range":28,"../utils":36,"./link-tooltip":22}],25:[function(require,module,exports){
var ScribeDOM, ScribeNormalizer, ScribeUtils;

ScribeDOM = require('./dom');

ScribeUtils = require('./utils');

ScribeNormalizer = (function() {
  ScribeNormalizer.TAG_RULES = {
    'A': {},
    'ADDRESSS': {
      rename: 'div'
    },
    'B': {},
    'BLOCKQUOTE': {
      rename: 'div'
    },
    'BR': {},
    'BIG': {
      rename: 'span'
    },
    'CENTER': {
      rename: 'span'
    },
    'DD': {
      rename: 'div'
    },
    'DEL': {
      rename: 's'
    },
    'DIV': {},
    'DL': {
      rename: 'div'
    },
    'EM': {
      rename: 'i'
    },
    'FONT': function(formatManager, node) {
      var resultNode;
      resultNode = ScribeDOM.unwrap(node);
      _.each({
        color: 'fore-color',
        face: 'font-name',
        size: 'font-size'
      }, function(format, attr) {
        var formatNode;
        if (node.hasAttribute(attr)) {
          formatNode = formatManager.createFormatContainer(format, node.getAttribute(attr));
          return resultNode = ScribeDOM.wrap(formatNode, resultNode);
        }
      });
      return resultNode;
    },
    'H1': {
      rename: 'div'
    },
    'H2': {
      rename: 'div'
    },
    'H3': {
      rename: 'div'
    },
    'H4': {
      rename: 'div'
    },
    'H5': {
      rename: 'div'
    },
    'H6': {
      rename: 'div'
    },
    'HR': {
      rename: 'br'
    },
    'I': {},
    'INS': {
      rename: 'span'
    },
    'LI': {
      rename: 'div'
    },
    'OL': {
      rename: 'div'
    },
    'P': {
      rename: 'div'
    },
    'PRE': {
      rename: 'div'
    },
    'S': {},
    'SMALL': {
      rename: 'span'
    },
    'SPAN': {},
    'STRIKE': {
      rename: 's'
    },
    'STRONG': {
      rename: 'b'
    },
    'TABLE': {
      rename: 'div'
    },
    'TBODY': {
      rename: 'div'
    },
    'TD': {
      rename: 'span'
    },
    'TFOOT': {
      rename: 'div'
    },
    'TH': {
      rename: 'span'
    },
    'THEAD': {
      rename: 'div'
    },
    'TR': {
      rename: 'div'
    },
    'U': {},
    'UL': {
      rename: 'div'
    }
  };

  ScribeNormalizer.breakBlocks = function(root) {
    var _this = this;
    ScribeNormalizer.groupBlocks(root);
    _.each(root.querySelectorAll('br'), function(node) {
      return ScribeNormalizer.normalizeBreak(node, root);
    });
    return _.each(root.childNodes, function(childNode) {
      return ScribeNormalizer.breakLine(childNode);
    });
  };

  ScribeNormalizer.breakLine = function(lineNode) {
    var _this = this;
    if (lineNode.childNodes.length === 1 && lineNode.firstChild.tagName === 'BR') {
      return;
    }
    return ScribeUtils.traversePostorder(lineNode, function(node) {
      var line;
      if (ScribeUtils.isBlock(node)) {
        if (node.tagName !== 'DIV') {
          node = ScribeDOM.switchTag(node, 'div');
        }
        if (node.nextSibling != null) {
          line = lineNode.ownerDocument.createElement('div');
          lineNode.parentNode.insertBefore(line, lineNode.nextSibling);
          while (node.nextSibling != null) {
            line.appendChild(node.nextSibling);
          }
          ScribeNormalizer.breakLine(line);
        }
        return ScribeDOM.unwrap(node);
      } else {
        return node;
      }
    });
  };

  ScribeNormalizer.groupBlocks = function(root) {
    var curLine, line, nextLine, _results;
    curLine = root.firstChild;
    _results = [];
    while (curLine != null) {
      if (ScribeUtils.isBlock(curLine)) {
        _results.push(curLine = curLine.nextSibling);
      } else {
        line = root.ownerDocument.createElement('div');
        root.insertBefore(line, curLine);
        while ((curLine != null) && !ScribeUtils.isBlock(curLine)) {
          nextLine = curLine.nextSibling;
          line.appendChild(curLine);
          curLine = nextLine;
        }
        _results.push(curLine = line);
      }
    }
    return _results;
  };

  ScribeNormalizer.normalizeBreak = function(node, root) {
    if (node === root) {
      return;
    }
    if (node.previousSibling != null) {
      if (node.nextSibling != null) {
        ScribeUtils.splitBefore(node, root);
      }
      return node.parentNode.removeChild(node);
    } else if (node.nextSibling != null) {
      if (ScribeUtils.splitBefore(node.nextSibling, root)) {
        return ScribeNormalizer.normalizeBreak(node, root);
      }
    } else if (node.parentNode !== root && node.parentNode.parentNode !== root) {
      ScribeDOM.unwrap(node.parentNode);
      return ScribeNormalizer.normalizeBreak(node, root);
    }
  };

  ScribeNormalizer.normalizeEmptyDoc = function(root) {
    if (!root.firstChild) {
      return root.appendChild(root.ownerDocument.createElement('div'));
    }
  };

  ScribeNormalizer.normalizeEmptyLines = function(root) {
    if (!ScribeUtils.isIE()) {
      return;
    }
    return _.each(root.querySelectorAll('br'), function(node) {
      if ((node.previousSibling != null) || (node.nextSibling != null)) {
        return ScribeDOM.removeNode(node);
      }
    });
  };

  ScribeNormalizer.normalizeHtml = function(html) {
    html = html.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    html = html.replace(/\>\s+\</g, '><');
    html = html.replace(/<br><\/br>/, '<br/>');
    return html;
  };

  ScribeNormalizer.requireLeaf = function(lineNode) {
    if (!(lineNode.childNodes.length > 0)) {
      if (lineNode.tagName === 'OL' || lineNode.tagName === 'UL') {
        lineNode.appendChild(lineNode.ownerDocument.createElement('li'));
        lineNode = lineNode.firstChild;
      }
      return lineNode.appendChild(lineNode.ownerDocument.createElement('br'));
    }
  };

  ScribeNormalizer.wrapText = function(lineNode) {
    var _this = this;
    return ScribeUtils.traversePreorder(lineNode, 0, function(node) {
      var span;
      ScribeDOM.normalize(node);
      if (node.nodeType === ScribeDOM.TEXT_NODE && ((node.nextSibling != null) || (node.previousSibling != null) || node.parentNode === lineNode || node.parentNode.tagName === 'LI')) {
        span = node.ownerDocument.createElement('span');
        ScribeDOM.wrap(span, node);
        node = span;
      }
      return node;
    });
  };

  function ScribeNormalizer(container, formatManager) {
    this.container = container;
    this.formatManager = formatManager;
  }

  ScribeNormalizer.prototype.applyRules = function(root) {
    var _this = this;
    return ScribeUtils.traversePreorder(root, 0, function(node, index) {
      var rules;
      if (node.nodeType === ScribeDOM.ELEMENT_NODE) {
        rules = ScribeNormalizer.TAG_RULES[node.tagName];
        if (rules != null) {
          if (_.isFunction(rules)) {
            node = rules.call(null, _this.formatManager, node);
          } else if (_.isObject(rules)) {
            _.each(rules, function(data, rule) {
              switch (rule) {
                case 'rename':
                  return node = ScribeDOM.switchTag(node, data);
              }
            });
          }
        } else {
          node = ScribeDOM.unwrap(node);
        }
      }
      return node;
    });
  };

  ScribeNormalizer.prototype.normalizeDoc = function() {
    var _this = this;
    ScribeNormalizer.normalizeEmptyDoc(this.container);
    this.applyRules(this.container);
    ScribeNormalizer.breakBlocks(this.container);
    return _.each(this.container.childNodes, function(lineNode) {
      return _this.normalizeLine(lineNode);
    });
  };

  ScribeNormalizer.prototype.normalizeLine = function(lineNode) {
    if (lineNode.childNodes.length === 1 && lineNode.childNodes[0].tagName === 'BR') {
      return;
    }
    this.applyRules(lineNode);
    this.normalizeTags(lineNode);
    ScribeNormalizer.requireLeaf(lineNode);
    this.removeRedundant(lineNode);
    return ScribeNormalizer.wrapText(lineNode);
  };

  ScribeNormalizer.prototype.normalizeTags = function(lineNode) {
    var _this = this;
    return ScribeUtils.traversePreorder(lineNode, 0, function(node) {
      var containerNode, nodeFormat, nodeValue, _ref;
      containerNode = node;
      _ref = _this.formatManager.getFormat(node), nodeFormat = _ref[0], nodeValue = _ref[1];
      if (_.isArray(nodeFormat)) {
        _.each(nodeFormat.slice(1), function(format, i) {
          var container;
          if (_this.formatManager.formats[format] != null) {
            container = _this.formatManager.formats[format].createContainer(nodeValue[i + 1]);
            return containerNode = ScribeDOM.wrap(container, node);
          }
        });
        nodeFormat = nodeFormat[0];
        nodeValue = nodeValue[0];
      }
      if (_this.formatManager.formats[nodeFormat] != null) {
        _this.formatManager.formats[nodeFormat].clean(node);
      } else {
        ScribeDOM.removeAttributes(node);
      }
      return containerNode;
    });
  };

  ScribeNormalizer.prototype.removeRedundant = function(lineNode) {
    var attributes, nodes,
      _this = this;
    nodes = [lineNode];
    attributes = [{}];
    return ScribeUtils.traversePreorder(lineNode, 0, function(node) {
      var formatName, formatValue, nodeAttributes, parentAttributes, redundant, _ref;
      _ref = _this.formatManager.getFormat(node), formatName = _ref[0], formatValue = _ref[1];
      parentAttributes = attributes[_.indexOf(nodes, node.parentNode)];
      redundant = (function(node) {
        if (node.nodeType !== ScribeDOM.ELEMENT_NODE) {
          return false;
        }
        if (ScribeUtils.getNodeLength(node) === 0) {
          return node.tagName !== 'BR' || node.parentNode.childNodes.length > 1;
        }
        if (formatName != null) {
          return parentAttributes[formatName] != null;
        }
        if (node.tagName !== 'SPAN') {
          return false;
        }
        if (node.childNodes.length === 0 || !_.any(node.childNodes, function(child) {
          return child.nodeType !== ScribeDOM.ELEMENT_NODE;
        })) {
          return true;
        }
        if (node.previousSibling === null && node.nextSibling === null && node.parentNode !== lineNode && node.parentNode.tagName !== 'LI') {
          return true;
        }
        return false;
      })(node);
      if (redundant) {
        node = ScribeDOM.unwrap(node);
      }
      if (node != null) {
        nodes.push(node);
        if (formatName != null) {
          nodeAttributes = _.clone(parentAttributes);
          nodeAttributes[formatName] = formatValue;
          attributes.push(nodeAttributes);
        } else {
          attributes.push(parentAttributes);
        }
      }
      return node;
    });
  };

  return ScribeNormalizer;

})();

module.exports = ScribeNormalizer;


},{"./dom":12,"./utils":36}],26:[function(require,module,exports){
var ScribeDOM, ScribeDocument, ScribePasteManager, ScribeRange, Tandem;

ScribeDOM = require('./dom');

ScribeDocument = require('./document');

ScribeRange = require('./range');

Tandem = require('tandem-core');

ScribePasteManager = (function() {
  function ScribePasteManager(editor) {
    this.editor = editor;
    this.container = this.editor.root.ownerDocument.createElement('div');
    ScribeDOM.addClass(this.container, 'paste-container');
    this.container.setAttribute('contenteditable', true);
    this.editor.renderer.addStyles({
      '.paste-container': {
        'left': '-10000px',
        'position': 'absolute',
        'top': '50%'
      }
    });
    this.editor.renderer.addContainer(this.container);
    this.initListeners();
  }

  ScribePasteManager.prototype.initListeners = function() {
    var _this = this;
    return ScribeDOM.addEventListener(this.editor.root, 'paste', function() {
      var oldDocLength, range;
      oldDocLength = _this.editor.getLength();
      range = _this.editor.getSelection();
      if (range == null) {
        return;
      }
      _this.container.innerHTML = "";
      _this.container.focus();
      return _.defer(function() {
        var delta, doc, lengthAdded;
        doc = new ScribeDocument(_this.container, _this.editor.options);
        delta = doc.toDelta();
        delta = delta.compose(Tandem.Delta.makeDeleteDelta(delta.endLength, delta.endLength - 1, 1));
        lengthAdded = delta.endLength;
        if (range.start.index > 0) {
          delta.ops.unshift(new Tandem.RetainOp(0, range.start.index));
        }
        if (range.end.index < oldDocLength) {
          delta.ops.push(new Tandem.RetainOp(range.end.index, oldDocLength));
        }
        delta.endLength += _this.editor.getLength() - (range.end.index - range.start.index);
        delta.startLength = oldDocLength;
        _this.editor.applyDelta(delta, {
          source: 'user'
        });
        _this.editor.root.focus();
        return _this.editor.setSelection(new ScribeRange(_this.editor, range.start.index + lengthAdded, range.start.index + lengthAdded));
      });
    });
  };

  return ScribePasteManager;

})();

module.exports = ScribePasteManager;


},{"./document":11,"./dom":12,"./range":28,"tandem-core":"PDczpc"}],27:[function(require,module,exports){
var ScribeDOM, ScribePosition, ScribeUtils;

ScribeDOM = require('./dom');

ScribeUtils = require('./utils');

ScribePosition = (function() {
  ScribePosition.findLeafNode = function(editor, node, offset) {
    var _ref;
    _ref = ScribeUtils.findDeepestNode(node, offset), node = _ref[0], offset = _ref[1];
    if (node.nodeType === ScribeDOM.TEXT_NODE) {
      offset = ScribePosition.getIndex(node, offset, node.parentNode);
      node = node.parentNode;
    }
    return [node, offset];
  };

  ScribePosition.getIndex = function(node, index, offsetNode) {
    if (index == null) {
      index = 0;
    }
    if (offsetNode == null) {
      offsetNode = null;
    }
    while (node !== offsetNode && (node.ownerDocument != null) && !ScribeDOM.hasClass(node, 'editor')) {
      while (node.previousSibling != null) {
        node = node.previousSibling;
        index += ScribeUtils.getNodeLength(node);
      }
      node = node.parentNode;
    }
    return index;
  };

  function ScribePosition(editor, leafNode, offset) {
    var _ref;
    this.editor = editor;
    this.leafNode = leafNode;
    this.offset = offset;
    if (_.isNumber(this.leafNode)) {
      this.offset = this.index = this.leafNode;
      this.leafNode = this.editor.root;
    } else {
      this.index = ScribePosition.getIndex(this.leafNode, this.offset);
    }
    _ref = ScribePosition.findLeafNode(this.editor, this.leafNode, this.offset), this.leafNode = _ref[0], this.offset = _ref[1];
  }

  ScribePosition.prototype.getLeaf = function() {
    if (this.leaf != null) {
      return this.leaf;
    }
    this.leaf = this.editor.doc.findLeaf(this.leafNode);
    return this.leaf;
  };

  ScribePosition.prototype.getIndex = function() {
    return ScribePosition.getIndex(this.leafNode, this.offset, this.editor.root);
  };

  return ScribePosition;

})();

module.exports = ScribePosition;


},{"./dom":12,"./utils":36}],28:[function(require,module,exports){
var ScribeLeafIterator, ScribePosition, ScribeRange;

ScribeLeafIterator = require('./leaf-iterator');

ScribePosition = require('./position');

ScribeRange = (function() {
  function ScribeRange(editor, start, end) {
    this.editor = editor;
    this.start = start;
    this.end = end;
    if (_.isNumber(this.start)) {
      this.start = new ScribePosition(this.editor, this.start);
    }
    if (_.isNumber(this.end)) {
      this.end = new ScribePosition(this.editor, this.end);
    }
  }

  ScribeRange.prototype.deleteContents = function(options) {
    if (this.isCollapsed()) {
      return;
    }
    return this.editor.deleteAt(this.start.index, this.end.index - this.start.index, options);
  };

  ScribeRange.prototype.equals = function(range) {
    if (range == null) {
      return false;
    }
    return range.start.leafNode === this.start.leafNode && range.end.leafNode === this.end.leafNode && range.start.offset === this.start.offset && range.end.offset === this.end.offset;
  };

  ScribeRange.prototype.format = function(name, value, options) {
    return this.editor.formatAt(this.start.index, this.end.index - this.start.index, name, value, options);
  };

  ScribeRange.prototype.getFormats = function() {
    var endLeaf, formats, leaves, startLeaf;
    startLeaf = this.start.getLeaf();
    endLeaf = this.end.getLeaf();
    if ((startLeaf == null) || (endLeaf == null)) {
      return {};
    }
    if (this.isCollapsed()) {
      return startLeaf.getFormats();
    }
    leaves = this.getLeaves();
    if (leaves.length > 1 && this.end.offset === 0) {
      leaves.pop();
    }
    if (leaves.length > 1 && this.start.offset === leaves[0].length) {
      leaves.splice(0, 1);
    }
    formats = leaves.length > 0 ? leaves[0].getFormats() : {};
    _.all(leaves.slice(1), function(leaf) {
      var leafFormats;
      if (leaf.text === '') {
        return true;
      }
      leafFormats = leaf.getFormats();
      _.each(formats, function(value, key) {
        if (!leafFormats[key]) {
          return delete formats[key];
        } else if (leafFormats[key] !== value) {
          if (!_.isArray(value)) {
            formats[key] = [value];
          }
          return formats[key].push(leafFormats[key]);
        }
      });
      return _.keys(formats).length > 0;
    });
    _.each(formats, function(value, key) {
      if (_.isArray(value)) {
        return formats[key] = _.uniq(value);
      }
    });
    return formats;
  };

  ScribeRange.prototype.getLeafNodes = function() {
    var leafIterator, leafNodes;
    if (this.isCollapsed()) {
      return [this.start.leafNode];
    }
    leafIterator = new ScribeLeafIterator(this.start.getLeaf(), this.end.getLeaf());
    leafNodes = _.pluck(leafIterator.toArray(), 'node');
    if (leafNodes[leafNodes.length - 1] !== this.end.leafNode || this.end.offset === 0) {
      leafNodes.pop();
    }
    return leafNodes;
  };

  ScribeRange.prototype.getLeaves = function() {
    var arr, itr;
    itr = new ScribeLeafIterator(this.start.getLeaf(), this.end.getLeaf());
    arr = itr.toArray();
    return arr;
  };

  ScribeRange.prototype.getLineNodes = function() {
    var endLine, lines, startLine;
    startLine = this.editor.doc.findLineNode(this.start.leafNode);
    endLine = this.editor.doc.findLineNode(this.end.leafNode);
    if (startLine === endLine) {
      return [startLine];
    }
    lines = [];
    while (startLine !== endLine) {
      lines.push(startLine);
      startLine = startLine.nextSibling;
    }
    lines.push(endLine);
    return lines;
  };

  ScribeRange.prototype.getLines = function() {
    var _this = this;
    return _.map(this.getLineNodes(), function(lineNode) {
      return _this.editor.doc.findLine(lineNode);
    });
  };

  ScribeRange.prototype.getText = function() {
    var leaves, line,
      _this = this;
    leaves = this.getLeaves();
    if (leaves.length === 0) {
      return "";
    }
    line = leaves[0].line;
    return _.map(leaves, function(leaf) {
      var part;
      part = leaf.text;
      if (leaf === _this.end.getLeaf()) {
        part = part.substring(0, _this.end.offset);
      }
      if (leaf === _this.start.getLeaf()) {
        part = part.substring(_this.start.offset);
      }
      if (line !== leaf.line) {
        part = "\n" + part;
        line = leaf.line;
      }
      return part;
    }).join('');
  };

  ScribeRange.prototype.insertContents = function(offset, text, formats, options) {
    return this.editor.insertAt(this.start.index + offset, text, formats, options);
  };

  ScribeRange.prototype.isCollapsed = function() {
    return this.start.leafNode === this.end.leafNode && this.start.offset === this.end.offset;
  };

  return ScribeRange;

})();

module.exports = ScribeRange;


},{"./leaf-iterator":17,"./position":27}],29:[function(require,module,exports){
var ScribeDOM, ScribeNormalizer, ScribeRenderer, ScribeUtils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ScribeDOM = require('./dom');

ScribeUtils = require('./utils');

ScribeNormalizer = require('./normalizer');

ScribeRenderer = (function(_super) {
  __extends(ScribeRenderer, _super);

  ScribeRenderer.DEFAULTS = {
    id: 'editor',
    iframe: true,
    keepHTML: false,
    styles: {
      '.editor-container': {
        'cursor': 'text',
        'font-family': "'Helvetica', 'Arial', sans-serif",
        'font-size': '13px',
        'height': '100%',
        'line-height': '1.154',
        'margin': '0px',
        'overflow': 'auto',
        'padding': '0px'
      },
      '.editor': {
        'height': '100%',
        'outline': 'none',
        'tab-size': '4',
        'white-space': 'pre-wrap'
      },
      '.editor .line:first-child': {
        'padding-top': '10px'
      },
      '.editor .line:last-child': {
        'padding-bottom': '10px'
      },
      '.editor .line': {
        'margin-left': '15px',
        'margin-right': '15px'
      },
      '.editor a': {
        'text-decoration': 'underline'
      },
      '.editor b': {
        'font-weight': 'bold'
      },
      '.editor i': {
        'font-style': 'italic'
      },
      '.editor s': {
        'text-decoration': 'line-through'
      },
      '.editor u': {
        'text-decoration': 'underline'
      },
      '.editor ol': {
        'margin': '0px',
        'padding': '0px'
      },
      '.editor ul': {
        'list-style-type': 'disc',
        'margin': '0px',
        'padding': '0px'
      },
      '.editor ol.indent-1': {
        'list-style-type': 'decimal'
      },
      '.editor ol.indent-2': {
        'list-style-type': 'lower-alpha'
      },
      '.editor ol.indent-3': {
        'list-style-type': 'lower-roman'
      },
      '.editor ol.indent-4': {
        'list-style-type': 'decimal'
      },
      '.editor ol.indent-5': {
        'list-style-type': 'lower-alpha'
      },
      '.editor ol.indent-6': {
        'list-style-type': 'lower-roman'
      },
      '.editor ol.indent-7': {
        'list-style-type': 'decimal'
      },
      '.editor ol.indent-8': {
        'list-style-type': 'lower-alpha'
      },
      '.editor ol.indent-9': {
        'list-style-type': 'lower-roman'
      },
      '.editor .indent-1': {
        'margin-left': '2em'
      },
      '.editor .indent-2': {
        'margin-left': '4em'
      },
      '.editor .indent-3': {
        'margin-left': '6em'
      },
      '.editor .indent-4': {
        'margin-left': '8em'
      },
      '.editor .indent-5': {
        'margin-left': '10em'
      },
      '.editor .indent-6': {
        'margin-left': '12em'
      },
      '.editor .indent-7': {
        'margin-left': '14em'
      },
      '.editor .indent-8': {
        'margin-left': '16em'
      },
      '.editor .indent-9': {
        'margin-left': '18em'
      }
    }
  };

  ScribeRenderer.events = {
    UPDATE: 'renderer-update'
  };

  ScribeRenderer.objToCss = function(obj) {
    return _.map(obj, function(value, key) {
      var innerStr;
      innerStr = _.map(value, function(innerValue, innerKey) {
        return "" + innerKey + ": " + innerValue + ";";
      }).join(' ');
      return "" + key + " { " + innerStr + " }";
    }).join("\n");
  };

  function ScribeRenderer(container, options) {
    var originalStyles,
      _this = this;
    this.container = container;
    if (options == null) {
      options = {};
    }
    options = options.renderer || {};
    originalStyles = options.styles;
    this.options = _.defaults(options, ScribeRenderer.DEFAULTS);
    this.options.styles = originalStyles;
    this.buildFrame();
    this.formats = {};
    if (ScribeUtils.isIE()) {
      ScribeRenderer.DEFAULTS.styles['br'] = {
        'display': 'none'
      };
    }
    this.addStyles(ScribeRenderer.DEFAULTS.styles);
    _.defer(function() {
      if (options.styles != null) {
        return _this.addStyles(options.styles);
      }
    });
  }

  ScribeRenderer.prototype.addContainer = function(container, before) {
    var refNode;
    if (before == null) {
      before = false;
    }
    refNode = before ? this.root : null;
    return this.root.parentNode.insertBefore(container, refNode);
  };

  ScribeRenderer.prototype.addStyles = function(css) {
    var style,
      _this = this;
    style = this.root.ownerDocument.createElement('style');
    style.type = 'text/css';
    if (!_.isString(css)) {
      css = ScribeRenderer.objToCss(css);
    }
    if (style.styleSheet != null) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(this.root.ownerDocument.createTextNode(css));
    }
    return _.defer(function() {
      _this.root.ownerDocument.querySelector('head').appendChild(style);
      return _this.emit(ScribeRenderer.events.UPDATE, css);
    });
  };

  ScribeRenderer.prototype.buildFrame = function() {
    var doc, html, htmlTag,
      _this = this;
    html = this.container.innerHTML;
    this.container.innerHTML = '';
    if (this.options.iframe) {
      this.iframe = this.container.ownerDocument.createElement('iframe');
      this.iframe.frameBorder = '0';
      this.container.appendChild(this.iframe);
      doc = this.getDocument();
      this.iframe.height = this.iframe.width = '100%';
      doc.open();
      doc.write('<!DOCTYPE html>');
      doc.close();
      htmlTag = doc.querySelector('html');
      htmlTag.style.height = doc.body.style.height = '100%';
    } else {
      this.iframe = this.container;
      doc = this.getDocument();
    }
    this.root = doc.createElement('div');
    ScribeDOM.addClass(this.root, 'editor');
    this.root.id = this.options.id;
    if (this.options.iframe) {
      doc.body.appendChild(this.root);
    } else {
      this.container.appendChild(this.root);
    }
    ScribeDOM.addClass(this.root.parentNode, 'editor-container');
    if (this.options.keepHTML) {
      this.root.innerHTML = ScribeNormalizer.normalizeHtml(html);
    }
    return ScribeDOM.addEventListener(this.container, 'focus', function() {
      return _this.root.focus();
    });
  };

  ScribeRenderer.prototype.checkFocus = function() {
    return this.root.ownerDocument.activeElement === this.root;
  };

  ScribeRenderer.prototype.getDocument = function() {
    var _ref;
    if (this.iframe.parentNode == null) {
      return null;
    }
    if (this.options.iframe) {
      return (_ref = this.iframe.contentWindow) != null ? _ref.document : void 0;
    } else {
      return this.iframe.ownerDocument;
    }
  };

  return ScribeRenderer;

})(EventEmitter2);

module.exports = ScribeRenderer;


},{"./dom":12,"./normalizer":25,"./utils":36}],30:[function(require,module,exports){
var ScribeDOM, ScribeKeyboard, ScribeLine, ScribePosition, ScribeRange, ScribeSelection, ScribeUtils, compareNativeRanges, normalizeNativePosition, normalizeNativeRange, _nativeRangeToRange, _preserveWithIndex, _preserveWithLine, _updateFocus;

ScribeDOM = require('./dom');

ScribeLine = require('./line');

ScribeKeyboard = require('./keyboard');

ScribePosition = require('./position');

ScribeRange = require('./range');

ScribeUtils = require('./utils');

compareNativeRanges = function(r1, r2) {
  if (r1 === r2) {
    return true;
  }
  if (!((r1 != null) && (r2 != null))) {
    return false;
  }
  return r1.equals(r2);
};

normalizeNativePosition = function(node, offset) {
  if ((node != null ? node.nodeType : void 0) === ScribeDOM.ELEMENT_NODE) {
    if (node.firstChild == null) {
      return [node, 0];
    }
    offset = Math.min(node.childNodes.length, offset);
    if (offset < node.childNodes.length) {
      return normalizeNativePosition(node.childNodes[offset], 0);
    } else {
      if (node.lastChild.nodeType === ScribeDOM.ELEMENT_NODE) {
        return normalizeNativePosition(node.lastChild, node.lastChild.childNodes.length);
      } else {
        return [node.lastChild, ScribeUtils.getNodeLength(node.lastChild)];
      }
    }
  }
  return [node, offset];
};

normalizeNativeRange = function(nativeRange) {
  var endContainer, endOffset, startContainer, startOffset, _ref, _ref1;
  if (nativeRange == null) {
    return null;
  }
  _ref = normalizeNativePosition(nativeRange.startContainer, nativeRange.startOffset), startContainer = _ref[0], startOffset = _ref[1];
  _ref1 = normalizeNativePosition(nativeRange.endContainer, nativeRange.endOffset), endContainer = _ref1[0], endOffset = _ref1[1];
  return {
    startContainer: startContainer,
    startOffset: startOffset,
    endContainer: endContainer,
    endOffset: endOffset,
    isBackwards: nativeRange.isBackwards
  };
};

_nativeRangeToRange = function(nativeRange) {
  var end, range, start;
  if (nativeRange == null) {
    return null;
  }
  start = new ScribePosition(this.editor, nativeRange.startContainer, nativeRange.startOffset);
  end = new ScribePosition(this.editor, nativeRange.endContainer, nativeRange.endOffset);
  if (start.index <= end.index) {
    range = new ScribeRange(this.editor, start, end);
    range.isBackwards = false;
  } else {
    range = new ScribeRange(this.editor, end, start);
    range.isBackwards = true;
  }
  if (nativeRange.isBackwards) {
    range.isBackwards = true;
  }
  return range;
};

_preserveWithIndex = function(nativeRange, index, lengthAdded, fn) {
  var endIndex, range, startIndex, _ref;
  range = _nativeRangeToRange.call(this, nativeRange);
  _ref = _.map([range.start, range.end], function(pos) {
    if (index >= pos.index) {
      return pos.index;
    } else {
      return Math.max(pos.index + lengthAdded, index);
    }
  }), startIndex = _ref[0], endIndex = _ref[1];
  fn.call(null);
  return this.setRange(new ScribeRange(this.editor, startIndex, endIndex), true);
};

_preserveWithLine = function(savedNativeRange, fn) {
  var end, nativeRange, savedData, start, _ref,
    _this = this;
  savedData = _.map([
    {
      container: savedNativeRange.startContainer,
      offset: savedNativeRange.startOffset
    }, {
      container: savedNativeRange.endContainer,
      offset: savedNativeRange.endOffset
    }
  ], function(position) {
    var lineNode, _ref;
    lineNode = ScribeUtils.findAncestor(position.container, ScribeUtils.isLineNode) || _this.editor.root;
    return {
      lineNode: lineNode,
      offset: ScribePosition.getIndex(position.container, position.offset, lineNode),
      nextLine: ((_ref = position.container.previousSibling) != null ? _ref.tagName : void 0) === 'BR'
    };
  });
  fn.call(null);
  nativeRange = this.getNativeRange(true);
  if (!_.isEqual(nativeRange, savedNativeRange)) {
    _ref = _.map(savedData, function(savedDatum) {
      if (savedDatum.nextLine && (savedDatum.lineNode.nextSibling != null)) {
        savedDatum.lineNode = savedDatum.lineNode.nextSibling;
        savedDatum.offset = 0;
      }
      return new ScribePosition(_this.editor, savedDatum.lineNode, savedDatum.offset);
    }), start = _ref[0], end = _ref[1];
    return this.setRange(new ScribeRange(this.editor, start, end), true);
  }
};

_updateFocus = function(silent) {
  var hasFocus,
    _this = this;
  hasFocus = this.editor.renderer.checkFocus();
  if (!silent && this.hasFocus !== hasFocus) {
    if (hasFocus) {
      if (this.blurTimer) {
        clearTimeout(this.blurTimer);
        this.blurTimer = null;
      } else {
        this.editor.emit(this.editor.constructor.events.FOCUS_CHANGE, true);
      }
    } else if (this.blurTimer == null) {
      this.blurTimer = setTimeout(function() {
        if (_this.hasFocus === false) {
          _this.editor.emit(_this.editor.constructor.events.FOCUS_CHANGE, false);
        }
        return _this.blurTimer = null;
      }, 200);
    }
  }
  return this.hasFocus = hasFocus;
};

ScribeSelection = (function() {
  function ScribeSelection(editor) {
    var _this = this;
    this.editor = editor;
    this.range = null;
    this.blurTimer = null;
    rangy.init();
    if (this.editor.renderer.options.iframe) {
      if (this.editor.renderer.iframe.parentNode != null) {
        this.nativeSelection = rangy.getIframeSelection(this.editor.renderer.iframe);
      }
    } else {
      this.nativeSelection = rangy.getSelection();
    }
    this.setRange(null, true);
    this.hasFocus = this.editor.renderer.checkFocus();
    ScribeDOM.addEventListener(this.editor.root, 'focus', function() {
      return _.defer(function() {
        return _this.editor.checkUpdate();
      });
    });
    ScribeDOM.addEventListener(this.editor.root, 'beforedeactivate blur mouseup', function() {
      return _this.editor.checkUpdate();
    });
  }

  ScribeSelection.prototype.getDimensions = function() {
    var nativeRange;
    if (this.range == null) {
      return null;
    }
    nativeRange = this.range.nativeRange || this.range.textRange;
    return nativeRange.getBoundingClientRect();
  };

  ScribeSelection.prototype.getNativeRange = function(normalize) {
    var range, _ref;
    if (normalize == null) {
      normalize = false;
    }
    if (!this.editor.renderer.checkFocus()) {
      return this.range;
    }
    if (!this.nativeSelection) {
      return null;
    }
    this.nativeSelection.refresh();
    range = ((_ref = this.nativeSelection) != null ? _ref.rangeCount : void 0) > 0 ? this.nativeSelection.getRangeAt(0) : null;
    if ((range != null) && (!rangy.dom.isAncestorOf(this.editor.root, range.startContainer, true) || !rangy.dom.isAncestorOf(this.editor.root, range.endContainer, true))) {
      range = null;
    }
    if (range) {
      if (normalize) {
        range = normalizeNativeRange(range);
      }
      if (this.nativeSelection.isBackwards()) {
        range.isBackwards = true;
      }
      return range;
    } else {
      return null;
    }
  };

  ScribeSelection.prototype.getRange = function() {
    var nativeRange;
    nativeRange = this.getNativeRange(true);
    if (nativeRange != null) {
      return _nativeRangeToRange.call(this, nativeRange);
    } else {
      return null;
    }
  };

  ScribeSelection.prototype.preserve = function(index, lengthAdded, fn) {
    var nativeRange;
    if (_.isFunction(index)) {
      fn = index;
    }
    nativeRange = this.getNativeRange(true);
    if (this.range != null) {
      if (_.isFunction(index)) {
        return _preserveWithLine.call(this, nativeRange, index);
      } else {
        return _preserveWithIndex.call(this, nativeRange, index, lengthAdded, fn);
      }
    } else {
      return fn.call(null);
    }
  };

  ScribeSelection.prototype.setRange = function(range, silent) {
    var nativeRange;
    if (silent == null) {
      silent = false;
    }
    if (this.nativeSelection == null) {
      return;
    }
    if (this.editor.renderer.checkFocus()) {
      this.nativeSelection.removeAllRanges();
    }
    if (range != null) {
      nativeRange = rangy.createRangyRange(this.editor.renderer.getDocument());
      _.each([range.start, range.end], function(pos, i) {
        var fn, node, offset, _ref;
        _ref = ScribeUtils.findDeepestNode(pos.leafNode, pos.offset), node = _ref[0], offset = _ref[1];
        offset = Math.min(ScribeDOM.getText(node).length, offset);
        if (node.tagName === 'BR') {
          if (node.tagName === "BR") {
            node = node.parentNode;
          }
          if (ScribeUtils.isIE()) {
            offset = 1;
          }
        }
        fn = i === 0 ? 'setStart' : 'setEnd';
        return nativeRange[fn].call(nativeRange, node, offset);
      });
      this.nativeSelection.addRange(nativeRange, range.isBackwards);
      this.range = nativeRange;
    } else {
      this.range = null;
    }
    if (!silent) {
      return this.editor.emit(this.editor.constructor.events.SELECTION_CHANGE, range);
    }
  };

  ScribeSelection.prototype.update = function(silent) {
    var nativeRange, range;
    if (silent == null) {
      silent = false;
    }
    _updateFocus.call(this, silent);
    if (this.hasFocus) {
      nativeRange = this.getNativeRange(false);
      if (compareNativeRanges(nativeRange, this.range)) {
        return;
      }
      this.range = nativeRange;
      range = _nativeRangeToRange.call(this, normalizeNativeRange(this.range));
      if (ScribeUtils.isEmptyDoc(this.editor.root)) {
        return this.setRange(range, silent);
      } else {
        if (!silent) {
          return this.editor.emit(this.editor.constructor.events.SELECTION_CHANGE, range);
        }
      }
    }
  };

  return ScribeSelection;

})();

module.exports = ScribeSelection;


},{"./dom":12,"./keyboard":16,"./line":19,"./position":27,"./range":28,"./utils":36}],31:[function(require,module,exports){
var ScribeColorPicker, ScribeDOM, ScribePicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ScribeDOM = require('../dom');

ScribePicker = require('./picker');

ScribeColorPicker = (function(_super) {
  __extends(ScribeColorPicker, _super);

  function ScribeColorPicker() {
    ScribeColorPicker.__super__.constructor.apply(this, arguments);
    ScribeDOM.addClass(this.container, 'color-picker');
  }

  ScribeColorPicker.prototype.buildItem = function(picker, option, index) {
    var item;
    item = ScribeColorPicker.__super__.buildItem.call(this, picker, option, index);
    item.style.backgroundColor = option.value;
    ScribeDOM.setText(item, '');
    return item;
  };

  ScribeColorPicker.prototype.selectItem = function(item) {
    ScribeColorPicker.__super__.selectItem.call(this, item);
    return this.label.innerHTML = '';
  };

  return ScribeColorPicker;

})(ScribePicker);

module.exports = ScribeColorPicker;


},{"../dom":12,"./picker":33}],32:[function(require,module,exports){
var ScribeAttribution, ScribeDefaultTheme, ScribeLinkTooltip, ScribeMultiCursor, ScribeToolbar;

ScribeAttribution = require('../modules/attribution');

ScribeLinkTooltip = require('../modules/link-tooltip');

ScribeMultiCursor = require('../modules/multi-cursor');

ScribeToolbar = require('../modules/toolbar');

ScribeDefaultTheme = (function() {
  ScribeDefaultTheme.stylesheets = {};

  function ScribeDefaultTheme(editor) {
    this.editor = editor;
  }

  ScribeDefaultTheme.prototype.addModule = function(name, options) {
    switch (name) {
      case 'attribution':
        return new ScribeAttribution(this.editor, options);
      case 'link-tooltip':
        return new ScribeLinkTooltip(this.editor, options);
      case 'multi-cursor':
        return new ScribeMultiCursor(this.editor, options);
      case 'toolbar':
        return new ScribeToolbar(this.editor, options);
      default:
        return null;
    }
  };

  return ScribeDefaultTheme;

})();

module.exports = ScribeDefaultTheme;


},{"../modules/attribution":21,"../modules/link-tooltip":22,"../modules/multi-cursor":23,"../modules/toolbar":24}],33:[function(require,module,exports){
var ScribeDOM, ScribePicker;

ScribeDOM = require('../dom');

ScribePicker = (function() {
  function ScribePicker(select) {
    var picker, selected, title,
      _this = this;
    this.select = select;
    this.container = this.select.ownerDocument.createElement('div');
    _.each(ScribeDOM.getClasses(this.select), function(css) {
      return ScribeDOM.addClass(_this.container, css);
    });
    title = this.select.getAttribute('title');
    if (title) {
      this.container.setAttribute('title', title);
    }
    ScribeDOM.addClass(this.container, 'picker');
    this.label = this.select.ownerDocument.createElement('div');
    ScribeDOM.addClass(this.label, 'picker-label');
    this.container.appendChild(this.label);
    picker = this.buildPicker();
    this.container.appendChild(picker);
    selected = picker.querySelector('.selected');
    if (selected != null) {
      ScribeDOM.setText(this.label, ScribeDOM.getText(selected));
    }
    ScribeDOM.addEventListener(this.label, 'click', function() {
      var hasClass;
      hasClass = ScribeDOM.hasClass(_this.container, 'expanded');
      return _.defer(function() {
        return ScribeDOM.toggleClass(_this.container, 'expanded', !hasClass);
      });
    });
    ScribeDOM.addEventListener(this.select.ownerDocument, 'click', function() {
      return ScribeDOM.removeClass(_this.container, 'expanded');
    });
    ScribeDOM.addEventListener(this.select, 'change', function() {
      var option;
      option = _this.container.querySelectorAll('.picker-item')[_this.select.selectedIndex];
      _this.selectItem(option);
      return ScribeDOM.toggleClass(_this.label, 'active', option !== selected);
    });
    this.select.parentNode.insertBefore(this.container, this.select);
  }

  ScribePicker.prototype.buildItem = function(picker, option, index) {
    var item,
      _this = this;
    item = this.select.ownerDocument.createElement('div');
    ScribeDOM.addClass(item, 'picker-item');
    ScribeDOM.setText(item, ScribeDOM.getText(option));
    if (this.select.selectedIndex === index) {
      ScribeDOM.addClass(item, 'selected');
    }
    ScribeDOM.addEventListener(item, 'click', function() {
      _this.selectItem(item);
      _this.select.selectedIndex = index;
      ScribeDOM.triggerEvent(_this.select, 'change', true, true);
      return true;
    });
    return item;
  };

  ScribePicker.prototype.buildPicker = function() {
    var picker,
      _this = this;
    picker = this.select.ownerDocument.createElement('div');
    ScribeDOM.addClass(picker, 'picker-options');
    _.each(this.select.querySelectorAll('option'), function(option, i) {
      var item;
      item = _this.buildItem(picker, option, i);
      return picker.appendChild(item);
    });
    this.select.style.display = 'none';
    return picker;
  };

  ScribePicker.prototype.close = function() {
    return ScribeDOM.removeClass(this.container, 'expanded');
  };

  ScribePicker.prototype.selectItem = function(item) {
    var selected;
    selected = this.container.querySelector('.selected');
    if (selected != null) {
      ScribeDOM.removeClass(selected, 'selected');
    }
    if (item != null) {
      ScribeDOM.addClass(item, 'selected');
      return ScribeDOM.setText(this.label, ScribeDOM.getText(item));
    } else {
      return this.label.innerHTML = '&nbsp;';
    }
  };

  return ScribePicker;

})();

module.exports = ScribePicker;


},{"../dom":12}],34:[function(require,module,exports){
var ScribeColorPicker, ScribeDOM, ScribeDefaultTheme, ScribePicker, ScribeSnowTheme,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ScribeColorPicker = require('./color-picker');

ScribeDefaultTheme = require('./default');

ScribeDOM = require('../dom');

ScribePicker = require('./picker');

ScribeSnowTheme = (function(_super) {
  __extends(ScribeSnowTheme, _super);

  ScribeSnowTheme.COLORS = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008A00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];

  function ScribeSnowTheme(editor) {
    var _this = this;
    this.editor = editor;
    _.defaults({
      styles: {
        'div.editor': {
          'bottom': '15px',
          'top': '15px'
        }
      }
    }, this.editor.options.renderer);
    this.pickers = [];
    this.editor.on(this.editor.constructor.events.SELECTION_CHANGE, function() {
      return _.each(_this.pickers, function(picker) {
        return picker.close();
      });
    });
    ScribeSnowTheme.__super__.constructor.apply(this, arguments);
  }

  ScribeSnowTheme.prototype.addModule = function(name, options) {
    switch (name) {
      case 'attribution':
        this.extendAttribution(options);
        break;
      case 'link-tooltip':
        this.extendLinkTooltip(options);
        break;
      case 'multi-cursor':
        this.extendMultiCursor(options);
        break;
      case 'toolbar':
        this.extendToolbar(options);
    }
    return ScribeSnowTheme.__super__.addModule.call(this, name, options);
  };

  ScribeSnowTheme.prototype.extendAttribution = function(options) {};

  ScribeSnowTheme.prototype.extendLinkTooltip = function(options) {
    return this.editor.renderer.addStyles({
      '.editor-container a': {
        'color': '#06c'
      },
      '.editor-container #link-tooltip': {
        'border': '1px solid #ccc',
        'box-shadow': '0px 0px 5px #ddd',
        'color': '#222'
      },
      '.editor-container #link-tooltip a': {
        'color': '#06c'
      },
      '.editor-container #link-tooltip .input': {
        'border': '1px solid #ccc',
        'margin': '0px',
        'padding': '3px'
      }
    });
  };

  ScribeSnowTheme.prototype.extendMultiCursor = function(options) {
    options.template = '<span class="cursor-flag">\
        <span class="cursor-name"></span>\
        <span class="cursor-triangle"></span>\
      </span>\
      <span class="cursor-caret"></span>';
    return this.editor.renderer.addStyles({
      '.editor-container .cursor-name': {
        'border-radius': '3px',
        'font-size': '11px',
        'font-family': 'Arial',
        'margin-left': '-50%',
        'padding': '4px 10px'
      },
      '.editor-container .cursor-triangle': {
        'border-left': '4px solid transparent',
        'border-right': '4px solid transparent',
        'border-top': '4px solid transparent',
        'display': 'block',
        'height': '0px',
        'margin-bottom': '-1px',
        'margin-left': '-3px',
        'width': '0px'
      },
      '.editor-container .cursor.top > .cursor-flag': {
        'bottom': '100%',
        'top': 'auto'
      }
    });
  };

  ScribeSnowTheme.prototype.extendToolbar = function(options) {
    var _this = this;
    if (_.isString(options.container)) {
      options.container = document.querySelector(options.container);
    }
    ScribeDOM.addClass(options.container, 'toolbar-container');
    _.each(options.container.querySelectorAll('.font-name, .font-size'), function(select) {
      var picker;
      picker = new ScribePicker(select);
      return _this.pickers.push(picker);
    });
    return _.each(['fore-color', 'back-color'], function(css) {
      var format, picker, select;
      select = options.container.querySelector("." + css);
      if (select == null) {
        return;
      }
      picker = new ScribeColorPicker(select);
      _this.pickers.push(picker);
      ScribeDOM.addClass(picker.container.querySelector('.picker-label'), 'format-button');
      _.each(picker.container.querySelectorAll('.picker-item'), function(item, i) {
        if (i < 7) {
          return ScribeDOM.addClass(item, 'primary-color');
        }
      });
      format = _this.editor.doc.formatManager.formats[css];
      if (format != null) {
        format.styles = _.reduce(ScribeSnowTheme.COLORS, function(colors, c) {
          colors[c] = "rgb(" + (parseInt(c.substr(1, 2), 16)) + ", " + (parseInt(c.substr(3, 2), 16)) + ", " + (parseInt(c.substr(5, 2), 16)) + ")";
          return colors;
        }, {});
        return format.defaultStyle = css === 'fore-color' ? '#000000' : '#ffffff';
      }
    });
  };

  return ScribeSnowTheme;

})(ScribeDefaultTheme);

module.exports = ScribeSnowTheme;


},{"../dom":12,"./color-picker":31,"./default":32,"./picker":33}],35:[function(require,module,exports){
var ScribeKeyboard, ScribeRange, ScribeUndoManager, Tandem, getLastChangeIndex, _change, _ignoreChanges;

ScribeKeyboard = require('./keyboard');

ScribeRange = require('./range');

Tandem = require('tandem-core');

getLastChangeIndex = function(delta) {
  var index, lastChangeIndex, offset;
  lastChangeIndex = index = offset = 0;
  _.each(delta.ops, function(op) {
    if (Tandem.Delta.isInsert(op)) {
      offset += op.getLength();
      return lastChangeIndex = index + offset;
    } else if (Tandem.Delta.isRetain(op)) {
      if (op.start > index) {
        lastChangeIndex = index + offset;
        offset -= op.start - index;
      }
      if (_.keys(op.attributes).length > 0) {
        lastChangeIndex = op.end + offset;
      }
      return index = op.end;
    }
  });
  if (delta.endLength < delta.startLength + offset) {
    lastChangeIndex = delta.endLength;
  }
  return lastChangeIndex;
};

_change = function(source, dest) {
  var change,
    _this = this;
  if (this.stack[source].length > 0) {
    change = this.stack[source].pop();
    this.lastRecorded = 0;
    _ignoreChanges.call(this, function() {
      var index;
      _this.editor.applyDelta(change[source], {
        source: 'user'
      });
      index = getLastChangeIndex(change[source]);
      return _this.editor.setSelection(new ScribeRange(_this.editor, index, index));
    });
    return this.stack[dest].push(change);
  }
};

_ignoreChanges = function(fn) {
  var oldIgnoringChanges;
  oldIgnoringChanges = this.ignoringChanges;
  this.ignoringChanges = true;
  fn.call(this);
  return this.ignoringChanges = oldIgnoringChanges;
};

ScribeUndoManager = (function() {
  ScribeUndoManager.DEFAULTS = {
    delay: 1000,
    maxStack: 100
  };

  function ScribeUndoManager(editor, options) {
    this.editor = editor;
    if (options == null) {
      options = {};
    }
    this.options = _.defaults(options.undoManager || {}, ScribeUndoManager.DEFAULTS);
    this.lastRecorded = 0;
    this.clear();
    this.initListeners();
  }

  ScribeUndoManager.prototype.initListeners = function() {
    var _this = this;
    this.editor.keyboard.addHotkey(ScribeKeyboard.hotkeys.UNDO, function() {
      _this.undo();
      return false;
    });
    this.editor.keyboard.addHotkey(ScribeKeyboard.hotkeys.REDO, function() {
      _this.redo();
      return false;
    });
    this.ignoringChanges = false;
    return this.editor.on(this.editor.constructor.events.USER_TEXT_CHANGE, function(delta) {
      if (!_this.ignoringChanges) {
        _this.record(delta, _this.oldDelta);
      }
      return _this.oldDelta = _this.editor.getDelta();
    }).on(this.editor.constructor.events.API_TEXT_CHANGE, function(delta) {
      _this.record(delta, _this.oldDelta);
      return _this.oldDelta = _this.editor.getDelta();
    });
  };

  ScribeUndoManager.prototype.clear = function() {
    this.stack = {
      undo: [],
      redo: []
    };
    return this.oldDelta = this.editor.getDelta();
  };

  ScribeUndoManager.prototype.record = function(changeDelta, oldDelta) {
    var change, ignored, timestamp, undoDelta;
    if (changeDelta.isIdentity()) {
      return;
    }
    this.redoStack = [];
    try {
      undoDelta = oldDelta.invert(changeDelta);
      timestamp = new Date().getTime();
      if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
        change = this.stack.undo.pop();
        if (undoDelta.canCompose(change.undo) && change.redo.canCompose(changeDelta)) {
          undoDelta = undoDelta.compose(change.undo);
          changeDelta = change.redo.compose(changeDelta);
        } else {
          if (typeof console !== "undefined" && console !== null) {
            console.warn("Unable to compose change, clearing undo stack");
          }
          this.clear();
          this.lastRecorded = timestamp;
        }
      } else {
        this.lastRecorded = timestamp;
      }
      this.stack.undo.push({
        redo: changeDelta,
        undo: undoDelta
      });
      if (this.stack.undo.length > this.options.maxStack) {
        this.stack.undo.unshift();
      }
      return true;
    } catch (_error) {
      ignored = _error;
      this.clear();
      return false;
    }
  };

  ScribeUndoManager.prototype.redo = function() {
    return _change.call(this, 'redo', 'undo');
  };

  /*
  transformExternal: (delta) ->
    return if delta.isIdentity()
    @stack['undo'] = _.map(@stack['undo'], (change) ->
      return {
        redo: delta.follows(change.redo, true)
        undo: change.undo.follows(delta, true)
      }
    )
  */


  ScribeUndoManager.prototype.undo = function() {
    return _change.call(this, 'undo', 'redo');
  };

  return ScribeUndoManager;

})();

module.exports = ScribeUndoManager;


},{"./keyboard":16,"./range":28,"tandem-core":"PDczpc"}],36:[function(require,module,exports){
var ScribeDOM, ScribeUtils, ieVersion,
  __slice = [].slice;

ScribeDOM = require('./dom');

ieVersion = (function() {
  var matchVersion;
  matchVersion = navigator.userAgent.match(/MSIE [0-9\.]+/);
  if (matchVersion != null) {
    return parseInt(matchVersion[0].slice("MSIE".length));
  } else {
    return null;
  }
})();

ScribeUtils = {
  BLOCK_TAGS: ['ADDRESS', 'BLOCKQUOTE', 'DD', 'DIV', 'DL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'OL', 'P', 'PRE', 'TABLE', 'TBODY', 'TD', 'TFOOT', 'TH', 'THEAD', 'TR', 'UL'],
  findAncestor: function(node, checkFn) {
    while ((node != null) && !checkFn(node)) {
      node = node.parentNode;
    }
    return node;
  },
  findClosestPoint: function(point, list, prepFn) {
    var closestDist, closestValue, coords, dist, key;
    if (prepFn == null) {
      prepFn = function() {};
    }
    point = prepFn.call(null, point);
    if (!_.isArray(point)) {
      point = [point];
    }
    closestDist = Infinity;
    closestValue = false;
    for (key in list) {
      coords = list[key];
      coords = prepFn.call(null, coords);
      if (!_.isArray(coords)) {
        coords = [coords];
      }
      dist = _.reduce(coords, function(dist, coord, i) {
        return dist + Math.pow(coord - point[i], 2);
      }, 0);
      dist = Math.sqrt(dist);
      if (dist === 0) {
        return key;
      }
      if (dist < closestDist) {
        closestDist = dist;
        closestValue = key;
      }
    }
    return closestValue;
  },
  findDeepestNode: function(node, offset) {
    var child, length, _i, _len, _ref;
    if (node.firstChild != null) {
      _ref = _.clone(node.childNodes);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        length = ScribeUtils.getNodeLength(child);
        if (offset < length) {
          return ScribeUtils.findDeepestNode(child, offset);
        } else {
          offset -= length;
        }
      }
      return ScribeUtils.findDeepestNode(child, offset + length);
    } else {
      return [node, offset];
    }
  },
  getChildAtOffset: function(node, offset) {
    var child, length;
    child = node.firstChild;
    length = ScribeUtils.getNodeLength(child);
    while (child != null) {
      if (offset < length) {
        break;
      }
      offset -= length;
      child = child.nextSibling;
      length = ScribeUtils.getNodeLength(child);
    }
    if (child == null) {
      child = node.lastChild;
      offset = ScribeUtils.getNodeLength(child);
    }
    return [child, offset];
  },
  getNodeLength: function(node) {
    if (node == null) {
      return 0;
    }
    if (node.nodeType === ScribeDOM.ELEMENT_NODE) {
      return _.reduce(node.childNodes, function(length, child) {
        return length + ScribeUtils.getNodeLength(child);
      }, ScribeUtils.isLineNode(node) ? 1 : 0);
    } else if (node.nodeType === ScribeDOM.TEXT_NODE) {
      return ScribeDOM.getText(node).length;
    } else {
      return 0;
    }
  },
  isBlock: function(node) {
    return _.indexOf(ScribeUtils.BLOCK_TAGS, node.tagName, true) > -1;
  },
  isEmptyDoc: function(root) {
    var firstLine;
    firstLine = root.firstChild;
    if (firstLine === null) {
      return true;
    }
    if (firstLine.firstChild === null) {
      return true;
    }
    if (firstLine.firstChild === firstLine.lastChild && firstLine.firstChild.tagName === 'BR') {
      return true;
    }
    return false;
  },
  isIE: function(maxVersion) {
    if (maxVersion == null) {
      maxVersion = 10;
    }
    return (ieVersion != null) && maxVersion >= ieVersion;
  },
  isLineNode: function(node) {
    return ((node != null ? node.parentNode : void 0) != null) && ScribeDOM.hasClass(node.parentNode, 'editor') && ScribeUtils.isBlock(node);
  },
  removeFormatFromSubtree: function(subtree, format) {
    if (format.matchContainer(subtree)) {
      subtree = ScribeDOM.unwrap(subtree);
    }
    _.each(subtree.childNodes, function(child) {
      return ScribeUtils.removeFormatFromSubtree(child, format);
    });
    return subtree;
  },
  splitBefore: function(node, root) {
    var parentClone, parentNode;
    if (node === root || node.parentNode === root) {
      return false;
    }
    parentNode = node.parentNode;
    parentClone = parentNode.cloneNode(false);
    parentNode.parentNode.insertBefore(parentClone, parentNode);
    while (node.previousSibling != null) {
      parentClone.insertBefore(node.previousSibling, parentClone.firstChild);
    }
    return ScribeUtils.splitBefore(parentNode, root);
  },
  splitNode: function(node, offset, force) {
    var after, child, childLeft, childRight, left, nextRight, nodeLength, right, _ref, _ref1;
    if (force == null) {
      force = false;
    }
    nodeLength = ScribeUtils.getNodeLength(node);
    offset = Math.max(0, offset);
    offset = Math.min(offset, nodeLength);
    if (!(force || offset !== 0)) {
      return [node.previousSibling, node, false];
    }
    if (!(force || offset !== nodeLength)) {
      return [node, node.nextSibling, false];
    }
    if (node.nodeType === ScribeDOM.TEXT_NODE) {
      after = node.splitText(offset);
      return [node, after, true];
    } else {
      left = node;
      right = node.cloneNode(false);
      node.parentNode.insertBefore(right, left.nextSibling);
      _ref = ScribeUtils.getChildAtOffset(node, offset), child = _ref[0], offset = _ref[1];
      _ref1 = ScribeUtils.splitNode(child, offset), childLeft = _ref1[0], childRight = _ref1[1];
      while (childRight !== null) {
        nextRight = childRight.nextSibling;
        right.appendChild(childRight);
        childRight = nextRight;
      }
      return [left, right, true];
    }
  },
  traversePostorder: function(root, fn, context) {
    var cur, _results;
    if (context == null) {
      context = fn;
    }
    if (root == null) {
      return;
    }
    cur = root.firstChild;
    _results = [];
    while (cur != null) {
      ScribeUtils.traversePostorder.call(context, cur, fn);
      cur = fn.call(context, cur);
      if (cur != null) {
        _results.push(cur = cur.nextSibling);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  traversePreorder: function() {
    var args, context, cur, curHtml, fn, nextOffset, offset, root, _ref, _results;
    root = arguments[0], offset = arguments[1], fn = arguments[2], context = arguments[3], args = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
    if (context == null) {
      context = fn;
    }
    if (root == null) {
      return;
    }
    cur = root.firstChild;
    _results = [];
    while (cur != null) {
      nextOffset = offset + ScribeUtils.getNodeLength(cur);
      curHtml = cur.innerHTML;
      cur = fn.call.apply(fn, [context, cur, offset].concat(__slice.call(args)));
      (_ref = ScribeUtils.traversePreorder).call.apply(_ref, [null, cur, offset, fn, context].concat(__slice.call(args)));
      if ((cur != null) && cur.innerHTML === curHtml) {
        cur = cur.nextSibling;
        _results.push(offset = nextOffset);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  traverseSiblings: function(curNode, endNode, fn) {
    var nextSibling, _results;
    _results = [];
    while (curNode != null) {
      nextSibling = curNode.nextSibling;
      fn(curNode);
      if (curNode === endNode) {
        break;
      }
      _results.push(curNode = nextSibling);
    }
    return _results;
  }
};

module.exports = ScribeUtils;


},{"./dom":12}]},{},[1])
;
  Scribe._ = _;
}());
