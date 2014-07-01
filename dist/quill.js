!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Quill=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"x/3aRz":[function(_dereq_,module,exports){
(function (process){
;!function(exports, undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {

      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
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
        tree[name] = {};
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
  }

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
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
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
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
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
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
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
        return this;
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

}).call(this,_dereq_("FWaASH"))
},{"FWaASH":1}],"eventemitter2":[function(_dereq_,module,exports){
module.exports=_dereq_('x/3aRz');
},{}],"4HJaAd":[function(_dereq_,module,exports){
(function (global){
/**
 * @license
 * Lo-Dash 2.4.1 <http://lodash.com/>
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used to pool arrays and objects used internally */
  var arrayPool = [],
      objectPool = [];

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used internally to indicate various things */
  var indicatorObject = {};

  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
  var keyPrefix = +new Date + '';

  /** Used as the size when optimizations are enabled for large arrays */
  var largeArraySize = 75;

  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;

  /** Used to detect and test whitespace */
  var whitespace = (
    // whitespace
    ' \t\x0B\f\xA0\ufeff' +

    // line terminators
    '\n\r\u2028\u2029' +

    // unicode category "Zs" space separators
    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
  );

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to match "interpolate" template delimiters */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match leading whitespace and zeros to be removed */
  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to assign default `context` object properties */
  var contextProps = [
    'Array', 'Boolean', 'Date', 'Error', 'Function', 'Math', 'Number', 'Object',
    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
    'parseInt', 'setTimeout'
  ];

  /** Used to fix the JScript [[DontEnum]] bug */
  var shadowedProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      errorClass = '[object Error]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used as an internal `_.debounce` options object */
  var debounceOptions = {
    'leading': false,
    'maxWait': 0,
    'trailing': false
  };

  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /** Used as the data object for `iteratorTemplate` */
  var iteratorData = {
    'args': '',
    'array': null,
    'bottom': '',
    'firstArg': '',
    'init': '',
    'keys': null,
    'loop': '',
    'shadowedProps': null,
    'support': null,
    'top': '',
    'useHas': false
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.indexOf` without support for binary searches
   * or `fromIndex` constraints.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value or `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    var index = (fromIndex || 0) - 1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * An implementation of `_.contains` for cache objects that mimics the return
   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache object to inspect.
   * @param {*} value The value to search for.
   * @returns {number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    var type = typeof value;
    cache = cache.cache;

    if (type == 'boolean' || value == null) {
      return cache[value] ? 0 : -1;
    }
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value;
    cache = (cache = cache[type]) && cache[key];

    return type == 'object'
      ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
      : (cache ? 0 : -1);
  }

  /**
   * Adds a given value to the corresponding cache object.
   *
   * @private
   * @param {*} value The value to add to the cache.
   */
  function cachePush(value) {
    var cache = this.cache,
        type = typeof value;

    if (type == 'boolean' || value == null) {
      cache[value] = true;
    } else {
      if (type != 'number' && type != 'string') {
        type = 'object';
      }
      var key = type == 'number' ? value : keyPrefix + value,
          typeCache = cache[type] || (cache[type] = {});

      if (type == 'object') {
        (typeCache[key] || (typeCache[key] = [])).push(value);
      } else {
        typeCache[key] = true;
      }
    }
  }

  /**
   * Used by `_.max` and `_.min` as the default callback when a given
   * collection is a string value.
   *
   * @private
   * @param {string} value The character to inspect.
   * @returns {number} Returns the code unit of given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Used by `sortBy` to compare transformed `collection` elements, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ac = a.criteria,
        bc = b.criteria,
        index = -1,
        length = ac.length;

    while (++index < length) {
      var value = ac[index],
          other = bc[index];

      if (value !== other) {
        if (value > other || typeof value == 'undefined') {
          return 1;
        }
        if (value < other || typeof other == 'undefined') {
          return -1;
        }
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to return the same value for
    // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
    //
    // This also ensures a stable sort in V8 and other engines.
    // See http://code.google.com/p/v8/issues/detail?id=90
    return a.index - b.index;
  }

  /**
   * Creates a cache object to optimize linear searches of large arrays.
   *
   * @private
   * @param {Array} [array=[]] The array to search.
   * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
   */
  function createCache(array) {
    var index = -1,
        length = array.length,
        first = array[0],
        mid = array[(length / 2) | 0],
        last = array[length - 1];

    if (first && typeof first == 'object' &&
        mid && typeof mid == 'object' && last && typeof last == 'object') {
      return false;
    }
    var cache = getObject();
    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

    var result = getObject();
    result.array = array;
    result.cache = cache;
    result.push = cachePush;

    while (++index < length) {
      result.push(array[index]);
    }
    return result;
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {string} match The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  /**
   * Gets an object from the object pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Object} The object from the pool.
   */
  function getObject() {
    return objectPool.pop() || {
      'array': null,
      'cache': null,
      'criteria': null,
      'false': false,
      'index': 0,
      'null': false,
      'number': null,
      'object': null,
      'push': null,
      'string': null,
      'true': false,
      'undefined': false,
      'value': null
    };
  }

  /**
   * Checks if `value` is a DOM node in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a DOM node, else `false`.
   */
  function isNode(value) {
    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
    // methods that are `typeof` "string" and still can coerce nodes to strings
    return typeof value.toString != 'function' && typeof (value + '') == 'string';
  }

  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  /**
   * Releases the given object back to the object pool.
   *
   * @private
   * @param {Object} [object] The object to release.
   */
  function releaseObject(object) {
    var cache = object.cache;
    if (cache) {
      releaseObject(cache);
    }
    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
    if (objectPool.length < maxPoolSize) {
      objectPool.push(object);
    }
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new `lodash` function using the given context object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns the `lodash` function.
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See http://es5.github.io/#x11.1.5.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references */
    var Array = context.Array,
        Boolean = context.Boolean,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /**
     * Used for `Array` method references.
     *
     * Normally `Array.prototype` would suffice, however, using an array literal
     * avoids issues in Narwhal.
     */
    var arrayRef = [];

    /** Used for native method references */
    var errorProto = Error.prototype,
        objectProto = Object.prototype,
        stringProto = String.prototype;

    /** Used to restore the original `_` reference in `noConflict` */
    var oldDash = context._;

    /** Used to resolve the internal [[Class]] of values */
    var toString = objectProto.toString;

    /** Used to detect if a method is native */
    var reNative = RegExp('^' +
      String(toString)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    /** Native method shortcuts */
    var ceil = Math.ceil,
        clearTimeout = context.clearTimeout,
        floor = Math.floor,
        fnToString = Function.prototype.toString,
        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
        hasOwnProperty = objectProto.hasOwnProperty,
        push = arrayRef.push,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        setTimeout = context.setTimeout,
        splice = arrayRef.splice,
        unshift = arrayRef.unshift;

    /** Used to set meta data on functions */
    var defineProperty = (function() {
      // IE 8 only accepts DOM elements
      try {
        var o = {},
            func = isNative(func = Object.defineProperty) && func,
            result = func(o, o, o) && func;
      } catch(e) { }
      return result;
    }());

    /* Native method shortcuts for methods with the same name as other `lodash` methods */
    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = context.isFinite,
        nativeIsNaN = context.isNaN,
        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used to lookup a built-in constructor by [[Class]] */
    var ctorByClass = {};
    ctorByClass[arrayClass] = Array;
    ctorByClass[boolClass] = Boolean;
    ctorByClass[dateClass] = Date;
    ctorByClass[funcClass] = Function;
    ctorByClass[objectClass] = Object;
    ctorByClass[numberClass] = Number;
    ctorByClass[regexpClass] = RegExp;
    ctorByClass[stringClass] = String;

    /** Used to avoid iterating non-enumerable properties in IE < 9 */
    var nonEnumProps = {};
    nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
    nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
    nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
    nonEnumProps[objectClass] = { 'constructor': true };

    (function() {
      var length = shadowedProps.length;
      while (length--) {
        var key = shadowedProps[length];
        for (var className in nonEnumProps) {
          if (hasOwnProperty.call(nonEnumProps, className) && !hasOwnProperty.call(nonEnumProps[className], key)) {
            nonEnumProps[className][key] = false;
          }
        }
      }
    }());

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps the given value to enable intuitive
     * method chaining.
     *
     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
     * and `unshift`
     *
     * Chaining is supported in custom builds as long as the `value` method is
     * implicitly or explicitly included in the build.
     *
     * The chainable wrapper functions are:
     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
     * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
     * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
     * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
     * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
     * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
     * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
     * and `zip`
     *
     * The non-chainable wrapper functions are:
     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
     * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
     * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
     * `template`, `unescape`, `uniqueId`, and `value`
     *
     * The wrapper functions `first` and `last` return wrapped values when `n` is
     * provided, otherwise they return unwrapped values.
     *
     * Explicit chaining can be enabled by using the `_.chain` method.
     *
     * @name _
     * @constructor
     * @category Chaining
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(num) {
     *   return num * num;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
       ? value
       : new lodashWrapper(value);
    }

    /**
     * A fast path for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap in a `lodash` instance.
     * @param {boolean} chainAll A flag to enable chaining for all methods
     * @returns {Object} Returns a `lodash` instance.
     */
    function lodashWrapper(value, chainAll) {
      this.__chain__ = !!chainAll;
      this.__wrapped__ = value;
    }
    // ensure `new lodashWrapper` is an instance of `lodash`
    lodashWrapper.prototype = lodash.prototype;

    /**
     * An object used to flag environments features.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    (function() {
      var ctor = function() { this.x = 1; },
          object = { '0': 1, 'length': 1 },
          props = [];

      ctor.prototype = { 'valueOf': 1, 'y': 1 };
      for (var key in new ctor) { props.push(key); }
      for (key in arguments) { }

      /**
       * Detect if an `arguments` object's [[Class]] is resolvable (all but Firefox < 4, IE < 9).
       *
       * @memberOf _.support
       * @type boolean
       */
      support.argsClass = toString.call(arguments) == argsClass;

      /**
       * Detect if `arguments` objects are `Object` objects (all but Narwhal and Opera < 10.5).
       *
       * @memberOf _.support
       * @type boolean
       */
      support.argsObject = arguments.constructor == Object && !(arguments instanceof Array);

      /**
       * Detect if `name` or `message` properties of `Error.prototype` are
       * enumerable by default. (IE < 9, Safari < 5.1)
       *
       * @memberOf _.support
       * @type boolean
       */
      support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');

      /**
       * Detect if `prototype` properties are enumerable by default.
       *
       * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
       * (if the prototype or a property on the prototype has been set)
       * incorrectly sets a function's `prototype` property [[Enumerable]]
       * value to `true`.
       *
       * @memberOf _.support
       * @type boolean
       */
      support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');

      /**
       * Detect if functions can be decompiled by `Function#toString`
       * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
       *
       * @memberOf _.support
       * @type boolean
       */
      support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

      /**
       * Detect if `Function#name` is supported (all but IE).
       *
       * @memberOf _.support
       * @type boolean
       */
      support.funcNames = typeof Function.name == 'string';

      /**
       * Detect if `arguments` object indexes are non-enumerable
       * (Firefox < 4, IE < 9, PhantomJS, Safari < 5.1).
       *
       * @memberOf _.support
       * @type boolean
       */
      support.nonEnumArgs = key != 0;

      /**
       * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
       *
       * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
       * made non-enumerable as well (a.k.a the JScript [[DontEnum]] bug).
       *
       * @memberOf _.support
       * @type boolean
       */
      support.nonEnumShadows = !/valueOf/.test(props);

      /**
       * Detect if own properties are iterated after inherited properties (all but IE < 9).
       *
       * @memberOf _.support
       * @type boolean
       */
      support.ownLast = props[0] != 'x';

      /**
       * Detect if `Array#shift` and `Array#splice` augment array-like objects correctly.
       *
       * Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array `shift()`
       * and `splice()` functions that fail to remove the last element, `value[0]`,
       * of array-like objects even though the `length` property is set to `0`.
       * The `shift()` method is buggy in IE 8 compatibility mode, while `splice()`
       * is buggy regardless of mode in IE < 9 and buggy in compatibility mode in IE 9.
       *
       * @memberOf _.support
       * @type boolean
       */
      support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);

      /**
       * Detect lack of support for accessing string characters by index.
       *
       * IE < 8 can't access characters by index and IE 8 can only access
       * characters by index on string literals.
       *
       * @memberOf _.support
       * @type boolean
       */
      support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';

      /**
       * Detect if a DOM node's [[Class]] is resolvable (all but IE < 9)
       * and that the JS engine errors when attempting to coerce an object to
       * a string without a `toString` function.
       *
       * @memberOf _.support
       * @type boolean
       */
      try {
        support.nodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
      } catch(e) {
        support.nodeClass = true;
      }
    }(1));

    /**
     * By default, the template delimiters used by Lo-Dash are similar to those in
     * embedded Ruby (ERB). Change the following template settings to use alternative
     * delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': /<%-([\s\S]+?)%>/g,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': /<%([\s\S]+?)%>/g,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*--------------------------------------------------------------------------*/

    /**
     * The template used to create iterator functions.
     *
     * @private
     * @param {Object} data The data object used to populate the text.
     * @returns {string} Returns the interpolated text.
     */
    var iteratorTemplate = template(
      // the `iterable` may be reassigned by the `top` snippet
      'var index, iterable = <%= firstArg %>, ' +
      // assign the `result` variable an initial value
      'result = <%= init %>;\n' +
      // exit early if the first argument is falsey
      'if (!iterable) return result;\n' +
      // add code before the iteration branches
      '<%= top %>;' +

      // array-like iteration:
      '<% if (array) { %>\n' +
      'var length = iterable.length; index = -1;\n' +
      'if (<%= array %>) {' +

      // add support for accessing string characters by index if needed
      '  <% if (support.unindexedChars) { %>\n' +
      '  if (isString(iterable)) {\n' +
      "    iterable = iterable.split('')\n" +
      '  }' +
      '  <% } %>\n' +

      // iterate over the array-like value
      '  while (++index < length) {\n' +
      '    <%= loop %>;\n' +
      '  }\n' +
      '}\n' +
      'else {' +

      // object iteration:
      // add support for iterating over `arguments` objects if needed
      '  <% } else if (support.nonEnumArgs) { %>\n' +
      '  var length = iterable.length; index = -1;\n' +
      '  if (length && isArguments(iterable)) {\n' +
      '    while (++index < length) {\n' +
      "      index += '';\n" +
      '      <%= loop %>;\n' +
      '    }\n' +
      '  } else {' +
      '  <% } %>' +

      // avoid iterating over `prototype` properties in older Firefox, Opera, and Safari
      '  <% if (support.enumPrototypes) { %>\n' +
      "  var skipProto = typeof iterable == 'function';\n" +
      '  <% } %>' +

      // avoid iterating over `Error.prototype` properties in older IE and Safari
      '  <% if (support.enumErrorProps) { %>\n' +
      '  var skipErrorProps = iterable === errorProto || iterable instanceof Error;\n' +
      '  <% } %>' +

      // define conditions used in the loop
      '  <%' +
      '    var conditions = [];' +
      '    if (support.enumPrototypes) { conditions.push(\'!(skipProto && index == "prototype")\'); }' +
      '    if (support.enumErrorProps)  { conditions.push(\'!(skipErrorProps && (index == "message" || index == "name"))\'); }' +
      '  %>' +

      // iterate own properties using `Object.keys`
      '  <% if (useHas && keys) { %>\n' +
      '  var ownIndex = -1,\n' +
      '      ownProps = objectTypes[typeof iterable] && keys(iterable),\n' +
      '      length = ownProps ? ownProps.length : 0;\n\n' +
      '  while (++ownIndex < length) {\n' +
      '    index = ownProps[ownIndex];\n<%' +
      "    if (conditions.length) { %>    if (<%= conditions.join(' && ') %>) {\n  <% } %>" +
      '    <%= loop %>;' +
      '    <% if (conditions.length) { %>\n    }<% } %>\n' +
      '  }' +

      // else using a for-in loop
      '  <% } else { %>\n' +
      '  for (index in iterable) {\n<%' +
      '    if (useHas) { conditions.push("hasOwnProperty.call(iterable, index)"); }' +
      "    if (conditions.length) { %>    if (<%= conditions.join(' && ') %>) {\n  <% } %>" +
      '    <%= loop %>;' +
      '    <% if (conditions.length) { %>\n    }<% } %>\n' +
      '  }' +

      // Because IE < 9 can't set the `[[Enumerable]]` attribute of an
      // existing property and the `constructor` property of a prototype
      // defaults to non-enumerable, Lo-Dash skips the `constructor`
      // property when it infers it's iterating over a `prototype` object.
      '    <% if (support.nonEnumShadows) { %>\n\n' +
      '  if (iterable !== objectProto) {\n' +
      "    var ctor = iterable.constructor,\n" +
      '        isProto = iterable === (ctor && ctor.prototype),\n' +
      '        className = iterable === stringProto ? stringClass : iterable === errorProto ? errorClass : toString.call(iterable),\n' +
      '        nonEnum = nonEnumProps[className];\n' +
      '      <% for (k = 0; k < 7; k++) { %>\n' +
      "    index = '<%= shadowedProps[k] %>';\n" +
      '    if ((!(isProto && nonEnum[index]) && hasOwnProperty.call(iterable, index))<%' +
      '        if (!useHas) { %> || (!nonEnum[index] && iterable[index] !== objectProto[index])<% }' +
      '      %>) {\n' +
      '      <%= loop %>;\n' +
      '    }' +
      '      <% } %>\n' +
      '  }' +
      '    <% } %>' +
      '  <% } %>' +
      '  <% if (array || support.nonEnumArgs) { %>\n}<% } %>\n' +

      // add code to the bottom of the iteration function
      '<%= bottom %>;\n' +
      // finally, return the `result`
      'return result'
    );

    /*--------------------------------------------------------------------------*/

    /**
     * The base implementation of `_.bind` that creates the bound function and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new bound function.
     */
    function baseBind(bindData) {
      var func = bindData[0],
          partialArgs = bindData[2],
          thisArg = bindData[4];

      function bound() {
        // `Function#bind` spec
        // http://es5.github.io/#x15.3.4.5
        if (partialArgs) {
          // avoid `arguments` object deoptimizations by using `slice` instead
          // of `Array.prototype.slice.call` and not assigning `arguments` to a
          // variable as a ternary expression
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        // mimic the constructor's `return` behavior
        // http://es5.github.io/#x13.2.2
        if (this instanceof bound) {
          // ensure `new bound` is an instance of `func`
          var thisBinding = baseCreate(func.prototype),
              result = func.apply(thisBinding, args || arguments);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisArg, args || arguments);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.clone` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, callback, stackA, stackB) {
      if (callback) {
        var result = callback(value);
        if (typeof result != 'undefined') {
          return result;
        }
      }
      // inspect [[Class]]
      var isObj = isObject(value);
      if (isObj) {
        var className = toString.call(value);
        if (!cloneableClasses[className] || (!support.nodeClass && isNode(value))) {
          return value;
        }
        var ctor = ctorByClass[className];
        switch (className) {
          case boolClass:
          case dateClass:
            return new ctor(+value);

          case numberClass:
          case stringClass:
            return new ctor(value);

          case regexpClass:
            result = ctor(value.source, reFlags.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }
      } else {
        return value;
      }
      var isArr = isArray(value);
      if (isDeep) {
        // check for circular references and return corresponding clone
        var initedStack = !stackA;
        stackA || (stackA = getArray());
        stackB || (stackB = getArray());

        var length = stackA.length;
        while (length--) {
          if (stackA[length] == value) {
            return stackB[length];
          }
        }
        result = isArr ? ctor(value.length) : {};
      }
      else {
        result = isArr ? slice(value) : assign({}, value);
      }
      // add array properties assigned by `RegExp#exec`
      if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
          result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
          result.input = value.input;
        }
      }
      // exit for shallow clone
      if (!isDeep) {
        return result;
      }
      // add the source value to the stack of traversed objects
      // and associate it with its clone
      stackA.push(value);
      stackB.push(result);

      // recursively populate clone (susceptible to call stack limits)
      (isArr ? baseEach : forOwn)(value, function(objValue, key) {
        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
      });

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(prototype, properties) {
      return isObject(prototype) ? nativeCreate(prototype) : {};
    }
    // fallback for browsers without `Object.create`
    if (!nativeCreate) {
      baseCreate = (function() {
        function Object() {}
        return function(prototype) {
          if (isObject(prototype)) {
            Object.prototype = prototype;
            var result = new Object;
            Object.prototype = null;
          }
          return result || context.Object();
        };
      }());
    }

    /**
     * The base implementation of `_.createCallback` without support for creating
     * "_.pluck" or "_.where" style callbacks.
     *
     * @private
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     */
    function baseCreateCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      // exit early for no `thisArg` or already bound by `Function#bind`
      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
        return func;
      }
      var bindData = func.__bindData__;
      if (typeof bindData == 'undefined') {
        if (support.funcNames) {
          bindData = !func.name;
        }
        bindData = bindData || !support.funcDecomp;
        if (!bindData) {
          var source = fnToString.call(func);
          if (!support.funcNames) {
            bindData = !reFuncName.test(source);
          }
          if (!bindData) {
            // checks if `func` references the `this` keyword and stores the result
            bindData = reThis.test(source);
            setBindData(func, bindData);
          }
        }
      }
      // exit early if there are no `this` references or `func` is bound
      if (bindData === false || (bindData !== true && bindData[1] & 1)) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 2: return function(a, b) {
          return func.call(thisArg, a, b);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return bind(func, thisArg);
    }

    /**
     * The base implementation of `createWrapper` that creates the wrapper and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new function.
     */
    function baseCreateWrapper(bindData) {
      var func = bindData[0],
          bitmask = bindData[1],
          partialArgs = bindData[2],
          partialRightArgs = bindData[3],
          thisArg = bindData[4],
          arity = bindData[5];

      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          key = func;

      function bound() {
        var thisBinding = isBind ? thisArg : this;
        if (partialArgs) {
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        if (partialRightArgs || isCurry) {
          args || (args = slice(arguments));
          if (partialRightArgs) {
            push.apply(args, partialRightArgs);
          }
          if (isCurry && args.length < arity) {
            bitmask |= 16 & ~32;
            return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
          }
        }
        args || (args = arguments);
        if (isBindKey) {
          func = thisBinding[key];
        }
        if (this instanceof bound) {
          thisBinding = baseCreate(func.prototype);
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.difference` that accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {Array} [values] The array of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     */
    function baseDifference(array, values) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          isLarge = length >= largeArraySize && indexOf === baseIndexOf,
          result = [];

      if (isLarge) {
        var cache = createCache(values);
        if (cache) {
          indexOf = cacheIndexOf;
          values = cache;
        } else {
          isLarge = false;
        }
      }
      while (++index < length) {
        var value = array[index];
        if (indexOf(values, value) < 0) {
          result.push(value);
        }
      }
      if (isLarge) {
        releaseObject(values);
      }
      return result;
    }

    /**
     * The base implementation of `_.flatten` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
     * @param {number} [fromIndex=0] The index to start from.
     * @returns {Array} Returns a new flattened array.
     */
    function baseFlatten(array, isShallow, isStrict, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (value && typeof value == 'object' && typeof value.length == 'number'
            && (isArray(value) || isArguments(value))) {
          // recursively flatten arrays (susceptible to call stack limits)
          if (!isShallow) {
            value = baseFlatten(value, isShallow, isStrict);
          }
          var valIndex = -1,
              valLength = value.length,
              resIndex = result.length;

          result.length += valLength;
          while (++valIndex < valLength) {
            result[resIndex++] = value[valIndex];
          }
        } else if (!isStrict) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.isEqual`, without support for `thisArg` binding,
     * that allows partial "_.where" style comparisons.
     *
     * @private
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
      // used to indicate that when comparing objects, `a` has at least the properties of `b`
      if (callback) {
        var result = callback(a, b);
        if (typeof result != 'undefined') {
          return !!result;
        }
      }
      // exit early for identical values
      if (a === b) {
        // treat `+0` vs. `-0` as not equal
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;

      // exit early for unlike primitive values
      if (a === a &&
          !(a && objectTypes[type]) &&
          !(b && objectTypes[otherType])) {
        return false;
      }
      // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
      // http://es5.github.io/#x15.3.4.4
      if (a == null || b == null) {
        return a === b;
      }
      // compare [[Class]] names
      var className = toString.call(a),
          otherClass = toString.call(b);

      if (className == argsClass) {
        className = objectClass;
      }
      if (otherClass == argsClass) {
        otherClass = objectClass;
      }
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          // coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
          return +a == +b;

        case numberClass:
          // treat `NaN` vs. `NaN` as equal
          return (a != +a)
            ? b != +b
            // but treat `+0` vs. `-0` as not equal
            : (a == 0 ? (1 / a == 1 / b) : a == +b);

        case regexpClass:
        case stringClass:
          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
          // treat string primitives and their corresponding object instances as equal
          return a == String(b);
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        // unwrap any `lodash` wrapped values
        var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
            bWrapped = hasOwnProperty.call(b, '__wrapped__');

        if (aWrapped || bWrapped) {
          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
        }
        // exit for functions and DOM nodes
        if (className != objectClass || (!support.nodeClass && (isNode(a) || isNode(b)))) {
          return false;
        }
        // in older versions of Opera, `arguments` objects have `Array` constructors
        var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
            ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;

        // non `Object` object instances with different constructors are not equal
        if (ctorA != ctorB &&
              !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
              ('constructor' in a && 'constructor' in b)
            ) {
          return false;
        }
      }
      // assume cyclic structures are equal
      // the algorithm for detecting cyclic structures is adapted from ES 5.1
      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var size = 0;
      result = true;

      // add `a` and `b` to the stack of traversed objects
      stackA.push(a);
      stackB.push(b);

      // recursively compare objects and arrays (susceptible to call stack limits)
      if (isArr) {
        // compare lengths to determine if a deep comparison is necessary
        length = a.length;
        size = b.length;
        result = size == length;

        if (result || isWhere) {
          // deep compare the contents, ignoring non-numeric properties
          while (size--) {
            var index = length,
                value = b[size];

            if (isWhere) {
              while (index--) {
                if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                  break;
                }
              }
            } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        }
      }
      else {
        // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
        // which, in this case, is more costly
        forIn(b, function(value, key, b) {
          if (hasOwnProperty.call(b, key)) {
            // count the number of properties.
            size++;
            // deep compare each property value.
            return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
          }
        });

        if (result && !isWhere) {
          // ensure both objects have the same number of properties
          forIn(a, function(value, key, a) {
            if (hasOwnProperty.call(a, key)) {
              // `size` will be `-1` if `a` has more properties than `b`
              return (result = --size > -1);
            }
          });
        }
      }
      stackA.pop();
      stackB.pop();

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.merge` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     */
    function baseMerge(object, source, callback, stackA, stackB) {
      (isArray(source) ? forEach : forOwn)(source, function(source, key) {
        var found,
            isArr,
            result = source,
            value = object[key];

        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
          // avoid merging previously merged cyclic sources
          var stackLength = stackA.length;
          while (stackLength--) {
            if ((found = stackA[stackLength] == source)) {
              value = stackB[stackLength];
              break;
            }
          }
          if (!found) {
            var isShallow;
            if (callback) {
              result = callback(value, source);
              if ((isShallow = typeof result != 'undefined')) {
                value = result;
              }
            }
            if (!isShallow) {
              value = isArr
                ? (isArray(value) ? value : [])
                : (isPlainObject(value) ? value : {});
            }
            // add `source` and associated `value` to the stack of traversed objects
            stackA.push(source);
            stackB.push(value);

            // recursively merge objects and arrays (susceptible to call stack limits)
            if (!isShallow) {
              baseMerge(value, source, callback, stackA, stackB);
            }
          }
        }
        else {
          if (callback) {
            result = callback(value, source);
            if (typeof result == 'undefined') {
              result = source;
            }
          }
          if (typeof result != 'undefined') {
            value = result;
          }
        }
        object[key] = value;
      });
    }

    /**
     * The base implementation of `_.random` without argument juggling or support
     * for returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns a random number.
     */
    function baseRandom(min, max) {
      return min + floor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function} [callback] The function called per iteration.
     * @returns {Array} Returns a duplicate-value-free array.
     */
    function baseUniq(array, isSorted, callback) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [];

      var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
          seen = (callback || isLarge) ? getArray() : result;

      if (isLarge) {
        var cache = createCache(seen);
        indexOf = cacheIndexOf;
        seen = cache;
      }
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;

        if (isSorted
              ? !index || seen[seen.length - 1] !== computed
              : indexOf(seen, computed) < 0
            ) {
          if (callback || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      if (isLarge) {
        releaseArray(seen.array);
        releaseObject(seen);
      } else if (callback) {
        releaseArray(seen);
      }
      return result;
    }

    /**
     * Creates a function that aggregates a collection, creating an object composed
     * of keys generated from the results of running each element of the collection
     * through a callback. The given `setter` function sets the keys and values
     * of the composed object.
     *
     * @private
     * @param {Function} setter The setter function.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter) {
      return function(collection, callback, thisArg) {
        var result = {};
        callback = lodash.createCallback(callback, thisArg, 3);

        if (isArray(collection)) {
          var index = -1,
              length = collection.length;

          while (++index < length) {
            var value = collection[index];
            setter(result, value, callback(value, index, collection), collection);
          }
        } else {
          baseEach(collection, function(value, key, collection) {
            setter(result, value, callback(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a function that, when called, either curries or invokes `func`
     * with an optional `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of method flags to compose.
     *  The bitmask may be composed of the following flags:
     *  1 - `_.bind`
     *  2 - `_.bindKey`
     *  4 - `_.curry`
     *  8 - `_.curry` (bound)
     *  16 - `_.partial`
     *  32 - `_.partialRight`
     * @param {Array} [partialArgs] An array of arguments to prepend to those
     *  provided to the new function.
     * @param {Array} [partialRightArgs] An array of arguments to append to those
     *  provided to the new function.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new function.
     */
    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          isPartial = bitmask & 16,
          isPartialRight = bitmask & 32;

      if (!isBindKey && !isFunction(func)) {
        throw new TypeError;
      }
      if (isPartial && !partialArgs.length) {
        bitmask &= ~16;
        isPartial = partialArgs = false;
      }
      if (isPartialRight && !partialRightArgs.length) {
        bitmask &= ~32;
        isPartialRight = partialRightArgs = false;
      }
      var bindData = func && func.__bindData__;
      if (bindData && bindData !== true) {
        // clone `bindData`
        bindData = slice(bindData);
        if (bindData[2]) {
          bindData[2] = slice(bindData[2]);
        }
        if (bindData[3]) {
          bindData[3] = slice(bindData[3]);
        }
        // set `thisBinding` is not previously bound
        if (isBind && !(bindData[1] & 1)) {
          bindData[4] = thisArg;
        }
        // set if previously bound but not currently (subsequent curried functions)
        if (!isBind && bindData[1] & 1) {
          bitmask |= 8;
        }
        // set curried arity if not yet set
        if (isCurry && !(bindData[1] & 4)) {
          bindData[5] = arity;
        }
        // append partial left arguments
        if (isPartial) {
          push.apply(bindData[2] || (bindData[2] = []), partialArgs);
        }
        // append partial right arguments
        if (isPartialRight) {
          unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
        }
        // merge flags
        bindData[1] |= bitmask;
        return createWrapper.apply(null, bindData);
      }
      // fast path for `_.bind`
      var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
      return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
    }

    /**
     * Creates compiled iteration functions.
     *
     * @private
     * @param {...Object} [options] The compile options object(s).
     * @param {string} [options.array] Code to determine if the iterable is an array or array-like.
     * @param {boolean} [options.useHas] Specify using `hasOwnProperty` checks in the object loop.
     * @param {Function} [options.keys] A reference to `_.keys` for use in own property iteration.
     * @param {string} [options.args] A comma separated string of iteration function arguments.
     * @param {string} [options.top] Code to execute before the iteration branches.
     * @param {string} [options.loop] Code to execute in the object loop.
     * @param {string} [options.bottom] Code to execute after the iteration branches.
     * @returns {Function} Returns the compiled function.
     */
    function createIterator() {
      // data properties
      iteratorData.shadowedProps = shadowedProps;
      iteratorData.support = support;

      // iterator options
      iteratorData.array = iteratorData.bottom = iteratorData.loop = iteratorData.top = '';
      iteratorData.init = 'iterable';
      iteratorData.useHas = true;

      // merge options into a template data object
      for (var object, index = 0; object = arguments[index]; index++) {
        for (var key in object) {
          iteratorData[key] = object[key];
        }
      }
      var args = iteratorData.args;
      iteratorData.firstArg = /^[^,]+/.exec(args)[0];

      // create the function factory
      var factory = Function(
          'baseCreateCallback, errorClass, errorProto, hasOwnProperty, ' +
          'indicatorObject, isArguments, isArray, isString, keys, objectProto, ' +
          'objectTypes, nonEnumProps, stringClass, stringProto, toString',
        'return function(' + args + ') {\n' + iteratorTemplate(iteratorData) + '\n}'
      );

      // return the compiled function
      return factory(
        baseCreateCallback, errorClass, errorProto, hasOwnProperty,
        indicatorObject, isArguments, isArray, isString, iteratorData.keys, objectProto,
        objectTypes, nonEnumProps, stringClass, stringProto, toString
      );
    }

    /**
     * Used by `escape` to convert characters to HTML entities.
     *
     * @private
     * @param {string} match The matched character to escape.
     * @returns {string} Returns the escaped character.
     */
    function escapeHtmlChar(match) {
      return htmlEscapes[match];
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized, this method returns the custom method, otherwise it returns
     * the `baseIndexOf` function.
     *
     * @private
     * @returns {Function} Returns the "indexOf" function.
     */
    function getIndexOf() {
      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
      return result;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
     */
    function isNative(value) {
      return typeof value == 'function' && reNative.test(value);
    }

    /**
     * Sets `this` binding data on a given function.
     *
     * @private
     * @param {Function} func The function to set data on.
     * @param {Array} value The data array to set.
     */
    var setBindData = !defineProperty ? noop : function(func, value) {
      descriptor.value = value;
      defineProperty(func, '__bindData__', descriptor);
    };

    /**
     * A fallback implementation of `isPlainObject` which checks if a given value
     * is an object created by the `Object` constructor, assuming objects created
     * by the `Object` constructor have no inherited enumerable properties and that
     * there are no `Object.prototype` extensions.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     */
    function shimIsPlainObject(value) {
      var ctor,
          result;

      // avoid non Object objects, `arguments` objects, and DOM elements
      if (!(value && toString.call(value) == objectClass) ||
          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor)) ||
          (!support.argsClass && isArguments(value)) ||
          (!support.nodeClass && isNode(value))) {
        return false;
      }
      // IE < 9 iterates inherited properties before own properties. If the first
      // iterated property is an object's own property then there are no inherited
      // enumerable properties.
      if (support.ownLast) {
        forIn(value, function(value, key, object) {
          result = hasOwnProperty.call(object, key);
          return false;
        });
        return result !== false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(value, key) {
        result = key;
      });
      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
    }

    /**
     * Used by `unescape` to convert HTML entities to characters.
     *
     * @private
     * @param {string} match The matched character to unescape.
     * @returns {string} Returns the unescaped character.
     */
    function unescapeHtmlChar(match) {
      return htmlUnescapes[match];
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Checks if `value` is an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
     * @example
     *
     * (function() { return _.isArguments(arguments); })(1, 2, 3);
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == argsClass || false;
    }
    // fallback for browsers that can't detect `arguments` objects by [[Class]]
    if (!support.argsClass) {
      isArguments = function(value) {
        return value && typeof value == 'object' && typeof value.length == 'number' &&
          hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee') || false;
      };
    }

    /**
     * Checks if `value` is an array.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
     * @example
     *
     * (function() { return _.isArray(arguments); })();
     * // => false
     *
     * _.isArray([1, 2, 3]);
     * // => true
     */
    var isArray = nativeIsArray || function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == arrayClass || false;
    };

    /**
     * A fallback implementation of `Object.keys` which produces an array of the
     * given object's own enumerable property names.
     *
     * @private
     * @type Function
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     */
    var shimKeys = createIterator({
      'args': 'object',
      'init': '[]',
      'top': 'if (!(objectTypes[typeof object])) return result',
      'loop': 'result.push(index)'
    });

    /**
     * Creates an array composed of the own enumerable property names of an object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     * @example
     *
     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
     * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (!isObject(object)) {
        return [];
      }
      if ((support.enumPrototypes && typeof object == 'function') ||
          (support.nonEnumArgs && object.length && isArguments(object))) {
        return shimKeys(object);
      }
      return nativeKeys(object);
    };

    /** Reusable iterator options shared by `each`, `forIn`, and `forOwn` */
    var eachIteratorOptions = {
      'args': 'collection, callback, thisArg',
      'top': "callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3)",
      'array': "typeof length == 'number'",
      'keys': keys,
      'loop': 'if (callback(iterable[index], index, collection) === false) return result'
    };

    /** Reusable iterator options for `assign` and `defaults` */
    var defaultsIteratorOptions = {
      'args': 'object, source, guard',
      'top':
        'var args = arguments,\n' +
        '    argsIndex = 0,\n' +
        "    argsLength = typeof guard == 'number' ? 2 : args.length;\n" +
        'while (++argsIndex < argsLength) {\n' +
        '  iterable = args[argsIndex];\n' +
        '  if (iterable && objectTypes[typeof iterable]) {',
      'keys': keys,
      'loop': "if (typeof result[index] == 'undefined') result[index] = iterable[index]",
      'bottom': '  }\n}'
    };

    /** Reusable iterator options for `forIn` and `forOwn` */
    var forOwnIteratorOptions = {
      'top': 'if (!objectTypes[typeof iterable]) return result;\n' + eachIteratorOptions.top,
      'array': false
    };

    /**
     * Used to convert characters to HTML entities:
     *
     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
     * don't require escaping in HTML and have no special meaning unless they're part
     * of a tag or an unquoted attribute value.
     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
     */
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    /** Used to convert HTML entities to characters */
    var htmlUnescapes = invert(htmlEscapes);

    /** Used to match HTML entities and HTML characters */
    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

    /**
     * A function compiled to iterate `arguments` objects, arrays, objects, and
     * strings consistenly across environments, executing the callback for each
     * element in the collection. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index|key, collection). Callbacks may exit
     * iteration early by explicitly returning `false`.
     *
     * @private
     * @type Function
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEach = createIterator(eachIteratorOptions);

    /*--------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources will overwrite property assignments of previous
     * sources. If a callback is provided it will be executed to produce the
     * assigned values. The callback is bound to `thisArg` and invoked with two
     * arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @type Function
     * @alias extend
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize assigning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
     * // => { 'name': 'fred', 'employer': 'slate' }
     *
     * var defaults = _.partialRight(_.assign, function(a, b) {
     *   return typeof a == 'undefined' ? b : a;
     * });
     *
     * var object = { 'name': 'barney' };
     * defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var assign = createIterator(defaultsIteratorOptions, {
      'top':
        defaultsIteratorOptions.top.replace(';',
          ';\n' +
          "if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {\n" +
          '  var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);\n' +
          "} else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {\n" +
          '  callback = args[--argsLength];\n' +
          '}'
        ),
      'loop': 'result[index] = callback ? callback(result[index], iterable[index]) : iterable[index]'
    });

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
     * be cloned, otherwise they will be assigned by reference. If a callback
     * is provided it will be executed to produce the cloned values. If the
     * callback returns `undefined` cloning will be handled by the method instead.
     * The callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var shallow = _.clone(characters);
     * shallow[0] === characters[0];
     * // => true
     *
     * var deep = _.clone(characters, true);
     * deep[0] === characters[0];
     * // => false
     *
     * _.mixin({
     *   'clone': _.partialRight(_.clone, function(value) {
     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
     *   })
     * });
     *
     * var clone = _.clone(document.body);
     * clone.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, callback, thisArg) {
      // allows working with "Collections" methods without using their `index`
      // and `collection` arguments for `isDeep` and `callback`
      if (typeof isDeep != 'boolean' && isDeep != null) {
        thisArg = callback;
        callback = isDeep;
        isDeep = false;
      }
      return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates a deep clone of `value`. If a callback is provided it will be
     * executed to produce the cloned values. If the callback returns `undefined`
     * cloning will be handled by the method instead. The callback is bound to
     * `thisArg` and invoked with one argument; (value).
     *
     * Note: This method is loosely based on the structured clone algorithm. Functions
     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var deep = _.cloneDeep(characters);
     * deep[0] === characters[0];
     * // => false
     *
     * var view = {
     *   'label': 'docs',
     *   'node': element
     * };
     *
     * var clone = _.cloneDeep(view, function(value) {
     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
     * });
     *
     * clone.node == view.node;
     * // => false
     */
    function cloneDeep(value, callback, thisArg) {
      return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? assign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional defaults of the same property will be ignored.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param- {Object} [guard] Allows working with `_.reduce` without using its
     *  `key` and `object` arguments as sources.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var object = { 'name': 'barney' };
     * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var defaults = createIterator(defaultsIteratorOptions);

    /**
     * This method is like `_.findIndex` except that it returns the key of the
     * first element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': false },
     *   'fred': {    'age': 40, 'blocked': true },
     *   'pebbles': { 'age': 1,  'blocked': false }
     * };
     *
     * _.findKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (property order is not guaranteed across environments)
     *
     * // using "_.where" callback shorthand
     * _.findKey(characters, { 'age': 1 });
     * // => 'pebbles'
     *
     * // using "_.pluck" callback shorthand
     * _.findKey(characters, 'blocked');
     * // => 'fred'
     */
    function findKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': true },
     *   'fred': {    'age': 40, 'blocked': false },
     *   'pebbles': { 'age': 1,  'blocked': true }
     * };
     *
     * _.findLastKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles`, assuming `_.findKey` returns `barney`
     *
     * // using "_.where" callback shorthand
     * _.findLastKey(characters, { 'age': 40 });
     * // => 'fred'
     *
     * // using "_.pluck" callback shorthand
     * _.findLastKey(characters, 'blocked');
     * // => 'pebbles'
     */
    function findLastKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwnRight(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over own and inherited enumerable properties of an object,
     * executing the callback for each property. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, key, object). Callbacks may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forIn(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
     */
    var forIn = createIterator(eachIteratorOptions, forOwnIteratorOptions, {
      'useHas': false
    });

    /**
     * This method is like `_.forIn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forInRight(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
     */
    function forInRight(object, callback, thisArg) {
      var pairs = [];

      forIn(object, function(value, key) {
        pairs.push(key, value);
      });

      var length = pairs.length;
      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(pairs[length--], pairs[length], object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Iterates over own enumerable properties of an object, executing the callback
     * for each property. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, key, object). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
     */
    var forOwn = createIterator(eachIteratorOptions, forOwnIteratorOptions);

    /**
     * This method is like `_.forOwn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
     */
    function forOwnRight(object, callback, thisArg) {
      var props = keys(object),
          length = props.length;

      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        var key = props[length];
        if (callback(object[key], key, object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Creates a sorted array of property names of all enumerable properties,
     * own and inherited, of `object` that have function values.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names that have function values.
     * @example
     *
     * _.functions(_);
     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
     */
    function functions(object) {
      var result = [];
      forIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }

    /**
     * Checks if the specified property name exists as a direct property of `object`,
     * instead of an inherited property.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to check.
     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
     * @example
     *
     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
     * // => true
     */
    function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    }

    /**
     * Creates an object composed of the inverted keys and values of the given object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the created inverted object.
     * @example
     *
     * _.invert({ 'first': 'fred', 'second': 'barney' });
     * // => { 'fred': 'first', 'barney': 'second' }
     */
    function invert(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        result[object[key]] = key;
      }
      return result;
    }

    /**
     * Checks if `value` is a boolean value.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
     * @example
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        value && typeof value == 'object' && toString.call(value) == boolClass || false;
    }

    /**
     * Checks if `value` is a date.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     */
    function isDate(value) {
      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     */
    function isElement(value) {
      return value && value.nodeType === 1 || false;
    }

    /**
     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
     * length of `0` and objects with no own enumerable properties are considered
     * "empty".
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({});
     * // => true
     *
     * _.isEmpty('');
     * // => true
     */
    function isEmpty(value) {
      var result = true;
      if (!value) {
        return result;
      }
      var className = toString.call(value),
          length = value.length;

      if ((className == arrayClass || className == stringClass ||
          (support.argsClass ? className == argsClass : isArguments(value))) ||
          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
        return !length;
      }
      forOwn(value, function() {
        return (result = false);
      });
      return result;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent to each other. If a callback is provided it will be executed
     * to compare values. If the callback returns `undefined` comparisons will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (a, b).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var copy = { 'name': 'fred' };
     *
     * object == copy;
     * // => false
     *
     * _.isEqual(object, copy);
     * // => true
     *
     * var words = ['hello', 'goodbye'];
     * var otherWords = ['hi', 'goodbye'];
     *
     * _.isEqual(words, otherWords, function(a, b) {
     *   var reGreet = /^(?:hello|hi)$/i,
     *       aGreet = _.isString(a) && reGreet.test(a),
     *       bGreet = _.isString(b) && reGreet.test(b);
     *
     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
     * });
     * // => true
     */
    function isEqual(a, b, callback, thisArg) {
      return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
    }

    /**
     * Checks if `value` is, or can be coerced to, a finite number.
     *
     * Note: This is not the same as native `isFinite` which will return true for
     * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
     * @example
     *
     * _.isFinite(-101);
     * // => true
     *
     * _.isFinite('10');
     * // => true
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite('');
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }

    /**
     * Checks if `value` is a function.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     */
    function isFunction(value) {
      return typeof value == 'function';
    }
    // fallback for older versions of Chrome and Safari
    if (isFunction(/x/)) {
      isFunction = function(value) {
        return typeof value == 'function' && toString.call(value) == funcClass;
      };
    }

    /**
     * Checks if `value` is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // check if the value is the ECMAScript language type of Object
      // http://es5.github.io/#x8
      // and avoid a V8 bug
      // http://code.google.com/p/v8/issues/detail?id=2291
      return !!(value && objectTypes[typeof value]);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * Note: This is not the same as native `isNaN` which will return `true` for
     * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // `NaN` as a primitive is the only value that is not equal to itself
      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(undefined);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is a number.
     *
     * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(8.4 * 5);
     * // => true
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        value && typeof value == 'object' && toString.call(value) == numberClass || false;
    }

    /**
     * Checks if `value` is an object created by the `Object` constructor.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * _.isPlainObject(new Shape);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     */
    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
      if (!(value && toString.call(value) == objectClass) || (!support.argsClass && isArguments(value))) {
        return false;
      }
      var valueOf = value.valueOf,
          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

      return objProto
        ? (value == objProto || getPrototypeOf(value) == objProto)
        : shimIsPlainObject(value);
    };

    /**
     * Checks if `value` is a regular expression.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
     * @example
     *
     * _.isRegExp(/fred/);
     * // => true
     */
    function isRegExp(value) {
      return value && objectTypes[typeof value] && toString.call(value) == regexpClass || false;
    }

    /**
     * Checks if `value` is a string.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
     * @example
     *
     * _.isString('fred');
     * // => true
     */
    function isString(value) {
      return typeof value == 'string' ||
        value && typeof value == 'object' && toString.call(value) == stringClass || false;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     */
    function isUndefined(value) {
      return typeof value == 'undefined';
    }

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new object with values of the results of each `callback` execution.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     *
     * var characters = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // using "_.pluck" callback shorthand
     * _.mapValues(characters, 'age');
     * // => { 'fred': 40, 'pebbles': 1 }
     */
    function mapValues(object, callback, thisArg) {
      var result = {};
      callback = lodash.createCallback(callback, thisArg, 3);

      forOwn(object, function(value, key, object) {
        result[key] = callback(value, key, object);
      });
      return result;
    }

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * will overwrite property assignments of previous sources. If a callback is
     * provided it will be executed to produce the merged values of the destination
     * and source properties. If the callback returns `undefined` merging will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var names = {
     *   'characters': [
     *     { 'name': 'barney' },
     *     { 'name': 'fred' }
     *   ]
     * };
     *
     * var ages = {
     *   'characters': [
     *     { 'age': 36 },
     *     { 'age': 40 }
     *   ]
     * };
     *
     * _.merge(names, ages);
     * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
     *
     * var food = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var otherFood = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(food, otherFood, function(a, b) {
     *   return _.isArray(a) ? a.concat(b) : undefined;
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
     */
    function merge(object) {
      var args = arguments,
          length = 2;

      if (!isObject(object)) {
        return object;
      }
      // allows working with `_.reduce` and `_.reduceRight` without using
      // their `index` and `collection` arguments
      if (typeof args[2] != 'number') {
        length = args.length;
      }
      if (length > 3 && typeof args[length - 2] == 'function') {
        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
      } else if (length > 2 && typeof args[length - 1] == 'function') {
        callback = args[--length];
      }
      var sources = slice(arguments, 1, length),
          index = -1,
          stackA = getArray(),
          stackB = getArray();

      while (++index < length) {
        baseMerge(object, sources[index], callback, stackA, stackB);
      }
      releaseArray(stackA);
      releaseArray(stackB);
      return object;
    }

    /**
     * Creates a shallow clone of `object` excluding the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` omitting the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The properties to omit or the
     *  function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object without the omitted properties.
     * @example
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
     * // => { 'name': 'fred' }
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
     *   return typeof value == 'number';
     * });
     * // => { 'name': 'fred' }
     */
    function omit(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var props = [];
        forIn(object, function(value, key) {
          props.push(key);
        });
        props = baseDifference(props, baseFlatten(arguments, true, false, 1));

        var index = -1,
            length = props.length;

        while (++index < length) {
          var key = props[index];
          result[key] = object[key];
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (!callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * Creates a two dimensional array of an object's key-value pairs,
     * i.e. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
     */
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates a shallow clone of `object` composed of the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` picking the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The function called per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object composed of the picked properties.
     * @example
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
     * // => { 'name': 'fred' }
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
     *   return key.charAt(0) != '_';
     * });
     * // => { 'name': 'fred' }
     */
    function pick(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var index = -1,
            props = baseFlatten(arguments, true, false, 1),
            length = isObject(object) ? props.length : 0;

        while (++index < length) {
          var key = props[index];
          if (key in object) {
            result[key] = object[key];
          }
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * An alternative to `_.reduce` this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable properties through a callback, with each callback execution
     * potentially mutating the `accumulator` object. The callback is bound to
     * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
     * Callbacks may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
     *   num *= num;
     *   if (num % 2) {
     *     return result.push(num) < 3;
     *   }
     * });
     * // => [1, 9, 25]
     *
     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     * });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function transform(object, callback, accumulator, thisArg) {
      var isArr = isArray(object);
      if (accumulator == null) {
        if (isArr) {
          accumulator = [];
        } else {
          var ctor = object && object.constructor,
              proto = ctor && ctor.prototype;

          accumulator = baseCreate(proto);
        }
      }
      if (callback) {
        callback = lodash.createCallback(callback, thisArg, 4);
        (isArr ? baseEach : forOwn)(object, function(value, index, object) {
          return callback(accumulator, value, index, object);
        });
      }
      return accumulator;
    }

    /**
     * Creates an array composed of the own enumerable property values of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property values.
     * @example
     *
     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
     * // => [1, 2, 3] (property order is not guaranteed across environments)
     */
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array of elements from the specified indexes, or keys, of the
     * `collection`. Indexes may be specified as individual arguments or as arrays
     * of indexes.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
     *   to retrieve, specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns a new array of elements corresponding to the
     *  provided indexes.
     * @example
     *
     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
     * // => ['a', 'c', 'e']
     *
     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
     * // => ['fred', 'pebbles']
     */
    function at(collection) {
      var args = arguments,
          index = -1,
          props = baseFlatten(args, true, false, 1),
          length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
          result = Array(length);

      if (support.unindexedChars && isString(collection)) {
        collection = collection.split('');
      }
      while(++index < length) {
        result[index] = collection[props[index]];
      }
      return result;
    }

    /**
     * Checks if a given value is present in a collection using strict equality
     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
     * offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @alias include
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {*} target The value to check for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
     * @example
     *
     * _.contains([1, 2, 3], 1);
     * // => true
     *
     * _.contains([1, 2, 3], 1, 2);
     * // => false
     *
     * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.contains('pebbles', 'eb');
     * // => true
     */
    function contains(collection, target, fromIndex) {
      var index = -1,
          indexOf = getIndexOf(),
          length = collection ? collection.length : 0,
          result = false;

      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
      if (isArray(collection)) {
        result = indexOf(collection, target, fromIndex) > -1;
      } else if (typeof length == 'number') {
        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
      } else {
        baseEach(collection, function(value) {
          if (++index >= fromIndex) {
            return !(result = value === target);
          }
        });
      }
      return result;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through the callback. The corresponding value
     * of each key is the number of times the key was returned by the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
    });

    /**
     * Checks if the given callback returns truey value for **all** elements of
     * a collection. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if all elements passed the callback check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes']);
     * // => false
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.every(characters, 'age');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.every(characters, { 'age': 36 });
     * // => false
     */
    function every(collection, callback, thisArg) {
      var result = true;
      callback = lodash.createCallback(callback, thisArg, 3);

      if (isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          if (!(result = !!callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        baseEach(collection, function(value, index, collection) {
          return (result = !!callback(value, index, collection));
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning an array of all elements
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that passed the callback check.
     * @example
     *
     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [2, 4, 6]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.filter(characters, 'blocked');
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     *
     * // using "_.where" callback shorthand
     * _.filter(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     */
    function filter(collection, callback, thisArg) {
      var result = [];
      callback = lodash.createCallback(callback, thisArg, 3);

      if (isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        baseEach(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning the first element that
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect, findWhere
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.find(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => { 'name': 'barney', 'age': 36, 'blocked': false }
     *
     * // using "_.where" callback shorthand
     * _.find(characters, { 'age': 1 });
     * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
     *
     * // using "_.pluck" callback shorthand
     * _.find(characters, 'blocked');
     * // => { 'name': 'fred', 'age': 40, 'blocked': true }
     */
    function find(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);

      if (isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            return value;
          }
        }
      } else {
        var result;
        baseEach(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result = value;
            return false;
          }
        });
        return result;
      }
    }

    /**
     * This method is like `_.find` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(num) {
     *   return num % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forEachRight(collection, function(value, index, collection) {
        if (callback(value, index, collection)) {
          result = value;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over elements of a collection, executing the callback for each
     * element. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * Note: As with other "Collections" methods, objects with a `length` property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
     * // => logs each number and returns '1,2,3'
     *
     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
     * // => logs each number and returns the object (property order is not guaranteed across environments)
     */
    function forEach(collection, callback, thisArg) {
      if (callback && typeof thisArg == 'undefined' && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          if (callback(collection[index], index, collection) === false) {
            break;
          }
        }
      } else {
        baseEach(collection, callback, thisArg);
      }
      return collection;
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
     * // => logs each number from right to left and returns '3,2,1'
     */
    function forEachRight(collection, callback, thisArg) {
      var iterable = collection,
          length = collection ? collection.length : 0;

      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (isArray(collection)) {
        while (length--) {
          if (callback(collection[length], length, collection) === false) {
            break;
          }
        }
      } else {
        if (typeof length != 'number') {
          var props = keys(collection);
          length = props.length;
        } else if (support.unindexedChars && isString(collection)) {
          iterable = collection.split('');
        }
        baseEach(collection, function(value, key, collection) {
          key = props ? props[--length] : --length;
          return callback(iterable[key], key, collection);
        });
      }
      return collection;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of a collection through the callback. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using "_.pluck" callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of the collection through the given callback. The corresponding
     * value of each key is the last element responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keys = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keys, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method named by `methodName` on each element in the `collection`
     * returning an array of the results of each invoked method. Additional arguments
     * will be provided to each invoked method. If `methodName` is a function it
     * will be invoked for, and `this` bound to, each element in the `collection`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|string} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [arg] Arguments to invoke the method with.
     * @returns {Array} Returns a new array of the results of each invoked method.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    function invoke(collection, methodName) {
      var args = slice(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }

    /**
     * Creates an array of values by running each element in the collection
     * through the callback. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of the results of each `callback` execution.
     * @example
     *
     * _.map([1, 2, 3], function(num) { return num * 3; });
     * // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
     * // => [3, 6, 9] (property order is not guaranteed across environments)
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(characters, 'name');
     * // => ['barney', 'fred']
     */
    function map(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      callback = lodash.createCallback(callback, thisArg, 3);
      if (isArray(collection)) {
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        baseEach(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }

    /**
     * Retrieves the maximum value of a collection. If the collection is empty or
     * falsey `-Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.max(characters, function(chr) { return chr.age; });
     * // => { 'name': 'fred', 'age': 40 };
     *
     * // using "_.pluck" callback shorthand
     * _.max(characters, 'age');
     * // => { 'name': 'fred', 'age': 40 };
     */
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        baseEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the minimum value of a collection. If the collection is empty or
     * falsey `Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.min(characters, function(chr) { return chr.age; });
     * // => { 'name': 'barney', 'age': 36 };
     *
     * // using "_.pluck" callback shorthand
     * _.min(characters, 'age');
     * // => { 'name': 'barney', 'age': 36 };
     */
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        baseEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the value of a specified property from all elements in the collection.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {string} property The name of the property to pluck.
     * @returns {Array} Returns a new array of property values.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(characters, 'name');
     * // => ['barney', 'fred']
     */
    var pluck = map;

    /**
     * Reduces a collection to a value which is the accumulated result of running
     * each element in the collection through the callback, where each successive
     * callback execution consumes the return value of the previous execution. If
     * `accumulator` is not provided the first element of the collection will be
     * used as the initial `accumulator` value. The callback is bound to `thisArg`
     * and invoked with four arguments; (accumulator, value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var sum = _.reduce([1, 2, 3], function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function reduce(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);

      if (isArray(collection)) {
        var index = -1,
            length = collection.length;

        if (noaccum) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        baseEach(collection, function(value, index, collection) {
          accumulator = noaccum
            ? (noaccum = false, value)
            : callback(accumulator, value, index, collection)
        });
      }
      return accumulator;
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var list = [[0, 1], [2, 3], [4, 5]];
     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);
      forEachRight(collection, function(value, index, collection) {
        accumulator = noaccum
          ? (noaccum = false, value)
          : callback(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The opposite of `_.filter` this method returns the elements of a
     * collection that the callback does **not** return truey for.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that failed the callback check.
     * @example
     *
     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [1, 3, 5]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.reject(characters, 'blocked');
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     *
     * // using "_.where" callback shorthand
     * _.reject(characters, { 'age': 36 });
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     */
    function reject(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);
      return filter(collection, function(value, index, collection) {
        return !callback(value, index, collection);
      });
    }

    /**
     * Retrieves a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Allows working with functions like `_.map`
     *  without using their `index` arguments as `n`.
     * @returns {Array} Returns the random sample(s) of `collection`.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (collection && typeof collection.length != 'number') {
        collection = values(collection);
      } else if (support.unindexedChars && isString(collection)) {
        collection = collection.split('');
      }
      if (n == null || guard) {
        return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
      }
      var result = shuffle(collection);
      result.length = nativeMin(nativeMax(0, n), result.length);
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates
     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns a new shuffled collection.
     * @example
     *
     * _.shuffle([1, 2, 3, 4, 5, 6]);
     * // => [4, 1, 6, 3, 5, 2]
     */
    function shuffle(collection) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        var rand = baseRandom(0, ++index);
        result[index] = result[rand];
        result[rand] = value;
      });
      return result;
    }

    /**
     * Gets the size of the `collection` by returning `collection.length` for arrays
     * and array-like objects or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns `collection.length` or number of own enumerable properties.
     * @example
     *
     * _.size([1, 2]);
     * // => 2
     *
     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
     * // => 3
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : keys(collection).length;
    }

    /**
     * Checks if the callback returns a truey value for **any** element of a
     * collection. The function returns as soon as it finds a passing value and
     * does not iterate over the entire collection. The callback is bound to
     * `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if any element passed the callback check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.some(characters, 'blocked');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.some(characters, { 'age': 1 });
     * // => false
     */
    function some(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);

      if (isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          if ((result = callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        baseEach(collection, function(value, index, collection) {
          return !(result = callback(value, index, collection));
        });
      }
      return !!result;
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through the callback. This method
     * performs a stable sort, that is, it will preserve the original sort order
     * of equal elements. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an array of property names is provided for `callback` the collection
     * will be sorted by each property value.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of sorted elements.
     * @example
     *
     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
     * // => [3, 1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'barney',  'age': 26 },
     *   { 'name': 'fred',    'age': 30 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(_.sortBy(characters, 'age'), _.values);
     * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
     *
     * // sorting by multiple properties
     * _.map(_.sortBy(characters, ['name', 'age']), _.values);
     * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
     */
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          isArr = isArray(callback),
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      if (!isArr) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      forEach(collection, function(value, key, collection) {
        var object = result[++index] = getObject();
        if (isArr) {
          object.criteria = map(callback, function(key) { return value[key]; });
        } else {
          (object.criteria = getArray())[0] = callback(value, key, collection);
        }
        object.index = index;
        object.value = value;
      });

      length = result.length;
      result.sort(compareAscending);
      while (length--) {
        var object = result[length];
        result[length] = object.value;
        if (!isArr) {
          releaseArray(object.criteria);
        }
        releaseObject(object);
      }
      return result;
    }

    /**
     * Converts the `collection` to an array.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to convert.
     * @returns {Array} Returns the new converted array.
     * @example
     *
     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
     * // => [2, 3, 4]
     */
    function toArray(collection) {
      if (collection && typeof collection.length == 'number') {
        return (support.unindexedChars && isString(collection))
          ? collection.split('')
          : slice(collection);
      }
      return values(collection);
    }

    /**
     * Performs a deep comparison of each element in a `collection` to the given
     * `properties` object, returning an array of all elements that have equivalent
     * property values.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Object} props The object of property values to filter by.
     * @returns {Array} Returns a new array of elements that have the given properties.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.where(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
     *
     * _.where(characters, { 'pets': ['dino'] });
     * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
     */
    var where = filter;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are all falsey.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to compact.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Creates an array excluding all values of the provided arrays using strict
     * equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
     * // => [1, 3, 4]
     */
    function difference(array) {
      return baseDifference(array, baseFlatten(arguments, true, true, 1));
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.findIndex(characters, function(chr) {
     *   return chr.age < 20;
     * });
     * // => 2
     *
     * // using "_.where" callback shorthand
     * _.findIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findIndex(characters, 'blocked');
     * // => 1
     */
    function findIndex(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        if (callback(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': true },
     *   { 'name': 'fred',    'age': 40, 'blocked': false },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
     * ];
     *
     * _.findLastIndex(characters, function(chr) {
     *   return chr.age > 30;
     * });
     * // => 1
     *
     * // using "_.where" callback shorthand
     * _.findLastIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findLastIndex(characters, 'blocked');
     * // => 2
     */
    function findLastIndex(array, callback, thisArg) {
      var length = array ? array.length : 0;
      callback = lodash.createCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(array[length], length, array)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Gets the first element or first `n` elements of an array. If a callback
     * is provided elements at the beginning of the array are returned as long
     * as the callback returns truey. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias head, take
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the first element(s) of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.first([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.first(characters, 'blocked');
     * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
     * // => ['barney', 'fred']
     */
    function first(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = -1;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[0] : undefined;
        }
      }
      return slice(array, 0, nativeMin(nativeMax(0, n), length));
    }

    /**
     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
     * is truey, the array will only be flattened a single level. If a callback
     * is provided each element of the array is passed through the callback before
     * flattening. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new flattened array.
     * @example
     *
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     *
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, [[4]]];
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.flatten(characters, 'pets');
     * // => ['hoppy', 'baby puss', 'dino']
     */
    function flatten(array, isShallow, callback, thisArg) {
      // juggle arguments
      if (typeof isShallow != 'boolean' && isShallow != null) {
        thisArg = callback;
        callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
        isShallow = false;
      }
      if (callback != null) {
        array = map(array, callback, thisArg);
      }
      return baseFlatten(array, isShallow);
    }

    /**
     * Gets the index at which the first occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If the array is already sorted
     * providing `true` for `fromIndex` will run a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 1
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 4
     *
     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      if (typeof fromIndex == 'number') {
        var length = array ? array.length : 0;
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
      } else if (fromIndex) {
        var index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element or last `n` elements of an array. If a
     * callback is provided elements at the end of the array are excluded from
     * the result as long as the callback returns truey. The callback is bound
     * to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     *
     * _.initial([1, 2, 3], 2);
     * // => [1]
     *
     * _.initial([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [1]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.initial(characters, 'blocked');
     * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
     * // => ['barney', 'fred']
     */
    function initial(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : callback || n;
      }
      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
    }

    /**
     * Creates an array of unique values present in all provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of shared values.
     * @example
     *
     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2]
     */
    function intersection() {
      var args = [],
          argsIndex = -1,
          argsLength = arguments.length,
          caches = getArray(),
          indexOf = getIndexOf(),
          trustIndexOf = indexOf === baseIndexOf,
          seen = getArray();

      while (++argsIndex < argsLength) {
        var value = arguments[argsIndex];
        if (isArray(value) || isArguments(value)) {
          args.push(value);
          caches.push(trustIndexOf && value.length >= largeArraySize &&
            createCache(argsIndex ? args[argsIndex] : seen));
        }
      }
      var array = args[0],
          index = -1,
          length = array ? array.length : 0,
          result = [];

      outer:
      while (++index < length) {
        var cache = caches[0];
        value = array[index];

        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
          argsIndex = argsLength;
          (cache || seen).push(value);
          while (--argsIndex) {
            cache = caches[argsIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      while (argsLength--) {
        cache = caches[argsLength];
        if (cache) {
          releaseObject(cache);
        }
      }
      releaseArray(caches);
      releaseArray(seen);
      return result;
    }

    /**
     * Gets the last element or last `n` elements of an array. If a callback is
     * provided elements at the end of the array are returned as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the last element(s) of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     *
     * _.last([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.last([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [2, 3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.last(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.last(characters, { 'employer': 'na' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function last(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[length - 1] : undefined;
        }
      }
      return slice(array, nativeMax(0, length - n));
    }

    /**
     * Gets the index at which the last occurrence of `value` is found using strict
     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
     * as the offset from the end of the collection.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 4
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from the given array using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {...*} [value] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull(array) {
      var args = arguments,
          argsIndex = 0,
          argsLength = args.length,
          length = array ? array.length : 0;

      while (++argsIndex < argsLength) {
        var index = -1,
            value = args[argsIndex];
        while (++index < length) {
          if (array[index] === value) {
            splice.call(array, index--, 1);
            length--;
          }
        }
      }
      return array;
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to but not including `end`. If `start` is less than `stop` a
     * zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns a new range array.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      start = +start || 0;
      step = typeof step == 'number' ? step : (+step || 1);

      if (end == null) {
        end = start;
        start = 0;
      }
      // use `Array(length)` so engines like Chakra and V8 avoid slower modes
      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
      var index = -1,
          length = nativeMax(0, ceil((end - start) / (step || 1))),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Removes all elements from an array that the callback returns truey for
     * and returns an array of removed elements. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4, 5, 6];
     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
     *
     * console.log(array);
     * // => [1, 3, 5]
     *
     * console.log(evens);
     * // => [2, 4, 6]
     */
    function remove(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (callback(value, index, array)) {
          result.push(value);
          splice.call(array, index--, 1);
          length--;
        }
      }
      return result;
    }

    /**
     * The opposite of `_.initial` this method gets all but the first element or
     * first `n` elements of an array. If a callback function is provided elements
     * at the beginning of the array are excluded from the result as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias drop, tail
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     *
     * _.rest([1, 2, 3], 2);
     * // => [3]
     *
     * _.rest([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.rest(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.rest(characters, { 'employer': 'slate' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function rest(array, callback, thisArg) {
      if (typeof callback != 'number' && callback != null) {
        var n = 0,
            index = -1,
            length = array ? array.length : 0;

        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
      }
      return slice(array, n);
    }

    /**
     * Uses a binary search to determine the smallest index at which a value
     * should be inserted into a given sorted array in order to maintain the sort
     * order of the array. If a callback is provided it will be executed for
     * `value` and each element of `array` to compute their sort ranking. The
     * callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([20, 30, 50], 40);
     * // => 2
     *
     * // using "_.pluck" callback shorthand
     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 2
     *
     * var dict = {
     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
     * };
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return dict.wordToNumber[word];
     * });
     * // => 2
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return this.wordToNumber[word];
     * }, dict);
     * // => 2
     */
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;

      // explicitly reference `identity` for better inlining in Firefox
      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
      value = callback(value);

      while (low < high) {
        var mid = (low + high) >>> 1;
        (callback(array[mid]) < value)
          ? low = mid + 1
          : high = mid;
      }
      return low;
    }

    /**
     * Creates an array of unique values, in order, of the provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of combined values.
     * @example
     *
     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2, 3, 5, 4]
     */
    function union() {
      return baseUniq(baseFlatten(arguments, true, true));
    }

    /**
     * Creates a duplicate-value-free version of an array using strict equality
     * for comparisons, i.e. `===`. If the array is sorted, providing
     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
     * each element of `array` is passed through the callback before uniqueness
     * is computed. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a duplicate-value-free array.
     * @example
     *
     * _.uniq([1, 2, 1, 3, 1]);
     * // => [1, 2, 3]
     *
     * _.uniq([1, 1, 2, 2, 3], true);
     * // => [1, 2, 3]
     *
     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
     * // => ['A', 'b', 'C']
     *
     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
     * // => [1, 2.5, 3]
     *
     * // using "_.pluck" callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, callback, thisArg) {
      // juggle arguments
      if (typeof isSorted != 'boolean' && isSorted != null) {
        thisArg = callback;
        callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
        isSorted = false;
      }
      if (callback != null) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      return baseUniq(array, isSorted, callback);
    }

    /**
     * Creates an array excluding all provided values using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to filter.
     * @param {...*} [value] The values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * // => [2, 3, 4]
     */
    function without(array) {
      return baseDifference(array, slice(arguments, 1));
    }

    /**
     * Creates an array that is the symmetric difference of the provided arrays.
     * See http://en.wikipedia.org/wiki/Symmetric_difference.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of values.
     * @example
     *
     * _.xor([1, 2, 3], [5, 2, 1, 4]);
     * // => [3, 5, 4]
     *
     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
     * // => [1, 4, 5]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArray(array) || isArguments(array)) {
          var result = result
            ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
            : array;
        }
      }
      return result || [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second
     * elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @alias unzip
     * @category Arrays
     * @param {...Array} [array] Arrays to process.
     * @returns {Array} Returns a new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    function zip() {
      var array = arguments.length > 1 ? arguments : arguments[0],
          index = -1,
          length = array ? max(pluck(array, 'length')) : 0,
          result = Array(length < 0 ? 0 : length);

      while (++index < length) {
        result[index] = pluck(array, index);
      }
      return result;
    }

    /**
     * Creates an object composed from arrays of `keys` and `values`. Provide
     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
     * or two arrays, one of `keys` and one of corresponding `values`.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Arrays
     * @param {Array} keys The array of keys.
     * @param {Array} [values=[]] The array of values.
     * @returns {Object} Returns an object composed of the given keys and
     *  corresponding values.
     * @example
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};

      if (!values && length && !isArray(keys[0])) {
        values = [];
      }
      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that executes `func`, with  the `this` binding and
     * arguments of the created function, only after being called `n` times.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {number} n The number of times the function must be called before
     *  `func` is executed.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('Done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'Done saving!', after all saves have completed
     */
    function after(n, func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with the `this`
     * binding of `thisArg` and prepends any additional `bind` arguments to those
     * provided to the bound function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var func = function(greeting) {
     *   return greeting + ' ' + this.name;
     * };
     *
     * func = _.bind(func, { 'name': 'fred' }, 'hi');
     * func();
     * // => 'hi fred'
     */
    function bind(func, thisArg) {
      return arguments.length > 2
        ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
        : createWrapper(func, 1, null, null, thisArg);
    }

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all the function properties
     * of `object` will be bound.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...string} [methodName] The object method names to
     *  bind, specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() { console.log('clicked ' + this.label); }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs', when the button is clicked
     */
    function bindAll(object) {
      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
          index = -1,
          length = funcs.length;

      while (++index < length) {
        var key = funcs[index];
        object[key] = createWrapper(object[key], 1, null, null, object);
      }
      return object;
    }

    /**
     * Creates a function that, when called, invokes the method at `object[key]`
     * and prepends any additional `bindKey` arguments to those provided to the bound
     * function. This method differs from `_.bind` by allowing bound functions to
     * reference methods that will be redefined or don't yet exist.
     * See http://michaux.ca/articles/lazy-function-definition-pattern.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'name': 'fred',
     *   'greet': function(greeting) {
     *     return greeting + ' ' + this.name;
     *   }
     * };
     *
     * var func = _.bindKey(object, 'greet', 'hi');
     * func();
     * // => 'hi fred'
     *
     * object.greet = function(greeting) {
     *   return greeting + 'ya ' + this.name + '!';
     * };
     *
     * func();
     * // => 'hiya fred!'
     */
    function bindKey(object, key) {
      return arguments.length > 2
        ? createWrapper(key, 19, slice(arguments, 2), null, object)
        : createWrapper(key, 3, null, null, object);
    }

    /**
     * Creates a function that is the composition of the provided functions,
     * where each function consumes the return value of the function that follows.
     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
     * Each function is executed with the `this` binding of the composed function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {...Function} [func] Functions to compose.
     * @returns {Function} Returns the new composed function.
     * @example
     *
     * var realNameMap = {
     *   'pebbles': 'penelope'
     * };
     *
     * var format = function(name) {
     *   name = realNameMap[name.toLowerCase()] || name;
     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
     * };
     *
     * var greet = function(formatted) {
     *   return 'Hiya ' + formatted + '!';
     * };
     *
     * var welcome = _.compose(greet, format);
     * welcome('pebbles');
     * // => 'Hiya Penelope!'
     */
    function compose() {
      var funcs = arguments,
          length = funcs.length;

      while (length--) {
        if (!isFunction(funcs[length])) {
          throw new TypeError;
        }
      }
      return function() {
        var args = arguments,
            length = funcs.length;

        while (length--) {
          args = [funcs[length].apply(this, args)];
        }
        return args[0];
      };
    }

    /**
     * Creates a function which accepts one or more arguments of `func` that when
     * invoked either executes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` can be specified
     * if `func.length` is not sufficient.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var curried = _.curry(function(a, b, c) {
     *   console.log(a + b + c);
     * });
     *
     * curried(1)(2)(3);
     * // => 6
     *
     * curried(1, 2)(3);
     * // => 6
     *
     * curried(1, 2, 3);
     * // => 6
     */
    function curry(func, arity) {
      arity = typeof arity == 'number' ? arity : (+arity || func.length);
      return createWrapper(func, 4, null, null, null, arity);
    }

    /**
     * Creates a function that will delay the execution of `func` until after
     * `wait` milliseconds have elapsed since the last time it was invoked.
     * Provide an options object to indicate that `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
     * to the debounced function will return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to debounce.
     * @param {number} wait The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * var lazyLayout = _.debounce(calculateLayout, 150);
     * jQuery(window).on('resize', lazyLayout);
     *
     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * });
     *
     * // ensure `batchLog` is executed once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * source.addEventListener('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }, false);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      wait = nativeMax(0, wait) || 0;
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      var delayed = function() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0) {
          if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
          }
          var isCalled = trailingCall;
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
          }
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      };

      var maxDelayed = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (trailing || (maxWait !== wait)) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = null;
          }
        }
      };

      return function() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
        return result;
      };
    }

    /**
     * Defers executing the `func` function until the current call stack has cleared.
     * Additional arguments will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to defer.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) { console.log(text); }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    function defer(func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 1);
      return setTimeout(function() { func.apply(undefined, args); }, 1);
    }

    /**
     * Executes the `func` function after `wait` milliseconds. Additional arguments
     * will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay execution.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) { console.log(text); }, 1000, 'later');
     * // => logs 'later' after one second
     */
    function delay(func, wait) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 2);
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it will be used to determine the cache key for storing the result
     * based on the arguments provided to the memoized function. By default, the
     * first argument provided to the memoized function is used as the cache key.
     * The `func` is executed with the `this` binding of the memoized function.
     * The result cache is exposed as the `cache` property on the memoized function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] A function used to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var fibonacci = _.memoize(function(n) {
     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     * });
     *
     * fibonacci(9)
     * // => 34
     *
     * var data = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // modifying the result cache
     * var get = _.memoize(function(name) { return data[name]; }, _.identity);
     * get('pebbles');
     * // => { 'name': 'pebbles', 'age': 1 }
     *
     * get.cache.pebbles.name = 'penelope';
     * get('pebbles');
     * // => { 'name': 'penelope', 'age': 1 }
     */
    function memoize(func, resolver) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var memoized = function() {
        var cache = memoized.cache,
            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

        return hasOwnProperty.call(cache, key)
          ? cache[key]
          : (cache[key] = func.apply(this, arguments));
      }
      memoized.cache = {};
      return memoized;
    }

    /**
     * Creates a function that is restricted to execute `func` once. Repeat calls to
     * the function will return the value of the first call. The `func` is executed
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` executes `createApplication` once
     */
    function once(func) {
      var ran,
          result;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);

        // clear the `func` variable so the function may be garbage collected
        func = null;
        return result;
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with any additional
     * `partial` arguments prepended to those provided to the new function. This
     * method is similar to `_.bind` except it does **not** alter the `this` binding.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) { return greeting + ' ' + name; };
     * var hi = _.partial(greet, 'hi');
     * hi('fred');
     * // => 'hi fred'
     */
    function partial(func) {
      return createWrapper(func, 16, slice(arguments, 1));
    }

    /**
     * This method is like `_.partial` except that `partial` arguments are
     * appended to those provided to the new function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
     *
     * var options = {
     *   'variable': 'data',
     *   'imports': { 'jq': $ }
     * };
     *
     * defaultsDeep(options, _.templateSettings);
     *
     * options.variable
     * // => 'data'
     *
     * options.imports
     * // => { '_': _, 'jq': $ }
     */
    function partialRight(func) {
      return createWrapper(func, 32, null, slice(arguments, 1));
    }

    /**
     * Creates a function that, when executed, will only call the `func` function
     * at most once per every `wait` milliseconds. Provide an options object to
     * indicate that `func` should be invoked on the leading and/or trailing edge
     * of the `wait` timeout. Subsequent calls to the throttled function will
     * return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to throttle.
     * @param {number} wait The number of milliseconds to throttle executions to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * var throttled = _.throttle(updatePosition, 100);
     * jQuery(window).on('scroll', throttled);
     *
     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? options.leading : leading;
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      debounceOptions.leading = leading;
      debounceOptions.maxWait = wait;
      debounceOptions.trailing = trailing;

      return debounce(func, wait, debounceOptions);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Additional arguments provided to the function are appended
     * to those provided to the wrapper function. The wrapper is executed with
     * the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('Fred, Wilma, & Pebbles');
     * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
     */
    function wrap(value, wrapper) {
      return createWrapper(wrapper, 16, [value]);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var getter = _.constant(object);
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Produces a callback bound to an optional `thisArg`. If `func` is a property
     * name the created callback will return the property value for a given element.
     * If `func` is an object the created callback will return `true` for elements
     * that contain the equivalent object properties, otherwise it will return `false`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
     *   return !match ? func(callback, thisArg) : function(object) {
     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(characters, 'age__gt38');
     * // => [{ 'name': 'fred', 'age': 40 }]
     */
    function createCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (func == null || type == 'function') {
        return baseCreateCallback(func, thisArg, argCount);
      }
      // handle "_.pluck" style callback shorthands
      if (type != 'object') {
        return property(func);
      }
      var props = keys(func),
          key = props[0],
          a = func[key];

      // handle "_.where" style callback shorthands
      if (props.length == 1 && a === a && !isObject(a)) {
        // fast path the common case of providing an object with a single
        // property containing a primitive value
        return function(object) {
          var b = object[key];
          return a === b && (a !== 0 || (1 / a == 1 / b));
        };
      }
      return function(object) {
        var length = props.length,
            result = false;

        while (length--) {
          if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
            break;
          }
        }
        return result;
      };
    }

    /**
     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
     * corresponding HTML entities.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('Fred, Wilma, & Pebbles');
     * // => 'Fred, Wilma, &amp; Pebbles'
     */
    function escape(string) {
      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Adds function properties of a source object to the destination object.
     * If `object` is a function methods will be added to its prototype as well.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Function|Object} [object=lodash] object The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
     * @example
     *
     * function capitalize(string) {
     *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
     * }
     *
     * _.mixin({ 'capitalize': capitalize });
     * _.capitalize('fred');
     * // => 'Fred'
     *
     * _('fred').capitalize().value();
     * // => 'Fred'
     *
     * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
     * _('fred').capitalize();
     * // => 'Fred'
     */
    function mixin(object, source, options) {
      var chain = true,
          methodNames = source && functions(source);

      if (!source || (!options && !methodNames.length)) {
        if (options == null) {
          options = source;
        }
        ctor = lodashWrapper;
        source = object;
        object = lodash;
        methodNames = functions(source);
      }
      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      var ctor = object,
          isFunc = isFunction(ctor);

      forEach(methodNames, function(methodName) {
        var func = object[methodName] = source[methodName];
        if (isFunc) {
          ctor.prototype[methodName] = function() {
            var chainAll = this.__chain__,
                value = this.__wrapped__,
                args = [value];

            push.apply(args, arguments);
            var result = func.apply(object, args);
            if (chain || chainAll) {
              if (value === result && isObject(result)) {
                return this;
              }
              result = new ctor(result);
              result.__chain__ = chainAll;
            }
            return result;
          };
        }
      });
    }

    /**
     * Reverts the '_' variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      context._ = oldDash;
      return this;
    }

    /**
     * A no-operation function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // no operation performed
    }

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var stamp = _.now();
     * _.defer(function() { console.log(_.now() - stamp); });
     * // => logs the number of milliseconds it took for the deferred function to be called
     */
    var now = isNative(now = Date.now) && now || function() {
      return new Date().getTime();
    };

    /**
     * Converts the given value into an integer of the specified radix.
     * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
     *
     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
     * implementations. See http://es5.github.io/#E.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} value The value to parse.
     * @param {number} [radix] The radix used to interpret the value to parse.
     * @returns {number} Returns the new integer value.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     */
    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
      // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
    };

    /**
     * Creates a "_.pluck" style function, which returns the `key` value of a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} key The name of the property to retrieve.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var characters = [
     *   { 'name': 'fred',   'age': 40 },
     *   { 'name': 'barney', 'age': 36 }
     * ];
     *
     * var getName = _.property('name');
     *
     * _.map(characters, getName);
     * // => ['barney', 'fred']
     *
     * _.sortBy(characters, getName);
     * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
     */
    function property(key) {
      return function(object) {
        return object[key];
      };
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number will be
     * returned. If `floating` is truey or either `min` or `max` are floats a
     * floating-point number will be returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating=false] Specify returning a floating-point number.
     * @returns {number} Returns a random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (typeof min == 'boolean' && noMax) {
          floating = min;
          min = 1;
        }
        else if (!noMax && typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /**
     * Resolves the value of property `key` on `object`. If `key` is a function
     * it will be invoked with the `this` binding of `object` and its result returned,
     * else the property value is returned. If `object` is falsey then `undefined`
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to resolve.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = {
     *   'cheese': 'crumpets',
     *   'stuff': function() {
     *     return 'nonsense';
     *   }
     * };
     *
     * _.result(object, 'cheese');
     * // => 'crumpets'
     *
     * _.result(object, 'stuff');
     * // => 'nonsense'
     */
    function result(object, key) {
      if (object) {
        var value = object[key];
        return isFunction(value) ? object[key]() : value;
      }
    }

    /**
     * A micro-templating method that handles arbitrary delimiters, preserves
     * whitespace, and correctly escapes quotes within interpolated code.
     *
     * Note: In the development build, `_.template` utilizes sourceURLs for easier
     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
     *
     * For more information on precompiling templates see:
     * http://lodash.com/custom-builds
     *
     * For more information on Chrome extension sandboxes see:
     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} text The template text.
     * @param {Object} data The data object used to populate the text.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as local variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [variable] The data object variable name.
     * @returns {Function|string} Returns a compiled function when no `data` object
     *  is given, else it returns the interpolated text.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= name %>');
     * compiled({ 'name': 'fred' });
     * // => 'hello fred'
     *
     * // using the "escape" delimiter to escape HTML in data property values
     * _.template('<b><%- value %></b>', { 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to generate HTML
     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
     * _.template('hello ${ name }', { 'name': 'pebbles' });
     * // => 'hello pebbles'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
     * // => 'hello barney!'
     *
     * // using a custom template delimiters
     * _.templateSettings = {
     *   'interpolate': /{{([\s\S]+?)}}/g
     * };
     *
     * _.template('hello {{ name }}!', { 'name': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using the `imports` option to import jQuery
     * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     *   var __t, __p = '', __e = _.escape;
     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
     *   return __p;
     * }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(text, data, options) {
      // based on John Resig's `tmpl` implementation
      // http://ejohn.org/blog/javascript-micro-templating/
      // and Laura Doktorova's doT.js
      // https://github.com/olado/doT
      var settings = lodash.templateSettings;
      text = String(text || '');

      // avoid missing dependencies when `iteratorTemplate` is not defined
      options = iteratorTemplate ? defaults({}, options, settings) : settings;

      var imports = iteratorTemplate && defaults({}, options.imports, settings.imports),
          importsKeys = iteratorTemplate ? keys(imports) : ['_'],
          importsValues = iteratorTemplate ? values(imports) : [lodash];

      var isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // compile the regexp to match each delimiter
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // escape characters that cannot be included in string literals
        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // replace delimiters with snippets
        if (escapeValue) {
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // the JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value
        return match;
      });

      source += "';\n";

      // if `variable` is not specified, wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain
      var variable = options.variable,
          hasVariable = variable;

      if (!hasVariable) {
        variable = 'obj';
        source = 'with (' + variable + ') {\n' + source + '\n}\n';
      }
      // cleanup code by stripping empty strings
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // frame code as the function body
      source = 'function(' + variable + ') {\n' +
        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
        "var __t, __p = '', __e = _.escape" +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      // Use a sourceURL for easier debugging.
      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

      try {
        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
      } catch(e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      // provide the compiled function's source by its `toString` method, in
      // supported environments, or the `source` property as a convenience for
      // inlining compiled templates during the build process
      result.source = source;
      return result;
    }

    /**
     * Executes the callback `n` times, returning an array of the results
     * of each callback execution. The callback is bound to `thisArg` and invoked
     * with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} n The number of times to execute the callback.
     * @param {Function} callback The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns an array of the results of each `callback` execution.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) { mage.castSpell(n); });
     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
     *
     * _.times(3, function(n) { this.cast(n); }, mage);
     * // => also calls `mage.castSpell(n)` three times
     */
    function times(n, callback, thisArg) {
      n = (n = +n) > -1 ? n : 0;
      var index = -1,
          result = Array(n);

      callback = baseCreateCallback(callback, thisArg, 1);
      while (++index < n) {
        result[index] = callback(index);
      }
      return result;
    }

    /**
     * The inverse of `_.escape` this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
     * corresponding characters.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('Fred, Barney &amp; Pebbles');
     * // => 'Fred, Barney & Pebbles'
     */
    function unescape(string) {
      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return String(prefix == null ? '' : prefix) + id;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps the given value with explicit
     * method chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(characters)
     *     .sortBy('age')
     *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
     *     .first()
     *     .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      value = new lodashWrapper(value);
      value.__chain__ = true;
      return value;
    }

    /**
     * Invokes `interceptor` with the `value` as the first argument and then
     * returns `value`. The purpose of this method is to "tap into" a method
     * chain in order to perform operations on intermediate results within
     * the chain.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3, 4])
     *  .tap(function(array) { array.pop(); })
     *  .reverse()
     *  .value();
     * // => [3, 2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chaining
     * @returns {*} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(characters).first();
     * // => { 'name': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(characters).chain()
     *   .first()
     *   .pick('age')
     *   .value();
     * // => { 'age': 36 }
     */
    function wrapperChain() {
      this.__chain__ = true;
      return this;
    }

    /**
     * Produces the `toString` result of the wrapped value.
     *
     * @name toString
     * @memberOf _
     * @category Chaining
     * @returns {string} Returns the string result.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return String(this.__wrapped__);
    }

    /**
     * Extracts the wrapped value.
     *
     * @name valueOf
     * @memberOf _
     * @alias value
     * @category Chaining
     * @returns {*} Returns the wrapped value.
     * @example
     *
     * _([1, 2, 3]).valueOf();
     * // => [1, 2, 3]
     */
    function wrapperValueOf() {
      return this.__wrapped__;
    }

    /*--------------------------------------------------------------------------*/

    // add functions that return wrapped values when chaining
    lodash.after = after;
    lodash.assign = assign;
    lodash.at = at;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.chain = chain;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.createCallback = createCallback;
    lodash.curry = curry;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.map = map;
    lodash.mapValues = mapValues;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.min = min;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.pull = pull;
    lodash.range = range;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.values = values;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;

    // add aliases
    lodash.collect = map;
    lodash.drop = rest;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    lodash.unzip = zip;

    // add functions to `lodash.prototype`
    mixin(lodash);

    /*--------------------------------------------------------------------------*/

    // add functions that return unwrapped values when chaining
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.contains = contains;
    lodash.escape = escape;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.result = result;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.template = template;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;

    // add aliases
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.findWhere = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;

    mixin(function() {
      var source = {}
      forOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }(), false);

    /*--------------------------------------------------------------------------*/

    // add functions capable of returning wrapped and unwrapped values when chaining
    lodash.first = first;
    lodash.last = last;
    lodash.sample = sample;

    // add aliases
    lodash.take = first;
    lodash.head = first;

    forOwn(lodash, function(func, methodName) {
      var callbackable = methodName !== 'sample';
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName]= function(n, guard) {
          var chainAll = this.__chain__,
              result = func(this.__wrapped__, n, guard);

          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
            ? result
            : new lodashWrapper(result, chainAll);
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = '2.4.1';

    // add "Chaining" functions to the wrapper
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.value = wrapperValueOf;
    lodash.prototype.valueOf = wrapperValueOf;

    // add `Array` functions that return unwrapped values
    baseEach(['join', 'pop', 'shift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            result = func.apply(this.__wrapped__, arguments);

        return chainAll
          ? new lodashWrapper(result, chainAll)
          : result;
      };
    });

    // add `Array` functions that return the existing wrapped value
    baseEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        func.apply(this.__wrapped__, arguments);
        return this;
      };
    });

    // add `Array` functions that return new wrapped values
    baseEach(['concat', 'slice', 'splice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
      };
    });

    // avoid array-like object bugs with `Array#shift` and `Array#splice`
    // in IE < 9, Firefox < 10, Narwhal, and RingoJS
    if (!support.spliceObjects) {
      baseEach(['pop', 'shift', 'splice'], function(methodName) {
        var func = arrayRef[methodName],
            isSplice = methodName == 'splice';

        lodash.prototype[methodName] = function() {
          var chainAll = this.__chain__,
              value = this.__wrapped__,
              result = func.apply(value, arguments);

          if (value.length === 0) {
            delete value[0];
          }
          return (chainAll || isSplice)
            ? new lodashWrapper(result, chainAll)
            : result;
        };
      });
    }

    // add pseudo private property to be used and removed during the build process
    lodash._baseEach = baseEach;
    lodash._iteratorTemplate = iteratorTemplate;
    lodash._shimKeys = shimKeys;

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  var _ = runInContext();

  // some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash is loaded with a RequireJS shim config.
    // See http://requirejs.org/docs/api.html#config-shim
    root._ = _;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return _;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // in Narwhal or Rhino -require
    else {
      freeExports._ = _;
    }
  }
  else {
    // in a browser or Rhino
    root._ = _;
  }
}.call(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"lodash":[function(_dereq_,module,exports){
module.exports=_dereq_('4HJaAd');
},{}],6:[function(_dereq_,module,exports){
(function() {
  var Delta, InsertOp, Op, RetainOp, diff_match_patch, dmp, _;

  _ = _dereq_('lodash');

  diff_match_patch = _dereq_('./diff_match_patch');

  Op = _dereq_('./op');

  InsertOp = _dereq_('./insert');

  RetainOp = _dereq_('./retain');

  dmp = new diff_match_patch();

  Delta = (function() {
    var _insertInsertCase, _retainRetainCase;

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
          if (!(Op.isRetain(op) || Op.isInsert(op))) {
            return false;
          }
        }
        return true;
      }
      return false;
    };

    Delta.makeDelta = function(obj) {
      return new Delta(obj.startLength, obj.endLength, _.map(obj.ops, function(op) {
        if (Op.isInsert(op)) {
          return new InsertOp(op.value, op.attributes);
        } else if (Op.isRetain(op)) {
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
        if (Op.isRetain(op)) {
          return op;
        } else if (Op.isInsert(op)) {
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
      var index, offset, retains;
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
      _.each(this.ops, (function(_this) {
        return function(op) {
          if (Op.isInsert(op)) {
            insertFn.call(context, index + offset, op.value, op.attributes);
            return offset += op.getLength();
          } else if (Op.isRetain(op)) {
            if (op.start > index) {
              deleteFn.call(context, index + offset, op.start - index);
              offset -= op.start - index;
            }
            retains.push(new RetainOp(op.start + offset, op.end + offset, op.attributes));
            return index = op.end;
          }
        };
      })(this));
      if (this.endLength < this.startLength + offset) {
        deleteFn.call(context, this.endLength, this.startLength + offset - this.endLength);
      }
      return _.each(retains, (function(_this) {
        return function(op) {
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
        };
      })(this));
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
        if (Op.isInsert(op)) {
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
          if (Op.isInsert(last) && Op.isInsert(op) && last.attributesMatch(op)) {
            return compacted[compacted.length - 1] = new InsertOp(last.value + op.value, op.attributes);
          } else if (Op.isRetain(last) && Op.isRetain(op) && last.end === op.start && last.attributesMatch(op)) {
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
        if (Op.isInsert(opInB)) {
          composed.push(opInB);
        } else if (Op.isRetain(opInB)) {
          opsInRange = deltaA.getOpsAt(opInB.start, opInB.getLength());
          opsInRange = _.map(opsInRange, function(opInA) {
            if (Op.isInsert(opInA)) {
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
        return Op.isInsert(op);
      }))) {
        throw new Error("DeltaA has retain in decompose");
      }
      if (!_.all(deltaC.ops, (function(op) {
        return Op.isInsert(op);
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
          if (Op.isInsert(op)) {
            d = new InsertOp(op.value.substring(offsetC, offsetC + opInC.getLength()), opInC.attributes);
            ops.push(d);
          } else if (Op.isRetain(op)) {
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

    _insertInsertCase = function(elemA, elemB, indexes, aIsRemote) {
      var length, results;
      results = _.extend({}, indexes);
      length = Math.min(elemA.getLength(), elemB.getLength());
      if (aIsRemote) {
        results.transformOp = new RetainOp(results.indexA, results.indexA + length);
        results.indexA += length;
        if (length === elemA.getLength()) {
          results.elemIndexA++;
        } else if (length < elemA.getLength()) {
          results.elemA = _.last(elemA.split(length));
        } else {
          throw new Error("Invalid elem length in transform");
        }
      } else {
        results.transformOp = _.first(elemB.split(length));
        results.indexB += length;
        if (length === elemB.getLength()) {
          results.elemIndexB++;
        } else {
          results.elemB = _.last(elemB.split(length));
        }
      }
      return results;
    };

    _retainRetainCase = function(elemA, elemB, indexes) {
      var addedAttributes, elemIndexA, elemIndexB, errMsg, indexA, indexB, length, results;
      indexA = indexes.indexA, indexB = indexes.indexB, elemIndexA = indexes.elemIndexA, elemIndexB = indexes.elemIndexB;
      results = _.extend({}, indexes);
      if (elemA.end < elemB.start) {
        results.indexA += elemA.getLength();
        results.elemIndexA++;
      } else if (elemB.end < elemA.start) {
        results.indexB += elemB.getLength();
        results.elemIndexB++;
      } else {
        if (elemA.start < elemB.start) {
          results.indexA += elemB.start - elemA.start;
          elemA = results.elemA = new RetainOp(elemB.start, elemA.end, elemA.attributes);
        } else if (elemB.start < elemA.start) {
          results.indexB += elemA.start - elemB.start;
          elemB = results.elemB = new RetainOp(elemA.start, elemB.end, elemB.attributes);
        }
        errMsg = "RetainOps must have same start length in transform";
        if (elemA.start !== elemB.start) {
          throw new Error(errMsg);
        }
        length = Math.min(elemA.end, elemB.end) - elemA.start;
        addedAttributes = elemA.addAttributes(elemB.attributes);
        results.transformOp = new RetainOp(results.indexA, results.indexA + length, addedAttributes);
        results.indexA += length;
        results.indexB += length;
        if (elemA.end === elemB.end) {
          results.elemIndexA++;
          results.elemIndexB++;
        } else if (elemA.end < elemB.end) {
          results.elemIndexA++;
          results.elemB = _.last(elemB.split(length));
        } else {
          results.elemIndexB++;
          results.elemA = _.last(elemA.split(length));
        }
      }
      if (results.elemIndexA !== indexes.elemIndexA) {
        results.elemA = null;
      }
      if (results.elemIndexB !== indexes.elemIndexB) {
        results.elemB = null;
      }
      return results;
    };

    Delta.prototype.transform = function(deltaA, aIsRemote) {
      var deltaB, elemA, elemB, elemIndexA, elemIndexB, errMsg, indexA, indexB, results, transformEndLength, transformOps, transformStartLength, _applyResults, _buildIndexes;
      if (aIsRemote == null) {
        aIsRemote = false;
      }
      if (!Delta.isDelta(deltaA)) {
        errMsg = "Transform called when deltaA is not a Delta, type: ";
        throw new Error(errMsg + typeof deltaA);
      }
      deltaA = new Delta(deltaA.startLength, deltaA.endLength, deltaA.ops);
      deltaB = new Delta(this.startLength, this.endLength, this.ops);
      transformOps = [];
      indexA = indexB = 0;
      elemIndexA = elemIndexB = 0;
      _applyResults = function(results) {
        if (results.indexA != null) {
          indexA = results.indexA;
        }
        if (results.indexB != null) {
          indexB = results.indexB;
        }
        if (results.elemIndexA != null) {
          elemIndexA = results.elemIndexA;
        }
        if (results.elemIndexB != null) {
          elemIndexB = results.elemIndexB;
        }
        if (results.elemA != null) {
          deltaA.ops[elemIndexA] = results.elemA;
        }
        if (results.elemB != null) {
          deltaB.ops[elemIndexB] = results.elemB;
        }
        if (results.transformOp != null) {
          return transformOps.push(results.transformOp);
        }
      };
      _buildIndexes = function() {
        return {
          indexA: indexA,
          indexB: indexB,
          elemIndexA: elemIndexA,
          elemIndexB: elemIndexB
        };
      };
      while (elemIndexA < deltaA.ops.length && elemIndexB < deltaB.ops.length) {
        elemA = deltaA.ops[elemIndexA];
        elemB = deltaB.ops[elemIndexB];
        if (Op.isInsert(elemA) && Op.isInsert(elemB)) {
          results = _insertInsertCase(elemA, elemB, _buildIndexes(), aIsRemote);
          _applyResults(results);
        } else if (Op.isRetain(elemA) && Op.isRetain(elemB)) {
          results = _retainRetainCase(elemA, elemB, _buildIndexes());
          _applyResults(results);
        } else if (Op.isInsert(elemA) && Op.isRetain(elemB)) {
          transformOps.push(new RetainOp(indexA, indexA + elemA.getLength()));
          indexA += elemA.getLength();
          elemIndexA++;
        } else if (Op.isRetain(elemA) && Op.isInsert(elemB)) {
          transformOps.push(elemB);
          indexB += elemB.getLength();
          elemIndexB++;
        }
      }
      while (elemIndexA < deltaA.ops.length) {
        elemA = deltaA.ops[elemIndexA];
        if (Op.isInsert(elemA)) {
          transformOps.push(new RetainOp(indexA, indexA + elemA.getLength()));
        }
        indexA += elemA.getLength();
        elemIndexA++;
      }
      while (elemIndexB < deltaB.ops.length) {
        elemB = deltaB.ops[elemIndexB];
        if (Op.isInsert(elemB)) {
          transformOps.push(elemB);
        }
        indexB += elemB.getLength();
        elemIndexB++;
      }
      transformStartLength = deltaA.endLength;
      transformEndLength = _.reduce(transformOps, function(transformEndLength, op) {
        return transformEndLength + op.getLength();
      }, 0);
      return new Delta(transformStartLength, transformEndLength, transformOps);
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
          if (!Op.isRetain(op)) {
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
        return Op.isInsert(op);
      });
    };

    Delta.prototype.merge = function(other) {
      var ops;
      ops = _.map(other.ops, (function(_this) {
        return function(op) {
          if (Op.isRetain(op)) {
            return new RetainOp(op.start + _this.startLength, op.end + _this.startLength, op.attributes);
          } else {
            return op;
          }
        };
      })(this));
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

}).call(this);

},{"./diff_match_patch":8,"./insert":9,"./op":10,"./retain":11,"lodash":"4HJaAd"}],7:[function(_dereq_,module,exports){
(function() {
  var Delta, DeltaGenerator, InsertOp, RetainOp, getUtils, setDomain, _, _domain;

  _ = _dereq_('lodash');

  Delta = _dereq_('./delta');

  InsertOp = _dereq_('./insert');

  RetainOp = _dereq_('./retain');

  _domain = {
    alphabet: "abcdefghijklmnopqrstuvwxyz\n\n\n\n  ",
    booleanAttributes: {
      'bold': [true, false],
      'italic': [true, false],
      'strike': [true, false]
    },
    nonBooleanAttributes: {
      'back-color': ['white', 'black', 'red', 'blue', 'lime', 'teal', 'magenta', 'yellow'],
      'fore-color': ['white', 'black', 'red', 'blue', 'lime', 'teal', 'magenta', 'yellow'],
      'font-name': ['monospace', 'serif'],
      'font-size': ['huge', 'large', 'small']
    },
    defaultAttributeValue: {
      'back-color': 'white',
      'fore-color': 'black',
      'font-name': 'san-serif',
      'font-size': 'normal'
    }
  };

  setDomain = function(domain) {
    if (domain != null) {
      return _domain = domain;
    }
  };

  getUtils = function(domain) {
    domain = domain || _domain;
    if (domain == null) {
      throw new Error("Must provide DeltaGenerator with a domain.");
    }
    if (domain.alphabet == null) {
      throw new Error("Domain must define alphabet.");
    }
    if (domain.booleanAttributes == null) {
      throw new Error("Domain must define booleanAttributes.");
    }
    if (domain.nonBooleanAttributes == null) {
      throw new Error("Domain must define nonBooleanAttributes.");
    }
    if (domain.defaultAttributeValue == null) {
      throw new Error("Domain must define defaultAttributeValue.");
    }
    return {
      getDomain: function(domain) {
        return _domain;
      },
      getRandomString: function(length) {
        var _i, _ref, _results;
        return _.map((function() {
          _results = [];
          for (var _i = 0, _ref = length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this), function() {
          return domain.alphabet[_.random(0, domain.alphabet.length - 1)];
        }).join('');
      },
      getRandomLength: function() {
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
      },
      insertAt: function(delta, insertionPoint, insertions) {
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
      },
      deleteAt: function(delta, deletionPoint, numToDelete) {
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
            if (InsertOp.isInsert(op)) {
              newText = op.value.substring(0, deletionPoint - charIndex) + op.value.substring(deletionPoint - charIndex + curDelete);
              if (newText.length > 0) {
                ops.push(new InsertOp(newText));
              }
            } else {
              if (!RetainOp.isRetain(op)) {
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
      },
      formatAt: function(delta, formatPoint, numToFormat, attrs, reference) {
        var attr, charIndex, cur, curFormat, head, op, ops, reachedFormatPoint, tail, _formatBooleanAttribute, _formatNonBooleanAttribute, _i, _j, _len, _len1, _limitScope, _ref, _ref1, _splitOpInThree;
        _splitOpInThree = function(elem, splitAt, length, reference) {
          var cur, curStr, head, headStr, marker, newCur, op, origOps, tail, tailStr, _i, _len;
          if (InsertOp.isInsert(elem)) {
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
            if (!RetainOp.isRetain(elem)) {
              throw new Error("Expected retain but got " + elem);
            }
            head = new RetainOp(elem.start, elem.start + splitAt, _.clone(elem.attributes));
            cur = new RetainOp(head.end, head.end + length, _.clone(elem.attributes));
            tail = new RetainOp(cur.end, elem.end, _.clone(elem.attributes));
            origOps = reference.getOpsAt(cur.start, cur.getLength());
            if (!_.every(origOps, function(op) {
              return InsertOp.isInsert(op);
            })) {
              throw new Error("Non insert op in backref");
            }
            marker = cur.start;
            for (_i = 0, _len = origOps.length; _i < _len; _i++) {
              op = origOps[_i];
              if (InsertOp.isInsert(op)) {
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
        _limitScope = function(op, tail, attr, referenceOps) {
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
        _formatBooleanAttribute = function(op, tail, attr, reference) {
          var referenceOps;
          if (InsertOp.isInsert(op)) {
            if (op.attributes[attr] != null) {
              return delete op.attributes[attr];
            } else {
              return op.attributes[attr] = true;
            }
          } else {
            if (!RetainOp.isRetain(op)) {
              throw new Error("Expected retain but got " + op);
            }
            if (op.attributes[attr] != null) {
              return delete op.attributes[attr];
            } else {
              referenceOps = reference.getOpsAt(op.start, op.getLength());
              if (!_.every(referenceOps, function(op) {
                return InsertOp.isInsert(op);
              })) {
                throw new Error("Formatting a retain that does not refer to an insert.");
              }
              if (referenceOps.length > 0) {
                _limitScope(op, tail, attr, referenceOps);
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
        _formatNonBooleanAttribute = (function(_this) {
          return function(op, tail, attr, reference) {
            var getNewAttrVal, referenceOps;
            getNewAttrVal = function(prevVal) {
              if (prevVal != null) {
                return _.first(_.shuffle(_.without(domain.nonBooleanAttributes[attr], prevVal)));
              } else {
                return _.first(_.shuffle(_.without(domain.nonBooleanAttributes[attr], domain.defaultAttributeValue[attr])));
              }
            };
            if (InsertOp.isInsert(op)) {
              return op.attributes[attr] = getNewAttrVal(attr, op.attributes[attr]);
            } else {
              if (!RetainOp.isRetain(op)) {
                throw new Error("Expected retain but got " + op);
              }
              referenceOps = reference.getOpsAt(op.start, op.getLength());
              if (!_.every(referenceOps, function(op) {
                return InsertOp.isInsert(op);
              })) {
                throw new Error("Formatting a retain that does not refer to an insert.");
              }
              if (referenceOps.length > 0) {
                _limitScope(op, tail, attr, referenceOps);
                if ((op.attributes[attr] != null) && Math.random() < 0.5) {
                  return delete op.attributes[attr];
                } else {
                  return op.attributes[attr] = getNewAttrVal(op.attributes[attr]);
                }
              }
            }
          };
        })(this);
        charIndex = 0;
        ops = [];
        _ref = delta.ops;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          op = _ref[_i];
          reachedFormatPoint = charIndex === formatPoint || charIndex + op.getLength() > formatPoint;
          if (numToFormat > 0 && reachedFormatPoint) {
            curFormat = Math.min(numToFormat, op.getLength() - (formatPoint - charIndex));
            numToFormat -= curFormat;
            _ref1 = _splitOpInThree(op, formatPoint - charIndex, curFormat, reference), head = _ref1[0], cur = _ref1[1], tail = _ref1[2];
            ops.push(head);
            ops.push(cur);
            ops.push(tail);
            for (_j = 0, _len1 = attrs.length; _j < _len1; _j++) {
              attr = attrs[_j];
              if (_.has(domain.booleanAttributes, attr)) {
                _formatBooleanAttribute(cur, tail, attr, reference);
              } else if (_.has(domain.nonBooleanAttributes, attr)) {
                _formatNonBooleanAttribute(cur, tail, attr, reference);
              } else {
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
      },
      addRandomOp: function(newDelta, referenceDelta) {
        var attrs, finalIndex, numAttrs, opIndex, opLength, rand, shuffled_attrs;
        finalIndex = referenceDelta.endLength - 1;
        opIndex = _.random(0, finalIndex);
        rand = Math.random();
        if (rand < 0.5) {
          opLength = this.getRandomLength();
          this.insertAt(newDelta, opIndex, this.getRandomString(opLength));
        } else if (rand < 0.75) {
          if (referenceDelta.endLength <= 1) {
            return newDelta;
          }
          opIndex = _.random(0, finalIndex - 1);
          opLength = _.random(1, finalIndex - opIndex);
          this.deleteAt(newDelta, opIndex, opLength);
        } else {
          shuffled_attrs = _.shuffle(_.keys(domain.booleanAttributes).concat(_.keys(domain.nonBooleanAttributes)));
          numAttrs = _.random(1, shuffled_attrs.length);
          attrs = shuffled_attrs.slice(0, numAttrs);
          opLength = _.random(1, finalIndex - opIndex);
          this.formatAt(newDelta, opIndex, opLength, attrs, referenceDelta);
        }
        return newDelta;
      },
      getRandomDelta: function(referenceDelta, numOps) {
        var i, newDelta, _i;
        newDelta = new Delta(referenceDelta.endLength, referenceDelta.endLength, [new RetainOp(0, referenceDelta.endLength)]);
        numOps || (numOps = _.random(1, 10));
        for (i = _i = 0; 0 <= numOps ? _i < numOps : _i > numOps; i = 0 <= numOps ? ++_i : --_i) {
          this.addRandomOp(newDelta, referenceDelta);
        }
        return newDelta;
      }
    };
  };

  DeltaGenerator = {
    setDomain: setDomain,
    getUtils: getUtils
  };

  module.exports = DeltaGenerator;

}).call(this);

},{"./delta":6,"./insert":9,"./retain":11,"lodash":"4HJaAd"}],8:[function(_dereq_,module,exports){
(function() {
  var googlediff;

  googlediff = _dereq_('googlediff');

  googlediff.DIFF_DELETE = -1;

  googlediff.DIFF_INSERT = 1;

  googlediff.DIFF_EQUAL = 0;

  module.exports = googlediff;

}).call(this);

},{"googlediff":14}],9:[function(_dereq_,module,exports){
(function() {
  var InsertOp, Op, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = _dereq_('lodash');

  Op = _dereq_('./op');

  InsertOp = (function(_super) {
    __extends(InsertOp, _super);

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

}).call(this);

},{"./op":10,"lodash":"4HJaAd"}],10:[function(_dereq_,module,exports){
(function() {
  var Op, _;

  _ = _dereq_('lodash');

  Op = (function() {
    Op.isInsert = function(i) {
      return (i != null) && typeof i.value === "string";
    };

    Op.isRetain = function(r) {
      return (r != null) && typeof r.start === "number" && typeof r.end === "number";
    };

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
      var resolveAttributes;
      resolveAttributes = (function(_this) {
        return function(oldAttrs, newAttrs) {
          var key, resolvedAttrs, value;
          if (!newAttrs) {
            return oldAttrs;
          }
          resolvedAttrs = _.clone(oldAttrs);
          for (key in newAttrs) {
            value = newAttrs[key];
            if (Op.isInsert(_this) && value === null) {
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
      })(this);
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

}).call(this);

},{"lodash":"4HJaAd"}],11:[function(_dereq_,module,exports){
(function() {
  var Op, RetainOp, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = _dereq_('lodash');

  Op = _dereq_('./op');

  RetainOp = (function(_super) {
    __extends(RetainOp, _super);

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

}).call(this);

},{"./op":10,"lodash":"4HJaAd"}],"tandem-core":[function(_dereq_,module,exports){
module.exports=_dereq_('38mxji');
},{}],"38mxji":[function(_dereq_,module,exports){
(function() {
  module.exports = {
    Delta: _dereq_('./delta'),
    DeltaGen: _dereq_('./delta_generator'),
    Op: _dereq_('./op'),
    InsertOp: _dereq_('./insert'),
    RetainOp: _dereq_('./retain')
  };

}).call(this);

},{"./delta":6,"./delta_generator":7,"./insert":9,"./op":10,"./retain":11}],14:[function(_dereq_,module,exports){
module.exports = _dereq_('./javascript/diff_match_patch_uncompressed.js').diff_match_patch;

},{"./javascript/diff_match_patch_uncompressed.js":15}],15:[function(_dereq_,module,exports){
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
this['diff_match_patch'] = diff_match_patch;
this['DIFF_DELETE'] = DIFF_DELETE;
this['DIFF_INSERT'] = DIFF_INSERT;
this['DIFF_EQUAL'] = DIFF_EQUAL;

},{}],"Fq7WE+":[function(_dereq_,module,exports){
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

},{}],"underscore.string":[function(_dereq_,module,exports){
module.exports=_dereq_('Fq7WE+');
},{}],18:[function(_dereq_,module,exports){
module.exports={
  "name": "quilljs",
  "version": "0.15.1",
  "description": "Cross browser rich text editor",
  "author": "Jason Chen <jhchen7@gmail.com>",
  "homepage": "http://quilljs.com",
  "contributors": [
    "Byron Milligan <byronner@gmail.com>",
    "Keegan Poppen <keegan.poppen@gmail.com>"
  ],
  "main": "index.js",
  "dependencies": {
    "eventemitter2": "~0.4.13",
    "lodash": "~2.4.1",
    "tandem-core": "~0.6.1",
    "underscore.string": "~2.3.3"
  },
  "devDependencies": {
    "async": "~0.9.0",
    "coffeeify": "~0.6.0",
    "grunt": "~0.4.3",
    "grunt-browserify": "~2.1.0",
    "grunt-contrib-clean": "~0.5.0",
    "grunt-contrib-coffee": "~0.10.1",
    "grunt-contrib-concat": "~0.4.0",
    "grunt-contrib-connect": "~0.7.1",
    "grunt-contrib-jade": "~0.11.0",
    "grunt-contrib-stylus": "~0.16.0",
    "grunt-contrib-uglify": "~0.4.0",
    "grunt-contrib-watch": "~0.6.1",
    "grunt-karma": "~0.8.0",
    "grunt-newer": "~0.7.0",
    "grunt-protractor-runner": "~0.2.4",
    "grunt-shell": "~0.7.0",
    "istanbul": "~0.2.6",
    "jquery": "~1.11.0",
    "karma": "~0.12.0",
    "karma-chrome-launcher": "~0.1.2",
    "karma-coffee-preprocessor": "~0.2.1",
    "karma-coverage": "~0.2.0",
    "karma-firefox-launcher": "~0.1.3",
    "karma-html2js-preprocessor": "~0.1.0",
    "karma-jasmine": "~0.2.0",
    "karma-phantomjs-launcher": "~0.1.2",
    "karma-safari-launcher": "~0.1.1",
    "karma-sauce-launcher": "~0.2.2",
    "load-grunt-tasks": "~0.4.0",
    "protractor": "~0.23.0"
  },
  "engines": {
    "node": ">=0.10"
  },
  "license": "BSD-3-Clause",
  "repository": {
    "type": "git",
    "url": "https://github.com/quilljs/quill"
  },
  "bugs": {
    "url": "https://github.com/quilljs/quill/issues"
  },
  "scripts": {
    "prepublish": "grunt coffee:src",
    "postpublish": "grunt clean:coffee",
    "test": "grunt test"
  },
  "keywords": ["editor", "rich text", "wysiwyg"]
}

},{}],19:[function(_dereq_,module,exports){
var DOM, Document, Format, Line, LinkedList, Normalizer, Tandem, Utils, _;

_ = _dereq_('lodash');

DOM = _dereq_('./dom');

Format = _dereq_('./format');

Line = _dereq_('./line');

LinkedList = _dereq_('./lib/linked-list');

Normalizer = _dereq_('./normalizer');

Utils = _dereq_('./utils');

Tandem = _dereq_('tandem-core');

Document = (function() {
  function Document(root, options) {
    this.root = root;
    if (options == null) {
      options = {};
    }
    this.formats = {};
    _.each(options.formats, _.bind(this.addFormat, this));
    this.setHTML(this.root.innerHTML);
  }

  Document.prototype.addFormat = function(name, config) {
    if (!_.isObject(config)) {
      config = Format.FORMATS[name];
    }
    if (this.formats[name] != null) {
      console.warn('Overwriting format', name, this.formats[name]);
    }
    return this.formats[name] = new Format(this.root.ownerDocument, config);
  };

  Document.prototype.appendLine = function(lineNode) {
    return this.insertLineBefore(lineNode, null);
  };

  Document.prototype.findLeafAt = function(index, inclusive) {
    var line, offset, _ref;
    _ref = this.findLineAt(index), line = _ref[0], offset = _ref[1];
    if (line != null) {
      return line.findLeafAt(offset, inclusive);
    } else {
      return [null, offset];
    }
  };

  Document.prototype.findLine = function(node) {
    var line;
    while ((node != null) && (DOM.BLOCK_TAGS[node.tagName] == null)) {
      node = node.parentNode;
    }
    line = node != null ? this.lineMap[node.id] : null;
    if ((line != null ? line.node : void 0) === node) {
      return line;
    } else {
      return null;
    }
  };

  Document.prototype.findLineAt = function(index) {
    var curLine, length;
    if (!(this.lines.length > 0)) {
      return [null, index];
    }
    length = this.toDelta().endLength;
    if (index === length) {
      return [this.lines.last, this.lines.last.length];
    }
    if (index > length) {
      return [null, index - length];
    }
    curLine = this.lines.first;
    while (curLine != null) {
      if (index < curLine.length) {
        return [curLine, index];
      }
      index -= curLine.length;
      curLine = curLine.next;
    }
    return [null, index];
  };

  Document.prototype.insertLineBefore = function(newLineNode, refLine) {
    var line;
    line = new Line(this, newLineNode);
    if (refLine != null) {
      if (!DOM.isElement(newLineNode.parentNode)) {
        this.root.insertBefore(newLineNode, refLine.node);
      }
      this.lines.insertAfter(refLine.prev, line);
    } else {
      if (!DOM.isElement(newLineNode.parentNode)) {
        this.root.appendChild(newLineNode);
      }
      this.lines.append(line);
    }
    this.lineMap[line.id] = line;
    return line;
  };

  Document.prototype.mergeLines = function(line, lineToMerge) {
    if (lineToMerge.length > 1) {
      if (line.length === 1) {
        DOM.removeNode(line.leaves.last.node);
      }
      _.each(DOM.getChildNodes(lineToMerge.node), function(child) {
        if (child.tagName !== DOM.DEFAULT_BREAK_TAG) {
          return line.node.appendChild(child);
        }
      });
    }
    this.removeLine(lineToMerge);
    return line.rebuild();
  };

  Document.prototype.optimizeLines = function() {
    return _.each(this.lines.toArray(), function(line, i) {
      line.optimize();
      return true;
    });
  };

  Document.prototype.rebuild = function() {
    var lineNode, lines, _results;
    lines = this.lines.toArray();
    lineNode = this.root.firstChild;
    if ((lineNode != null) && (DOM.LIST_TAGS[lineNode.tagName] != null)) {
      lineNode = lineNode.firstChild;
    }
    _.each(lines, (function(_this) {
      return function(line, index) {
        var newLine, _ref;
        while (line.node !== lineNode) {
          if (line.node.parentNode === _this.root || ((_ref = line.node.parentNode) != null ? _ref.parentNode : void 0) === _this.root) {
            lineNode = Normalizer.normalizeLine(lineNode);
            newLine = _this.insertLineBefore(lineNode, line);
            lineNode = Utils.getNextLineNode(lineNode, _this.root);
          } else {
            return _this.removeLine(line);
          }
        }
        if (line.outerHTML !== lineNode.outerHTML) {
          line.node = Normalizer.normalizeLine(line.node);
          line.rebuild();
        }
        return lineNode = Utils.getNextLineNode(lineNode, _this.root);
      };
    })(this));
    _results = [];
    while (lineNode != null) {
      lineNode = Normalizer.normalizeLine(lineNode);
      this.appendLine(lineNode);
      _results.push(lineNode = Utils.getNextLineNode(lineNode, this.root));
    }
    return _results;
  };

  Document.prototype.removeLine = function(line) {
    if (line.node.parentNode != null) {
      if (DOM.LIST_TAGS[line.node.parentNode.tagName] && line.node.parentNode.childNodes.length === 1) {
        DOM.removeNode(line.node.parentNode);
      } else {
        DOM.removeNode(line.node);
      }
    }
    delete this.lineMap[line.id];
    return this.lines.remove(line);
  };

  Document.prototype.setHTML = function(html) {
    html = Normalizer.stripComments(html);
    html = Normalizer.stripWhitespace(html);
    this.root.innerHTML = html;
    this.lines = new LinkedList();
    this.lineMap = {};
    return this.rebuild();
  };

  Document.prototype.splitLine = function(line, offset) {
    var lineNode1, lineNode2, newLine, _ref;
    offset = Math.min(offset, line.length - 1);
    _ref = Utils.splitNode(line.node, offset, true), lineNode1 = _ref[0], lineNode2 = _ref[1];
    line.node = lineNode1;
    line.rebuild();
    newLine = this.insertLineBefore(lineNode2, line.next);
    newLine.formats = _.clone(line.formats);
    newLine.resetContent();
    return newLine;
  };

  Document.prototype.toDelta = function() {
    var lines, ops;
    lines = this.lines.toArray();
    ops = _.flatten(_.map(lines, function(line) {
      return _.clone(line.delta.ops);
    }), true);
    return new Tandem.Delta(0, ops);
  };

  return Document;

})();

module.exports = Document;


},{"./dom":20,"./format":22,"./lib/linked-list":25,"./line":28,"./normalizer":38,"./utils":44,"lodash":"4HJaAd","tandem-core":"38mxji"}],20:[function(_dereq_,module,exports){
var DOM, lastKeyEvent, _;

_ = _dereq_('lodash');

_.str = _dereq_('underscore.string');

lastKeyEvent = null;

DOM = {
  ELEMENT_NODE: 1,
  NOBREAK_SPACE: "&nbsp;",
  TEXT_NODE: 3,
  ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF",
  DEFAULT_BLOCK_TAG: 'P',
  DEFAULT_BREAK_TAG: 'BR',
  DEFAULT_INLINE_TAG: 'SPAN',
  EMBED_TEXT: '!',
  FONT_SIZES: {
    '10px': 1,
    '13px': 2,
    '16px': 3,
    '18px': 4,
    '24px': 5,
    '32px': 6,
    '48px': 7
  },
  KEYS: {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  },
  BLOCK_TAGS: {
    'ADDRESS': 'ADDRESS',
    'ARTICLE': 'ARTICLE',
    'ASIDE': 'ASIDE',
    'AUDIO': 'AUDIO',
    'BLOCKQUOTE': 'BLOCKQUOTE',
    'CANVAS': 'CANVAS',
    'DD': 'DD',
    'DIV': 'DIV',
    'DL': 'DL',
    'FIGCAPTION': 'FIGCAPTION',
    'FIGURE': 'FIGURE',
    'FOOTER': 'FOOTER',
    'FORM': 'FORM',
    'H1': 'H1',
    'H2': 'H2',
    'H3': 'H3',
    'H4': 'H4',
    'H5': 'H5',
    'H6': 'H6',
    'HEADER': 'HEADER',
    'HGROUP': 'HGROUP',
    'LI': 'LI',
    'OL': 'OL',
    'OUTPUT': 'OUTPUT',
    'P': 'P',
    'PRE': 'PRE',
    'SECTION': 'SECTION',
    'TABLE': 'TABLE',
    'TBODY': 'TBODY',
    'TD': 'TD',
    'TFOOT': 'TFOOT',
    'TH': 'TH',
    'THEAD': 'THEAD',
    'TR': 'TR',
    'UL': 'UL',
    'VIDEO': 'VIDEO'
  },
  EMBED_TAGS: {
    'IMG': 'IMG'
  },
  LIST_TAGS: {
    'OL': 'OL',
    'UL': 'UL'
  },
  VOID_TAGS: {
    'AREA': 'AREA',
    'BASE': 'BASE',
    'BR': 'BR',
    'COL': 'COL',
    'COMMAND': 'COMMAND',
    'EMBED': 'EMBED',
    'HR': 'HR',
    'IMG': 'IMG',
    'INPUT': 'INPUT',
    'KEYGEN': 'KEYGEN',
    'LINK': 'LINK',
    'META': 'META',
    'PARAM': 'PARAM',
    'SOURCE': 'SOURCE',
    'TRACK': 'TRACK',
    'WBR': 'WBR'
  },
  addClass: function(node, cssClass) {
    if (DOM.hasClass(node, cssClass)) {
      return;
    }
    if (node.classList != null) {
      return node.classList.add(cssClass);
    } else if (node.className != null) {
      return node.className = _.str.trim(node.className + ' ' + cssClass);
    }
  },
  addEventListener: function(node, eventName, listener) {
    return node.addEventListener(eventName, function(event) {
      var arg, propogate;
      arg = lastKeyEvent && (eventName === 'keydown' || eventName === 'keyup') ? lastKeyEvent : event;
      propogate = listener(arg);
      if (!propogate) {
        event.preventDefault();
        event.stopPropagation();
      }
      return propogate;
    });
  },
  addStyles: function(node, styles) {
    styles = _.defaults(styles, DOM.getStyles(node));
    return DOM.setStyles(node, styles);
  },
  clearAttributes: function(node, exception) {
    if (exception == null) {
      exception = [];
    }
    if (_.isString(exception)) {
      exception = [exception];
    }
    return _.each(DOM.getAttributes(node), function(value, name) {
      if (!(_.indexOf(exception, name) > -1)) {
        return node.removeAttribute(name);
      }
    });
  },
  getAttributes: function(node) {
    var attr, attributes, i, value, _i, _len, _ref;
    if (node.attributes == null) {
      return {};
    }
    attributes = {};
    _ref = node.attributes;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      value = _ref[i];
      attr = node.attributes[i];
      attributes[attr.name] = attr.value;
    }
    return attributes;
  },
  getChildNodes: function(parent) {
    return _.map(parent.childNodes);
  },
  getChildren: function(parent) {
    return _.map(parent.children);
  },
  getDescendants: function(parent) {
    return _.map(parent.getElementsByTagName('*'));
  },
  getClasses: function(node) {
    return node.className.split(/\s+/);
  },
  getDefaultOption: function(select) {
    return select.querySelector('option[selected]');
  },
  getSelectValue: function(select) {
    if (select.selectedIndex > -1) {
      return select.options[select.selectedIndex].value;
    } else {
      return '';
    }
  },
  getStyles: function(node) {
    var obj, styleString;
    styleString = node.getAttribute('style') || '';
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
  },
  getText: function(node) {
    switch (node.nodeType) {
      case DOM.ELEMENT_NODE:
        if (node.tagName === DOM.DEFAULT_BREAK_TAG) {
          return "";
        }
        if (DOM.EMBED_TAGS[node.tagName] != null) {
          return DOM.EMBED_TEXT;
        }
        if (node.textContent != null) {
          return node.textContent;
        }
        return "";
      case DOM.TEXT_NODE:
        return node.data || "";
      default:
        return "";
    }
  },
  getTextNodes: function(root) {
    var node, nodes, walker;
    walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    nodes = [];
    while (node = walker.nextNode()) {
      nodes.push(node);
    }
    return nodes;
  },
  getWindow: function(node) {
    return node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
  },
  hasClass: function(node, cssClass) {
    if (node.classList != null) {
      return node.classList.contains(cssClass);
    } else if (node.className != null) {
      return _.indexOf(DOM.getClasses(node), cssClass) > -1;
    }
    return false;
  },
  isElement: function(node) {
    return (node != null ? node.nodeType : void 0) === DOM.ELEMENT_NODE;
  },
  isTextNode: function(node) {
    return (node != null ? node.nodeType : void 0) === DOM.TEXT_NODE;
  },
  moveChildren: function(newParent, oldParent) {
    return _.each(DOM.getChildNodes(oldParent), function(child) {
      return newParent.appendChild(child);
    });
  },
  normalize: function(node) {
    var curNode, newText, nextNode, _results;
    curNode = node.firstChild;
    _results = [];
    while (curNode != null) {
      nextNode = curNode.nextSibling;
      if (DOM.isTextNode(curNode)) {
        if (DOM.getText(curNode).length === 0) {
          DOM.removeNode(curNode);
        } else if (DOM.isTextNode(nextNode)) {
          nextNode = nextNode.nextSibling;
          newText = DOM.getText(curNode) + DOM.getText(curNode.nextSibling);
          DOM.setText(curNode, newText);
          DOM.removeNode(curNode.nextSibling);
        }
      }
      _results.push(curNode = nextNode);
    }
    return _results;
  },
  isIE: function(maxVersion) {
    var version;
    version = document.documentMode;
    return version && maxVersion >= version;
  },
  isIOS: function() {
    return /iPhone|iPad/i.test(navigator.userAgent);
  },
  removeClass: function(node, cssClass) {
    var classArray;
    if (!DOM.hasClass(node, cssClass)) {
      return;
    }
    if (node.classList != null) {
      return node.classList.remove(cssClass);
    } else if (node.className != null) {
      classArray = DOM.getClasses(node);
      classArray.splice(_.indexOf(classArray, cssClass), 1);
      return node.className = classArray.join(' ');
    }
  },
  removeNode: function(node) {
    var _ref;
    return (_ref = node.parentNode) != null ? _ref.removeChild(node) : void 0;
  },
  replaceNode: function(newNode, oldNode) {
    oldNode.parentNode.replaceChild(newNode, oldNode);
    return newNode;
  },
  resetSelect: function(select, trigger) {
    var option;
    if (trigger == null) {
      trigger = true;
    }
    option = DOM.getDefaultOption(select);
    if (option != null) {
      option.selected = true;
    } else {
      select.selectedIndex = 0;
    }
    if (trigger) {
      return DOM.triggerEvent(select, 'change');
    }
  },
  selectOption: function(select, option, trigger) {
    var value;
    if (trigger == null) {
      trigger = true;
    }
    value = _.isElement(option) ? option.value : option;
    if (value) {
      select.value = value;
    } else {
      select.selectedIndex = -1;
    }
    if (trigger) {
      return DOM.triggerEvent(select, 'change');
    }
  },
  setAttributes: function(node, attributes) {
    return _.each(attributes, function(value, name) {
      return node.setAttribute(name, value);
    });
  },
  setStyles: function(node, styles) {
    var styleString;
    styleString = _.map(styles, function(style, name) {
      return "" + name + ": " + style;
    }).join('; ') + ';';
    return node.setAttribute('style', styleString);
  },
  setText: function(node, text) {
    switch (node.nodeType) {
      case DOM.ELEMENT_NODE:
        return node.textContent = text;
      case DOM.TEXT_NODE:
        return node.data = text;
    }
  },
  switchTag: function(node, newTag) {
    var attributes, newNode;
    newTag = newTag.toUpperCase();
    if (node.tagName === newTag) {
      return node;
    }
    newNode = node.ownerDocument.createElement(newTag);
    attributes = DOM.getAttributes(node);
    if (DOM.VOID_TAGS[newTag] == null) {
      this.moveChildren(newNode, node);
    }
    node.parentNode.replaceChild(newNode, node);
    _.each(attributes, function(value, name) {
      return newNode.setAttribute(name, value);
    });
    return newNode;
  },
  toggleClass: function(node, className, state) {
    if (state == null) {
      state = !DOM.hasClass(node, className);
    }
    if (state) {
      return DOM.addClass(node, className);
    } else {
      return DOM.removeClass(node, className);
    }
  },
  triggerEvent: function(elem, eventName, options) {
    var event, initFn, modifiers;
    if (options == null) {
      options = {};
    }
    if (_.indexOf(['keypress', 'keydown', 'keyup'], eventName) < 0) {
      event = elem.ownerDocument.createEvent('Event');
      event.initEvent(eventName, options.bubbles, options.cancelable);
    } else {
      event = elem.ownerDocument.createEvent('KeyboardEvent');
      lastKeyEvent = _.clone(options);
      if (_.isNumber(options.key)) {
        lastKeyEvent.which = options.key;
      } else if (_.isString(options.key)) {
        lastKeyEvent.which = options.key.toUpperCase().charCodeAt(0);
      } else {
        lastKeyEvent.which = 0;
      }
      if (DOM.isIE(10)) {
        modifiers = [];
        if (options.altKey) {
          modifiers.push('Alt');
        }
        if (options.ctrlKey) {
          modifiers.push('Control');
        }
        if (options.metaKey) {
          modifiers.push('Meta');
        }
        if (options.shiftKey) {
          modifiers.push('Shift');
        }
        event.initKeyboardEvent(eventName, options.bubbles, options.cancelable, elem.ownerDocument.defaultView.window, 0, 0, modifiers.join(' '), null, null);
      } else {
        initFn = _.isFunction(event.initKeyboardEvent) ? 'initKeyboardEvent' : 'initKeyEvent';
        event[initFn](eventName, options.bubbles, options.cancelable, elem.ownerDocument.defaultView.window, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 0, 0);
      }
    }
    elem.dispatchEvent(event);
    return lastKeyEvent = null;
  },
  unwrap: function(node) {
    var next, ret;
    ret = node.firstChild;
    next = node.nextSibling;
    _.each(DOM.getChildNodes(node), function(child) {
      return node.parentNode.insertBefore(child, next);
    });
    DOM.removeNode(node);
    return ret;
  },
  wrap: function(wrapper, node) {
    var parent;
    if (node.parentNode != null) {
      node.parentNode.insertBefore(wrapper, node);
    }
    parent = wrapper;
    while (parent.firstChild != null) {
      parent = wrapper.firstChild;
    }
    parent.appendChild(node);
    return parent;
  }
};

module.exports = DOM;


},{"lodash":"4HJaAd","underscore.string":"Fq7WE+"}],21:[function(_dereq_,module,exports){
var DOM, Document, Editor, Line, Renderer, Selection, Tandem, _;

_ = _dereq_('lodash');

DOM = _dereq_('./dom');

Document = _dereq_('./document');

Line = _dereq_('./line');

Renderer = _dereq_('./renderer');

Selection = _dereq_('./selection');

Tandem = _dereq_('tandem-core');

Editor = (function() {
  function Editor(iframeContainer, quill, options) {
    this.iframeContainer = iframeContainer;
    this.quill = quill;
    this.options = options != null ? options : {};
    this.renderer = new Renderer(this.iframeContainer, this.options);
    this.root = this.renderer.root;
    this.doc = new Document(this.root, this.options);
    this.delta = this.doc.toDelta();
    this.selection = new Selection(this.doc, this.renderer.iframe, this.quill);
    this.timer = setInterval(_.bind(this.checkUpdate, this), this.options.pollInterval);
    this.quill.on(this.quill.constructor.events.SELECTION_CHANGE, (function(_this) {
      return function(range) {
        return _this.savedRange = range;
      };
    })(this));
    if (!this.options.readOnly) {
      this.enable();
    }
  }

  Editor.prototype.disable = function() {
    return this.enable(false);
  };

  Editor.prototype.enable = function(enabled) {
    if (enabled == null) {
      enabled = true;
    }
    return this.root.setAttribute('contenteditable', enabled);
  };

  Editor.prototype.applyDelta = function(delta, source) {
    var localDelta, tempDelta;
    localDelta = this._update();
    if (localDelta) {
      tempDelta = localDelta;
      localDelta = localDelta.transform(delta, true);
      delta = delta.transform(tempDelta, false);
      this.delta = this.doc.toDelta();
    }
    if (!delta.isIdentity()) {
      if (delta.startLength !== this.delta.endLength) {
        console.warn("Trying to apply delta to incorrect doc length", delta, this.delta);
      }
      delta = this._trackDelta((function(_this) {
        return function() {
          delta.apply(_this._insertAt, _this._deleteAt, _this._formatAt, _this);
          return _this.selection.shiftAfter(0, 0, _.bind(_this.doc.optimizeLines, _this.doc));
        };
      })(this));
      this.delta = this.doc.toDelta();
      this.innerHTML = this.root.innerHTML;
      if (delta && source !== 'silent') {
        this.quill.emit(this.quill.constructor.events.TEXT_CHANGE, delta, source);
      }
    }
    if (localDelta && !localDelta.isIdentity() && source !== 'silent') {
      return this.quill.emit(this.quill.constructor.events.TEXT_CHANGE, localDelta, 'user');
    }
  };

  Editor.prototype.checkUpdate = function(source) {
    var delta, oldDelta;
    if (source == null) {
      source = 'user';
    }
    if ((this.renderer.iframe.parentNode == null) || (this.root.parentNode == null)) {
      return clearInterval(this.timer);
    }
    delta = this._update();
    if (delta) {
      oldDelta = this.delta;
      this.delta = oldDelta.compose(delta);
      this.quill.emit(this.quill.constructor.events.TEXT_CHANGE, delta, source);
    }
    if (delta) {
      source = 'silent';
    }
    return this.selection.update(source);
  };

  Editor.prototype.getDelta = function() {
    return this.delta;
  };

  Editor.prototype._deleteAt = function(index, length) {
    if (length <= 0) {
      return;
    }
    return this.selection.shiftAfter(index, -1 * length, (function(_this) {
      return function() {
        var curLine, deleteLength, firstLine, mergeFirstLine, nextLine, offset, _ref;
        _ref = _this.doc.findLineAt(index), firstLine = _ref[0], offset = _ref[1];
        curLine = firstLine;
        mergeFirstLine = firstLine.length - offset <= length && offset > 0;
        while ((curLine != null) && length > 0) {
          nextLine = curLine.next;
          deleteLength = Math.min(curLine.length - offset, length);
          if (offset === 0 && length >= curLine.length) {
            _this.doc.removeLine(curLine);
          } else {
            curLine.deleteText(offset, deleteLength);
          }
          length -= deleteLength;
          curLine = nextLine;
          offset = 0;
        }
        if (mergeFirstLine && firstLine.next) {
          return _this.doc.mergeLines(firstLine, firstLine.next);
        }
      };
    })(this));
  };

  Editor.prototype._formatAt = function(index, length, name, value) {
    return this.selection.shiftAfter(index, 0, (function(_this) {
      return function() {
        var formatLength, line, offset, _ref, _results;
        _ref = _this.doc.findLineAt(index), line = _ref[0], offset = _ref[1];
        _results = [];
        while ((line != null) && length > 0) {
          formatLength = Math.min(length, line.length - offset - 1);
          line.formatText(offset, formatLength, name, value);
          length -= formatLength;
          if (length > 0) {
            line.format(name, value);
          }
          length -= 1;
          offset = 0;
          _results.push(line = line.next);
        }
        return _results;
      };
    })(this));
  };

  Editor.prototype._insertAt = function(index, text, formatting) {
    if (formatting == null) {
      formatting = {};
    }
    return this.selection.shiftAfter(index, text.length, (function(_this) {
      return function() {
        var line, lineTexts, offset, _ref;
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        lineTexts = text.split('\n');
        _ref = _this.doc.findLineAt(index), line = _ref[0], offset = _ref[1];
        return _.each(lineTexts, function(lineText, i) {
          var nextLine;
          if ((line == null) || line.length <= offset) {
            if (i < lineTexts.length - 1 || lineText.length > 0) {
              line = _this.doc.appendLine(_this.root.ownerDocument.createElement(DOM.DEFAULT_BLOCK_TAG));
              offset = 0;
              line.insertText(offset, lineText, formatting);
              line.format(formatting);
              nextLine = null;
            }
          } else {
            line.insertText(offset, lineText, formatting);
            if (i < lineTexts.length - 1) {
              nextLine = _this.doc.splitLine(line, offset + lineText.length);
              _.each(_.defaults({}, formatting, line.formats), function(value, format) {
                return line.format(format, formatting[format]);
              });
              offset = 0;
            }
          }
          return line = nextLine;
        });
      };
    })(this));
  };

  Editor.prototype._trackDelta = function(fn) {
    var decompose, decomposeA, decomposeB, decomposeLeft, decomposeRight, ignored, lengthA, lengthB, newDelta, newIndex, newLeftDelta, newRightDelta, oldIndex, oldLeftDelta, oldRightDelta, _ref, _ref1, _ref2, _ref3, _ref4;
    oldIndex = (_ref = this.savedRange) != null ? _ref.start : void 0;
    fn();
    newDelta = this.doc.toDelta();
    try {
      newIndex = (_ref1 = this.selection.getRange()) != null ? _ref1.start : void 0;
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
      _ref4 = _.map([decomposeA, decomposeB], function(delta) {
        return _.reduce(delta.ops, function(count, op) {
          if (op.value != null) {
            count += op.value.length;
          }
          return count;
        }, 0);
      }), lengthA = _ref4[0], lengthB = _ref4[1];
      decompose = lengthA < lengthA ? decomposeA : decomposeB;
    } else {
      decompose = decomposeA || decomposeB;
    }
    return decompose;
  };

  Editor.prototype._update = function() {
    var delta;
    if (this.innerHTML === this.root.innerHTML) {
      return false;
    }
    delta = this._trackDelta((function(_this) {
      return function() {
        _this.selection.preserve(_.bind(_this.doc.rebuild, _this.doc));
        return _this.selection.shiftAfter(0, 0, _.bind(_this.doc.optimizeLines, _this.doc));
      };
    })(this));
    this.innerHTML = this.root.innerHTML;
    if (delta.isIdentity()) {
      return false;
    } else {
      return delta;
    }
  };

  return Editor;

})();

module.exports = Editor;


},{"./document":19,"./dom":20,"./line":28,"./renderer":40,"./selection":41,"lodash":"4HJaAd","tandem-core":"38mxji"}],22:[function(_dereq_,module,exports){
var DOM, Format, Utils, _;

_ = _dereq_('lodash');

DOM = _dereq_('./dom');

Utils = _dereq_('./utils');

Format = (function() {
  Format.types = {
    LINE: 'line'
  };

  Format.FORMATS = {
    bold: {
      tag: 'B',
      prepare: 'bold'
    },
    italic: {
      tag: 'I',
      prepare: 'italic'
    },
    underline: {
      tag: 'U',
      prepare: 'underline'
    },
    strike: {
      tag: 'S',
      prepare: 'strikeThrough'
    },
    color: {
      style: 'color',
      "default": 'rgb(0, 0, 0)',
      prepare: 'foreColor'
    },
    background: {
      style: 'backgroundColor',
      "default": 'rgb(255, 255, 255)',
      prepare: 'backColor'
    },
    font: {
      style: 'fontFamily',
      "default": "'Helvetica', 'Arial', sans-serif",
      prepare: 'fontName'
    },
    size: {
      style: 'fontSize',
      "default": '13px',
      prepare: function(doc, value) {
        return doc.execCommand('fontSize', false, Utils.convertFontSize(value));
      }
    },
    link: {
      tag: 'A',
      attribute: 'href'
    },
    image: {
      tag: 'IMG',
      attribute: 'src'
    },
    align: {
      type: Format.types.LINE,
      style: 'textAlign',
      "default": 'left'
    },
    bullet: {
      type: Format.types.LINE,
      exclude: 'list',
      parentTag: 'UL',
      tag: 'LI'
    },
    list: {
      type: Format.types.LINE,
      exclude: 'bullet',
      parentTag: 'OL',
      tag: 'LI'
    }
  };

  function Format(document, config) {
    this.document = document;
    this.config = config;
  }

  Format.prototype.add = function(node, value) {
    var formatNode, parentNode, _ref, _ref1;
    if (!value) {
      return this.remove(node);
    }
    if (this.value(node) === value) {
      return node;
    }
    if (_.isString(this.config.parentTag)) {
      parentNode = this.document.createElement(this.config.parentTag);
      DOM.wrap(parentNode, node);
      if (node.parentNode.tagName === ((_ref = node.parentNode.previousSibling) != null ? _ref.tagName : void 0)) {
        Utils.mergeNodes(node.parentNode.previousSibling, node.parentNode);
      }
      if (node.parentNode.tagName === ((_ref1 = node.parentNode.nextSibling) != null ? _ref1.tagName : void 0)) {
        Utils.mergeNodes(node.parentNode, node.parentNode.nextSibling);
      }
    }
    if (_.isString(this.config.tag)) {
      formatNode = this.document.createElement(this.config.tag);
      if (DOM.VOID_TAGS[formatNode.tagName] != null) {
        if (node.parentNode != null) {
          node.parentNode.insertBefore(formatNode, node);
        }
        DOM.removeNode(node);
        node = formatNode;
      } else if (this.isType(Format.types.LINE)) {
        node = DOM.switchTag(node, this.config.tag);
      } else {
        node = DOM.wrap(formatNode, node);
      }
    }
    if (_.isString(this.config.style) || _.isString(this.config.attribute) || _.isString(this.config["class"])) {
      if (_.isString(this.config["class"])) {
        node = this.remove(node);
      }
      if (DOM.isTextNode(node)) {
        node = DOM.wrap(this.document.createElement(DOM.DEFAULT_INLINE_TAG), node);
      }
      if (_.isString(this.config.style)) {
        if (value !== this.config["default"]) {
          node.style[this.config.style] = value;
        }
      }
      if (_.isString(this.config.attribute)) {
        node.setAttribute(this.config.attribute, value);
      }
      if (_.isString(this.config["class"])) {
        DOM.addClass(node, this.config["class"] + value);
      }
    }
    return node;
  };

  Format.prototype.isType = function(type) {
    return type === this.config.type;
  };

  Format.prototype.match = function(node) {
    var c, _i, _len, _ref, _ref1;
    if (!DOM.isElement(node)) {
      return false;
    }
    if (_.isString(this.config.parentTag) && ((_ref = node.parentNode) != null ? _ref.tagName : void 0) !== this.config.parentTag) {
      return false;
    }
    if (_.isString(this.config.tag) && node.tagName !== this.config.tag) {
      return false;
    }
    if (_.isString(this.config.style) && (!node.style[this.config.style] || node.style[this.config.style] === this.config["default"])) {
      return false;
    }
    if (_.isString(this.config.attribute) && !node.hasAttribute(this.config.attribute)) {
      return false;
    }
    if (_.isString(this.config["class"])) {
      _ref1 = DOM.getClasses(node);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        if (c.indexOf(this.config["class"]) === 0) {
          return true;
        }
      }
      return false;
    }
    return true;
  };

  Format.prototype.prepare = function(value) {
    if (_.isString(this.config.prepare)) {
      return this.document.execCommand(this.config.prepare, false, value);
    } else if (_.isFunction(this.config.prepare)) {
      return this.config.prepare(this.document, value);
    }
  };

  Format.prototype.remove = function(node) {
    var c, _i, _len, _ref;
    if (!this.match(node)) {
      return node;
    }
    if (_.isString(this.config.style)) {
      node.style[this.config.style] = '';
      if (!node.getAttribute('style')) {
        node.removeAttribute('style');
      }
    }
    if (_.isString(this.config.attribute)) {
      node.removeAttribute(this.config.attribute);
    }
    if (_.isString(this.config["class"])) {
      _ref = DOM.getClasses(node);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c.indexOf(this.config["class"]) === 0) {
          DOM.removeClass(node, c);
        }
      }
      if (!node.getAttribute('class')) {
        node.removeAttribute('class');
      }
    }
    if (_.isString(this.config.tag)) {
      if (this.isType(Format.types.LINE)) {
        if (node.previousSibling != null) {
          Utils.splitAncestors(node, node.parentNode.parentNode);
        }
        if (node.nextSibling != null) {
          Utils.splitAncestors(node.nextSibling, node.parentNode.parentNode);
        }
        node = DOM.switchTag(node, DOM.DEFAULT_BLOCK_TAG);
      } else {
        node = DOM.switchTag(node, DOM.DEFAULT_INLINE_TAG);
        if (DOM.EMBED_TAGS[this.config.tag] != null) {
          DOM.setText(node, DOM.EMBED_TEXT);
        }
      }
    }
    if (_.isString(this.config.parentTag)) {
      DOM.unwrap(node.parentNode);
    }
    if (node.tagName === DOM.DEFAULT_INLINE_TAG && !node.hasAttributes()) {
      node = DOM.unwrap(node);
    }
    return node;
  };

  Format.prototype.value = function(node) {
    var c, _i, _len, _ref;
    if (!this.match(node)) {
      return void 0;
    }
    if (_.isString(this.config.attribute)) {
      return node.getAttribute(this.config.attribute) || void 0;
    } else if (_.isString(this.config.style)) {
      return node.style[this.config.style] || void 0;
    } else if (_.isString(this.config["class"])) {
      _ref = DOM.getClasses(node);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c.indexOf(this.config["class"]) === 0) {
          return c.slice(this.config["class"].length);
        }
      }
    } else if (_.isString(this.config.tag)) {
      return true;
    }
    return void 0;
  };

  return Format;

})();

module.exports = Format;


},{"./dom":20,"./utils":44,"lodash":"4HJaAd"}],23:[function(_dereq_,module,exports){
var DOM, Format, Leaf, LinkedList, Utils, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = _dereq_('lodash');

DOM = _dereq_('./dom');

Format = _dereq_('./format');

LinkedList = _dereq_('./lib/linked-list');

Utils = _dereq_('./utils');

Leaf = (function(_super) {
  __extends(Leaf, _super);

  Leaf.ID_PREFIX = 'leaf-';

  Leaf.isLeafNode = function(node) {
    return DOM.isTextNode(node) || (node.firstChild == null);
  };

  function Leaf(node, formats) {
    this.node = node;
    this.formats = _.clone(formats);
    this.id = _.uniqueId(Leaf.ID_PREFIX);
    this.text = DOM.getText(this.node);
    this.length = this.text.length;
  }

  Leaf.prototype.getFormats = function() {
    return this.formats;
  };

  Leaf.prototype.deleteText = function(offset, length) {
    var textNode;
    if (!(length > 0)) {
      return;
    }
    this.text = this.text.slice(0, offset) + this.text.slice(offset + length);
    this.length = this.text.length;
    if (DOM.EMBED_TAGS[this.node.tagName] != null) {
      textNode = this.node.ownerDocument.createTextNode(this.text);
      return this.node = DOM.replaceNode(textNode, this.node);
    } else {
      return DOM.setText(this.node, this.text);
    }
  };

  Leaf.prototype.insertText = function(offset, text) {
    var textNode;
    this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
    if (DOM.isTextNode(this.node)) {
      DOM.setText(this.node, this.text);
    } else {
      textNode = this.node.ownerDocument.createTextNode(text);
      if (this.node.tagName === DOM.DEFAULT_BREAK_TAG) {
        DOM.replaceNode(textNode, this.node);
      } else {
        this.node.appendChild(textNode);
      }
      this.node = textNode;
    }
    return this.length = this.text.length;
  };

  return Leaf;

})(LinkedList.Node);

module.exports = Leaf;


},{"./dom":20,"./format":22,"./lib/linked-list":25,"./utils":44,"lodash":"4HJaAd"}],24:[function(_dereq_,module,exports){
var ColorPicker, DOM, Picker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DOM = _dereq_('../dom');

Picker = _dereq_('./picker');

ColorPicker = (function(_super) {
  __extends(ColorPicker, _super);

  function ColorPicker() {
    ColorPicker.__super__.constructor.apply(this, arguments);
    DOM.addClass(this.container, 'ql-color-picker');
  }

  ColorPicker.prototype.buildItem = function(picker, option, index) {
    var item;
    item = ColorPicker.__super__.buildItem.call(this, picker, option, index);
    item.style.backgroundColor = option.value;
    return item;
  };

  return ColorPicker;

})(Picker);

module.exports = ColorPicker;


},{"../dom":20,"./picker":26}],25:[function(_dereq_,module,exports){
var LinkedList, Node;

Node = (function() {
  function Node(data) {
    this.data = data;
    this.prev = this.next = null;
  }

  return Node;

})();

LinkedList = (function() {
  LinkedList.Node = Node;

  function LinkedList() {
    this.length = 0;
    this.first = this.last = null;
  }

  LinkedList.prototype.append = function(node) {
    if (this.first != null) {
      node.next = null;
      this.last.next = node;
    } else {
      this.first = node;
    }
    node.prev = this.last;
    this.last = node;
    return this.length += 1;
  };

  LinkedList.prototype.insertAfter = function(refNode, newNode) {
    newNode.prev = refNode;
    if (refNode != null) {
      newNode.next = refNode.next;
      if (refNode.next != null) {
        refNode.next.prev = newNode;
      }
      refNode.next = newNode;
      if (refNode === this.last) {
        this.last = newNode;
      }
    } else {
      newNode.next = this.first;
      this.first.prev = newNode;
      this.first = newNode;
    }
    return this.length += 1;
  };

  LinkedList.prototype.remove = function(node) {
    if (this.length > 1) {
      if (node.prev != null) {
        node.prev.next = node.next;
      }
      if (node.next != null) {
        node.next.prev = node.prev;
      }
      if (node === this.first) {
        this.first = node.next;
      }
      if (node === this.last) {
        this.last = node.prev;
      }
    } else {
      this.first = this.last = null;
    }
    node.prev = node.next = null;
    return this.length -= 1;
  };

  LinkedList.prototype.toArray = function() {
    var arr, cur;
    arr = [];
    cur = this.first;
    while (cur != null) {
      arr.push(cur);
      cur = cur.next;
    }
    return arr;
  };

  return LinkedList;

})();

module.exports = LinkedList;


},{}],26:[function(_dereq_,module,exports){
var DOM, Normalizer, Picker, _;

_ = _dereq_('lodash');

DOM = _dereq_('../dom');

Normalizer = _dereq_('../normalizer');

Picker = (function() {
  Picker.TEMPLATE = '<span class="ql-picker-label"></span><span class="ql-picker-options"></span>';

  function Picker(select) {
    this.select = select;
    this.container = this.select.ownerDocument.createElement('span');
    this.buildPicker();
    DOM.addClass(this.container, 'ql-picker');
    this.select.style.display = 'none';
    this.select.parentNode.insertBefore(this.container, this.select);
    DOM.addEventListener(this.select.ownerDocument, 'click', (function(_this) {
      return function() {
        _this.close();
        return true;
      };
    })(this));
    DOM.addEventListener(this.label, 'click', (function(_this) {
      return function() {
        return _.defer(function() {
          return DOM.toggleClass(_this.container, 'ql-expanded');
        });
      };
    })(this));
    DOM.addEventListener(this.select, 'change', (function(_this) {
      return function() {
        var item, option;
        if (_this.select.selectedIndex > -1) {
          item = _this.container.querySelectorAll('.ql-picker-item')[_this.select.selectedIndex];
          option = _this.select.options[_this.select.selectedIndex];
        }
        _this.selectItem(item, false);
        return DOM.toggleClass(_this.label, 'ql-active', option !== DOM.getDefaultOption(_this.select));
      };
    })(this));
  }

  Picker.prototype.buildItem = function(picker, option, index) {
    var item;
    item = this.select.ownerDocument.createElement('span');
    item.setAttribute('data-value', option.getAttribute('value'));
    DOM.addClass(item, 'ql-picker-item');
    DOM.setText(item, DOM.getText(option));
    if (this.select.selectedIndex === index) {
      this.selectItem(item, false);
    }
    DOM.addEventListener(item, 'click', (function(_this) {
      return function() {
        _this.selectItem(item, true);
        return _this.close();
      };
    })(this));
    return item;
  };

  Picker.prototype.buildPicker = function() {
    var picker;
    _.each(DOM.getAttributes(this.select), (function(_this) {
      return function(value, name) {
        return _this.container.setAttribute(name, value);
      };
    })(this));
    this.container.innerHTML = Normalizer.stripWhitespace(Picker.TEMPLATE);
    this.label = this.container.querySelector('.ql-picker-label');
    picker = this.container.querySelector('.ql-picker-options');
    return _.each(this.select.options, (function(_this) {
      return function(option, i) {
        var item;
        item = _this.buildItem(picker, option, i);
        return picker.appendChild(item);
      };
    })(this));
  };

  Picker.prototype.close = function() {
    return DOM.removeClass(this.container, 'ql-expanded');
  };

  Picker.prototype.selectItem = function(item, trigger) {
    var selected, value;
    selected = this.container.querySelector('.ql-selected');
    if (selected != null) {
      DOM.removeClass(selected, 'ql-selected');
    }
    if (item != null) {
      value = item.getAttribute('data-value');
      DOM.addClass(item, 'ql-selected');
      DOM.setText(this.label, DOM.getText(item));
      DOM.selectOption(this.select, value, trigger);
      return this.label.setAttribute('data-value', value);
    } else {
      this.label.innerHTML = '&nbsp;';
      return this.label.removeAttribute('data-value');
    }
  };

  return Picker;

})();

module.exports = Picker;


},{"../dom":20,"../normalizer":38,"lodash":"4HJaAd"}],27:[function(_dereq_,module,exports){
var Range, _;

_ = _dereq_('lodash');

Range = (function() {
  Range.compare = function(r1, r2) {
    if (r1 === r2) {
      return true;
    }
    if (!((r1 != null) && (r2 != null))) {
      return false;
    }
    return r1.equals(r2);
  };

  function Range(start, end) {
    this.start = start;
    this.end = end;
  }

  Range.prototype.equals = function(range) {
    if (range == null) {
      return false;
    }
    return this.start === range.start && this.end === range.end;
  };

  Range.prototype.shift = function(index, length) {
    var _ref;
    return _ref = _.map([this.start, this.end], function(pos) {
      if (index > pos) {
        return pos;
      }
      if (length >= 0) {
        return pos + length;
      } else {
        return Math.max(index, pos + length);
      }
    }), this.start = _ref[0], this.end = _ref[1], _ref;
  };

  Range.prototype.isCollapsed = function() {
    return this.start === this.end;
  };

  return Range;

})();

module.exports = Range;


},{"lodash":"4HJaAd"}],28:[function(_dereq_,module,exports){
var DOM, Format, Leaf, Line, LinkedList, Normalizer, Tandem, Utils, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = _dereq_('lodash');

DOM = _dereq_('./dom');

Format = _dereq_('./format');

Leaf = _dereq_('./leaf');

Line = _dereq_('./line');

LinkedList = _dereq_('./lib/linked-list');

Normalizer = _dereq_('./normalizer');

Utils = _dereq_('./utils');

Tandem = _dereq_('tandem-core');

Line = (function(_super) {
  __extends(Line, _super);

  Line.CLASS_NAME = 'line';

  Line.ID_PREFIX = 'line-';

  function Line(doc, node) {
    this.doc = doc;
    this.node = node;
    this.id = _.uniqueId(Line.ID_PREFIX);
    this.formats = {};
    DOM.addClass(this.node, Line.CLASS_NAME);
    this.rebuild();
    Line.__super__.constructor.call(this, this.node);
  }

  Line.prototype.buildLeaves = function(node, formats) {
    return _.each(DOM.getChildNodes(node), (function(_this) {
      return function(node) {
        var nodeFormats;
        node = Normalizer.normalizeNode(node);
        nodeFormats = _.clone(formats);
        _.each(_this.doc.formats, function(format, name) {
          if (!format.isType(Format.types.LINE) && format.match(node)) {
            return nodeFormats[name] = format.value(node);
          }
        });
        if (Leaf.isLeafNode(node)) {
          return _this.leaves.append(new Leaf(node, nodeFormats));
        } else {
          return _this.buildLeaves(node, nodeFormats);
        }
      };
    })(this));
  };

  Line.prototype.deleteText = function(offset, length) {
    var deleteLength, leaf, _ref;
    if (!(length > 0)) {
      return;
    }
    _ref = this.findLeafAt(offset), leaf = _ref[0], offset = _ref[1];
    while ((leaf != null) && length > 0) {
      deleteLength = Math.min(length, leaf.length - offset);
      leaf.deleteText(offset, deleteLength);
      length -= deleteLength;
      leaf = leaf.next;
      offset = 0;
    }
    return this.rebuild();
  };

  Line.prototype.findLeaf = function(leafNode) {
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

  Line.prototype.findLeafAt = function(offset, inclusive) {
    var leaf;
    if (inclusive == null) {
      inclusive = false;
    }
    if (offset >= this.length - 1) {
      return [this.leaves.last, this.leaves.last.length];
    }
    leaf = this.leaves.first;
    while (leaf != null) {
      if (offset < leaf.length || (offset === leaf.length && inclusive)) {
        return [leaf, offset];
      }
      offset -= leaf.length;
      leaf = leaf.next;
    }
    return [this.leaves.last, offset - this.leaves.last.length];
  };

  Line.prototype.format = function(name, value) {
    var formats;
    if (_.isObject(name)) {
      formats = name;
    } else {
      formats = {};
      formats[name] = value;
    }
    _.each(formats, (function(_this) {
      return function(value, name) {
        var excludeFormat, format;
        format = _this.doc.formats[name];
        if (format.isType(Format.types.LINE)) {
          if (format.config.exclude && _this.formats[format.config.exclude]) {
            excludeFormat = _this.doc.formats[format.config.exclude];
            if (excludeFormat != null) {
              _this.node = excludeFormat.remove(_this.node);
              delete _this.formats[format.config.exclude];
            }
          }
          _this.node = format.add(_this.node, value);
        }
        if (value) {
          return _this.formats[name] = value;
        } else {
          return delete _this.formats[name];
        }
      };
    })(this));
    return this.resetContent();
  };

  Line.prototype.formatText = function(offset, length, name, value) {
    var format, leaf, leafOffset, leftNode, nextLeaf, rightNode, targetNode, _ref, _ref1, _ref2;
    _ref = this.findLeafAt(offset), leaf = _ref[0], leafOffset = _ref[1];
    format = this.doc.formats[name];
    if (!((format != null) && format.config.type !== Format.types.LINE)) {
      return;
    }
    while ((leaf != null) && length > 0) {
      nextLeaf = leaf.next;
      if ((value && leaf.formats[name] !== value) || (!value && (leaf.formats[name] != null))) {
        targetNode = leaf.node;
        if (leaf.formats[name] != null) {
          Utils.splitAncestors(targetNode, this.node);
          while (!format.match(targetNode)) {
            targetNode = targetNode.parentNode;
          }
        }
        if (leafOffset > 0) {
          _ref1 = Utils.splitNode(targetNode, leafOffset), leftNode = _ref1[0], targetNode = _ref1[1];
        }
        if (leaf.length > leafOffset + length) {
          _ref2 = Utils.splitNode(targetNode, length), targetNode = _ref2[0], rightNode = _ref2[1];
        }
        format.add(targetNode, value);
      }
      length -= leaf.length - leafOffset;
      leafOffset = 0;
      leaf = nextLeaf;
    }
    return this.rebuild();
  };

  Line.prototype.insertText = function(offset, text, formats) {
    var leaf, leafOffset, nextNode, node, prevNode, _ref, _ref1;
    if (formats == null) {
      formats = {};
    }
    if (!(text.length > 0)) {
      return;
    }
    _ref = this.findLeafAt(offset), leaf = _ref[0], leafOffset = _ref[1];
    if (_.isEqual(leaf.formats, formats)) {
      leaf.insertText(leafOffset, text);
      return this.resetContent();
    } else {
      node = _.reduce(formats, (function(_this) {
        return function(node, value, name) {
          return _this.doc.formats[name].add(node, value);
        };
      })(this), this.node.ownerDocument.createTextNode(text));
      _ref1 = Utils.splitNode(leaf.node, leafOffset), prevNode = _ref1[0], nextNode = _ref1[1];
      if (nextNode) {
        nextNode = Utils.splitAncestors(nextNode, this.node);
      }
      this.node.insertBefore(node, nextNode);
      return this.rebuild();
    }
  };

  Line.prototype.optimize = function() {
    Normalizer.optimizeLine(this.node);
    return this.rebuild();
  };

  Line.prototype.rebuild = function(force) {
    if (force == null) {
      force = false;
    }
    if (!force && (this.outerHTML != null) && this.outerHTML === this.node.outerHTML) {
      if (_.all(this.leaves.toArray(), function(leaf) {
        return leaf.node.parentNode != null;
      })) {
        return false;
      }
    }
    this.node = Normalizer.normalizeNode(this.node);
    if (Utils.getNodeLength(this.node) === 0 && !this.node.querySelector(DOM.DEFAULT_BREAK_TAG)) {
      this.node.appendChild(this.node.ownerDocument.createElement(DOM.DEFAULT_BREAK_TAG));
    }
    this.leaves = new LinkedList();
    this.formats = _.reduce(this.doc.formats, (function(_this) {
      return function(formats, format, name) {
        if (format.isType(Format.types.LINE)) {
          if (format.match(_this.node)) {
            formats[name] = format.value(_this.node);
          } else {
            delete formats[name];
          }
        }
        return formats;
      };
    })(this), this.formats);
    this.buildLeaves(this.node, {});
    this.resetContent();
    return true;
  };

  Line.prototype.resetContent = function() {
    var ops;
    if (this.node.id !== this.id) {
      this.node.id = this.id;
    }
    this.outerHTML = this.node.outerHTML;
    this.length = 1;
    ops = _.map(this.leaves.toArray(), (function(_this) {
      return function(leaf) {
        _this.length += leaf.length;
        return new Tandem.InsertOp(leaf.text, leaf.formats);
      };
    })(this));
    ops.push(new Tandem.InsertOp('\n', this.formats));
    return this.delta = new Tandem.Delta(0, this.length, ops);
  };

  return Line;

})(LinkedList.Node);

module.exports = Line;


},{"./dom":20,"./format":22,"./leaf":23,"./lib/linked-list":25,"./line":28,"./normalizer":38,"./utils":44,"lodash":"4HJaAd","tandem-core":"38mxji"}],29:[function(_dereq_,module,exports){
var Authorship, DOM, Format, Tandem, _;

_ = _dereq_('lodash');

DOM = _dereq_('../dom');

Format = _dereq_('../format');

Tandem = _dereq_('tandem-core');

Authorship = (function() {
  Authorship.DEFAULTS = {
    authorId: null,
    color: 'blue',
    enabled: false
  };

  function Authorship(quill, options) {
    this.quill = quill;
    this.options = options;
    if (this.options.button != null) {
      this.attachButton(this.options.button);
    }
    if (this.options.enabled) {
      this.enable();
    }
    this.quill.addFormat('author', {
      "class": 'author-'
    });
    if (this.options.authorId == null) {
      return;
    }
    this.quill.on(this.quill.constructor.events.PRE_EVENT, (function(_this) {
      return function(eventName, delta, origin) {
        var attribute, authorDelta;
        if (eventName === _this.quill.constructor.events.TEXT_CHANGE && origin === 'user') {
          _.each(delta.ops, function(op) {
            if (Tandem.InsertOp.isInsert(op) || _.keys(op.attributes).length > 0) {
              return op.attributes['author'] = _this.options.authorId;
            }
          });
          authorDelta = new Tandem.Delta(delta.endLength, [new Tandem.RetainOp(0, delta.endLength)]);
          attribute = {
            author: _this.options.authorId
          };
          delta.apply(function(index, text) {
            return authorDelta = authorDelta.compose(Tandem.Delta.makeRetainDelta(delta.endLength, index, text.length, attribute));
          }, (function() {}), function(index, length, name, value) {
            return authorDelta = authorDelta.compose(Tandem.Delta.makeRetainDelta(delta.endLength, index, length, attribute));
          });
          return _this.quill.updateContents(authorDelta, 'silent');
        }
      };
    })(this));
    this.addAuthor(this.options.authorId, this.options.color);
  }

  Authorship.prototype.addAuthor = function(id, color) {
    var styles;
    styles = {};
    styles[".authorship .author-" + id] = {
      "background-color": "" + color
    };
    return this.quill.addStyles(styles);
  };

  Authorship.prototype.attachButton = function(button) {
    return DOM.addEventListener(button, 'click', (function(_this) {
      return function() {
        DOM.toggleClass(button, 'ql-on');
        return _this.enable(DOM.hasClass(button, 'ql-on'));
      };
    })(this));
  };

  Authorship.prototype.enable = function(enabled) {
    if (enabled == null) {
      enabled = true;
    }
    return DOM.toggleClass(this.quill.root, 'authorship', enabled);
  };

  Authorship.prototype.disable = function() {
    return this.enable(false);
  };

  return Authorship;

})();

module.exports = Authorship;


},{"../dom":20,"../format":22,"lodash":"4HJaAd","tandem-core":"38mxji"}],30:[function(_dereq_,module,exports){
var DOM, ImageTooltip, Tooltip, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = _dereq_('lodash');

DOM = _dereq_('../dom');

Tooltip = _dereq_('./tooltip');

ImageTooltip = (function(_super) {
  __extends(ImageTooltip, _super);

  ImageTooltip.DEFAULTS = {
    styles: {
      '.image-tooltip-container': {
        'margin': '25px',
        'padding': '10px',
        'width': '300px'
      },
      '.image-tooltip-container:after': {
        'clear': 'both',
        'content': '""',
        'display': 'table'
      },
      '.image-tooltip-container .preview': {
        'margin': '10px 0px',
        'position': 'relative',
        'border': '1px dashed #000',
        'height': '200px'
      },
      '.image-tooltip-container .preview span': {
        'display': 'inline-block',
        'position': 'absolute',
        'text-align': 'center',
        'top': '40%',
        'width': '100%'
      },
      '.image-tooltip-container img': {
        'bottom': '0',
        'left': '0',
        'margin': 'auto',
        'max-height': '100%',
        'max-width': '100%',
        'position': 'absolute',
        'right': '0',
        'top': '0'
      },
      '.image-tooltip-container .input': {
        'box-sizing': 'border-box',
        'width': '100%'
      },
      '.image-tooltip-container a': {
        'border': '1px solid black',
        'box-sizing': 'border-box',
        'display': 'inline-block',
        'float': 'left',
        'padding': '5px',
        'text-align': 'center',
        'width': '50%'
      }
    },
    template: '<input class="input" type="textbox"> <div class="preview"> <span>Preview</span> </div> <a href="javascript:;" class="cancel">Cancel</a> <a href="javascript:;" class="insert">Insert</a>'
  };

  function ImageTooltip(quill, options) {
    this.quill = quill;
    this.options = options;
    this.options.styles = _.defaults(this.options.styles, Tooltip.DEFAULTS.styles);
    this.options = _.defaults(this.options, Tooltip.DEFAULTS);
    ImageTooltip.__super__.constructor.call(this, this.quill, this.options);
    this.preview = this.container.querySelector('.preview');
    this.textbox = this.container.querySelector('.input');
    DOM.addClass(this.container, 'image-tooltip-container');
    this.initListeners();
  }

  ImageTooltip.prototype.initListeners = function() {
    DOM.addEventListener(this.container.querySelector('.insert'), 'click', _.bind(this.insertImage, this));
    DOM.addEventListener(this.container.querySelector('.cancel'), 'click', _.bind(this.hide, this));
    DOM.addEventListener(this.textbox, 'input', _.bind(this._preview, this));
    this.initTextbox(this.textbox, this.insertImage, this.hide);
    return this.quill.onModuleLoad('toolbar', (function(_this) {
      return function(toolbar) {
        return toolbar.initFormat('image', _.bind(_this._onToolbar, _this));
      };
    })(this));
  };

  ImageTooltip.prototype.insertImage = function() {
    var index, url;
    url = this._normalizeURL(this.textbox.value);
    if (this.range == null) {
      this.range = new Range(0, 0);
    }
    if (this.range) {
      this.preview.innerHTML = '<span>Preview</span>';
      this.textbox.value = '';
      index = this.range.end;
      this.quill.insertEmbed(index, 'image', url, 'user');
      this.quill.setSelection(index + 1, index + 1);
    }
    return this.hide();
  };

  ImageTooltip.prototype._onToolbar = function(range, value) {
    if (value) {
      if (!this.textbox.value) {
        this.textbox.value = 'http://';
      }
      this.show();
      this.textbox.focus();
      return _.defer((function(_this) {
        return function() {
          return _this.textbox.setSelectionRange(_this.textbox.value.length, _this.textbox.value.length);
        };
      })(this));
    } else {
      return this.quill.deleteText(range, 'user');
    }
  };

  ImageTooltip.prototype._preview = function() {
    var img;
    if (!this._matchImageURL(this.textbox.value)) {
      return;
    }
    if (this.preview.firstChild.tagName === 'IMG') {
      return this.preview.firstChild.setAttribute('src', this.textbox.value);
    } else {
      img = this.preview.ownerDocument.createElement('img');
      img.setAttribute('src', this.textbox.value);
      return this.preview.replaceChild(img, this.preview.firstChild);
    }
  };

  ImageTooltip.prototype._matchImageURL = function(url) {
    return /^https?:\/\/.+\.(jp?g|gif|png)$/.test(url);
  };

  ImageTooltip.prototype._normalizeURL = function(url) {
    if (!/^https?:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  };

  return ImageTooltip;

})(Tooltip);

module.exports = ImageTooltip;


},{"../dom":20,"./tooltip":36,"lodash":"4HJaAd"}],31:[function(_dereq_,module,exports){
var DOM, Keyboard, Line, Tandem, _;

_ = _dereq_('lodash');

DOM = _dereq_('../dom');

Line = _dereq_('../line');

Tandem = _dereq_('tandem-core');

Keyboard = (function() {
  Keyboard.hotkeys = {
    BOLD: {
      key: 'B',
      metaKey: true
    },
    INDENT: {
      key: DOM.KEYS.TAB,
      shiftKey: false
    },
    ITALIC: {
      key: 'I',
      metaKey: true
    },
    OUTDENT: {
      key: DOM.KEYS.TAB,
      shiftKey: true
    },
    UNDERLINE: {
      key: 'U',
      metaKey: true
    }
  };

  function Keyboard(quill, options) {
    this.quill = quill;
    this.hotkeys = {};
    this._initListeners();
    this._initHotkeys();
    this._initDeletes();
  }

  Keyboard.prototype.addHotkey = function(hotkey, callback) {
    var which, _base;
    hotkey = _.isObject(hotkey) ? _.clone(hotkey) : {
      key: hotkey
    };
    hotkey.callback = callback;
    which = _.isNumber(hotkey.key) ? hotkey.key : hotkey.key.toUpperCase().charCodeAt(0);
    if ((_base = this.hotkeys)[which] == null) {
      _base[which] = [];
    }
    return this.hotkeys[which].push(hotkey);
  };

  Keyboard.prototype.toggleFormat = function(range, format) {
    var delta, toolbar, value;
    if (range.isCollapsed()) {
      delta = this.quill.getContents(Math.max(0, range.start - 1), range.end);
    } else {
      delta = this.quill.getContents(range);
    }
    value = delta.ops.length === 0 || !_.all(delta.ops, function(op) {
      return op.attributes[format];
    });
    if (range.isCollapsed()) {
      this.quill.prepareFormat(format, value);
    } else {
      this.quill.formatText(range, format, value, 'user');
    }
    toolbar = this.quill.getModule('toolbar');
    if (toolbar != null) {
      return toolbar.setActive(format, value);
    }
  };

  Keyboard.prototype._initDeletes = function() {
    return _.each([DOM.KEYS.DELETE, DOM.KEYS.BACKSPACE], (function(_this) {
      return function(key) {
        return _this.addHotkey(key, function() {
          return _this.quill.getLength() > 1;
        });
      };
    })(this));
  };

  Keyboard.prototype._initHotkeys = function() {
    this.addHotkey(Keyboard.hotkeys.INDENT, (function(_this) {
      return function(range) {
        _this._onTab(range, false);
        return false;
      };
    })(this));
    this.addHotkey(Keyboard.hotkeys.OUTDENT, (function(_this) {
      return function(range) {
        return false;
      };
    })(this));
    return _.each(['bold', 'italic', 'underline'], (function(_this) {
      return function(format) {
        return _this.addHotkey(Keyboard.hotkeys[format.toUpperCase()], function(range) {
          _this.toggleFormat(range, format);
          return false;
        });
      };
    })(this));
  };

  Keyboard.prototype._initListeners = function() {
    return DOM.addEventListener(this.quill.root, 'keydown', (function(_this) {
      return function(event) {
        var prevent, range;
        prevent = false;
        range = _this.quill.getSelection();
        _.each(_this.hotkeys[event.which], function(hotkey) {
          if ((hotkey.metaKey != null) && (event.metaKey !== hotkey.metaKey && event.ctrlKey !== hotkey.metaKey)) {
            return;
          }
          if ((hotkey.shiftKey != null) && event.shiftKey !== hotkey.shiftKey) {
            return;
          }
          return prevent = hotkey.callback(range) === false || prevent;
        });
        return !prevent;
      };
    })(this));
  };

  Keyboard.prototype._onTab = function(range, shift) {
    var delta;
    if (shift == null) {
      shift = false;
    }
    delta = Tandem.Delta.makeDelta({
      startLength: this.quill.getLength(),
      ops: [
        {
          start: 0,
          end: range.start
        }, {
          value: "\t"
        }, {
          start: range.end,
          end: this.quill.getLength()
        }
      ]
    });
    this.quill.updateContents(delta);
    return this.quill.setSelection(range.start + 1, range.start + 1);
  };

  return Keyboard;

})();

module.exports = Keyboard;


},{"../dom":20,"../line":28,"lodash":"4HJaAd","tandem-core":"38mxji"}],32:[function(_dereq_,module,exports){
var DOM, LinkTooltip, Tooltip, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = _dereq_('lodash');

DOM = _dereq_('../dom');

Tooltip = _dereq_('./tooltip');

LinkTooltip = (function(_super) {
  __extends(LinkTooltip, _super);

  LinkTooltip.DEFAULTS = {
    maxLength: 50,
    styles: {
      '.link-tooltip-container': {
        'padding': '5px 10px'
      },
      '.link-tooltip-container input.input': {
        'width': '170px'
      },
      '.link-tooltip-container input.input, .link-tooltip-container a.done, .link-tooltip-container.editing a.url, .link-tooltip-container.editing a.change': {
        'display': 'none'
      },
      '.link-tooltip-container.editing input.input, .link-tooltip-container.editing a.done': {
        'display': 'inline-block'
      }
    },
    template: '<span class="title">Visit URL:&nbsp;</span> <a href="#" class="url" target="_blank" href="about:blank"></a> <input class="input" type="text"> <span>&nbsp;&#45;&nbsp;</span> <a href="javascript:;" class="change">Change</a> <a href="javascript:;" class="done">Done</a>'
  };

  function LinkTooltip(quill, options) {
    this.quill = quill;
    this.options = options;
    this.options.styles = _.defaults(this.options.styles, Tooltip.DEFAULTS.styles);
    this.options = _.defaults(this.options, Tooltip.DEFAULTS);
    LinkTooltip.__super__.constructor.call(this, this.quill, this.options);
    DOM.addClass(this.container, 'link-tooltip-container');
    this.textbox = this.container.querySelector('.input');
    this.link = this.container.querySelector('.url');
    this.initListeners();
  }

  LinkTooltip.prototype.initListeners = function() {
    this.quill.on(this.quill.constructor.events.SELECTION_CHANGE, (function(_this) {
      return function(range) {
        var anchor;
        if (!((range != null) && range.isCollapsed())) {
          return;
        }
        anchor = _this._findAnchor(range);
        if (anchor) {
          _this.setMode(anchor.href, false);
          return _this.show(anchor);
        } else {
          _this.range = null;
          return _this.hide();
        }
      };
    })(this));
    DOM.addEventListener(this.container.querySelector('.done'), 'click', _.bind(this.saveLink, this));
    DOM.addEventListener(this.container.querySelector('.change'), 'click', (function(_this) {
      return function() {
        return _this.setMode(_this.link.href, true);
      };
    })(this));
    this.initTextbox(this.textbox, this.saveLink, this.hide);
    return this.quill.onModuleLoad('toolbar', (function(_this) {
      return function(toolbar) {
        return toolbar.initFormat('link', _.bind(_this._onToolbar, _this));
      };
    })(this));
  };

  LinkTooltip.prototype.saveLink = function() {
    var anchor, url;
    url = this._normalizeURL(this.textbox.value);
    if (this.range != null) {
      if (this.range.isCollapsed()) {
        anchor = this._findAnchor(this.range);
        if (anchor != null) {
          anchor.href = url;
        }
      } else {
        this.quill.formatText(this.range, 'link', url, 'user');
      }
    }
    return this.setMode(url, false);
  };

  LinkTooltip.prototype.setMode = function(url, edit) {
    var text;
    if (edit == null) {
      edit = false;
    }
    if (edit) {
      this.textbox.value = url;
      this.textbox.focus();
      _.defer((function(_this) {
        return function() {
          return _this.textbox.setSelectionRange(url.length, url.length);
        };
      })(this));
    } else {
      this.link.href = url;
      text = url.length > this.options.maxLength ? url.slice(0, this.options.maxLength) + '...' : url;
      DOM.setText(this.link, text);
    }
    return DOM.toggleClass(this.container, 'editing', edit);
  };

  LinkTooltip.prototype._findAnchor = function(range) {
    var leaf, node, offset, _ref;
    _ref = this.quill.editor.doc.findLeafAt(range.start, true), leaf = _ref[0], offset = _ref[1];
    if (leaf != null) {
      node = leaf.node;
    }
    while (node != null) {
      if (node.tagName === 'A') {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };

  LinkTooltip.prototype._onToolbar = function(range, value) {
    var nativeRange;
    if (!(range && !range.isCollapsed())) {
      return;
    }
    if (value) {
      this.setMode(this._suggestURL(range), true);
      nativeRange = this.quill.editor.selection._getNativeRange();
      return this.show(nativeRange);
    } else {
      return this.quill.formatText(range, 'link', false, 'user');
    }
  };

  LinkTooltip.prototype._normalizeURL = function(url) {
    if (!/^https?:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  };

  LinkTooltip.prototype._suggestURL = function(range) {
    var text;
    text = this.quill.getText(range);
    return this._normalizeURL(text);
  };

  return LinkTooltip;

})(Tooltip);

module.exports = LinkTooltip;


},{"../dom":20,"./tooltip":36,"lodash":"4HJaAd"}],33:[function(_dereq_,module,exports){
var DOM, EventEmitter2, MultiCursor, Utils, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = _dereq_('lodash');

EventEmitter2 = _dereq_('eventemitter2').EventEmitter2;

DOM = _dereq_('../dom');

Utils = _dereq_('../utils');

MultiCursor = (function(_super) {
  __extends(MultiCursor, _super);

  MultiCursor.DEFAULTS = {
    template: '<span class="cursor-flag"> <span class="cursor-name"></span> </span> <span class="cursor-caret"></span>',
    timeout: 2500
  };

  MultiCursor.events = {
    CURSOR_ADDED: 'cursor-addded',
    CURSOR_MOVED: 'cursor-moved',
    CURSOR_REMOVED: 'cursor-removed'
  };

  function MultiCursor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.cursors = {};
    this.container = this.quill.addContainer('cursor-container', true);
    this.quill.addStyles({
      '.cursor-container': {
        'position': 'absolute',
        'left': '0',
        'top': '0',
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
      },
      '.cursor.right > .cursor-flag': {
        'right': '-2px'
      }
    });
    this.quill.on(this.quill.constructor.events.TEXT_CHANGE, _.bind(this._applyDelta, this));
  }

  MultiCursor.prototype.clearCursors = function() {
    _.each(_.keys(this.cursors), _.bind(this.removeCursor, this));
    return this.cursors = {};
  };

  MultiCursor.prototype.moveCursor = function(userId, index) {
    var cursor;
    cursor = this.cursors[userId];
    cursor.index = index;
    DOM.removeClass(cursor.elem, 'hidden');
    clearTimeout(cursor.timer);
    cursor.timer = setTimeout((function(_this) {
      return function() {
        DOM.addClass(cursor.elem, 'hidden');
        return cursor.timer = null;
      };
    })(this), this.options.timeout);
    this._updateCursor(cursor);
    return cursor;
  };

  MultiCursor.prototype.removeCursor = function(userId) {
    var cursor;
    cursor = this.cursors[userId];
    this.emit(MultiCursor.events.CURSOR_REMOVED, cursor);
    if (cursor != null) {
      cursor.elem.parentNode.removeChild(cursor.elem);
    }
    return delete this.cursors[userId];
  };

  MultiCursor.prototype.setCursor = function(userId, index, name, color) {
    var cursor;
    if (this.cursors[userId] == null) {
      this.cursors[userId] = cursor = {
        userId: userId,
        index: index,
        color: color,
        elem: this._buildCursor(name, color)
      };
      this.emit(MultiCursor.events.CURSOR_ADDED, cursor);
    }
    _.defer((function(_this) {
      return function() {
        return _this.moveCursor(userId, index);
      };
    })(this));
    return this.cursors[userId];
  };

  MultiCursor.prototype.shiftCursors = function(index, length, authorId) {
    if (authorId == null) {
      authorId = null;
    }
    return _.each(this.cursors, (function(_this) {
      return function(cursor, id) {
        if (!(cursor && (cursor.index > index || cursor.userId === authorId))) {
          return;
        }
        return cursor.index += Math.max(length, index - cursor.index);
      };
    })(this));
  };

  MultiCursor.prototype.update = function() {
    return _.each(this.cursors, (function(_this) {
      return function(cursor, id) {
        if (cursor == null) {
          return;
        }
        _this._updateCursor(cursor);
        return true;
      };
    })(this));
  };

  MultiCursor.prototype._applyDelta = function(delta) {
    delta.apply((function(_this) {
      return function(index, text, formatting) {
        return _this.shiftCursors(index, text.length, formatting['author']);
      };
    })(this), (function(_this) {
      return function(index, length) {
        return _this.shiftCursors(index, -1 * length, null);
      };
    })(this), (function(_this) {
      return function(index, length, name, value) {
        return _this.shiftCursors(index, 0, null);
      };
    })(this));
    return this.update();
  };

  MultiCursor.prototype._buildCursor = function(name, color) {
    var cursor, cursorCaret, cursorFlag, cursorName;
    cursor = this.container.ownerDocument.createElement('span');
    DOM.addClass(cursor, 'cursor');
    cursor.innerHTML = this.options.template;
    cursorFlag = cursor.querySelector('.cursor-flag');
    cursorName = cursor.querySelector('.cursor-name');
    DOM.setText(cursorName, name);
    cursorCaret = cursor.querySelector('.cursor-caret');
    cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color;
    this.container.appendChild(cursor);
    return cursor;
  };

  MultiCursor.prototype._moveCursor = function(cursor, reference, side) {
    var bounds, flag;
    if (side == null) {
      side = 'left';
    }
    bounds = reference.getBoundingClientRect();
    cursor.elem.style.top = bounds.top + 'px';
    cursor.elem.style.left = bounds[side] + 'px';
    cursor.elem.style.height = bounds.height + 'px';
    flag = cursor.elem.querySelector('.cursor-flag');
    DOM.toggleClass(cursor.elem, 'top', parseInt(cursor.elem.style.top) <= flag.offsetHeight);
    DOM.toggleClass(cursor.elem, 'left', parseInt(cursor.elem.style.left) <= flag.offsetWidth);
    DOM.toggleClass(cursor.elem, 'right', this.quill.root.offsetWidth - parseInt(cursor.elem.style.left) <= flag.offsetWidth);
    return this.emit(MultiCursor.events.CURSOR_MOVED, cursor);
  };

  MultiCursor.prototype._updateCursor = function(cursor) {
    var didSplit, guide, leaf, leftNode, offset, rightNode, _ref, _ref1;
    this.quill.editor.checkUpdate();
    _ref = this.quill.editor.doc.findLeafAt(cursor.index, true), leaf = _ref[0], offset = _ref[1];
    guide = this.container.ownerDocument.createElement('span');
    if (leaf != null) {
      _ref1 = Utils.splitNode(leaf.node, offset), leftNode = _ref1[0], rightNode = _ref1[1], didSplit = _ref1[2];
      DOM.setText(guide, DOM.ZERO_WIDTH_NOBREAK_SPACE);
      leaf.node.parentNode.insertBefore(guide, rightNode);
    } else {
      DOM.setText(guide, DOM.NOBREAK_SPACE);
      this.quill.root.appendChild(guide);
    }
    this._moveCursor(cursor, guide);
    DOM.removeNode(guide);
    if (didSplit) {
      DOM.normalize(leaf.node.parentNode);
    }
    return this.quill.editor.selection.update('silent');
  };

  return MultiCursor;

})(EventEmitter2);

module.exports = MultiCursor;


},{"../dom":20,"../utils":44,"eventemitter2":"x/3aRz","lodash":"4HJaAd"}],34:[function(_dereq_,module,exports){
var DOM, Document, PasteManager, Tandem, _;

_ = _dereq_('lodash');

DOM = _dereq_('../dom');

Document = _dereq_('../document');

Tandem = _dereq_('tandem-core');

PasteManager = (function() {
  function PasteManager(quill, options) {
    this.quill = quill;
    this.options = options;
    this.container = this.quill.addContainer('paste-container');
    this.container.setAttribute('contenteditable', true);
    this.quill.addStyles({
      '.paste-container': {
        'left': '-10000px',
        'position': 'absolute',
        'top': '50%'
      }
    });
    DOM.addEventListener(this.quill.root, 'paste', _.bind(this._paste, this));
  }

  PasteManager.prototype._paste = function() {
    var oldDocLength, range;
    oldDocLength = this.quill.getLength();
    range = this.quill.getSelection();
    if (range == null) {
      return;
    }
    this.container.innerHTML = "";
    this.container.focus();
    return _.defer((function(_this) {
      return function() {
        var delta, doc, lengthAdded;
        doc = new Document(_this.container, _this.quill.options);
        delta = doc.toDelta();
        delta = delta.compose(Tandem.Delta.makeDeleteDelta(delta.endLength, delta.endLength - 1, 1));
        lengthAdded = delta.endLength;
        if (range.start > 0) {
          delta.ops.unshift(new Tandem.RetainOp(0, range.start));
        }
        if (range.end < oldDocLength) {
          delta.ops.push(new Tandem.RetainOp(range.end, oldDocLength));
        }
        delta.endLength += _this.quill.getLength() - (range.end - range.start);
        delta.startLength = oldDocLength;
        _this.quill.updateContents(delta, 'user');
        _this.quill.focus();
        return _this.quill.setSelection(range.start + lengthAdded, range.start + lengthAdded);
      };
    })(this));
  };

  return PasteManager;

})();

module.exports = PasteManager;


},{"../document":19,"../dom":20,"lodash":"4HJaAd","tandem-core":"38mxji"}],35:[function(_dereq_,module,exports){
var DOM, Toolbar, Utils, _;

_ = _dereq_('lodash');

DOM = _dereq_('../dom');

Utils = _dereq_('../utils');

Toolbar = (function() {
  Toolbar.DEFAULTS = {
    container: null
  };

  Toolbar.formats = {
    LINE: {
      'align': 'align',
      'bullet': 'bullet',
      'list': 'list'
    },
    SELECT: {
      'align': 'align',
      'background': 'background',
      'color': 'color',
      'font': 'font',
      'size': 'size'
    },
    TOGGLE: {
      'bold': 'bold',
      'bullet': 'bullet',
      'image': 'image',
      'italic': 'italic',
      'link': 'link',
      'list': 'list',
      'strike': 'strike',
      'underline': 'underline'
    },
    TOOLTIP: {
      'image': 'image',
      'link': 'link'
    }
  };

  function Toolbar(quill, options) {
    this.quill = quill;
    this.options = options;
    if (this.options.container == null) {
      throw new Error('container required for toolbar', this.options);
    }
    this.container = _.isString(this.options.container) ? document.querySelector(this.options.container) : this.options.container;
    this.inputs = {};
    this.preventUpdate = false;
    this.triggering = false;
    _.each(this.quill.options.formats, (function(_this) {
      return function(format) {
        if (Toolbar.formats.TOOLTIP[format] != null) {
          return;
        }
        return _this.initFormat(format, function(range, value) {
          if (_this.triggering) {
            return;
          }
          if (range.isCollapsed()) {
            _this.quill.prepareFormat(format, value);
          } else if (Toolbar.formats.LINE[format] != null) {
            _this.quill.formatLine(range, format, value, 'user');
          } else {
            _this.quill.formatText(range, format, value, 'user');
          }
          return _.defer(function() {
            _this.updateActive(range);
            return _this.setActive(format, value);
          });
        });
      };
    })(this));
    this.quill.on(this.quill.constructor.events.SELECTION_CHANGE, _.bind(this.updateActive, this));
    DOM.addClass(this.container, 'ql-toolbar-container');
    if (DOM.isIOS()) {
      DOM.addClass(this.container, 'ios');
    }
    if (DOM.isIE(11) || DOM.isIOS()) {
      DOM.addEventListener(this.container, 'mousedown', (function(_this) {
        return function() {
          return false;
        };
      })(this));
    }
  }

  Toolbar.prototype.initFormat = function(format, callback) {
    var eventName, input, selector;
    selector = ".ql-" + format;
    if (Toolbar.formats.SELECT[format] != null) {
      selector = "select" + selector;
      eventName = 'change';
    } else {
      eventName = 'click';
    }
    input = this.container.querySelector(selector);
    if (input == null) {
      return;
    }
    this.inputs[format] = input;
    return DOM.addEventListener(input, eventName, (function(_this) {
      return function() {
        var range, value;
        value = eventName === 'change' ? DOM.getSelectValue(input) : !DOM.hasClass(input, 'ql-active');
        _this.preventUpdate = true;
        _this.quill.focus();
        range = _this.quill.getSelection();
        if (range != null) {
          callback(range, value);
        }
        _this.preventUpdate = false;
        return true;
      };
    })(this));
  };

  Toolbar.prototype.setActive = function(format, value) {
    var input, selectValue;
    input = this.inputs[format];
    if (input == null) {
      return;
    }
    if (input.tagName === 'SELECT') {
      this.triggering = true;
      selectValue = DOM.getSelectValue(input);
      if (_.isArray(value)) {
        value = '';
      }
      if (value !== selectValue) {
        if (value != null) {
          DOM.selectOption(input, value);
        } else {
          DOM.resetSelect(input);
        }
      }
      return this.triggering = false;
    } else {
      return DOM.toggleClass(input, 'ql-active', value || false);
    }
  };

  Toolbar.prototype.updateActive = function(range) {
    var activeFormats;
    if (!((range != null) && !this.preventUpdate)) {
      return;
    }
    activeFormats = this._getActive(range);
    return _.each(this.inputs, (function(_this) {
      return function(input, format) {
        _this.setActive(format, activeFormats[format]);
        return true;
      };
    })(this));
  };

  Toolbar.prototype._getActive = function(range) {
    var leafFormats, lineFormats;
    leafFormats = this._getLeafActive(range);
    lineFormats = this._getLineActive(range);
    return _.defaults({}, leafFormats, lineFormats);
  };

  Toolbar.prototype._getLeafActive = function(range) {
    var contents, formatsArr, line, offset, _ref;
    if (range.isCollapsed()) {
      _ref = this.quill.editor.doc.findLineAt(range.start), line = _ref[0], offset = _ref[1];
      if (offset === 0) {
        contents = this.quill.getContents(range.start, range.end + 1);
      } else {
        contents = this.quill.getContents(range.start - 1, range.end);
      }
    } else {
      contents = this.quill.getContents(range);
    }
    formatsArr = _.map(contents.ops, 'attributes');
    return this._intersectFormats(formatsArr);
  };

  Toolbar.prototype._getLineActive = function(range) {
    var firstLine, formatsArr, lastLine, offset, _ref, _ref1;
    formatsArr = [];
    _ref = this.quill.editor.doc.findLineAt(range.start), firstLine = _ref[0], offset = _ref[1];
    _ref1 = this.quill.editor.doc.findLineAt(range.end), lastLine = _ref1[0], offset = _ref1[1];
    if ((lastLine != null) && lastLine === firstLine) {
      lastLine = lastLine.next;
    }
    while ((firstLine != null) && firstLine !== lastLine) {
      formatsArr.push(_.clone(firstLine.formats));
      firstLine = firstLine.next;
    }
    return this._intersectFormats(formatsArr);
  };

  Toolbar.prototype._intersectFormats = function(formatsArr) {
    return _.reduce(formatsArr.slice(1), function(activeFormats, formats) {
      var activeKeys, added, formatKeys, intersection, missing;
      activeKeys = _.keys(activeFormats);
      formatKeys = _.keys(formats);
      intersection = _.intersection(activeKeys, formatKeys);
      missing = _.difference(activeKeys, formatKeys);
      added = _.difference(formatKeys, activeKeys);
      _.each(intersection, function(name) {
        if (Toolbar.formats.SELECT[name] != null) {
          if (_.isArray(activeFormats[name])) {
            if (_.indexOf(activeFormats[name], formats[name]) < 0) {
              return activeFormats[name].push(formats[name]);
            }
          } else if (activeFormats[name] !== formats[name]) {
            return activeFormats[name] = [activeFormats[name], formats[name]];
          }
        }
      });
      _.each(missing, function(name) {
        if (Toolbar.formats.TOGGLE[name] != null) {
          return delete activeFormats[name];
        } else if ((Toolbar.formats.SELECT[name] != null) && !_.isArray(activeFormats[name])) {
          return activeFormats[name] = [activeFormats[name]];
        }
      });
      _.each(added, function(name) {
        if (Toolbar.formats.SELECT[name] != null) {
          return activeFormats[name] = [formats[name]];
        }
      });
      return activeFormats;
    }, formatsArr[0] || {});
  };

  return Toolbar;

})();

module.exports = Toolbar;


},{"../dom":20,"../utils":44,"lodash":"4HJaAd"}],36:[function(_dereq_,module,exports){
var DOM, Normalizer, Tooltip, _;

_ = _dereq_('lodash');

DOM = _dereq_('../dom');

Normalizer = _dereq_('../normalizer');

Tooltip = (function() {
  Tooltip.DEFAULTS = {
    offset: 10,
    styles: {
      '.tooltip': {
        'background-color': '#fff',
        'border': '1px solid #000',
        'top': '0px',
        'white-space': 'nowrap',
        'z-index': '2000'
      },
      '.tooltip a': {
        'cursor': 'pointer',
        'text-decoration': 'none'
      }
    },
    template: ''
  };

  Tooltip.HIDE_MARGIN = '-10000px';

  function Tooltip(quill, options) {
    this.quill = quill;
    this.options = options;
    this.quill.addStyles(this.options.styles);
    this.container = this.quill.addContainer('tooltip');
    this.container.innerHTML = Normalizer.stripWhitespace(this.options.template);
    this.container.style.position = 'absolute';
    DOM.addEventListener(this.quill.root, 'focus', _.bind(this.hide, this));
    this.hide();
    this.quill.on(this.quill.constructor.events.TEXT_CHANGE, (function(_this) {
      return function(delta, source) {
        if (source === 'user' && _this.container.style.left !== Tooltip.HIDE_MARGIN) {
          _this.range = null;
          return _this.hide();
        }
      };
    })(this));
  }

  Tooltip.prototype.initTextbox = function(textbox, enterCallback, escapeCallback) {
    return DOM.addEventListener(textbox, 'keyup', (function(_this) {
      return function(event) {
        switch (event.which) {
          case DOM.KEYS.ENTER:
            return enterCallback.call(_this);
          case DOM.KEYS.ESCAPE:
            return escapeCallback.call(_this);
          default:
            return true;
        }
      };
    })(this));
  };

  Tooltip.prototype.hide = function() {
    this.container.style.left = Tooltip.HIDE_MARGIN;
    if (this.range) {
      this.quill.setSelection(this.range);
    }
    return this.range = null;
  };

  Tooltip.prototype.show = function(reference) {
    var left, top, _ref, _ref1;
    this.range = this.quill.getSelection();
    _ref = this._position(reference), left = _ref[0], top = _ref[1];
    _ref1 = this._limit(left, top), left = _ref1[0], top = _ref1[1];
    left += this.quill.root.ownerDocument.defaultView.window.pageXOffset;
    top += this.quill.root.ownerDocument.defaultView.window.pageYOffset;
    this.container.style.left = "" + left + "px";
    this.container.style.top = "" + top + "px";
    return this.container.focus();
  };

  Tooltip.prototype._getBounds = function() {
    var bounds, scrollX, scrollY;
    bounds = this.quill.root.getBoundingClientRect();
    scrollX = this.quill.root.ownerDocument.defaultView.window.pageXOffset;
    scrollY = this.quill.root.ownerDocument.defaultView.window.pageYOffset;
    return {
      left: bounds.left + scrollX,
      right: bounds.right + scrollX,
      top: bounds.top + scrollY,
      bottom: bounds.bottom + scrollY,
      width: bounds.width,
      height: bounds.height
    };
  };

  Tooltip.prototype._limit = function(left, top) {
    var editorRect, toolbarRect;
    editorRect = this._getBounds();
    toolbarRect = this.container.getBoundingClientRect();
    left = Math.min(editorRect.right - toolbarRect.width, left);
    left = Math.max(editorRect.left, left);
    top = Math.min(editorRect.bottom - toolbarRect.height, top);
    top = Math.max(editorRect.top, top);
    return [left, top];
  };

  Tooltip.prototype._position = function(reference) {
    var editorRect, left, referenceBounds, toolbarRect, top;
    toolbarRect = this.container.getBoundingClientRect();
    editorRect = this._getBounds();
    if (reference != null) {
      referenceBounds = reference.getBoundingClientRect();
      left = referenceBounds.left + referenceBounds.width / 2 - toolbarRect.width / 2;
      top = referenceBounds.top + referenceBounds.height + this.options.offset;
      if (top + toolbarRect.height > editorRect.bottom) {
        top = referenceBounds.top - toolbarRect.height - this.options.offset;
      }
    } else {
      left = editorRect.left + editorRect.width / 2 - toolbarRect.width / 2;
      top = editorRect.top + editorRect.height / 2 - toolbarRect.height / 2;
    }
    return [left, top];
  };

  return Tooltip;

})();

module.exports = Tooltip;


},{"../dom":20,"../normalizer":38,"lodash":"4HJaAd"}],37:[function(_dereq_,module,exports){
var Tandem, UndoManager, _;

_ = _dereq_('lodash');

Tandem = _dereq_('tandem-core');

UndoManager = (function() {
  UndoManager.DEFAULTS = {
    delay: 1000,
    maxStack: 100
  };

  UndoManager.hotkeys = {
    UNDO: {
      key: 'Z',
      metaKey: true,
      shiftKey: false
    },
    REDO: {
      key: 'Z',
      metaKey: true,
      shiftKey: true
    }
  };

  function UndoManager(quill, options) {
    this.quill = quill;
    this.options = options != null ? options : {};
    this.lastRecorded = 0;
    this.emittedDelta = null;
    this.clear();
    this.initListeners();
  }

  UndoManager.prototype.initListeners = function() {
    this.quill.onModuleLoad('keyboard', (function(_this) {
      return function(keyboard) {
        keyboard.addHotkey(UndoManager.hotkeys.UNDO, function() {
          _this.undo();
          return false;
        });
        return keyboard.addHotkey(UndoManager.hotkeys.REDO, function() {
          _this.redo();
          return false;
        });
      };
    })(this));
    return this.quill.on(this.quill.constructor.events.TEXT_CHANGE, (function(_this) {
      return function(delta, origin) {
        if (delta.isEqual(_this.emittedDelta)) {
          _this.emittedDelta = null;
          return;
        }
        _this.record(delta, _this.oldDelta);
        return _this.oldDelta = _this.quill.getContents();
      };
    })(this));
  };

  UndoManager.prototype.clear = function() {
    this.stack = {
      undo: [],
      redo: []
    };
    return this.oldDelta = this.quill.getContents();
  };

  UndoManager.prototype.record = function(changeDelta, oldDelta) {
    var change, ignored, timestamp, undoDelta;
    if (changeDelta.isIdentity()) {
      return;
    }
    this.stack.redo = [];
    try {
      undoDelta = oldDelta.invert(changeDelta);
      timestamp = new Date().getTime();
      if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
        change = this.stack.undo.pop();
        if (undoDelta.canCompose(change.undo) && change.redo.canCompose(changeDelta)) {
          undoDelta = undoDelta.compose(change.undo);
          changeDelta = change.redo.compose(changeDelta);
        } else {
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
        return this.stack.undo.unshift();
      }
    } catch (_error) {
      ignored = _error;
      return this.clear();
    }
  };

  UndoManager.prototype.redo = function() {
    return this._change('redo', 'undo');
  };

  UndoManager.prototype.undo = function() {
    return this._change('undo', 'redo');
  };

  UndoManager.prototype._getLastChangeIndex = function(delta) {
    var lastIndex;
    lastIndex = 0;
    delta.apply(function(index, text) {
      return lastIndex = Math.max(index + text.length, lastIndex);
    }, function(index, length) {
      return lastIndex = Math.max(index, lastIndex);
    }, function(index, length) {
      return lastIndex = Math.max(index + length, lastIndex);
    });
    return lastIndex;
  };

  UndoManager.prototype._change = function(source, dest) {
    var change, index;
    if (this.stack[source].length > 0) {
      change = this.stack[source].pop();
      this.lastRecorded = 0;
      this.emittedDelta = change[source];
      this.quill.updateContents(change[source], 'user');
      this.emittedDelta = null;
      index = this._getLastChangeIndex(change[source]);
      this.quill.setSelection(index, index);
      return this.stack[dest].push(change);
    }
  };

  return UndoManager;

})();

module.exports = UndoManager;


},{"lodash":"4HJaAd","tandem-core":"38mxji"}],38:[function(_dereq_,module,exports){
var DOM, Normalizer, Utils, _;

_ = _dereq_('lodash');

DOM = _dereq_('./dom');

Utils = _dereq_('./utils');

Normalizer = {
  ALIASES: {
    'STRONG': 'B',
    'EM': 'I',
    'DEL': 'S',
    'STRIKE': 'S'
  },
  ATTRIBUTES: {
    'color': 'color',
    'face': 'fontFamily',
    'size': 'fontSize'
  },
  STYLES: {
    'background-color': 'background-color',
    'color': 'color',
    'font-family': 'font-family',
    'font-size': 'font-size',
    'text-align': 'text-align'
  },
  TAGS: {
    'P': 'P',
    'BR': 'BR',
    'SPAN': 'SPAN',
    'B': 'B',
    'I': 'I',
    'S': 'S',
    'U': 'U',
    'A': 'A',
    'IMG': 'IMG',
    'UL': 'UL',
    'LI': 'LI'
  },
  handleBreaks: function(lineNode) {
    var breaks;
    breaks = _.map(lineNode.querySelectorAll(DOM.DEFAULT_BREAK_TAG));
    _.each(breaks, (function(_this) {
      return function(br) {
        if ((br.nextSibling != null) && (!DOM.isIE(10) || (br.previousSibling != null))) {
          return Utils.splitAncestors(br.nextSibling, lineNode.parentNode);
        }
      };
    })(this));
    return lineNode;
  },
  normalizeLine: function(lineNode) {
    lineNode = Normalizer.wrapInline(lineNode);
    lineNode = Normalizer.handleBreaks(lineNode);
    lineNode = Normalizer.pullBlocks(lineNode);
    lineNode = Normalizer.normalizeNode(lineNode);
    Normalizer.unwrapText(lineNode);
    return lineNode;
  },
  normalizeNode: function(node) {
    if (DOM.isTextNode(node)) {
      return node;
    }
    _.each(Normalizer.ATTRIBUTES, function(style, attribute) {
      var value;
      if (node.hasAttribute(attribute)) {
        value = node.getAttribute(attribute);
        if (attribute === 'size') {
          value = Utils.convertFontSize(value);
        }
        node.style[style] = value;
        return node.removeAttribute(attribute);
      }
    });
    Normalizer.whitelistStyles(node);
    return Normalizer.whitelistTags(node);
  },
  optimizeLine: function(lineNode) {
    var lineNodeLength, node, nodes, _results;
    lineNodeLength = Utils.getNodeLength(lineNode);
    nodes = DOM.getDescendants(lineNode);
    _results = [];
    while (nodes.length > 0) {
      node = nodes.pop();
      if ((node != null ? node.parentNode : void 0) == null) {
        continue;
      }
      if (DOM.EMBED_TAGS[node.tagName] != null) {
        continue;
      }
      if (node.tagName === DOM.DEFAULT_BREAK_TAG) {
        if (lineNodeLength !== 0) {
          _results.push(DOM.removeNode(node));
        } else {
          _results.push(void 0);
        }
      } else if (Utils.getNodeLength(node) === 0) {
        nodes.push(node.nextSibling);
        _results.push(DOM.unwrap(node));
      } else if ((node.previousSibling != null) && node.tagName === node.previousSibling.tagName) {
        if (_.isEqual(DOM.getAttributes(node), DOM.getAttributes(node.previousSibling))) {
          nodes.push(node.firstChild);
          _results.push(Utils.mergeNodes(node.previousSibling, node));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  pullBlocks: function(lineNode) {
    var curNode;
    curNode = lineNode.firstChild;
    while (curNode != null) {
      if ((DOM.BLOCK_TAGS[curNode.tagName] != null) && curNode.tagName !== 'LI') {
        if (curNode.previousSibling != null) {
          Utils.splitAncestors(curNode, lineNode.parentNode);
        }
        if (curNode.nextSibling != null) {
          Utils.splitAncestors(curNode.nextSibling, lineNode.parentNode);
        }
        if (DOM.LIST_TAGS[curNode.tagName] == null) {
          DOM.unwrap(curNode);
          Normalizer.pullBlocks(lineNode);
        } else {
          DOM.unwrap(curNode.parentNode);
          if (lineNode.parentNode == null) {
            lineNode = curNode;
          }
        }
        break;
      }
      curNode = curNode.nextSibling;
    }
    return lineNode;
  },
  stripComments: function(html) {
    return html.replace(/<!--[\s\S]*?-->/g, '');
  },
  stripWhitespace: function(html) {
    html = html.replace(/^\s+/, '').replace(/\s+$/, '');
    html = html.replace(/\>\s+\</g, '><');
    return html;
  },
  whitelistStyles: function(node) {
    var original, styles;
    original = DOM.getStyles(node);
    styles = _.omit(original, function(value, key) {
      return Normalizer.STYLES[key] == null;
    });
    if (_.keys(styles).length < _.keys(original).length) {
      if (_.keys(styles).length > 0) {
        return DOM.setStyles(node, styles);
      } else {
        return node.removeAttribute('style');
      }
    }
  },
  whitelistTags: function(node) {
    if (!DOM.isElement(node)) {
      return node;
    }
    if (Normalizer.ALIASES[node.tagName] != null) {
      node = DOM.switchTag(node, Normalizer.ALIASES[node.tagName]);
    }
    if (Normalizer.TAGS[node.tagName] == null) {
      if (DOM.BLOCK_TAGS[node.tagName] != null) {
        node = DOM.switchTag(node, DOM.DEFAULT_BLOCK_TAG);
      } else if (!node.hasAttributes() && (node.firstChild != null)) {
        node = DOM.unwrap(node);
      } else {
        node = DOM.switchTag(node, DOM.DEFAULT_INLINE_TAG);
      }
    }
    return node;
  },
  wrapInline: function(lineNode) {
    var blockNode, nextNode;
    if (DOM.BLOCK_TAGS[lineNode.tagName] != null) {
      return lineNode;
    }
    blockNode = lineNode.ownerDocument.createElement(DOM.DEFAULT_BLOCK_TAG);
    lineNode.parentNode.insertBefore(blockNode, lineNode);
    while ((lineNode != null) && (DOM.BLOCK_TAGS[lineNode.tagName] == null)) {
      nextNode = lineNode.nextSibling;
      blockNode.appendChild(lineNode);
      lineNode = nextNode;
    }
    return blockNode;
  },
  unwrapText: function(lineNode) {
    var spans;
    spans = _.map(lineNode.querySelectorAll(DOM.DEFAULT_INLINE_TAG));
    return _.each(spans, function(span) {
      var attributes;
      attributes = DOM.getAttributes(span);
      if (_.keys(attributes).length === 0) {
        return DOM.unwrap(span);
      }
    });
  }
};

module.exports = Normalizer;


},{"./dom":20,"./utils":44,"lodash":"4HJaAd"}],39:[function(_dereq_,module,exports){
var DOM, Editor, EventEmitter2, Format, Modules, Quill, Range, Tandem, Themes, pkg, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

_ = _dereq_('lodash');

_.str = _dereq_('underscore.string');

pkg = _dereq_('../package.json');

EventEmitter2 = _dereq_('eventemitter2').EventEmitter2;

DOM = _dereq_('./dom');

Editor = _dereq_('./editor');

Format = _dereq_('./format');

Range = _dereq_('./lib/range');

Tandem = _dereq_('tandem-core');

Modules = {
  Authorship: _dereq_('./modules/authorship'),
  ImageTooltip: _dereq_('./modules/image-tooltip'),
  Keyboard: _dereq_('./modules/keyboard'),
  LinkTooltip: _dereq_('./modules/link-tooltip'),
  MultiCursor: _dereq_('./modules/multi-cursor'),
  PasteManager: _dereq_('./modules/paste-manager'),
  Toolbar: _dereq_('./modules/toolbar'),
  UndoManager: _dereq_('./modules/undo-manager')
};

Themes = {
  Default: _dereq_('./themes/default'),
  Snow: _dereq_('./themes/snow')
};

Quill = (function(_super) {
  __extends(Quill, _super);

  Quill.version = pkg.version;

  Quill.editors = [];

  Quill.Module = Modules;

  Quill.Theme = Themes;

  Quill.DEFAULTS = {
    formats: ['align', 'bold', 'italic', 'strike', 'underline', 'color', 'background', 'font', 'size', 'link', 'image', 'bullet', 'list'],
    modules: {
      'keyboard': true,
      'paste-manager': true,
      'undo-manager': true
    },
    pollInterval: 100,
    readOnly: false,
    theme: 'default'
  };

  Quill.events = {
    MODULE_INIT: 'module-init',
    POST_EVENT: 'post-event',
    PRE_EVENT: 'pre-event',
    SELECTION_CHANGE: 'selection-change',
    TEXT_CHANGE: 'text-change'
  };

  Quill.sources = {
    API: 'api',
    SILENT: 'silent',
    USER: 'user'
  };

  function Quill(container, options) {
    var html, moduleOptions, themeClass;
    if (options == null) {
      options = {};
    }
    if (_.isString(container)) {
      container = document.querySelector(container);
    }
    if (container == null) {
      throw new Error('Invalid Quill container');
    }
    moduleOptions = _.defaults(options.modules || {}, Quill.DEFAULTS.modules);
    html = container.innerHTML;
    this.options = _.defaults(options, Quill.DEFAULTS);
    this.options.modules = moduleOptions;
    this.options.id = this.id = "quill-" + (Quill.editors.length + 1);
    this.options.emitter = this;
    this.modules = {};
    this.editor = new Editor(container, this, this.options);
    this.root = this.editor.doc.root;
    Quill.editors.push(this);
    this.setHTML(html, Quill.sources.SILENT);
    themeClass = _.str.capitalize(_.str.camelize(this.options.theme));
    this.theme = new Quill.Theme[themeClass](this, this.options);
    _.each(this.options.modules, (function(_this) {
      return function(option, name) {
        return _this.addModule(name, option);
      };
    })(this));
  }

  Quill.prototype.addContainer = function(className, before) {
    if (before == null) {
      before = false;
    }
    return this.editor.renderer.addContainer(className, before);
  };

  Quill.prototype.addFormat = function(name, format) {
    return this.editor.doc.addFormat(name, format);
  };

  Quill.prototype.addModule = function(name, options) {
    var className, moduleClass;
    className = _.str.capitalize(_.str.camelize(name));
    moduleClass = Quill.Module[className];
    if (moduleClass == null) {
      throw new Error("Cannot load " + name + " module. Are you sure you included it?");
    }
    if (!_.isObject(options)) {
      options = {};
    }
    options = _.defaults(options, this.theme.constructor.OPTIONS[name] || {}, moduleClass.DEFAULTS || {});
    this.modules[name] = new moduleClass(this, options);
    this.emit(Quill.events.MODULE_INIT, name, this.modules[name]);
    return this.modules[name];
  };

  Quill.prototype.addStyles = function(styles) {
    return this.editor.renderer.addStyles(styles);
  };

  Quill.prototype.deleteText = function(start, end, source) {
    var delta, formats, _ref;
    if (source == null) {
      source = Quill.sources.API;
    }
    _ref = this._buildParams(start, end, {}, source), start = _ref[0], end = _ref[1], formats = _ref[2], source = _ref[3];
    if (!(end > start)) {
      return;
    }
    delta = Tandem.Delta.makeDeleteDelta(this.getLength(), start, end - start);
    return this.editor.applyDelta(delta, source);
  };

  Quill.prototype.emit = function() {
    var args, eventName;
    eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    Quill.__super__.emit.apply(this, [Quill.events.PRE_EVENT, eventName].concat(__slice.call(args)));
    Quill.__super__.emit.apply(this, [eventName].concat(__slice.call(args)));
    return Quill.__super__.emit.apply(this, [Quill.events.POST_EVENT, eventName].concat(__slice.call(args)));
  };

  Quill.prototype.focus = function() {
    return this.root.focus();
  };

  Quill.prototype.formatLine = function(start, end, name, value, source) {
    var formats, line, offset, _ref, _ref1;
    _ref = this._buildParams(start, end, name, value, source), start = _ref[0], end = _ref[1], formats = _ref[2], source = _ref[3];
    _ref1 = this.editor.doc.findLineAt(end), line = _ref1[0], offset = _ref1[1];
    if (line != null) {
      end += line.length - offset;
    }
    return this.formatText(start, end, formats, source);
  };

  Quill.prototype.formatText = function(start, end, name, value, source) {
    var delta, formats, _ref;
    _ref = this._buildParams(start, end, name, value, source), start = _ref[0], end = _ref[1], formats = _ref[2], source = _ref[3];
    formats = _.reduce(formats, (function(_this) {
      return function(formats, value, name) {
        var format;
        format = _this.editor.doc.formats[name];
        if (!(value && value !== format.config["default"])) {
          formats[name] = null;
        }
        return formats;
      };
    })(this), formats);
    delta = Tandem.Delta.makeRetainDelta(this.getLength(), start, end - start, formats);
    return this.editor.applyDelta(delta, source);
  };

  Quill.prototype.getContents = function(start, end) {
    var ops;
    if (start == null) {
      start = 0;
    }
    if (end == null) {
      end = null;
    }
    if (_.isObject(start)) {
      end = start.end;
      start = start.start;
    } else {
      if (end == null) {
        end = this.getLength();
      }
    }
    ops = this.editor.getDelta().getOpsAt(start, end - start);
    return new Tandem.Delta(0, ops);
  };

  Quill.prototype.getHTML = function() {
    return this.root.innerHTML;
  };

  Quill.prototype.getLength = function() {
    return this.editor.getDelta().endLength;
  };

  Quill.prototype.getModule = function(name) {
    return this.modules[name];
  };

  Quill.prototype.getSelection = function() {
    this.editor.checkUpdate();
    return this.editor.selection.getRange();
  };

  Quill.prototype.getText = function(start, end) {
    if (start == null) {
      start = 0;
    }
    if (end == null) {
      end = null;
    }
    return _.pluck(this.getContents(start, end).ops, 'value').join('');
  };

  Quill.prototype.insertEmbed = function(index, type, url, source) {
    return this.insertText(index, DOM.EMBED_TEXT, type, url, source);
  };

  Quill.prototype.insertText = function(index, text, name, value, source) {
    var delta, end, formats, _ref;
    _ref = this._buildParams(index, 0, name, value, source), index = _ref[0], end = _ref[1], formats = _ref[2], source = _ref[3];
    if (!(text.length > 0)) {
      return;
    }
    delta = Tandem.Delta.makeInsertDelta(this.getLength(), index, text, formats);
    return this.editor.applyDelta(delta, source);
  };

  Quill.prototype.onModuleLoad = function(name, callback) {
    if (this.modules[name]) {
      return callback(this.modules[name]);
    }
    return this.on(Quill.events.MODULE_INIT, function(moduleName, module) {
      if (moduleName === name) {
        return callback(module);
      }
    });
  };

  Quill.prototype.prepareFormat = function(name, value) {
    var format, range;
    format = this.editor.doc.formats[name];
    if (format == null) {
      return;
    }
    range = this.getSelection();
    if (!(range != null ? range.isCollapsed() : void 0)) {
      return;
    }
    if (format.isType(Format.types.LINE)) {
      return this.formatLine(range, name, value, Quill.sources.USER);
    } else {
      return format.prepare(value);
    }
  };

  Quill.prototype.setContents = function(delta, source) {
    if (source == null) {
      source = Quill.sources.API;
    }
    if (_.isArray(delta)) {
      delta = {
        startLength: this.getLength(),
        ops: delta
      };
    } else {
      delta.startLength = this.getLength();
    }
    return this.updateContents(delta, source);
  };

  Quill.prototype.setHTML = function(html, source) {
    if (source == null) {
      source = Quill.sources.API;
    }
    if (!html) {
      html = "<" + DOM.DEFAULT_BLOCK_TAG + "><" + DOM.DEFAULT_BREAK_TAG + "></" + DOM.DEFAULT_BLOCK_TAG + ">";
    }
    this.editor.doc.setHTML(html);
    return this.editor.checkUpdate(source);
  };

  Quill.prototype.setSelection = function(start, end, source) {
    var range;
    if (source == null) {
      source = Quill.sources.API;
    }
    if (_.isNumber(start) && _.isNumber(end)) {
      range = new Range(start, end);
    } else {
      range = start;
      source = end || source;
    }
    return this.editor.selection.setRange(range, source);
  };

  Quill.prototype.updateContents = function(delta, source) {
    if (source == null) {
      source = Quill.sources.API;
    }
    delta = Tandem.Delta.makeDelta(delta);
    return this.editor.applyDelta(delta, source);
  };

  Quill.prototype._buildParams = function() {
    var formats, params;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (_.isObject(params[0])) {
      params.splice(0, 1, params[0].start, params[0].end);
    }
    if (_.isString(params[2])) {
      formats = {};
      formats[params[2]] = params[3];
      params.splice(2, 2, formats);
    }
    if (params[3] == null) {
      params[3] = Quill.sources.API;
    }
    return params;
  };

  return Quill;

})(EventEmitter2);

module.exports = Quill;


},{"../package.json":18,"./dom":20,"./editor":21,"./format":22,"./lib/range":27,"./modules/authorship":29,"./modules/image-tooltip":30,"./modules/keyboard":31,"./modules/link-tooltip":32,"./modules/multi-cursor":33,"./modules/paste-manager":34,"./modules/toolbar":35,"./modules/undo-manager":37,"./themes/default":42,"./themes/snow":43,"eventemitter2":"x/3aRz","lodash":"4HJaAd","tandem-core":"38mxji","underscore.string":"Fq7WE+"}],40:[function(_dereq_,module,exports){
var DEFAULT_STYLES, DOM, LIST_STYLES, Normalizer, Renderer, Utils, rule, _;

_ = _dereq_('lodash');

DOM = _dereq_('./dom');

Utils = _dereq_('./utils');

Normalizer = _dereq_('./normalizer');

DEFAULT_STYLES = {
  'html': {
    'height': '100%',
    'width': '100%'
  },
  'body': {
    'box-sizing': 'border-box',
    'cursor': 'text',
    'font-family': "'Helvetica', 'Arial', sans-serif",
    'font-size': '13px',
    'height': '100%',
    'line-height': '1.42',
    'margin': '0px',
    'overflow-x': 'hidden',
    'overflow-y': 'auto',
    'padding': '12px 15px'
  },
  '.editor-container': {
    'height': '100%',
    'outline': 'none',
    'position': 'relative',
    'tab-size': '4',
    'white-space': 'pre-wrap'
  },
  '.editor-container p': {
    'margin': '0',
    'padding': '0'
  },
  '.editor-container a': {
    'text-decoration': 'underline'
  },
  '.editor-container b': {
    'font-weight': 'bold'
  },
  '.editor-container i': {
    'font-style': 'italic'
  },
  '.editor-container s': {
    'text-decoration': 'line-through'
  },
  '.editor-container u': {
    'text-decoration': 'underline'
  },
  '.editor-container img': {
    'max-width': '100%'
  },
  '.editor-container blockquote': {
    'margin': '0 0 0 2em',
    'padding': '0'
  },
  '.editor-container ol': {
    'margin': '0 0 0 2em',
    'padding': '0',
    'list-style-type': 'decimal'
  },
  '.editor-container ul': {
    'margin': '0 0 0 2em',
    'padding': '0',
    'list-style-type': 'disc'
  }
};

LIST_STYLES = ['decimal', 'lower-alpha', 'lower-roman'];

rule = '.editor-container ol > li';

_.each([1, 2, 3, 4, 5, 6, 7, 8, 9], function(i) {
  rule += ' > ol';
  DEFAULT_STYLES[rule] = {
    'list-style-type': LIST_STYLES[i % 3]
  };
  return rule += ' > li';
});

if (Utils.isIE(10)) {
  DEFAULT_STYLES[DOM.DEFAULT_BREAK_TAG] = {
    'display': 'none'
  };
}

Renderer = (function() {
  Renderer.objToCss = function(obj) {
    return _.map(obj, function(value, key) {
      var innerStr;
      innerStr = _.map(value, function(innerValue, innerKey) {
        return "" + innerKey + ": " + innerValue + ";";
      }).join(' ');
      return "" + key + " { " + innerStr + " }";
    }).join("\n");
  };

  Renderer.buildFrame = function(container) {
    var iframe, iframeDoc, root;
    iframe = container.ownerDocument.createElement('iframe');
    DOM.setAttributes(iframe, {
      frameBorder: '0',
      height: '100%',
      width: '100%',
      title: 'Quill Rich Text Editor',
      role: 'presentation'
    });
    container.appendChild(iframe);
    iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write('<!DOCTYPE html>');
    iframeDoc.close();
    root = iframeDoc.createElement('div');
    iframeDoc.body.appendChild(root);
    return [root, iframe];
  };

  function Renderer(container, options) {
    var _ref;
    this.container = container;
    this.options = options != null ? options : {};
    this.container.innerHTML = '';
    _ref = Renderer.buildFrame(this.container), this.root = _ref[0], this.iframe = _ref[1];
    this.root.id = this.options.id;
    DOM.addClass(this.root, 'editor-container');
    DOM.addClass(this.container, 'ql-container');
    DOM.addEventListener(this.container, 'focus', (function(_this) {
      return function() {
        return _this.root.focus();
      };
    })(this));
    if (DOM.isIOS()) {
      DOM.addStyles(this.container, {
        'overflow': 'auto',
        '-webkit-overflow-scrolling': 'touch'
      });
    }
    this.addStyles(DEFAULT_STYLES);
    if (this.options.styles != null) {
      _.defer(_.bind(this.addStyles, this, this.options.styles));
    }
  }

  Renderer.prototype.addContainer = function(className, before) {
    var container, refNode;
    if (before == null) {
      before = false;
    }
    refNode = before ? this.root : null;
    container = this.root.ownerDocument.createElement('div');
    DOM.addClass(container, className);
    this.root.parentNode.insertBefore(container, refNode);
    return container;
  };

  Renderer.prototype.addStyles = function(css) {
    var link, style;
    if (typeof css === 'object') {
      style = this.root.ownerDocument.createElement('style');
      style.type = 'text/css';
      css = Renderer.objToCss(css);
      style.appendChild(this.root.ownerDocument.createTextNode(css));
      return this.root.ownerDocument.head.appendChild(style);
    } else if (typeof css === 'string') {
      link = this.root.ownerDocument.createElement('link');
      DOM.setAttributes(link, {
        type: 'text/css',
        rel: 'stylesheet',
        href: css
      });
      return this.root.ownerDocument.head.appendChild(link);
    }
  };

  return Renderer;

})();

module.exports = Renderer;


},{"./dom":20,"./normalizer":38,"./utils":44,"lodash":"4HJaAd"}],41:[function(_dereq_,module,exports){
var DOM, Leaf, Normalizer, Range, Selection, Utils, _;

_ = _dereq_('lodash');

DOM = _dereq_('./dom');

Leaf = _dereq_('./leaf');

Normalizer = _dereq_('./normalizer');

Range = _dereq_('./lib/range');

Utils = _dereq_('./utils');

Selection = (function() {
  function Selection(doc, iframe, emitter) {
    this.doc = doc;
    this.iframe = iframe;
    this.emitter = emitter;
    this.document = this.doc.root.ownerDocument;
    this.range = this.getRange();
    this.nullDelay = false;
  }

  Selection.prototype.checkFocus = function() {
    if (this.document.activeElement !== this.doc.root) {
      return false;
    }
    if ((document.activeElement != null) && document.activeElement.tagName === 'IFRAME') {
      return document.activeElement === this.iframe;
    }
    return true;
  };

  Selection.prototype.getRange = function() {
    var end, nativeRange, start;
    if (!this.checkFocus()) {
      return null;
    }
    nativeRange = this._getNativeRange();
    if (nativeRange == null) {
      return null;
    }
    start = this._positionToIndex(nativeRange.startContainer, nativeRange.startOffset);
    if (nativeRange.startContainer === nativeRange.endContainer && nativeRange.startOffset === nativeRange.endOffset) {
      end = start;
    } else {
      end = this._positionToIndex(nativeRange.endContainer, nativeRange.endOffset);
    }
    return new Range(Math.min(start, end), Math.max(start, end));
  };

  Selection.prototype.preserve = function(fn) {
    var endNode, endOffset, nativeRange, startNode, startOffset, _ref, _ref1, _ref2, _ref3;
    nativeRange = this._getNativeRange();
    if ((nativeRange != null) && this.checkFocus()) {
      _ref = this._encodePosition(nativeRange.startContainer, nativeRange.startOffset), startNode = _ref[0], startOffset = _ref[1];
      _ref1 = this._encodePosition(nativeRange.endContainer, nativeRange.endOffset), endNode = _ref1[0], endOffset = _ref1[1];
      fn();
      _ref2 = this._decodePosition(startNode, startOffset), startNode = _ref2[0], startOffset = _ref2[1];
      _ref3 = this._decodePosition(endNode, endOffset), endNode = _ref3[0], endOffset = _ref3[1];
      return this._setNativeRange(startNode, startOffset, endNode, endOffset);
    } else {
      return fn();
    }
  };

  Selection.prototype.setRange = function(range, source) {
    var endNode, endOffset, startNode, startOffset, _ref, _ref1, _ref2;
    if (range != null) {
      _ref = this._indexToPosition(range.start), startNode = _ref[0], startOffset = _ref[1];
      if (range.isCollapsed()) {
        _ref1 = [startNode, startOffset], endNode = _ref1[0], endOffset = _ref1[1];
      } else {
        _ref2 = this._indexToPosition(range.end), endNode = _ref2[0], endOffset = _ref2[1];
      }
      this._setNativeRange(startNode, startOffset, endNode, endOffset);
    } else {
      this._setNativeRange(null);
    }
    return this.update(source);
  };

  Selection.prototype.shiftAfter = function(index, length, fn) {
    var range;
    range = this.getRange();
    fn();
    if (range != null) {
      range.shift(index, length);
      return this.setRange(range, 'silent');
    }
  };

  Selection.prototype.update = function(source) {
    var emit, range;
    range = this.getRange();
    emit = source !== 'silent' && !Range.compare(range, this.range);
    if (range === null && source === 'user' && !this.nullDelay) {
      return this.nullDelay = true;
    } else {
      this.nullDelay = false;
      this.range = range;
      if (emit) {
        return this.emitter.emit(this.emitter.constructor.events.SELECTION_CHANGE, range, source);
      }
    }
  };

  Selection.prototype._decodePosition = function(node, offset) {
    var childIndex;
    if (DOM.isElement(node)) {
      childIndex = _.indexOf(DOM.getChildNodes(node.parentNode), node);
      offset += childIndex;
      node = node.parentNode;
    }
    return [node, offset];
  };

  Selection.prototype._encodePosition = function(node, offset) {
    var text;
    while (true) {
      if (DOM.isTextNode(node) || node.tagName === DOM.DEFAULT_BREAK_TAG || (DOM.EMBED_TAGS[node.tagName] != null)) {
        return [node, offset];
      } else if (offset < node.childNodes.length) {
        node = node.childNodes[offset];
        offset = 0;
      } else if (node.childNodes.length === 0) {
        if (Normalizer.TAGS[node.tagName] == null) {
          text = node.ownerDocument.createTextNode('');
          node.appendChild(text);
          node = text;
        }
        return [node, 0];
      } else {
        node = node.lastChild;
        if (DOM.isElement(node)) {
          if (node.tagName === DOM.DEFAULT_BREAK_TAG || (DOM.EMBED_TAGS[node.tagName] != null)) {
            return [node, 1];
          } else {
            offset = node.childNodes.length;
          }
        } else {
          return [node, Utils.getNodeLength(node)];
        }
      }
    }
  };

  Selection.prototype._getNativeSelection = function() {
    if (this.document.getSelection != null) {
      return this.document.getSelection();
    } else {
      return null;
    }
  };

  Selection.prototype._getNativeRange = function() {
    var selection;
    selection = this._getNativeSelection();
    if ((selection != null ? selection.rangeCount : void 0) > 0) {
      return selection.getRangeAt(0);
    } else {
      return null;
    }
  };

  Selection.prototype._indexToPosition = function(index) {
    var leaf, offset, _ref;
    if (this.doc.lines.length === 0) {
      return [this.doc.root, 0];
    }
    _ref = this.doc.findLeafAt(index, true), leaf = _ref[0], offset = _ref[1];
    return this._decodePosition(leaf.node, offset);
  };

  Selection.prototype._positionToIndex = function(node, offset) {
    var leaf, leafNode, leafOffset, line, lineOffset, _ref;
    _ref = this._encodePosition(node, offset), leafNode = _ref[0], offset = _ref[1];
    line = this.doc.findLine(leafNode);
    if (line == null) {
      return 0;
    }
    leaf = line.findLeaf(leafNode);
    lineOffset = 0;
    while (line.prev != null) {
      line = line.prev;
      lineOffset += line.length;
    }
    if (leaf == null) {
      return lineOffset;
    }
    leafOffset = 0;
    while (leaf.prev != null) {
      leaf = leaf.prev;
      leafOffset += leaf.length;
    }
    return lineOffset + leafOffset + offset;
  };

  Selection.prototype._setNativeRange = function(startNode, startOffset, endNode, endOffset) {
    var nativeRange, selection;
    selection = this._getNativeSelection();
    if (!selection) {
      return;
    }
    if (startNode != null) {
      this.doc.root.focus();
      nativeRange = this._getNativeRange();
      if ((nativeRange == null) || startNode !== nativeRange.startContainer || startOffset !== nativeRange.startOffset || endNode !== nativeRange.endContainer || endOffset !== nativeRange.endOffset) {
        if (nativeRange != null) {
          selection.removeAllRanges();
        }
        selection.removeAllRanges();
        nativeRange = this.document.createRange();
        nativeRange.setStart(startNode, startOffset);
        nativeRange.setEnd(endNode, endOffset);
        selection.addRange(nativeRange);
        return this.doc.root.focus();
      }
    } else {
      selection.removeAllRanges();
      return this.doc.root.blur();
    }
  };

  return Selection;

})();

module.exports = Selection;


},{"./dom":20,"./leaf":23,"./lib/range":27,"./normalizer":38,"./utils":44,"lodash":"4HJaAd"}],42:[function(_dereq_,module,exports){
var DefaultTheme;

DefaultTheme = (function() {
  DefaultTheme.OPTIONS = {};

  function DefaultTheme(quill) {
    this.quill = quill;
    this.editor = this.quill.editor;
    this.editorContainer = this.editor.root;
  }

  return DefaultTheme;

})();

module.exports = DefaultTheme;


},{}],43:[function(_dereq_,module,exports){
var ColorPicker, DOM, DefaultTheme, Picker, SnowTheme, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = _dereq_('lodash');

ColorPicker = _dereq_('../../lib/color-picker');

DefaultTheme = _dereq_('../default');

DOM = _dereq_('../../dom');

Picker = _dereq_('../../lib/picker');

SnowTheme = (function(_super) {
  __extends(SnowTheme, _super);

  SnowTheme.COLORS = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008A00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];

  SnowTheme.OPTIONS = {
    'multi-cursor': {
      template: '<span class="cursor-flag"> <span class="cursor-triangle top"></span> <span class="cursor-name"></span> <span class="cursor-triangle bottom"></span> </span> <span class="cursor-caret"></span>'
    }
  };

  SnowTheme.STYLES = {
    '.snow .image-tooltip-container a': {
      'border': '1px solid #06c'
    },
    '.snow .image-tooltip-container a.insert': {
      'background-color': '#06c',
      'color': '#fff'
    },
    '.snow .cursor-name': {
      'border-radius': '4px',
      'font-size': '11px',
      'font-family': 'Arial',
      'margin-left': '-50%',
      'padding': '4px 10px'
    },
    '.snow .cursor-triangle': {
      'border-left': '4px solid transparent',
      'border-right': '4px solid transparent',
      'height': '0px',
      'margin-left': '-3px',
      'width': '0px'
    },
    '.snow .cursor.left .cursor-name': {
      'margin-left': '-8px'
    },
    '.snow .cursor.right .cursor-flag': {
      'right': 'auto'
    },
    '.snow .cursor.right .cursor-name': {
      'margin-left': '-100%',
      'margin-right': '-8px'
    },
    '.snow .cursor-triangle.bottom': {
      'border-top': '4px solid transparent',
      'display': 'block',
      'margin-bottom': '-1px'
    },
    '.snow .cursor-triangle.top': {
      'border-bottom': '4px solid transparent',
      'display': 'none',
      'margin-top': '-1px'
    },
    '.snow .cursor.top .cursor-triangle.bottom': {
      'display': 'none'
    },
    '.snow .cursor.top .cursor-triangle.top': {
      'display': 'block'
    },
    '.snow a': {
      'color': '#06c'
    },
    '.snow .tooltip': {
      'border': '1px solid #ccc',
      'box-shadow': '0px 0px 5px #ddd',
      'color': '#222'
    },
    '.snow .tooltip a': {
      'color': '#06c'
    },
    '.snow .tooltip .input': {
      'border': '1px solid #ccc',
      'margin': '0px',
      'padding': '5px'
    },
    '.snow .image-tooltip-container .preview': {
      'border-color': '#ccc',
      'color': '#ccc'
    },
    '.snow .link-tooltip-container a, .snow .link-tooltip-container span': {
      'display': 'inline-block',
      'line-height': '25px'
    }
  };

  function SnowTheme(quill) {
    this.quill = quill;
    SnowTheme.__super__.constructor.apply(this, arguments);
    this.quill.addStyles(SnowTheme.STYLES);
    this.pickers = [];
    this.quill.on(this.quill.constructor.events.SELECTION_CHANGE, (function(_this) {
      return function(range) {
        if (range != null) {
          return _.invoke(_this.pickers, 'close');
        }
      };
    })(this));
    DOM.addClass(this.quill.root.ownerDocument.body, 'snow');
    this.quill.onModuleLoad('multi-cursor', _.bind(this.extendMultiCursor, this));
    this.quill.onModuleLoad('toolbar', _.bind(this.extendToolbar, this));
  }

  SnowTheme.prototype.extendMultiCursor = function(module) {
    return module.on(module.constructor.events.CURSOR_ADDED, function(cursor) {
      var bottomTriangle, topTriangle;
      bottomTriangle = cursor.elem.querySelector('.cursor-triangle.bottom');
      topTriangle = cursor.elem.querySelector('.cursor-triangle.top');
      return bottomTriangle.style.borderTopColor = topTriangle.style.borderBottomColor = cursor.color;
    });
  };

  SnowTheme.prototype.extendToolbar = function(module) {
    _.each(['color', 'background', 'font', 'size', 'align'], (function(_this) {
      return function(format) {
        var picker, select;
        select = module.container.querySelector(".ql-" + format);
        if (select == null) {
          return;
        }
        switch (format) {
          case 'font':
          case 'size':
          case 'align':
            picker = new Picker(select);
            break;
          case 'color':
          case 'background':
            picker = new ColorPicker(select);
            _.each(picker.container.querySelectorAll('.ql-picker-item'), function(item, i) {
              if (i < 7) {
                return DOM.addClass(item, 'ql-primary-color');
              }
            });
        }
        if (picker != null) {
          return _this.pickers.push(picker);
        }
      };
    })(this));
    return _.each(DOM.getTextNodes(module.container), function(node) {
      if (DOM.getText(node).trim().length === 0) {
        return DOM.removeNode(node);
      }
    });
  };

  return SnowTheme;

})(DefaultTheme);

module.exports = SnowTheme;


},{"../../dom":20,"../../lib/color-picker":24,"../../lib/picker":26,"../default":42,"lodash":"4HJaAd"}],44:[function(_dereq_,module,exports){
var DOM, Utils, _;

_ = _dereq_('lodash');

DOM = _dereq_('./dom');

Utils = {
  convertFontSize: function(size) {
    var i, s, sources, targets;
    if (_.isString(size) && size.indexOf('px') > -1) {
      sources = _.keys(DOM.FONT_SIZES);
      targets = _.values(DOM.FONT_SIZES);
    } else {
      targets = _.keys(DOM.FONT_SIZES);
      sources = _.values(DOM.FONT_SIZES);
    }
    for (i in sources) {
      s = sources[i];
      if (parseInt(size) <= parseInt(s)) {
        return targets[i];
      }
    }
    return _.last(targets);
  },
  getChildAtOffset: function(node, offset) {
    var child, length;
    child = node.firstChild;
    length = Utils.getNodeLength(child);
    while (child != null) {
      if (offset < length) {
        break;
      }
      offset -= length;
      child = child.nextSibling;
      length = Utils.getNodeLength(child);
    }
    if (child == null) {
      child = node.lastChild;
      offset = Utils.getNodeLength(child);
    }
    return [child, offset];
  },
  getNextLineNode: function(curNode, root) {
    var nextNode;
    nextNode = curNode.nextSibling;
    if ((nextNode == null) && curNode.parentNode !== root) {
      nextNode = curNode.parentNode.nextSibling;
    }
    if ((nextNode != null) && (DOM.LIST_TAGS[nextNode.tagName] != null)) {
      nextNode = nextNode.firstChild;
    }
    return nextNode;
  },
  getNodeLength: function(node) {
    var length;
    if (node == null) {
      return 0;
    }
    length = DOM.getText(node).length;
    if (DOM.isElement(node)) {
      length += node.querySelectorAll(_.keys(DOM.EMBED_TAGS).join(',')).length;
    }
    return length;
  },
  isIE: function(maxVersion) {
    var version;
    version = document.documentMode;
    return version && maxVersion >= version;
  },
  mergeNodes: function(newNode, oldNode) {
    var text;
    if (DOM.isElement(newNode)) {
      DOM.moveChildren(newNode, oldNode);
      DOM.normalize(newNode);
    } else {
      text = DOM.getText(newNode) + DOM.getText(oldNode);
      DOM.setText(newNode, text);
    }
    return DOM.removeNode(oldNode);
  },
  splitAncestors: function(refNode, root, force) {
    var nextNode, parentClone, parentNode;
    if (force == null) {
      force = false;
    }
    if (refNode === root || refNode.parentNode === root) {
      return refNode;
    }
    if ((refNode.previousSibling != null) || force) {
      parentNode = refNode.parentNode;
      parentClone = parentNode.cloneNode(false);
      parentNode.parentNode.insertBefore(parentClone, parentNode.nextSibling);
      while (refNode != null) {
        nextNode = refNode.nextSibling;
        parentClone.appendChild(refNode);
        refNode = nextNode;
      }
      return Utils.splitAncestors(parentClone, root);
    } else {
      return Utils.splitAncestors(refNode.parentNode, root);
    }
  },
  splitNode: function(node, offset, force) {
    var after, child, childLeft, childRight, left, nextRight, nodeLength, right, _ref, _ref1;
    if (force == null) {
      force = false;
    }
    nodeLength = Utils.getNodeLength(node);
    offset = Math.max(0, offset);
    offset = Math.min(offset, nodeLength);
    if (!(force || offset !== 0)) {
      return [node.previousSibling, node, false];
    }
    if (!(force || offset !== nodeLength)) {
      return [node, node.nextSibling, false];
    }
    if (node.nodeType === DOM.TEXT_NODE) {
      after = node.splitText(offset);
      return [node, after, true];
    } else {
      left = node;
      right = node.cloneNode(false);
      node.parentNode.insertBefore(right, left.nextSibling);
      _ref = Utils.getChildAtOffset(node, offset), child = _ref[0], offset = _ref[1];
      _ref1 = Utils.splitNode(child, offset), childLeft = _ref1[0], childRight = _ref1[1];
      while (childRight !== null) {
        nextRight = childRight.nextSibling;
        right.appendChild(childRight);
        childRight = nextRight;
      }
      return [left, right, true];
    }
  }
};

module.exports = Utils;


},{"./dom":20,"lodash":"4HJaAd"}]},{},[39])
(39)
});