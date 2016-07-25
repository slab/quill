/*!
 * Quill Editor v1.0.0-beta.8
 * https://quilljs.com/
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Quill"] = factory();
	else
		root["Quill"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _quill = __webpack_require__(1);

	var _quill2 = _interopRequireDefault(_quill);

	__webpack_require__(109);

	__webpack_require__(110);

	__webpack_require__(111);

	__webpack_require__(112);

	__webpack_require__(113);

	__webpack_require__(114);

	__webpack_require__(115);

	__webpack_require__(116);

	__webpack_require__(117);

	__webpack_require__(118);

	__webpack_require__(119);

	__webpack_require__(120);

	__webpack_require__(121);

	__webpack_require__(122);

	__webpack_require__(123);

	__webpack_require__(124);

	__webpack_require__(125);

	__webpack_require__(126);

	__webpack_require__(127);

	__webpack_require__(128);

	__webpack_require__(129);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _quill2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _core = __webpack_require__(2);

	var _core2 = _interopRequireDefault(_core);

	var _align = __webpack_require__(46);

	var _direction = __webpack_require__(49);

	var _indent = __webpack_require__(54);

	var _blockquote = __webpack_require__(55);

	var _blockquote2 = _interopRequireDefault(_blockquote);

	var _header = __webpack_require__(56);

	var _header2 = _interopRequireDefault(_header);

	var _list = __webpack_require__(57);

	var _list2 = _interopRequireDefault(_list);

	var _background = __webpack_require__(47);

	var _color = __webpack_require__(48);

	var _font = __webpack_require__(50);

	var _size = __webpack_require__(51);

	var _bold = __webpack_require__(58);

	var _bold2 = _interopRequireDefault(_bold);

	var _italic = __webpack_require__(59);

	var _italic2 = _interopRequireDefault(_italic);

	var _link = __webpack_require__(60);

	var _link2 = _interopRequireDefault(_link);

	var _script = __webpack_require__(61);

	var _script2 = _interopRequireDefault(_script);

	var _strike = __webpack_require__(62);

	var _strike2 = _interopRequireDefault(_strike);

	var _underline = __webpack_require__(63);

	var _underline2 = _interopRequireDefault(_underline);

	var _image = __webpack_require__(64);

	var _image2 = _interopRequireDefault(_image);

	var _video = __webpack_require__(65);

	var _video2 = _interopRequireDefault(_video);

	var _code = __webpack_require__(32);

	var _code2 = _interopRequireDefault(_code);

	var _formula = __webpack_require__(66);

	var _formula2 = _interopRequireDefault(_formula);

	var _syntax = __webpack_require__(67);

	var _syntax2 = _interopRequireDefault(_syntax);

	var _toolbar = __webpack_require__(68);

	var _toolbar2 = _interopRequireDefault(_toolbar);

	var _icons = __webpack_require__(69);

	var _icons2 = _interopRequireDefault(_icons);

	var _picker = __webpack_require__(101);

	var _picker2 = _interopRequireDefault(_picker);

	var _colorPicker = __webpack_require__(103);

	var _colorPicker2 = _interopRequireDefault(_colorPicker);

	var _iconPicker = __webpack_require__(104);

	var _iconPicker2 = _interopRequireDefault(_iconPicker);

	var _tooltip = __webpack_require__(105);

	var _tooltip2 = _interopRequireDefault(_tooltip);

	var _bubble = __webpack_require__(106);

	var _bubble2 = _interopRequireDefault(_bubble);

	var _snow = __webpack_require__(108);

	var _snow2 = _interopRequireDefault(_snow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_core2.default.register({
	  'attributors/class/background': _background.BackgroundClass,
	  'attributors/class/color': _color.ColorClass,
	  'attributors/class/font': _font.FontClass,
	  'attributors/class/size': _size.SizeClass,
	  'attributors/style/background': _background.BackgroundStyle,
	  'attributors/style/color': _color.ColorStyle,
	  'attributors/style/font': _font.FontStyle,
	  'attributors/style/size': _size.SizeStyle
	}, true);

	_core2.default.register({
	  'formats/align': _align.AlignClass,
	  'formats/direction': _direction.DirectionClass,
	  'formats/indent': _indent.IndentClass,

	  'formats/background': _background.BackgroundStyle,
	  'formats/color': _color.ColorStyle,
	  'formats/font': _font.FontClass,
	  'formats/size': _size.SizeClass,

	  'formats/blockquote': _blockquote2.default,
	  'formats/code-block': _code2.default,
	  'formats/header': _header2.default,
	  'formats/list': _list2.default,

	  'formats/bold': _bold2.default,
	  'formats/code': _code.Code,
	  'formats/italic': _italic2.default,
	  'formats/link': _link2.default,
	  'formats/script': _script2.default,
	  'formats/strike': _strike2.default,
	  'formats/underline': _underline2.default,

	  'formats/image': _image2.default,
	  'formats/video': _video2.default,

	  'formats/list/item': _list.ListItem,

	  'modules/formula': _formula2.default,
	  'modules/syntax': _syntax2.default,
	  'modules/toolbar': _toolbar2.default,

	  'themes/bubble': _bubble2.default,
	  'themes/snow': _snow2.default,

	  'ui/icons': _icons2.default,
	  'ui/picker': _picker2.default,
	  'ui/icon-picker': _iconPicker2.default,
	  'ui/color-picker': _colorPicker2.default,
	  'ui/tooltip': _tooltip2.default
	}, true);

	module.exports = _core2.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(19);

	var _quill2 = _interopRequireDefault(_quill);

	var _block = __webpack_require__(33);

	var _block2 = _interopRequireDefault(_block);

	var _break = __webpack_require__(34);

	var _break2 = _interopRequireDefault(_break);

	var _container = __webpack_require__(42);

	var _container2 = _interopRequireDefault(_container);

	var _cursor = __webpack_require__(43);

	var _cursor2 = _interopRequireDefault(_cursor);

	var _embed = __webpack_require__(35);

	var _embed2 = _interopRequireDefault(_embed);

	var _inline = __webpack_require__(36);

	var _inline2 = _interopRequireDefault(_inline);

	var _scroll = __webpack_require__(44);

	var _scroll2 = _interopRequireDefault(_scroll);

	var _text = __webpack_require__(37);

	var _text2 = _interopRequireDefault(_text);

	var _clipboard = __webpack_require__(45);

	var _clipboard2 = _interopRequireDefault(_clipboard);

	var _history = __webpack_require__(52);

	var _history2 = _interopRequireDefault(_history);

	var _keyboard = __webpack_require__(53);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_quill2.default.register({
	  'blots/block': _block2.default,
	  'blots/block/embed': _block.BlockEmbed,
	  'blots/break': _break2.default,
	  'blots/container': _container2.default,
	  'blots/cursor': _cursor2.default,
	  'blots/embed': _embed2.default,
	  'blots/inline': _inline2.default,
	  'blots/scroll': _scroll2.default,
	  'blots/text': _text2.default,

	  'modules/clipboard': _clipboard2.default,
	  'modules/history': _history2.default,
	  'modules/keyboard': _keyboard2.default
	});

	_parchment2.default.register(_block2.default, _break2.default, _cursor2.default, _inline2.default, _scroll2.default, _text2.default);

	exports.default = _quill2.default;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var container_1 = __webpack_require__(4);
	var format_1 = __webpack_require__(8);
	var leaf_1 = __webpack_require__(13);
	var scroll_1 = __webpack_require__(14);
	var inline_1 = __webpack_require__(15);
	var block_1 = __webpack_require__(16);
	var embed_1 = __webpack_require__(17);
	var text_1 = __webpack_require__(18);
	var attributor_1 = __webpack_require__(9);
	var class_1 = __webpack_require__(11);
	var style_1 = __webpack_require__(12);
	var store_1 = __webpack_require__(10);
	var Registry = __webpack_require__(7);
	var Parchment = {
	    Scope: Registry.Scope,
	    create: Registry.create,
	    find: Registry.find,
	    query: Registry.query,
	    register: Registry.register,
	    Container: container_1.default,
	    Format: format_1.default,
	    Leaf: leaf_1.default,
	    Embed: embed_1.default,
	    Scroll: scroll_1.default,
	    Block: block_1.default,
	    Inline: inline_1.default,
	    Text: text_1.default,
	    Attributor: {
	        Attribute: attributor_1.default,
	        Class: class_1.default,
	        Style: style_1.default,
	        Store: store_1.default
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Parchment;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var linked_list_1 = __webpack_require__(5);
	var shadow_1 = __webpack_require__(6);
	var Registry = __webpack_require__(7);
	var ContainerBlot = (function (_super) {
	    __extends(ContainerBlot, _super);
	    function ContainerBlot() {
	        _super.apply(this, arguments);
	    }
	    ContainerBlot.prototype.appendChild = function (other) {
	        this.insertBefore(other);
	    };
	    ContainerBlot.prototype.attach = function () {
	        var _this = this;
	        _super.prototype.attach.call(this);
	        this.children = new linked_list_1.default();
	        // Need to be reversed for if DOM nodes already in order
	        [].slice.call(this.domNode.childNodes).reverse().forEach(function (node) {
	            try {
	                var child = makeBlot(node);
	                _this.insertBefore(child, _this.children.head);
	            }
	            catch (err) {
	                if (err instanceof Registry.ParchmentError)
	                    return;
	                else
	                    throw err;
	            }
	        });
	    };
	    ContainerBlot.prototype.deleteAt = function (index, length) {
	        if (index === 0 && length === this.length()) {
	            return this.remove();
	        }
	        this.children.forEachAt(index, length, function (child, offset, length) {
	            child.deleteAt(offset, length);
	        });
	    };
	    ContainerBlot.prototype.descendant = function (criteria, index) {
	        var _a = this.children.find(index), child = _a[0], offset = _a[1];
	        if ((criteria.blotName == null && criteria(child)) ||
	            (criteria.blotName != null && child instanceof criteria)) {
	            return [child, offset];
	        }
	        else if (child instanceof ContainerBlot) {
	            return child.descendant(criteria, offset);
	        }
	        else {
	            return [null, -1];
	        }
	    };
	    ContainerBlot.prototype.descendants = function (criteria, index, length) {
	        if (index === void 0) { index = 0; }
	        if (length === void 0) { length = Number.MAX_VALUE; }
	        var descendants = [], lengthLeft = length;
	        this.children.forEachAt(index, length, function (child, index, length) {
	            if ((criteria.blotName == null && criteria(child)) ||
	                (criteria.blotName != null && child instanceof criteria)) {
	                descendants.push(child);
	            }
	            if (child instanceof ContainerBlot) {
	                descendants = descendants.concat(child.descendants(criteria, index, lengthLeft));
	            }
	            lengthLeft -= length;
	        });
	        return descendants;
	    };
	    ContainerBlot.prototype.detach = function () {
	        this.children.forEach(function (child) {
	            child.detach();
	        });
	        _super.prototype.detach.call(this);
	    };
	    ContainerBlot.prototype.formatAt = function (index, length, name, value) {
	        this.children.forEachAt(index, length, function (child, offset, length) {
	            child.formatAt(offset, length, name, value);
	        });
	    };
	    ContainerBlot.prototype.insertAt = function (index, value, def) {
	        var _a = this.children.find(index), child = _a[0], offset = _a[1];
	        if (child) {
	            child.insertAt(offset, value, def);
	        }
	        else {
	            var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
	            this.appendChild(blot);
	        }
	    };
	    ContainerBlot.prototype.insertBefore = function (childBlot, refBlot) {
	        if (this.statics.allowedChildren != null && !this.statics.allowedChildren.some(function (child) {
	            return childBlot instanceof child;
	        })) {
	            throw new Registry.ParchmentError("Cannot insert " + childBlot.statics.blotName + " into " + this.statics.blotName);
	        }
	        childBlot.insertInto(this, refBlot);
	    };
	    ContainerBlot.prototype.length = function () {
	        return this.children.reduce(function (memo, child) {
	            return memo + child.length();
	        }, 0);
	    };
	    ContainerBlot.prototype.moveChildren = function (targetParent, refNode) {
	        this.children.forEach(function (child) {
	            targetParent.insertBefore(child, refNode);
	        });
	    };
	    ContainerBlot.prototype.optimize = function () {
	        _super.prototype.optimize.call(this);
	        if (this.children.length === 0) {
	            if (this.statics.defaultChild != null) {
	                var child = Registry.create(this.statics.defaultChild);
	                this.appendChild(child);
	                child.optimize();
	            }
	            else {
	                this.remove();
	            }
	        }
	    };
	    ContainerBlot.prototype.path = function (index, inclusive) {
	        if (inclusive === void 0) { inclusive = false; }
	        var _a = this.children.find(index, inclusive), child = _a[0], offset = _a[1];
	        var position = [[this, index]];
	        if (child instanceof ContainerBlot) {
	            return position.concat(child.path(offset, inclusive));
	        }
	        else if (child != null) {
	            position.push([child, offset]);
	        }
	        return position;
	    };
	    ContainerBlot.prototype.replace = function (target) {
	        if (target instanceof ContainerBlot) {
	            target.moveChildren(this);
	        }
	        _super.prototype.replace.call(this, target);
	    };
	    ContainerBlot.prototype.split = function (index, force) {
	        if (force === void 0) { force = false; }
	        if (!force) {
	            if (index === 0)
	                return this;
	            if (index === this.length())
	                return this.next;
	        }
	        var after = this.clone();
	        this.parent.insertBefore(after, this.next);
	        this.children.forEachAt(index, this.length(), function (child, offset, length) {
	            child = child.split(offset, force);
	            after.appendChild(child);
	        });
	        return after;
	    };
	    ContainerBlot.prototype.unwrap = function () {
	        this.moveChildren(this.parent, this.next);
	        this.remove();
	    };
	    ContainerBlot.prototype.update = function (mutations) {
	        var _this = this;
	        var addedNodes = [], removedNodes = [];
	        mutations.forEach(function (mutation) {
	            if (mutation.target === _this.domNode && mutation.type === 'childList') {
	                addedNodes.push.apply(addedNodes, mutation.addedNodes);
	                removedNodes.push.apply(removedNodes, mutation.removedNodes);
	            }
	        });
	        removedNodes.forEach(function (node) {
	            var blot = Registry.find(node);
	            if (blot == null)
	                return;
	            if (blot.domNode.parentNode == null || blot.domNode.parentNode === _this.domNode) {
	                blot.detach();
	            }
	        });
	        addedNodes.filter(function (node) {
	            return node.parentNode == _this.domNode;
	        }).sort(function (a, b) {
	            if (a === b)
	                return 0;
	            if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
	                return 1;
	            }
	            return -1;
	        }).forEach(function (node) {
	            var refBlot = null;
	            if (node.nextSibling != null) {
	                refBlot = Registry.find(node.nextSibling);
	            }
	            var blot = makeBlot(node);
	            if (blot.next != refBlot || blot.next == null) {
	                if (blot.parent != null) {
	                    blot.parent.children.remove(blot);
	                }
	                _this.insertBefore(blot, refBlot);
	            }
	        });
	    };
	    return ContainerBlot;
	}(shadow_1.default));
	function makeBlot(node) {
	    var blot = Registry.find(node);
	    if (blot == null) {
	        try {
	            blot = Registry.create(node);
	        }
	        catch (e) {
	            blot = Registry.create(Registry.Scope.INLINE);
	            [].slice.call(node.childNodes).forEach(function (child) {
	                blot.domNode.appendChild(child);
	            });
	            node.parentNode.replaceChild(blot.domNode, node);
	            blot.attach();
	        }
	    }
	    return blot;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ContainerBlot;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var LinkedList = (function () {
	    function LinkedList() {
	        this.head = this.tail = undefined;
	        this.length = 0;
	    }
	    LinkedList.prototype.append = function () {
	        var nodes = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            nodes[_i - 0] = arguments[_i];
	        }
	        this.insertBefore(nodes[0], undefined);
	        if (nodes.length > 1) {
	            this.append.apply(this, nodes.slice(1));
	        }
	    };
	    LinkedList.prototype.contains = function (node) {
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            if (cur === node)
	                return true;
	        }
	        return false;
	    };
	    LinkedList.prototype.insertBefore = function (node, refNode) {
	        node.next = refNode;
	        if (refNode != null) {
	            node.prev = refNode.prev;
	            if (refNode.prev != null) {
	                refNode.prev.next = node;
	            }
	            refNode.prev = node;
	            if (refNode === this.head) {
	                this.head = node;
	            }
	        }
	        else if (this.tail != null) {
	            this.tail.next = node;
	            node.prev = this.tail;
	            this.tail = node;
	        }
	        else {
	            node.prev = undefined;
	            this.head = this.tail = node;
	        }
	        this.length += 1;
	    };
	    LinkedList.prototype.offset = function (target) {
	        var index = 0, cur = this.head;
	        while (cur != null) {
	            if (cur === target)
	                return index;
	            index += cur.length();
	            cur = cur.next;
	        }
	        return -1;
	    };
	    LinkedList.prototype.remove = function (node) {
	        if (!this.contains(node))
	            return;
	        if (node.prev != null)
	            node.prev.next = node.next;
	        if (node.next != null)
	            node.next.prev = node.prev;
	        if (node === this.head)
	            this.head = node.next;
	        if (node === this.tail)
	            this.tail = node.prev;
	        this.length -= 1;
	    };
	    LinkedList.prototype.iterator = function (curNode) {
	        if (curNode === void 0) { curNode = this.head; }
	        // TODO use yield when we can
	        return function () {
	            var ret = curNode;
	            if (curNode != null)
	                curNode = curNode.next;
	            return ret;
	        };
	    };
	    LinkedList.prototype.find = function (index, inclusive) {
	        if (inclusive === void 0) { inclusive = false; }
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            var length_1 = cur.length();
	            if (index < length_1 || (inclusive && index === length_1 && (cur.next == null || cur.next.length() !== 0))) {
	                return [cur, index];
	            }
	            index -= length_1;
	        }
	        return [null, 0];
	    };
	    LinkedList.prototype.forEach = function (callback) {
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            callback(cur);
	        }
	    };
	    LinkedList.prototype.forEachAt = function (index, length, callback) {
	        if (length <= 0)
	            return;
	        var _a = this.find(index), startNode = _a[0], offset = _a[1];
	        var cur, curIndex = index - offset, next = this.iterator(startNode);
	        while ((cur = next()) && curIndex < index + length) {
	            var curLength = cur.length();
	            if (index > curIndex) {
	                callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
	            }
	            else {
	                callback(cur, 0, Math.min(curLength, index + length - curIndex));
	            }
	            curIndex += curLength;
	        }
	    };
	    LinkedList.prototype.map = function (callback) {
	        return this.reduce(function (memo, cur) {
	            memo.push(callback(cur));
	            return memo;
	        }, []);
	    };
	    LinkedList.prototype.reduce = function (callback, memo) {
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            memo = callback(memo, cur);
	        }
	        return memo;
	    };
	    return LinkedList;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LinkedList;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Registry = __webpack_require__(7);
	var ShadowBlot = (function () {
	    function ShadowBlot(domNode) {
	        this.domNode = domNode;
	        this.attach();
	    }
	    Object.defineProperty(ShadowBlot.prototype, "statics", {
	        // Hack for accessing inherited static methods
	        get: function () {
	            return this.constructor;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ShadowBlot.create = function (value) {
	        if (this.tagName == null) {
	            throw new Registry.ParchmentError('Blot definition missing tagName');
	        }
	        var node;
	        if (Array.isArray(this.tagName)) {
	            if (typeof value === 'string') {
	                value = value.toUpperCase();
	                if (parseInt(value).toString() === value) {
	                    value = parseInt(value);
	                }
	            }
	            if (typeof value === 'number') {
	                node = document.createElement(this.tagName[value - 1]);
	            }
	            else if (this.tagName.indexOf(value) > -1) {
	                node = document.createElement(value);
	            }
	            else {
	                node = document.createElement(this.tagName[0]);
	            }
	        }
	        else {
	            node = document.createElement(this.tagName);
	        }
	        if (this.className) {
	            node.classList.add(this.className);
	        }
	        return node;
	    };
	    ShadowBlot.prototype.attach = function () {
	        this.domNode[Registry.DATA_KEY] = { blot: this };
	    };
	    ShadowBlot.prototype.clone = function () {
	        var domNode = this.domNode.cloneNode();
	        return Registry.create(domNode);
	    };
	    ShadowBlot.prototype.detach = function () {
	        if (this.parent != null)
	            this.parent.children.remove(this);
	        delete this.domNode[Registry.DATA_KEY];
	    };
	    ShadowBlot.prototype.deleteAt = function (index, length) {
	        var blot = this.isolate(index, length);
	        blot.remove();
	    };
	    ShadowBlot.prototype.formatAt = function (index, length, name, value) {
	        var blot = this.isolate(index, length);
	        if (Registry.query(name, Registry.Scope.BLOT) != null && value) {
	            blot.wrap(name, value);
	        }
	        else if (Registry.query(name, Registry.Scope.ATTRIBUTE) != null) {
	            var parent_1 = Registry.create(this.statics.scope);
	            blot.wrap(parent_1);
	            parent_1.format(name, value);
	        }
	    };
	    ShadowBlot.prototype.insertAt = function (index, value, def) {
	        var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
	        var ref = this.split(index);
	        this.parent.insertBefore(blot, ref);
	    };
	    ShadowBlot.prototype.insertInto = function (parentBlot, refBlot) {
	        if (this.parent != null) {
	            this.parent.children.remove(this);
	        }
	        parentBlot.children.insertBefore(this, refBlot);
	        if (refBlot != null) {
	            var refDomNode = refBlot.domNode;
	        }
	        if (this.next == null || this.domNode.nextSibling != refDomNode) {
	            parentBlot.domNode.insertBefore(this.domNode, refDomNode);
	        }
	        this.parent = parentBlot;
	    };
	    ShadowBlot.prototype.isolate = function (index, length) {
	        var target = this.split(index);
	        target.split(length);
	        return target;
	    };
	    ShadowBlot.prototype.length = function () {
	        return 1;
	    };
	    ;
	    ShadowBlot.prototype.offset = function (root) {
	        if (root === void 0) { root = this.parent; }
	        if (this.parent == null || this == root)
	            return 0;
	        return this.parent.children.offset(this) + this.parent.offset(root);
	    };
	    ShadowBlot.prototype.optimize = function () {
	        // TODO clean up once we use WeakMap
	        if (this.domNode[Registry.DATA_KEY] != null) {
	            delete this.domNode[Registry.DATA_KEY].mutations;
	        }
	    };
	    ShadowBlot.prototype.remove = function () {
	        if (this.domNode.parentNode != null) {
	            this.domNode.parentNode.removeChild(this.domNode);
	        }
	        this.detach();
	    };
	    ShadowBlot.prototype.replace = function (target) {
	        if (target.parent == null)
	            return;
	        target.parent.insertBefore(this, target.next);
	        target.remove();
	    };
	    ShadowBlot.prototype.replaceWith = function (name, value) {
	        var replacement = typeof name === 'string' ? Registry.create(name, value) : name;
	        replacement.replace(this);
	        return replacement;
	    };
	    ShadowBlot.prototype.split = function (index, force) {
	        return index === 0 ? this : this.next;
	    };
	    ShadowBlot.prototype.update = function (mutations) {
	        if (mutations === void 0) { mutations = []; }
	        // Nothing to do by default
	    };
	    ShadowBlot.prototype.wrap = function (name, value) {
	        var wrapper = typeof name === 'string' ? Registry.create(name, value) : name;
	        if (this.parent != null) {
	            this.parent.insertBefore(wrapper, this.next);
	        }
	        wrapper.appendChild(this);
	        return wrapper;
	    };
	    ShadowBlot.blotName = 'abstract';
	    return ShadowBlot;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ShadowBlot;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ParchmentError = (function (_super) {
	    __extends(ParchmentError, _super);
	    function ParchmentError(message) {
	        message = '[Parchment] ' + message;
	        _super.call(this, message);
	        this.message = message;
	        this.name = this.constructor.name;
	    }
	    return ParchmentError;
	}(Error));
	exports.ParchmentError = ParchmentError;
	var attributes = {};
	var classes = {};
	var tags = {};
	var types = {};
	exports.DATA_KEY = '__blot';
	(function (Scope) {
	    Scope[Scope["TYPE"] = 3] = "TYPE";
	    Scope[Scope["LEVEL"] = 12] = "LEVEL";
	    Scope[Scope["ATTRIBUTE"] = 13] = "ATTRIBUTE";
	    Scope[Scope["BLOT"] = 14] = "BLOT";
	    Scope[Scope["INLINE"] = 7] = "INLINE";
	    Scope[Scope["BLOCK"] = 11] = "BLOCK";
	    Scope[Scope["BLOCK_BLOT"] = 10] = "BLOCK_BLOT";
	    Scope[Scope["INLINE_BLOT"] = 6] = "INLINE_BLOT";
	    Scope[Scope["BLOCK_ATTRIBUTE"] = 9] = "BLOCK_ATTRIBUTE";
	    Scope[Scope["INLINE_ATTRIBUTE"] = 5] = "INLINE_ATTRIBUTE";
	    Scope[Scope["ANY"] = 15] = "ANY";
	})(exports.Scope || (exports.Scope = {}));
	var Scope = exports.Scope;
	;
	function create(input, value) {
	    var match = query(input);
	    if (match == null) {
	        throw new ParchmentError("Unable to create " + input + " blot");
	    }
	    var BlotClass = match;
	    var node = input instanceof Node ? input : BlotClass.create(value);
	    return new BlotClass(node, value);
	}
	exports.create = create;
	function find(node, bubble) {
	    if (bubble === void 0) { bubble = false; }
	    if (node == null)
	        return null;
	    if (node[exports.DATA_KEY] != null)
	        return node[exports.DATA_KEY].blot;
	    if (bubble)
	        return find(node.parentNode, bubble);
	    return null;
	}
	exports.find = find;
	function query(query, scope) {
	    if (scope === void 0) { scope = Scope.ANY; }
	    var match;
	    if (typeof query === 'string') {
	        match = types[query] || attributes[query];
	    }
	    else if (query instanceof Text) {
	        match = types['text'];
	    }
	    else if (typeof query === 'number') {
	        if (query & Scope.LEVEL & Scope.BLOCK) {
	            match = types['block'];
	        }
	        else if (query & Scope.LEVEL & Scope.INLINE) {
	            match = types['inline'];
	        }
	    }
	    else if (query instanceof HTMLElement) {
	        var names = (query.getAttribute('class') || '').split(/\s+/);
	        for (var i in names) {
	            if (match = classes[names[i]])
	                break;
	        }
	        match = match || tags[query.tagName];
	    }
	    if (match == null)
	        return null;
	    if ((scope & Scope.LEVEL & match.scope) && (scope & Scope.TYPE & match.scope))
	        return match;
	    return null;
	}
	exports.query = query;
	function register() {
	    var Definitions = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        Definitions[_i - 0] = arguments[_i];
	    }
	    if (Definitions.length > 1) {
	        return Definitions.map(function (d) {
	            return register(d);
	        });
	    }
	    var Definition = Definitions[0];
	    if (typeof Definition.blotName !== 'string' && typeof Definition.attrName !== 'string') {
	        throw new ParchmentError('Invalid definition');
	    }
	    else if (Definition.blotName === 'abstract') {
	        throw new ParchmentError('Cannot register abstract class');
	    }
	    types[Definition.blotName || Definition.attrName] = Definition;
	    if (typeof Definition.keyName === 'string') {
	        attributes[Definition.keyName] = Definition;
	    }
	    else {
	        if (Definition.className != null) {
	            classes[Definition.className] = Definition;
	        }
	        if (Definition.tagName != null) {
	            if (Array.isArray(Definition.tagName)) {
	                Definition.tagName = Definition.tagName.map(function (tagName) {
	                    return tagName.toUpperCase();
	                });
	            }
	            else {
	                Definition.tagName = Definition.tagName.toUpperCase();
	            }
	            var tagNames = Array.isArray(Definition.tagName) ? Definition.tagName : [Definition.tagName];
	            tagNames.forEach(function (tag) {
	                if (tags[tag] == null || Definition.className == null) {
	                    tags[tag] = Definition;
	                }
	            });
	        }
	    }
	    return Definition;
	}
	exports.register = register;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributor_1 = __webpack_require__(9);
	var store_1 = __webpack_require__(10);
	var container_1 = __webpack_require__(4);
	var Registry = __webpack_require__(7);
	var FormatBlot = (function (_super) {
	    __extends(FormatBlot, _super);
	    function FormatBlot() {
	        _super.apply(this, arguments);
	    }
	    FormatBlot.formats = function (domNode) {
	        if (typeof this.tagName === 'string') {
	            return true;
	        }
	        else if (Array.isArray(this.tagName)) {
	            return domNode.tagName.toLowerCase();
	        }
	        return undefined;
	    };
	    FormatBlot.prototype.attach = function () {
	        _super.prototype.attach.call(this);
	        this.attributes = new store_1.default(this.domNode);
	    };
	    FormatBlot.prototype.format = function (name, value) {
	        var format = Registry.query(name);
	        if (format instanceof attributor_1.default) {
	            this.attributes.attribute(format, value);
	        }
	        else if (value) {
	            if (format != null && (name !== this.statics.blotName || this.formats()[name] !== value)) {
	                this.replaceWith(name, value);
	            }
	        }
	    };
	    FormatBlot.prototype.formats = function () {
	        var formats = this.attributes.values();
	        var format = this.statics.formats(this.domNode);
	        if (format != null) {
	            formats[this.statics.blotName] = format;
	        }
	        return formats;
	    };
	    FormatBlot.prototype.replaceWith = function (name, value) {
	        var replacement = _super.prototype.replaceWith.call(this, name, value);
	        this.attributes.copy(replacement);
	        return replacement;
	    };
	    FormatBlot.prototype.update = function (mutations) {
	        var _this = this;
	        _super.prototype.update.call(this, mutations);
	        if (mutations.some(function (mutation) {
	            return mutation.target === _this.domNode && mutation.type === 'attributes';
	        })) {
	            this.attributes.build();
	        }
	    };
	    FormatBlot.prototype.wrap = function (name, value) {
	        var wrapper = _super.prototype.wrap.call(this, name, value);
	        if (wrapper instanceof FormatBlot && wrapper.statics.scope === this.statics.scope) {
	            this.attributes.move(wrapper);
	        }
	        return wrapper;
	    };
	    return FormatBlot;
	}(container_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = FormatBlot;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Registry = __webpack_require__(7);
	var Attributor = (function () {
	    function Attributor(attrName, keyName, options) {
	        if (options === void 0) { options = {}; }
	        this.attrName = attrName;
	        this.keyName = keyName;
	        var attributeBit = Registry.Scope.TYPE & Registry.Scope.ATTRIBUTE;
	        if (options.scope != null) {
	            // Ignore type bits, force attribute bit
	            this.scope = (options.scope & Registry.Scope.LEVEL) | attributeBit;
	        }
	        else {
	            this.scope = Registry.Scope.ATTRIBUTE;
	        }
	        if (options.whitelist != null)
	            this.whitelist = options.whitelist;
	    }
	    Attributor.keys = function (node) {
	        return [].map.call(node.attributes, function (item) {
	            return item.name;
	        });
	    };
	    Attributor.prototype.add = function (node, value) {
	        if (!this.canAdd(node, value))
	            return false;
	        node.setAttribute(this.keyName, value);
	        return true;
	    };
	    Attributor.prototype.canAdd = function (node, value) {
	        var match = Registry.query(node, Registry.Scope.BLOT & (this.scope | Registry.Scope.TYPE));
	        if (match != null && (this.whitelist == null || this.whitelist.indexOf(value) > -1)) {
	            return true;
	        }
	        return false;
	    };
	    Attributor.prototype.remove = function (node) {
	        node.removeAttribute(this.keyName);
	    };
	    Attributor.prototype.value = function (node) {
	        return node.getAttribute(this.keyName);
	    };
	    return Attributor;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Attributor;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var attributor_1 = __webpack_require__(9);
	var class_1 = __webpack_require__(11);
	var style_1 = __webpack_require__(12);
	var Registry = __webpack_require__(7);
	var AttributorStore = (function () {
	    function AttributorStore(domNode) {
	        this.attributes = {};
	        this.domNode = domNode;
	        this.build();
	    }
	    AttributorStore.prototype.attribute = function (attribute, value) {
	        if (value) {
	            if (attribute.add(this.domNode, value)) {
	                if (attribute.value(this.domNode) != null) {
	                    this.attributes[attribute.attrName] = attribute;
	                }
	                else {
	                    delete this.attributes[attribute.attrName];
	                }
	            }
	        }
	        else {
	            attribute.remove(this.domNode);
	            delete this.attributes[attribute.attrName];
	        }
	    };
	    AttributorStore.prototype.build = function () {
	        var _this = this;
	        this.attributes = {};
	        var attributes = attributor_1.default.keys(this.domNode);
	        var classes = class_1.default.keys(this.domNode);
	        var styles = style_1.default.keys(this.domNode);
	        attributes.concat(classes).concat(styles).forEach(function (name) {
	            var attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
	            if (attr instanceof attributor_1.default) {
	                _this.attributes[attr.attrName] = attr;
	            }
	        });
	    };
	    AttributorStore.prototype.copy = function (target) {
	        var _this = this;
	        Object.keys(this.attributes).forEach(function (key) {
	            var value = _this.attributes[key].value(_this.domNode);
	            target.format(key, value);
	        });
	    };
	    AttributorStore.prototype.move = function (target) {
	        var _this = this;
	        this.copy(target);
	        Object.keys(this.attributes).forEach(function (key) {
	            _this.attributes[key].remove(_this.domNode);
	        });
	        this.attributes = {};
	    };
	    AttributorStore.prototype.values = function () {
	        var _this = this;
	        return Object.keys(this.attributes).reduce(function (attributes, name) {
	            attributes[name] = _this.attributes[name].value(_this.domNode);
	            return attributes;
	        }, {});
	    };
	    return AttributorStore;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AttributorStore;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributor_1 = __webpack_require__(9);
	function match(node, prefix) {
	    var className = node.getAttribute('class') || '';
	    return className.split(/\s+/).filter(function (name) {
	        return name.indexOf(prefix + "-") === 0;
	    });
	}
	var ClassAttributor = (function (_super) {
	    __extends(ClassAttributor, _super);
	    function ClassAttributor() {
	        _super.apply(this, arguments);
	    }
	    ClassAttributor.keys = function (node) {
	        return (node.getAttribute('class') || '').split(/\s+/).map(function (name) {
	            return name.split('-').slice(0, -1).join('-');
	        });
	    };
	    ClassAttributor.prototype.add = function (node, value) {
	        if (!this.canAdd(node, value))
	            return false;
	        this.remove(node);
	        node.classList.add(this.keyName + "-" + value);
	        return true;
	    };
	    ClassAttributor.prototype.remove = function (node) {
	        var matches = match(node, this.keyName);
	        matches.forEach(function (name) {
	            node.classList.remove(name);
	        });
	        if (node.classList.length === 0) {
	            node.removeAttribute('class');
	        }
	    };
	    ClassAttributor.prototype.value = function (node) {
	        var result = match(node, this.keyName)[0] || '';
	        return result.slice(this.keyName.length + 1); // +1 for hyphen
	    };
	    return ClassAttributor;
	}(attributor_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ClassAttributor;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributor_1 = __webpack_require__(9);
	function camelize(name) {
	    var parts = name.split('-');
	    var rest = parts.slice(1).map(function (part) {
	        return part[0].toUpperCase() + part.slice(1);
	    }).join('');
	    return parts[0] + rest;
	}
	var StyleAttributor = (function (_super) {
	    __extends(StyleAttributor, _super);
	    function StyleAttributor() {
	        _super.apply(this, arguments);
	    }
	    StyleAttributor.keys = function (node) {
	        return (node.getAttribute('style') || '').split(';').map(function (value) {
	            var arr = value.split(':');
	            return arr[0].trim();
	        });
	    };
	    StyleAttributor.prototype.add = function (node, value) {
	        if (!this.canAdd(node, value))
	            return false;
	        node.style[camelize(this.keyName)] = value;
	        return true;
	    };
	    StyleAttributor.prototype.remove = function (node) {
	        node.style[camelize(this.keyName)] = '';
	        if (!node.getAttribute('style')) {
	            node.removeAttribute('style');
	        }
	    };
	    StyleAttributor.prototype.value = function (node) {
	        return node.style[camelize(this.keyName)];
	    };
	    return StyleAttributor;
	}(attributor_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = StyleAttributor;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var shadow_1 = __webpack_require__(6);
	var Registry = __webpack_require__(7);
	var LeafBlot = (function (_super) {
	    __extends(LeafBlot, _super);
	    function LeafBlot() {
	        _super.apply(this, arguments);
	    }
	    LeafBlot.value = function (domNode) {
	        return true;
	    };
	    LeafBlot.prototype.index = function (node, offset) {
	        if (node !== this.domNode)
	            return -1;
	        return Math.min(offset, 1);
	    };
	    LeafBlot.prototype.position = function (index, inclusive) {
	        var offset = [].indexOf.call(this.parent.domNode.childNodes, this.domNode);
	        if (index > 0)
	            offset += 1;
	        return [this.parent.domNode, offset];
	    };
	    LeafBlot.prototype.value = function () {
	        return (_a = {}, _a[this.statics.blotName] = this.statics.value(this.domNode) || true, _a);
	        var _a;
	    };
	    LeafBlot.scope = Registry.Scope.INLINE_BLOT;
	    return LeafBlot;
	}(shadow_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LeafBlot;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var container_1 = __webpack_require__(4);
	var Registry = __webpack_require__(7);
	var OBSERVER_CONFIG = {
	    attributes: true,
	    characterData: true,
	    childList: true,
	    subtree: true
	};
	var MAX_OPTIMIZE_ITERATIONS = 100;
	var ScrollBlot = (function (_super) {
	    __extends(ScrollBlot, _super);
	    function ScrollBlot(node) {
	        var _this = this;
	        _super.call(this, node);
	        this.parent = null;
	        this.observer = new MutationObserver(function (mutations) {
	            _this.update(mutations);
	        });
	        this.observer.observe(this.domNode, OBSERVER_CONFIG);
	    }
	    ScrollBlot.prototype.detach = function () {
	        _super.prototype.detach.call(this);
	        this.observer.disconnect();
	    };
	    ScrollBlot.prototype.deleteAt = function (index, length) {
	        this.update();
	        if (index === 0 && length === this.length()) {
	            this.children.forEach(function (child) {
	                child.remove();
	            });
	        }
	        else {
	            _super.prototype.deleteAt.call(this, index, length);
	        }
	        this.optimize();
	    };
	    ScrollBlot.prototype.formatAt = function (index, length, name, value) {
	        this.update();
	        _super.prototype.formatAt.call(this, index, length, name, value);
	        this.optimize();
	    };
	    ScrollBlot.prototype.insertAt = function (index, value, def) {
	        this.update();
	        _super.prototype.insertAt.call(this, index, value, def);
	        this.optimize();
	    };
	    ScrollBlot.prototype.optimize = function (mutations) {
	        var _this = this;
	        if (mutations === void 0) { mutations = []; }
	        _super.prototype.optimize.call(this);
	        mutations.push.apply(mutations, this.observer.takeRecords());
	        // TODO use WeakMap
	        var mark = function (blot) {
	            if (blot == null || blot === _this)
	                return;
	            if (blot.domNode.parentNode == null)
	                return;
	            if (blot.domNode[Registry.DATA_KEY].mutations == null) {
	                blot.domNode[Registry.DATA_KEY].mutations = [];
	            }
	            mark(blot.parent);
	        };
	        var optimize = function (blot) {
	            if (blot instanceof container_1.default) {
	                blot.children.forEach(function (child) {
	                    if (!child.domNode[Registry.DATA_KEY] || child.domNode[Registry.DATA_KEY].mutations == null)
	                        return;
	                    optimize(child);
	                });
	            }
	            blot.optimize();
	        };
	        var remaining = mutations;
	        for (var i = 0; remaining.length > 0; i += 1) {
	            if (i >= MAX_OPTIMIZE_ITERATIONS) {
	                throw new Error('[Parchment] Maximum optimize iterations reached');
	            }
	            remaining.forEach(function (mutation) {
	                var blot = Registry.find(mutation.target, true);
	                if (blot != null && blot.domNode === mutation.target) {
	                    if (mutation.type === 'childList') {
	                        mark(Registry.find(mutation.previousSibling, false));
	                        [].forEach.call(mutation.addedNodes, function (node) {
	                            var child = Registry.find(node, false);
	                            mark(child);
	                            if (child instanceof container_1.default) {
	                                child.children.forEach(mark);
	                            }
	                        });
	                    }
	                    else if (mutation.type === 'attributes') {
	                        mark(blot.prev);
	                    }
	                    mark(blot);
	                }
	            });
	            this.children.forEach(optimize);
	            remaining = this.observer.takeRecords();
	            mutations.push.apply(mutations, remaining);
	        }
	    };
	    ScrollBlot.prototype.update = function (mutations) {
	        var _this = this;
	        mutations = mutations || this.observer.takeRecords();
	        // TODO use WeakMap
	        mutations.map(function (mutation) {
	            var blot = Registry.find(mutation.target, true);
	            if (blot == null)
	                return;
	            if (blot.domNode[Registry.DATA_KEY].mutations == null) {
	                blot.domNode[Registry.DATA_KEY].mutations = [mutation];
	                return blot;
	            }
	            else {
	                blot.domNode[Registry.DATA_KEY].mutations.push(mutation);
	                return null;
	            }
	        }).forEach(function (blot) {
	            if (blot == null || blot === _this)
	                return;
	            blot.update(blot.domNode[Registry.DATA_KEY].mutations || []);
	        });
	        if (this.domNode[Registry.DATA_KEY].mutations != null) {
	            _super.prototype.update.call(this, this.domNode[Registry.DATA_KEY].mutations);
	        }
	        this.optimize(mutations);
	    };
	    ScrollBlot.blotName = 'scroll';
	    ScrollBlot.defaultChild = 'block';
	    ScrollBlot.scope = Registry.Scope.BLOCK_BLOT;
	    ScrollBlot.tagName = 'DIV';
	    return ScrollBlot;
	}(container_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ScrollBlot;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var format_1 = __webpack_require__(8);
	var Registry = __webpack_require__(7);
	// Shallow object comparison
	function isEqual(obj1, obj2) {
	    if (Object.keys(obj1).length !== Object.keys(obj2).length)
	        return false;
	    for (var prop in obj1) {
	        if (obj1[prop] !== obj2[prop])
	            return false;
	    }
	    return true;
	}
	var InlineBlot = (function (_super) {
	    __extends(InlineBlot, _super);
	    function InlineBlot() {
	        _super.apply(this, arguments);
	    }
	    InlineBlot.formats = function (domNode) {
	        if (domNode.tagName === InlineBlot.tagName)
	            return undefined;
	        return _super.formats.call(this, domNode);
	    };
	    InlineBlot.prototype.format = function (name, value) {
	        var _this = this;
	        if (name === this.statics.blotName && !value) {
	            this.children.forEach(function (child) {
	                if (!(child instanceof format_1.default)) {
	                    child = child.wrap(InlineBlot.blotName, true);
	                }
	                _this.attributes.copy(child);
	            });
	            this.unwrap();
	        }
	        else {
	            _super.prototype.format.call(this, name, value);
	        }
	    };
	    InlineBlot.prototype.formatAt = function (index, length, name, value) {
	        if (this.formats()[name] != null || Registry.query(name, Registry.Scope.ATTRIBUTE)) {
	            var blot = this.isolate(index, length);
	            blot.format(name, value);
	        }
	        else {
	            _super.prototype.formatAt.call(this, index, length, name, value);
	        }
	    };
	    InlineBlot.prototype.optimize = function () {
	        _super.prototype.optimize.call(this);
	        var formats = this.formats();
	        if (Object.keys(formats).length === 0) {
	            return this.unwrap(); // unformatted span
	        }
	        var next = this.next;
	        if (next instanceof InlineBlot && next.prev === this && isEqual(formats, next.formats())) {
	            next.moveChildren(this);
	            next.remove();
	        }
	    };
	    InlineBlot.blotName = 'inline';
	    InlineBlot.scope = Registry.Scope.INLINE_BLOT;
	    InlineBlot.tagName = 'SPAN';
	    return InlineBlot;
	}(format_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = InlineBlot;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var format_1 = __webpack_require__(8);
	var Registry = __webpack_require__(7);
	var BlockBlot = (function (_super) {
	    __extends(BlockBlot, _super);
	    function BlockBlot() {
	        _super.apply(this, arguments);
	    }
	    BlockBlot.formats = function (domNode) {
	        var tagName = Registry.query(BlockBlot.blotName).tagName;
	        if (domNode.tagName === tagName)
	            return undefined;
	        return _super.formats.call(this, domNode);
	    };
	    BlockBlot.prototype.format = function (name, value) {
	        if (name === this.statics.blotName && !value) {
	            this.replaceWith(BlockBlot.blotName);
	        }
	        else {
	            _super.prototype.format.call(this, name, value);
	        }
	    };
	    BlockBlot.prototype.formatAt = function (index, length, name, value) {
	        if (Registry.query(name, Registry.Scope.BLOCK) != null) {
	            this.format(name, value);
	        }
	        else {
	            _super.prototype.formatAt.call(this, index, length, name, value);
	        }
	    };
	    BlockBlot.prototype.insertAt = function (index, value, def) {
	        if (def == null || Registry.query(value, Registry.Scope.INLINE) != null) {
	            // Insert text or inline
	            _super.prototype.insertAt.call(this, index, value, def);
	        }
	        else {
	            var after = this.split(index);
	            var blot = Registry.create(value, def);
	            after.parent.insertBefore(blot, after);
	        }
	    };
	    BlockBlot.blotName = 'block';
	    BlockBlot.scope = Registry.Scope.BLOCK_BLOT;
	    BlockBlot.tagName = 'P';
	    return BlockBlot;
	}(format_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BlockBlot;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var leaf_1 = __webpack_require__(13);
	var EmbedBlot = (function (_super) {
	    __extends(EmbedBlot, _super);
	    function EmbedBlot() {
	        _super.apply(this, arguments);
	    }
	    EmbedBlot.formats = function (domNode) {
	        return undefined;
	    };
	    EmbedBlot.prototype.format = function (name, value) {
	        // Do nothing by default
	    };
	    EmbedBlot.prototype.formats = function () {
	        return this.statics.formats(this.domNode);
	    };
	    return EmbedBlot;
	}(leaf_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EmbedBlot;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var leaf_1 = __webpack_require__(13);
	var Registry = __webpack_require__(7);
	var TextBlot = (function (_super) {
	    __extends(TextBlot, _super);
	    function TextBlot(node) {
	        _super.call(this, node);
	        this.text = this.statics.value(this.domNode);
	    }
	    TextBlot.create = function (value) {
	        return document.createTextNode(value);
	    };
	    TextBlot.value = function (domNode) {
	        return domNode.data;
	    };
	    TextBlot.prototype.deleteAt = function (index, length) {
	        this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
	    };
	    TextBlot.prototype.index = function (node, offset) {
	        if (this.domNode === node) {
	            return offset;
	        }
	        return -1;
	    };
	    TextBlot.prototype.insertAt = function (index, value, def) {
	        if (def == null) {
	            this.text = this.text.slice(0, index) + value + this.text.slice(index);
	            this.domNode.data = this.text;
	        }
	        else {
	            _super.prototype.insertAt.call(this, index, value, def);
	        }
	    };
	    TextBlot.prototype.length = function () {
	        return this.text.length;
	    };
	    TextBlot.prototype.optimize = function () {
	        _super.prototype.optimize.call(this);
	        this.text = this.statics.value(this.domNode);
	        if (this.text.length === 0) {
	            this.remove();
	        }
	        else if (this.next instanceof TextBlot && this.next.prev === this) {
	            this.insertAt(this.length(), this.next.value());
	            this.next.remove();
	        }
	    };
	    TextBlot.prototype.position = function (index, inclusive) {
	        if (inclusive === void 0) { inclusive = false; }
	        return [this.domNode, index];
	    };
	    TextBlot.prototype.split = function (index, force) {
	        if (force === void 0) { force = false; }
	        if (!force) {
	            if (index === 0)
	                return this;
	            if (index === this.length())
	                return this.next;
	        }
	        var after = Registry.create(this.domNode.splitText(index));
	        this.parent.insertBefore(after, this.next);
	        this.text = this.statics.value(this.domNode);
	        return after;
	    };
	    TextBlot.prototype.update = function (mutations) {
	        var _this = this;
	        if (mutations.some(function (mutation) {
	            return mutation.type === 'characterData' && mutation.target === _this.domNode;
	        })) {
	            this.text = this.statics.value(this.domNode);
	        }
	    };
	    TextBlot.prototype.value = function () {
	        return this.text;
	    };
	    TextBlot.blotName = 'text';
	    TextBlot.scope = Registry.Scope.INLINE_BLOT;
	    return TextBlot;
	}(leaf_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TextBlot;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.overload = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(20);

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _selection = __webpack_require__(40);

	var _selection2 = _interopRequireDefault(_selection);

	var _extend = __webpack_require__(26);

	var _extend2 = _interopRequireDefault(_extend);

	var _logger = __webpack_require__(31);

	var _logger2 = _interopRequireDefault(_logger);

	var _theme = __webpack_require__(41);

	var _theme2 = _interopRequireDefault(_theme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var debug = (0, _logger2.default)('quill');

	var Quill = function () {
	  _createClass(Quill, null, [{
	    key: 'debug',
	    value: function debug(limit) {
	      _logger2.default.level(limit);
	    }
	  }, {
	    key: 'import',
	    value: function _import(name) {
	      if (this.imports[name] == null) {
	        debug.error('Cannot import ' + name + '. Are you sure it was registered?');
	      }
	      return this.imports[name];
	    }
	  }, {
	    key: 'register',
	    value: function register(path, target) {
	      var _this = this;

	      var overwrite = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	      if (typeof path !== 'string') {
	        var name = path.attrName || path.blotName;
	        if (typeof name === 'string') {
	          // register(Blot | Attributor, overwrite)
	          this.register('formats/' + name, path, target);
	        } else {
	          Object.keys(path).forEach(function (key) {
	            _this.register(key, path[key], target);
	          });
	        }
	      } else {
	        if (this.imports[path] != null && !overwrite) {
	          debug.warn('Overwriting ' + path + ' with', target);
	        }
	        this.imports[path] = target;
	        if ((path.startsWith('blots/') || path.startsWith('formats/')) && target.blotName !== 'abstract') {
	          _parchment2.default.register(target);
	        }
	      }
	    }
	  }]);

	  function Quill(container) {
	    var _this2 = this;

	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, Quill);

	    this.container = typeof container === 'string' ? document.querySelector(container) : container;
	    if (this.container == null) {
	      return debug.error('Invalid Quill container', container);
	    }
	    var themeClass = _theme2.default;
	    if (options.theme != null && options.theme !== Quill.DEFAULTS.theme) {
	      themeClass = Quill.import('themes/' + options.theme);
	    }
	    options = (0, _extend2.default)(true, {}, Quill.DEFAULTS, themeClass.DEFAULTS, options);
	    options.bounds = typeof options.bounds === 'string' ? document.querySelector(options.bounds) : options.bounds;
	    var html = this.container.innerHTML.trim();
	    this.container.classList.add('ql-container');
	    this.container.innerHTML = '';
	    this.root = this.addContainer('ql-editor');
	    this.emitter = new _emitter2.default();
	    this.scroll = _parchment2.default.create(this.root, {
	      emitter: this.emitter,
	      whitelist: options.formats
	    });
	    this.editor = new _editor2.default(this.scroll, this.emitter);
	    this.selection = new _selection2.default(this.scroll, this.emitter);
	    this.theme = new themeClass(this, options);
	    this.keyboard = this.theme.addModule('keyboard');
	    this.clipboard = this.theme.addModule('clipboard');
	    this.history = this.theme.addModule('history');
	    this.theme.init();
	    this.pasteHTML('<div class=\'ql-editor\' style="white-space: normal;">' + html + '<p><br></p></div>');
	    this.history.clear();
	    if (options.readOnly) {
	      this.disable();
	    }
	    if (options.placeholder) {
	      this.root.dataset.placeholder = options.placeholder;
	    }
	    if (options.debug) {
	      Quill.debug(options.debug);
	    }
	    this.root.classList.toggle('ql-blank', this.editor.isBlank());
	    this.emitter.on(_emitter2.default.events.TEXT_CHANGE, function (delta) {
	      _this2.root.classList.toggle('ql-blank', _this2.editor.isBlank());
	    });
	  }

	  _createClass(Quill, [{
	    key: 'addContainer',
	    value: function addContainer(container) {
	      var refNode = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	      if (typeof container === 'string') {
	        var className = container;
	        container = document.createElement('div');
	        container.classList.add(className);
	      }
	      this.container.insertBefore(container, refNode);
	      return container;
	    }
	  }, {
	    key: 'blur',
	    value: function blur() {
	      this.selection.setRange(null);
	    }
	  }, {
	    key: 'deleteText',
	    value: function deleteText(index, length, source) {
	      var _overload = overload(index, length, source);

	      var _overload2 = _slicedToArray(_overload, 4);

	      index = _overload2[0];
	      length = _overload2[1];
	      source = _overload2[3];

	      var range = this.getSelection();
	      var change = this.editor.deleteText(index, length, source);
	      range = shiftRange(range, index, -1 * length, source);
	      this.setSelection(range, _emitter2.default.sources.SILENT);
	      return change;
	    }
	  }, {
	    key: 'disable',
	    value: function disable() {
	      this.editor.enable(false);
	    }
	  }, {
	    key: 'enable',
	    value: function enable() {
	      var enabled = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

	      this.editor.enable(enabled);
	    }
	  }, {
	    key: 'focus',
	    value: function focus() {
	      this.selection.focus();
	      this.selection.scrollIntoView();
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      var source = arguments.length <= 2 || arguments[2] === undefined ? _emitter2.default.sources.API : arguments[2];

	      var range = this.getSelection();
	      var change = new _delta2.default();
	      if (range == null) return change;
	      if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
	        change = this.formatLine(range, name, value, source);
	      } else if (range.length === 0) {
	        this.selection.format(name, value);
	        return change;
	      } else {
	        change = this.formatText(range, name, value, source);
	      }
	      this.setSelection(range, _emitter2.default.sources.SILENT);
	      return change;
	    }
	  }, {
	    key: 'formatLine',
	    value: function formatLine(index, length, name, value, source) {
	      var formats = void 0;

	      var _overload3 = overload(index, length, name, value, source);

	      var _overload4 = _slicedToArray(_overload3, 4);

	      index = _overload4[0];
	      length = _overload4[1];
	      formats = _overload4[2];
	      source = _overload4[3];

	      var range = this.getSelection();
	      var change = this.editor.formatLine(index, length, formats, source);
	      this.selection.setRange(range, true, _emitter2.default.sources.SILENT);
	      this.selection.scrollIntoView();
	      return change;
	    }
	  }, {
	    key: 'formatText',
	    value: function formatText(index, length, name, value, source) {
	      var formats = void 0;

	      var _overload5 = overload(index, length, name, value, source);

	      var _overload6 = _slicedToArray(_overload5, 4);

	      index = _overload6[0];
	      length = _overload6[1];
	      formats = _overload6[2];
	      source = _overload6[3];

	      var range = this.getSelection();
	      var change = this.editor.formatText(index, length, formats, source);
	      this.selection.setRange(range, true, _emitter2.default.sources.SILENT);
	      this.selection.scrollIntoView();
	      return change;
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds(index) {
	      var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	      if (typeof index === 'number') {
	        return this.selection.getBounds(index, length);
	      } else {
	        return this.selection.getBounds(index.index, index.length);
	      }
	    }
	  }, {
	    key: 'getContents',
	    value: function getContents() {
	      var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	      var length = arguments.length <= 1 || arguments[1] === undefined ? this.getLength() - index : arguments[1];

	      var _overload7 = overload(index, length);

	      var _overload8 = _slicedToArray(_overload7, 2);

	      index = _overload8[0];
	      length = _overload8[1];

	      return this.editor.getContents(index, length);
	    }
	  }, {
	    key: 'getFormat',
	    value: function getFormat() {
	      var index = arguments.length <= 0 || arguments[0] === undefined ? this.getSelection() : arguments[0];
	      var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	      if (typeof index === 'number') {
	        return this.editor.getFormat(index, length);
	      } else {
	        return this.editor.getFormat(index.index, index.length);
	      }
	    }
	  }, {
	    key: 'getLength',
	    value: function getLength() {
	      return this.scroll.length();
	    }
	  }, {
	    key: 'getModule',
	    value: function getModule(name) {
	      return this.theme.modules[name];
	    }
	  }, {
	    key: 'getSelection',
	    value: function getSelection() {
	      var focus = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

	      if (focus) this.focus();
	      this.update(); // Make sure we access getRange with editor in consistent state
	      return this.selection.getRange()[0];
	    }
	  }, {
	    key: 'getText',
	    value: function getText() {
	      var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	      var length = arguments.length <= 1 || arguments[1] === undefined ? this.getLength() - index : arguments[1];

	      var _overload9 = overload(index, length);

	      var _overload10 = _slicedToArray(_overload9, 2);

	      index = _overload10[0];
	      length = _overload10[1];

	      return this.editor.getText(index, length);
	    }
	  }, {
	    key: 'hasFocus',
	    value: function hasFocus() {
	      return this.selection.hasFocus();
	    }
	  }, {
	    key: 'insertEmbed',
	    value: function insertEmbed(index, embed, value, source) {
	      var range = this.getSelection();
	      var change = this.editor.insertEmbed(index, embed, value, source);
	      range = shiftRange(range, change, source);
	      this.setSelection(range, _emitter2.default.sources.SILENT);
	      return change;
	    }
	  }, {
	    key: 'insertText',
	    value: function insertText(index, text, name, value, source) {
	      var formats = void 0,
	          range = this.getSelection();

	      var _overload11 = overload(index, 0, name, value, source);

	      var _overload12 = _slicedToArray(_overload11, 4);

	      index = _overload12[0];
	      formats = _overload12[2];
	      source = _overload12[3];

	      var change = this.editor.insertText(index, text, formats, source);
	      range = shiftRange(range, index, text.length, source);
	      this.setSelection(range, _emitter2.default.sources.SILENT);
	      return change;
	    }
	  }, {
	    key: 'off',
	    value: function off() {
	      return this.emitter.off.apply(this.emitter, arguments);
	    }
	  }, {
	    key: 'on',
	    value: function on() {
	      return this.emitter.on.apply(this.emitter, arguments);
	    }
	  }, {
	    key: 'once',
	    value: function once() {
	      return this.emitter.once.apply(this.emitter, arguments);
	    }
	  }, {
	    key: 'pasteHTML',
	    value: function pasteHTML(index, html) {
	      var source = arguments.length <= 2 || arguments[2] === undefined ? _emitter2.default.sources.API : arguments[2];

	      if (typeof index === 'string') {
	        return this.setContents(this.clipboard.convert(index), html);
	      } else {
	        var paste = this.clipboard.convert(html);
	        return this.updateContents(new _delta2.default().retain(index).concat(paste), source);
	      }
	    }
	  }, {
	    key: 'removeFormat',
	    value: function removeFormat(index, length, source) {
	      var range = this.getSelection();

	      var _overload13 = overload(index, length, source);

	      var _overload14 = _slicedToArray(_overload13, 4);

	      index = _overload14[0];
	      length = _overload14[1];
	      source = _overload14[3];

	      var change = this.editor.removeFormat(index, length, source);
	      range = shiftRange(range, change, source);
	      this.setSelection(range, _emitter2.default.sources.SILENT);
	      return change;
	    }
	  }, {
	    key: 'setContents',
	    value: function setContents(delta) {
	      var source = arguments.length <= 1 || arguments[1] === undefined ? _emitter2.default.sources.API : arguments[1];

	      delta = new _delta2.default(delta).slice();
	      var lastOp = delta.ops[delta.ops.length - 1];
	      // Quill contents must always end with newline
	      if (lastOp == null || lastOp.insert[lastOp.insert.length - 1] !== '\n') {
	        delta.insert('\n');
	      }
	      delta.delete(this.getLength());
	      return this.editor.applyDelta(delta, source);
	    }
	  }, {
	    key: 'setSelection',
	    value: function setSelection(index, length, source) {
	      if (index == null) {
	        this.selection.setRange(null, length || Quill.sources.API);
	      } else {
	        var _overload15 = overload(index, length, source);

	        var _overload16 = _slicedToArray(_overload15, 4);

	        index = _overload16[0];
	        length = _overload16[1];
	        source = _overload16[3];

	        this.selection.setRange(new _selection.Range(index, length), source);
	      }
	      this.selection.scrollIntoView();
	    }
	  }, {
	    key: 'setText',
	    value: function setText(text) {
	      var source = arguments.length <= 1 || arguments[1] === undefined ? _emitter2.default.sources.API : arguments[1];

	      var delta = new _delta2.default().insert(text);
	      return this.setContents(delta, source);
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var source = arguments.length <= 0 || arguments[0] === undefined ? _emitter2.default.sources.USER : arguments[0];

	      var change = this.scroll.update(source); // Will update selection before selection.update() does if text changes
	      this.selection.update(source);
	      return change;
	    }
	  }, {
	    key: 'updateContents',
	    value: function updateContents(delta) {
	      var source = arguments.length <= 1 || arguments[1] === undefined ? _emitter2.default.sources.API : arguments[1];

	      var range = this.getSelection();
	      if (Array.isArray(delta)) {
	        delta = new _delta2.default(delta.slice());
	      }
	      var change = this.editor.applyDelta(delta, source);
	      if (range != null) {
	        range = shiftRange(range, change, source);
	        this.setSelection(range, _emitter2.default.sources.SILENT);
	      }
	      return change;
	    }
	  }]);

	  return Quill;
	}();

	Quill.DEFAULTS = {
	  bounds: document.body,
	  formats: null,
	  modules: {},
	  placeholder: '',
	  readOnly: false,
	  theme: 'default'
	};
	Quill.events = _emitter2.default.events;
	Quill.sources = _emitter2.default.sources;
	Quill.version = ("1.0.0-beta.8");

	Quill.imports = {
	  'delta': _delta2.default,
	  'parchment': _parchment2.default,
	  'core/module': _module2.default,
	  'core/theme': _theme2.default
	};

	function overload(index, length, name, value, source) {
	  var formats = {};
	  if (typeof index.index === 'number' && typeof index.length === 'number') {
	    // Allow for throwaway end (used by insertText/insertEmbed)
	    if (typeof length !== 'number') {
	      source = value, value = name, name = length, length = index.length, index = index.index;
	    } else {
	      length = index.length, index = index.index;
	    }
	  } else if (typeof length !== 'number') {
	    source = value, value = name, name = length, length = 0;
	  }
	  // Handle format being object, two format name/value strings or excluded
	  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
	    formats = name;
	    source = value;
	  } else if (typeof name === 'string') {
	    if (value != null) {
	      formats[name] = value;
	    } else {
	      source = name;
	    }
	  }
	  // Handle optional source
	  source = source || _emitter2.default.sources.API;
	  return [index, length, formats, source];
	}

	function shiftRange(range, index, length, source) {
	  if (range == null) return null;
	  var start = void 0,
	      end = void 0;
	  if (index instanceof _delta2.default) {
	    var _map = [range.index, range.index + range.length].map(function (pos) {
	      return index.transformPosition(pos, source === _emitter2.default.sources.USER);
	    });

	    var _map2 = _slicedToArray(_map, 2);

	    start = _map2[0];
	    end = _map2[1];
	  } else {
	    if (source === _emitter2.default.sources.USER) index -= 1;

	    var _map3 = [range.index, range.index + range.length].map(function (pos) {
	      if (index > pos) return pos;
	      if (length >= 0) {
	        return pos + length;
	      } else {
	        return Math.max(index, pos + length);
	      }
	    });

	    var _map4 = _slicedToArray(_map3, 2);

	    start = _map4[0];
	    end = _map4[1];
	  }
	  return new _selection.Range(start, end - start);
	}

	exports.overload = overload;
	exports.default = Quill;

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	var elem = document.createElement('div');
	elem.classList.toggle('test-class', false);
	if (elem.classList.contains('test-class')) {
	  (function () {
	    var _toggle = DOMTokenList.prototype.toggle;
	    DOMTokenList.prototype.toggle = function (token, force) {
	      if (arguments.length > 1 && !this.contains(token) === !force) {
	        return force;
	      } else {
	        return _toggle.call(this, token);
	      }
	    };
	  })();
	}

	if (!String.prototype.startsWith) {
	  String.prototype.startsWith = function (searchString, position) {
	    position = position || 0;
	    return this.substr(position, searchString.length) === searchString;
	  };
	}

	if (!String.prototype.endsWith) {
	  String.prototype.endsWith = function (searchString, position) {
	    var subjectString = this.toString();
	    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
	      position = subjectString.length;
	    }
	    position -= searchString.length;
	    var lastIndex = subjectString.indexOf(searchString, position);
	    return lastIndex !== -1 && lastIndex === position;
	  };
	}

	if (!Array.prototype.find) {
	  Object.defineProperty(Array.prototype, "find", {
	    value: function value(predicate) {
	      if (this === null) {
	        throw new TypeError('Array.prototype.find called on null or undefined');
	      }
	      if (typeof predicate !== 'function') {
	        throw new TypeError('predicate must be a function');
	      }
	      var list = Object(this);
	      var length = list.length >>> 0;
	      var thisArg = arguments[1];
	      var value;

	      for (var i = 0; i < length; i++) {
	        value = list[i];
	        if (predicate.call(thisArg, value, i, list)) {
	          return value;
	        }
	      }
	      return undefined;
	    }
	  });
	}

	// Disable resizing in Firefox
	document.addEventListener("DOMContentLoaded", function () {
	  document.execCommand("enableObjectResizing", false, false);
	});

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var diff = __webpack_require__(22);
	var equal = __webpack_require__(23);
	var extend = __webpack_require__(26);
	var op = __webpack_require__(27);

	var NULL_CHARACTER = String.fromCharCode(0); // Placeholder char for embed in diff()


	var Delta = function Delta(ops) {
	  // Assume we are given a well formed ops
	  if (Array.isArray(ops)) {
	    this.ops = ops;
	  } else if (ops != null && Array.isArray(ops.ops)) {
	    this.ops = ops.ops;
	  } else {
	    this.ops = [];
	  }
	};

	Delta.prototype.insert = function (text, attributes) {
	  var newOp = {};
	  if (text.length === 0) return this;
	  newOp.insert = text;
	  if ((typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) === 'object' && Object.keys(attributes).length > 0) newOp.attributes = attributes;
	  return this.push(newOp);
	};

	Delta.prototype['delete'] = function (length) {
	  if (length <= 0) return this;
	  return this.push({ 'delete': length });
	};

	Delta.prototype.retain = function (length, attributes) {
	  if (length <= 0) return this;
	  var newOp = { retain: length };
	  if ((typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) === 'object' && Object.keys(attributes).length > 0) newOp.attributes = attributes;
	  return this.push(newOp);
	};

	Delta.prototype.push = function (newOp) {
	  var index = this.ops.length;
	  var lastOp = this.ops[index - 1];
	  newOp = extend(true, {}, newOp);
	  if ((typeof lastOp === 'undefined' ? 'undefined' : _typeof(lastOp)) === 'object') {
	    if (typeof newOp['delete'] === 'number' && typeof lastOp['delete'] === 'number') {
	      this.ops[index - 1] = { 'delete': lastOp['delete'] + newOp['delete'] };
	      return this;
	    }
	    // Since it does not matter if we insert before or after deleting at the same index,
	    // always prefer to insert first
	    if (typeof lastOp['delete'] === 'number' && newOp.insert != null) {
	      index -= 1;
	      lastOp = this.ops[index - 1];
	      if ((typeof lastOp === 'undefined' ? 'undefined' : _typeof(lastOp)) !== 'object') {
	        this.ops.unshift(newOp);
	        return this;
	      }
	    }
	    if (equal(newOp.attributes, lastOp.attributes)) {
	      if (typeof newOp.insert === 'string' && typeof lastOp.insert === 'string') {
	        this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
	        if (_typeof(newOp.attributes) === 'object') this.ops[index - 1].attributes = newOp.attributes;
	        return this;
	      } else if (typeof newOp.retain === 'number' && typeof lastOp.retain === 'number') {
	        this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
	        if (_typeof(newOp.attributes) === 'object') this.ops[index - 1].attributes = newOp.attributes;
	        return this;
	      }
	    }
	  }
	  if (index === this.ops.length) {
	    this.ops.push(newOp);
	  } else {
	    this.ops.splice(index, 0, newOp);
	  }
	  return this;
	};

	Delta.prototype.chop = function () {
	  var lastOp = this.ops[this.ops.length - 1];
	  if (lastOp && lastOp.retain && !lastOp.attributes) {
	    this.ops.pop();
	  }
	  return this;
	};

	Delta.prototype.length = function () {
	  return this.ops.reduce(function (length, elem) {
	    return length + op.length(elem);
	  }, 0);
	};

	Delta.prototype.slice = function (start, end) {
	  start = start || 0;
	  if (typeof end !== 'number') end = Infinity;
	  var delta = new Delta();
	  var iter = op.iterator(this.ops);
	  var index = 0;
	  while (index < end && iter.hasNext()) {
	    var nextOp;
	    if (index < start) {
	      nextOp = iter.next(start - index);
	    } else {
	      nextOp = iter.next(end - index);
	      delta.push(nextOp);
	    }
	    index += op.length(nextOp);
	  }
	  return delta;
	};

	Delta.prototype.compose = function (other) {
	  var thisIter = op.iterator(this.ops);
	  var otherIter = op.iterator(other.ops);
	  var delta = new Delta();
	  while (thisIter.hasNext() || otherIter.hasNext()) {
	    if (otherIter.peekType() === 'insert') {
	      delta.push(otherIter.next());
	    } else if (thisIter.peekType() === 'delete') {
	      delta.push(thisIter.next());
	    } else {
	      var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
	      var thisOp = thisIter.next(length);
	      var otherOp = otherIter.next(length);
	      if (typeof otherOp.retain === 'number') {
	        var newOp = {};
	        if (typeof thisOp.retain === 'number') {
	          newOp.retain = length;
	        } else {
	          newOp.insert = thisOp.insert;
	        }
	        // Preserve null when composing with a retain, otherwise remove it for inserts
	        var attributes = op.attributes.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === 'number');
	        if (attributes) newOp.attributes = attributes;
	        delta.push(newOp);
	        // Other op should be delete, we could be an insert or retain
	        // Insert + delete cancels out
	      } else if (typeof otherOp['delete'] === 'number' && typeof thisOp.retain === 'number') {
	        delta.push(otherOp);
	      }
	    }
	  }
	  return delta.chop();
	};

	Delta.prototype.concat = function (other) {
	  var delta = new Delta(this.ops.slice());
	  if (other.ops.length > 0) {
	    delta.push(other.ops[0]);
	    delta.ops = delta.ops.concat(other.ops.slice(1));
	  }
	  return delta;
	};

	Delta.prototype.diff = function (other) {
	  var delta = new Delta();
	  if (this.ops === other.ops) {
	    return delta;
	  }
	  var strings = [this.ops, other.ops].map(function (ops) {
	    return ops.map(function (op) {
	      if (op.insert != null) {
	        return typeof op.insert === 'string' ? op.insert : NULL_CHARACTER;
	      }
	      var prep = ops === other.ops ? 'on' : 'with';
	      throw new Error('diff() called ' + prep + ' non-document');
	    }).join('');
	  });
	  var diffResult = diff(strings[0], strings[1]);
	  var thisIter = op.iterator(this.ops);
	  var otherIter = op.iterator(other.ops);
	  diffResult.forEach(function (component) {
	    var length = component[1].length;
	    while (length > 0) {
	      var opLength = 0;
	      switch (component[0]) {
	        case diff.INSERT:
	          opLength = Math.min(otherIter.peekLength(), length);
	          delta.push(otherIter.next(opLength));
	          break;
	        case diff.DELETE:
	          opLength = Math.min(length, thisIter.peekLength());
	          thisIter.next(opLength);
	          delta['delete'](opLength);
	          break;
	        case diff.EQUAL:
	          opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
	          var thisOp = thisIter.next(opLength);
	          var otherOp = otherIter.next(opLength);
	          if (equal(thisOp.insert, otherOp.insert)) {
	            delta.retain(opLength, op.attributes.diff(thisOp.attributes, otherOp.attributes));
	          } else {
	            delta.push(otherOp)['delete'](opLength);
	          }
	          break;
	      }
	      length -= opLength;
	    }
	  });
	  return delta.chop();
	};

	Delta.prototype.transform = function (other, priority) {
	  priority = !!priority;
	  if (typeof other === 'number') {
	    return this.transformPosition(other, priority);
	  }
	  var thisIter = op.iterator(this.ops);
	  var otherIter = op.iterator(other.ops);
	  var delta = new Delta();
	  while (thisIter.hasNext() || otherIter.hasNext()) {
	    if (thisIter.peekType() === 'insert' && (priority || otherIter.peekType() !== 'insert')) {
	      delta.retain(op.length(thisIter.next()));
	    } else if (otherIter.peekType() === 'insert') {
	      delta.push(otherIter.next());
	    } else {
	      var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
	      var thisOp = thisIter.next(length);
	      var otherOp = otherIter.next(length);
	      if (thisOp['delete']) {
	        // Our delete either makes their delete redundant or removes their retain
	        continue;
	      } else if (otherOp['delete']) {
	        delta.push(otherOp);
	      } else {
	        // We retain either their retain or insert
	        delta.retain(length, op.attributes.transform(thisOp.attributes, otherOp.attributes, priority));
	      }
	    }
	  }
	  return delta.chop();
	};

	Delta.prototype.transformPosition = function (index, priority) {
	  priority = !!priority;
	  var thisIter = op.iterator(this.ops);
	  var offset = 0;
	  while (thisIter.hasNext() && offset <= index) {
	    var length = thisIter.peekLength();
	    var nextType = thisIter.peekType();
	    thisIter.next();
	    if (nextType === 'delete') {
	      index -= Math.min(length, index - offset);
	      continue;
	    } else if (nextType === 'insert' && (offset < index || !priority)) {
	      index += length;
	    }
	    offset += length;
	  }
	  return index;
	};

	module.exports = Delta;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * This library modifies the diff-patch-match library by Neil Fraser
	 * by removing the patch and match functionality and certain advanced
	 * options in the diff function. The original license is as follows:
	 *
	 * ===
	 *
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
	 * The data structure representing a diff is an array of tuples:
	 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
	 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
	 */
	var DIFF_DELETE = -1;
	var DIFF_INSERT = 1;
	var DIFF_EQUAL = 0;

	/**
	 * Find the differences between two texts.  Simplifies the problem by stripping
	 * any common prefix or suffix off the texts before diffing.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_main(text1, text2) {
	  // Check for equality (speedup).
	  if (text1 == text2) {
	    if (text1) {
	      return [[DIFF_EQUAL, text1]];
	    }
	    return [];
	  }

	  // Trim off common prefix (speedup).
	  var commonlength = diff_commonPrefix(text1, text2);
	  var commonprefix = text1.substring(0, commonlength);
	  text1 = text1.substring(commonlength);
	  text2 = text2.substring(commonlength);

	  // Trim off common suffix (speedup).
	  commonlength = diff_commonSuffix(text1, text2);
	  var commonsuffix = text1.substring(text1.length - commonlength);
	  text1 = text1.substring(0, text1.length - commonlength);
	  text2 = text2.substring(0, text2.length - commonlength);

	  // Compute the diff on the middle block.
	  var diffs = diff_compute_(text1, text2);

	  // Restore the prefix and suffix.
	  if (commonprefix) {
	    diffs.unshift([DIFF_EQUAL, commonprefix]);
	  }
	  if (commonsuffix) {
	    diffs.push([DIFF_EQUAL, commonsuffix]);
	  }
	  diff_cleanupMerge(diffs);
	  return diffs;
	};

	/**
	 * Find the differences between two texts.  Assumes that the texts do not
	 * have any common prefix or suffix.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_compute_(text1, text2) {
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
	    diffs = [[DIFF_INSERT, longtext.substring(0, i)], [DIFF_EQUAL, shorttext], [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
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
	  var hm = diff_halfMatch_(text1, text2);
	  if (hm) {
	    // A half-match was found, sort out the return data.
	    var text1_a = hm[0];
	    var text1_b = hm[1];
	    var text2_a = hm[2];
	    var text2_b = hm[3];
	    var mid_common = hm[4];
	    // Send both pairs off for separate processing.
	    var diffs_a = diff_main(text1_a, text2_a);
	    var diffs_b = diff_main(text1_b, text2_b);
	    // Merge the results.
	    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
	  }

	  return diff_bisect_(text1, text2);
	};

	/**
	 * Find the 'middle snake' of a diff, split the problem in two
	 * and return the recursively constructed diff.
	 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 * @private
	 */
	function diff_bisect_(text1, text2) {
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
	  var front = delta % 2 != 0;
	  // Offsets for start and end of k loop.
	  // Prevents mapping of space beyond the grid.
	  var k1start = 0;
	  var k1end = 0;
	  var k2start = 0;
	  var k2end = 0;
	  for (var d = 0; d < max_d; d++) {
	    // Walk the front path one step.
	    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
	      var k1_offset = v_offset + k1;
	      var x1;
	      if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
	        x1 = v1[k1_offset + 1];
	      } else {
	        x1 = v1[k1_offset - 1] + 1;
	      }
	      var y1 = x1 - k1;
	      while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
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
	            return diff_bisectSplit_(text1, text2, x1, y1);
	          }
	        }
	      }
	    }

	    // Walk the reverse path one step.
	    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
	      var k2_offset = v_offset + k2;
	      var x2;
	      if (k2 == -d || k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
	        x2 = v2[k2_offset + 1];
	      } else {
	        x2 = v2[k2_offset - 1] + 1;
	      }
	      var y2 = x2 - k2;
	      while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
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
	            return diff_bisectSplit_(text1, text2, x1, y1);
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
	 * @return {Array} Array of diff tuples.
	 */
	function diff_bisectSplit_(text1, text2, x, y) {
	  var text1a = text1.substring(0, x);
	  var text2a = text2.substring(0, y);
	  var text1b = text1.substring(x);
	  var text2b = text2.substring(y);

	  // Compute both diffs serially.
	  var diffs = diff_main(text1a, text2a);
	  var diffsb = diff_main(text1b, text2b);

	  return diffs.concat(diffsb);
	};

	/**
	 * Determine the common prefix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the start of each
	 *     string.
	 */
	function diff_commonPrefix(text1, text2) {
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
	    if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
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
	function diff_commonSuffix(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerend = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
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
	 * Do the two texts share a substring which is at least half the length of the
	 * longer text?
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {Array.<string>} Five element Array, containing the prefix of
	 *     text1, the suffix of text1, the prefix of text2, the suffix of
	 *     text2 and the common middle.  Or null if there was no match.
	 */
	function diff_halfMatch_(text1, text2) {
	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
	    return null; // Pointless.
	  }

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
	      var prefixLength = diff_commonPrefix(longtext.substring(i), shorttext.substring(j));
	      var suffixLength = diff_commonSuffix(longtext.substring(0, i), shorttext.substring(0, j));
	      if (best_common.length < suffixLength + prefixLength) {
	        best_common = shorttext.substring(j - suffixLength, j) + shorttext.substring(j, j + prefixLength);
	        best_longtext_a = longtext.substring(0, i - suffixLength);
	        best_longtext_b = longtext.substring(i + prefixLength);
	        best_shorttext_a = shorttext.substring(0, j - suffixLength);
	        best_shorttext_b = shorttext.substring(j + prefixLength);
	      }
	    }
	    if (best_common.length * 2 >= longtext.length) {
	      return [best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b, best_common];
	    } else {
	      return null;
	    }
	  }

	  // First check if the second quarter is the seed for a half-match.
	  var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
	  // Check again based on the third quarter.
	  var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
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
	 * Reorder and merge like edit sections.  Merge equalities.
	 * Any edit section can move as long as it doesn't cross an equality.
	 * @param {Array} diffs Array of diff tuples.
	 */
	function diff_cleanupMerge(diffs) {
	  diffs.push([DIFF_EQUAL, '']); // Add a dummy entry at the end.
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
	            commonlength = diff_commonPrefix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] == DIFF_EQUAL) {
	                diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
	              } else {
	                diffs.splice(0, 0, [DIFF_EQUAL, text_insert.substring(0, commonlength)]);
	                pointer++;
	              }
	              text_insert = text_insert.substring(commonlength);
	              text_delete = text_delete.substring(commonlength);
	            }
	            // Factor out any common suffixies.
	            commonlength = diff_commonSuffix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
	              text_insert = text_insert.substring(0, text_insert.length - commonlength);
	              text_delete = text_delete.substring(0, text_delete.length - commonlength);
	            }
	          }
	          // Delete the offending records and add the merged ones.
	          if (count_delete === 0) {
	            diffs.splice(pointer - count_insert, count_delete + count_insert, [DIFF_INSERT, text_insert]);
	          } else if (count_insert === 0) {
	            diffs.splice(pointer - count_delete, count_delete + count_insert, [DIFF_DELETE, text_delete]);
	          } else {
	            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [DIFF_DELETE, text_delete], [DIFF_INSERT, text_insert]);
	          }
	          pointer = pointer - count_delete - count_insert + (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
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
	    diffs.pop(); // Remove the dummy entry at the end.
	  }

	  // Second pass: look for single edits surrounded on both sides by equalities
	  // which can be shifted sideways to eliminate an equality.
	  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
	  var changes = false;
	  pointer = 1;
	  // Intentionally ignore the first and last element (don't need checking).
	  while (pointer < diffs.length - 1) {
	    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
	      // This is a single edit surrounded by equalities.
	      if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
	        // Shift the edit over the previous equality.
	        diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
	        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
	        diffs.splice(pointer - 1, 1);
	        changes = true;
	      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
	        // Shift the edit over the next equality.
	        diffs[pointer - 1][1] += diffs[pointer + 1][1];
	        diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
	        diffs.splice(pointer + 1, 1);
	        changes = true;
	      }
	    }
	    pointer++;
	  }
	  // If shifts were made, the diff needs reordering and another shift sweep.
	  if (changes) {
	    diff_cleanupMerge(diffs);
	  }
	};

	var diff = diff_main;
	diff.INSERT = DIFF_INSERT;
	diff.DELETE = DIFF_DELETE;
	diff.EQUAL = DIFF_EQUAL;

	module.exports = diff;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(24);
	var isArguments = __webpack_require__(25);

	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	    // 7.3. Other pairs that do not both pass typeof value == 'object',
	    // equivalence is determined by ==.
	  } else if (!actual || !expected || (typeof actual === 'undefined' ? 'undefined' : _typeof(actual)) != 'object' && (typeof expected === 'undefined' ? 'undefined' : _typeof(expected)) != 'object') {
	    return opts.strict ? actual === expected : actual == expected;

	    // 7.4. For all other Object pairs, including Array objects, equivalence is
	    // determined by having the same number of owned properties (as verified
	    // with Object.prototype.hasOwnProperty.call), the same set of keys
	    // (although not necessarily the same order), equivalent values for every
	    // corresponding key, and an identical 'prototype' property. Note: this
	    // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	};

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer(x) {
	  if (!x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}

	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b);
	  } catch (e) {
	    //happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length) return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i]) return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === (typeof b === 'undefined' ? 'undefined' : _typeof(b));
	}

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;

	exports.shim = shim;
	function shim(obj) {
	  var keys = [];
	  for (var key in obj) {
	    keys.push(key);
	  }return keys;
	}

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var supportsArgumentsClass = function () {
	  return Object.prototype.toString.call(arguments);
	}() == '[object Arguments]';

	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	};

	exports.unsupported = unsupported;
	function unsupported(object) {
	  return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
		var options,
		    name,
		    src,
		    copy,
		    copyIsArray,
		    clone,
		    target = arguments[0],
		    i = 1,
		    length = arguments.length,
		    deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' && typeof target !== 'function' || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

							// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var equal = __webpack_require__(23);
	var extend = __webpack_require__(26);

	var lib = {
	  attributes: {
	    compose: function compose(a, b, keepNull) {
	      if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object') a = {};
	      if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object') b = {};
	      var attributes = extend(true, {}, b);
	      if (!keepNull) {
	        attributes = Object.keys(attributes).reduce(function (copy, key) {
	          if (attributes[key] != null) {
	            copy[key] = attributes[key];
	          }
	          return copy;
	        }, {});
	      }
	      for (var key in a) {
	        if (a[key] !== undefined && b[key] === undefined) {
	          attributes[key] = a[key];
	        }
	      }
	      return Object.keys(attributes).length > 0 ? attributes : undefined;
	    },

	    diff: function diff(a, b) {
	      if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object') a = {};
	      if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object') b = {};
	      var attributes = Object.keys(a).concat(Object.keys(b)).reduce(function (attributes, key) {
	        if (!equal(a[key], b[key])) {
	          attributes[key] = b[key] === undefined ? null : b[key];
	        }
	        return attributes;
	      }, {});
	      return Object.keys(attributes).length > 0 ? attributes : undefined;
	    },

	    transform: function transform(a, b, priority) {
	      if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object') return b;
	      if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object') return undefined;
	      if (!priority) return b; // b simply overwrites us without priority
	      var attributes = Object.keys(b).reduce(function (attributes, key) {
	        if (a[key] === undefined) attributes[key] = b[key]; // null is a valid value
	        return attributes;
	      }, {});
	      return Object.keys(attributes).length > 0 ? attributes : undefined;
	    }
	  },

	  iterator: function iterator(ops) {
	    return new Iterator(ops);
	  },

	  length: function length(op) {
	    if (typeof op['delete'] === 'number') {
	      return op['delete'];
	    } else if (typeof op.retain === 'number') {
	      return op.retain;
	    } else {
	      return typeof op.insert === 'string' ? op.insert.length : 1;
	    }
	  }
	};

	function Iterator(ops) {
	  this.ops = ops;
	  this.index = 0;
	  this.offset = 0;
	};

	Iterator.prototype.hasNext = function () {
	  return this.peekLength() < Infinity;
	};

	Iterator.prototype.next = function (length) {
	  if (!length) length = Infinity;
	  var nextOp = this.ops[this.index];
	  if (nextOp) {
	    var offset = this.offset;
	    var opLength = lib.length(nextOp);
	    if (length >= opLength - offset) {
	      length = opLength - offset;
	      this.index += 1;
	      this.offset = 0;
	    } else {
	      this.offset += length;
	    }
	    if (typeof nextOp['delete'] === 'number') {
	      return { 'delete': length };
	    } else {
	      var retOp = {};
	      if (nextOp.attributes) {
	        retOp.attributes = nextOp.attributes;
	      }
	      if (typeof nextOp.retain === 'number') {
	        retOp.retain = length;
	      } else if (typeof nextOp.insert === 'string') {
	        retOp.insert = nextOp.insert.substr(offset, length);
	      } else {
	        // offset should === 0, length should === 1
	        retOp.insert = nextOp.insert;
	      }
	      return retOp;
	    }
	  } else {
	    return { retain: Infinity };
	  }
	};

	Iterator.prototype.peekLength = function () {
	  if (this.ops[this.index]) {
	    // Should never return 0 if our index is being managed correctly
	    return lib.length(this.ops[this.index]) - this.offset;
	  } else {
	    return Infinity;
	  }
	};

	Iterator.prototype.peekType = function () {
	  if (this.ops[this.index]) {
	    if (typeof this.ops[this.index]['delete'] === 'number') {
	      return 'delete';
	    } else if (typeof this.ops[this.index].retain === 'number') {
	      return 'retain';
	    } else {
	      return 'insert';
	    }
	  }
	  return 'retain';
	};

	module.exports = lib;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _op = __webpack_require__(27);

	var _op2 = _interopRequireDefault(_op);

	var _emitter3 = __webpack_require__(29);

	var _emitter4 = _interopRequireDefault(_emitter3);

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _code = __webpack_require__(32);

	var _code2 = _interopRequireDefault(_code);

	var _block = __webpack_require__(33);

	var _block2 = _interopRequireDefault(_block);

	var _clone = __webpack_require__(38);

	var _clone2 = _interopRequireDefault(_clone);

	var _deepEqual = __webpack_require__(23);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _extend = __webpack_require__(26);

	var _extend2 = _interopRequireDefault(_extend);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Editor = function () {
	  function Editor(scroll, emitter) {
	    _classCallCheck(this, Editor);

	    this.scroll = scroll;
	    this.emitter = emitter;
	    this.emitter.on(_emitter4.default.events.SCROLL_UPDATE, this.update.bind(this, null));
	    this.delta = this.getDelta();
	    this.enable();
	  }

	  _createClass(Editor, [{
	    key: 'applyDelta',
	    value: function applyDelta(delta) {
	      var _this = this;

	      var source = arguments.length <= 1 || arguments[1] === undefined ? _emitter4.default.sources.API : arguments[1];

	      this.updating = true;
	      var consumeNextNewline = false;
	      delta.ops.reduce(function (index, op) {
	        if (typeof op.delete === 'number') {
	          _this.scroll.deleteAt(index, op.delete);
	          return index;
	        }
	        var length = op.retain || op.insert.length || 1;
	        var attributes = handleOldList(op.attributes || {});
	        if (op.insert != null) {
	          var _handleOldEmbed = handleOldEmbed(op, attributes);

	          var _handleOldEmbed2 = _slicedToArray(_handleOldEmbed, 2);

	          op = _handleOldEmbed2[0];
	          attributes = _handleOldEmbed2[1];

	          if (typeof op.insert === 'string') {
	            var text = op.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	            length = text.length;
	            if (text.endsWith('\n') && consumeNextNewline) {
	              consumeNextNewline = false;
	              text = text.slice(0, -1);
	            }
	            if (index >= _this.scroll.length() && !text.endsWith('\n')) {
	              consumeNextNewline = true;
	            }
	            _this.scroll.insertAt(index, text);

	            var _scroll$line = _this.scroll.line(index);

	            var _scroll$line2 = _slicedToArray(_scroll$line, 2);

	            var line = _scroll$line2[0];
	            var offset = _scroll$line2[1];

	            var formats = (0, _extend2.default)({}, (0, _block.bubbleFormats)(line));
	            if (line instanceof _block2.default) {
	              var _line$descendant = line.descendant(_parchment2.default.Leaf, offset);

	              var _line$descendant2 = _slicedToArray(_line$descendant, 1);

	              var leaf = _line$descendant2[0];

	              formats = (0, _extend2.default)(formats, (0, _block.bubbleFormats)(leaf));
	            }
	            attributes = _op2.default.attributes.diff(formats, attributes) || {};
	          } else if (_typeof(op.insert) === 'object') {
	            var key = Object.keys(op.insert)[0]; // There should only be one key
	            if (key != null) {
	              _this.scroll.insertAt(index, key, op.insert[key]);
	            } else {
	              return index;
	            }
	          }
	        }
	        Object.keys(attributes).forEach(function (name) {
	          _this.scroll.formatAt(index, length, name, attributes[name]);
	        });
	        return index + length;
	      }, 0);
	      this.updating = false;
	      return this.update(delta, source);
	    }
	  }, {
	    key: 'deleteText',
	    value: function deleteText(index, length) {
	      var source = arguments.length <= 2 || arguments[2] === undefined ? _emitter4.default.sources.API : arguments[2];

	      this.scroll.deleteAt(index, length);
	      return this.update(new _delta2.default().retain(index).delete(length), source);
	    }
	  }, {
	    key: 'enable',
	    value: function enable() {
	      var enabled = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

	      this.scroll.domNode.setAttribute('contenteditable', enabled);
	    }
	  }, {
	    key: 'formatLine',
	    value: function formatLine(index, length) {
	      var _this2 = this;

	      var formats = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	      var source = arguments.length <= 3 || arguments[3] === undefined ? _emitter4.default.sources.API : arguments[3];

	      this.scroll.update();
	      Object.keys(formats).forEach(function (format) {
	        var lines = _this2.scroll.lines(index, Math.max(length, 1));
	        lines.forEach(function (line, i) {
	          if (!(line instanceof _code2.default)) {
	            line.format(format, formats[format]);
	          } else {
	            var codeIndex = index - line.offset(_this2.scroll);
	            var codeLength = line.newlineIndex(codeIndex) - index + 1;
	            line.formatAt(codeIndex, codeLength, format, formats[format]);
	          }
	        });
	      });
	      this.scroll.optimize();
	      return this.update(new _delta2.default().retain(index).retain(length, (0, _clone2.default)(formats)), source);
	    }
	  }, {
	    key: 'formatText',
	    value: function formatText(index, length) {
	      var _this3 = this;

	      var formats = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	      var source = arguments.length <= 3 || arguments[3] === undefined ? _emitter4.default.sources.API : arguments[3];

	      Object.keys(formats).forEach(function (format) {
	        _this3.scroll.formatAt(index, length, format, formats[format]);
	      });
	      return this.update(new _delta2.default().retain(index).retain(length, (0, _clone2.default)(formats)), source);
	    }
	  }, {
	    key: 'getContents',
	    value: function getContents(index, length) {
	      return this.delta.slice(index, index + length);
	    }
	  }, {
	    key: 'getDelta',
	    value: function getDelta() {
	      return this.scroll.lines().reduce(function (delta, line) {
	        return delta.concat(line.delta());
	      }, new _delta2.default());
	    }
	  }, {
	    key: 'getFormat',
	    value: function getFormat(index) {
	      var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	      var lines = [],
	          leaves = [];
	      if (length === 0) {
	        this.scroll.path(index).forEach(function (path) {
	          var _path = _slicedToArray(path, 2);

	          var blot = _path[0];
	          var offset = _path[1];

	          if (blot instanceof _block2.default) {
	            lines.push(blot);
	          } else if (blot instanceof _parchment2.default.Leaf) {
	            leaves.push(blot);
	          }
	        });
	      } else {
	        lines = this.scroll.lines(index, length);
	        leaves = this.scroll.descendants(_parchment2.default.Leaf, index, length);
	      }
	      var formatsArr = [lines, leaves].map(function (blots) {
	        if (blots.length === 0) return {};
	        var formats = (0, _block.bubbleFormats)(blots.shift());
	        while (Object.keys(formats).length > 0) {
	          var blot = blots.shift();
	          if (blot == null) return formats;
	          formats = combineFormats((0, _block.bubbleFormats)(blot), formats);
	        }
	        return formats;
	      });
	      return _extend2.default.apply(_extend2.default, formatsArr);
	    }
	  }, {
	    key: 'getText',
	    value: function getText(index, length) {
	      return this.getContents(index, length).ops.map(function (op) {
	        return typeof op.insert === 'string' ? op.insert : '';
	      }).join('');
	    }
	  }, {
	    key: 'insertEmbed',
	    value: function insertEmbed(index, embed, value) {
	      var source = arguments.length <= 3 || arguments[3] === undefined ? _emitter4.default.sources.API : arguments[3];

	      this.scroll.insertAt(index, embed, value);
	      return this.update(new _delta2.default().retain(index).insert(_defineProperty({}, embed, value)), source);
	    }
	  }, {
	    key: 'insertText',
	    value: function insertText(index, text) {
	      var _this4 = this;

	      var formats = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	      var source = arguments.length <= 3 || arguments[3] === undefined ? _emitter4.default.sources.API : arguments[3];

	      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	      this.scroll.insertAt(index, text);
	      Object.keys(formats).forEach(function (format) {
	        _this4.scroll.formatAt(index, text.length, format, formats[format]);
	      });
	      return this.update(new _delta2.default().retain(index).insert(text, (0, _clone2.default)(formats)), source);
	    }
	  }, {
	    key: 'isBlank',
	    value: function isBlank() {
	      if (this.scroll.children.length == 0) return true;
	      if (this.scroll.children.length > 1) return false;
	      var child = this.scroll.children.head;
	      return child.length() <= 1 && Object.keys(child.formats()).length == 0;
	    }
	  }, {
	    key: 'removeFormat',
	    value: function removeFormat(index, length, source) {
	      var text = this.getText(index, length);

	      var _scroll$line3 = this.scroll.line(index + length);

	      var _scroll$line4 = _slicedToArray(_scroll$line3, 2);

	      var line = _scroll$line4[0];
	      var offset = _scroll$line4[1];

	      var suffixLength = 0,
	          suffix = new _delta2.default();
	      if (line != null) {
	        suffixLength = line.length() - offset;
	        suffix = line.delta().slice(offset, offset + suffixLength - 1).insert('\n');
	      }
	      var contents = this.getContents(index, length + suffixLength);
	      var diff = contents.diff(new _delta2.default().insert(text).concat(suffix));
	      var delta = new _delta2.default().retain(index).concat(diff);
	      return this.applyDelta(delta, source);
	    }
	  }, {
	    key: 'update',
	    value: function update(change) {
	      var source = arguments.length <= 1 || arguments[1] === undefined ? _emitter4.default.sources.USER : arguments[1];

	      if (this.updating) return;
	      var oldDelta = this.delta;
	      this.delta = this.getDelta();
	      if (!change || !(0, _deepEqual2.default)(oldDelta.compose(change), this.delta)) {
	        change = oldDelta.diff(this.delta);
	      }
	      if (change.length() > 0) {
	        var _emitter;

	        var args = [_emitter4.default.events.TEXT_CHANGE, change, oldDelta, source];
	        (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
	        if (source !== _emitter4.default.sources.SILENT) {
	          var _emitter2;

	          (_emitter2 = this.emitter).emit.apply(_emitter2, args);
	        }
	      }
	      return change;
	    }
	  }]);

	  return Editor;
	}();

	function combineFormats(formats, combined) {
	  return Object.keys(combined).reduce(function (merged, name) {
	    if (formats[name] == null) return merged;
	    if (combined[name] === formats[name]) {
	      merged[name] = combined[name];
	    } else if (Array.isArray(combined[name])) {
	      if (combined[name].indexOf(formats[name]) < 0) {
	        merged[name] = combined[name].concat([formats[name]]);
	      }
	    } else {
	      merged[name] = [combined[name], formats[name]];
	    }
	    return merged;
	  }, {});
	}

	function handleOldEmbed(op, attributes) {
	  if (op.insert === 1) {
	    attributes = (0, _clone2.default)(attributes);
	    op = {
	      insert: { image: attributes.image },
	      attributes: attributes
	    };
	    delete attributes['image'];
	  }
	  return [op, attributes];
	}

	function handleOldList(attributes) {
	  if (attributes['list'] === true) {
	    attributes = (0, _clone2.default)(attributes);
	    attributes['list'] = 'ordered';
	  } else if (attributes['bullet'] === true) {
	    attributes = (0, _clone2.default)(attributes);
	    attributes['list'] = 'bullet';
	  }
	  return attributes;
	}

	exports.default = Editor;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _eventemitter = __webpack_require__(30);

	var _eventemitter2 = _interopRequireDefault(_eventemitter);

	var _logger = __webpack_require__(31);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:events');

	var Emitter = function (_EventEmitter) {
	  _inherits(Emitter, _EventEmitter);

	  function Emitter() {
	    _classCallCheck(this, Emitter);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Emitter).call(this));

	    _this.on('error', debug.error);
	    return _this;
	  }

	  _createClass(Emitter, [{
	    key: 'emit',
	    value: function emit() {
	      debug.log.apply(debug, arguments);
	      _get(Object.getPrototypeOf(Emitter.prototype), 'emit', this).apply(this, arguments);
	    }
	  }]);

	  return Emitter;
	}(_eventemitter2.default);

	Emitter.events = {
	  EDITOR_CHANGE: 'editor-change',
	  SCROLL_BEFORE_UPDATE: 'scroll-before-update',
	  SCROLL_OPTIMIZE: 'scroll-optimize',
	  SCROLL_UPDATE: 'scroll-update',
	  SELECTION_CHANGE: 'selection-change',
	  TEXT_CHANGE: 'text-change'
	};
	Emitter.sources = {
	  API: 'api',
	  SILENT: 'silent',
	  USER: 'user'
	};

	exports.default = Emitter;

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	var has = Object.prototype.hasOwnProperty;

	//
	// We store our EE objects in a plain object whose properties are event names.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// `~` to make sure that the built-in object properties are not overridden or
	// used as an attack vector.
	// We also assume that `Object.create(null)` is available when the event name
	// is an ES6 Symbol.
	//
	var prefix = typeof Object.create !== 'function' ? '~' : false;

	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} [once=false] Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() {} /* Nothing to set */

	/**
	 * Hold the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;

	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var events = this._events,
	      names = [],
	      name;

	  if (!events) return names;

	  for (name in events) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }

	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }

	  return names;
	};

	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @param {Boolean} exists We only need to know if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event,
	      available = this._events && this._events[evt];

	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];

	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }

	  return ee;
	};

	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events || !this._events[evt]) return false;

	  var listeners = this._events[evt],
	      len = arguments.length,
	      args,
	      i;

	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

	    switch (len) {
	      case 1:
	        return listeners.fn.call(listeners.context), true;
	      case 2:
	        return listeners.fn.call(listeners.context, a1), true;
	      case 3:
	        return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4:
	        return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5:
	        return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6:
	        return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len - 1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length,
	        j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

	      switch (len) {
	        case 1:
	          listeners[i].fn.call(listeners[i].context);break;
	        case 2:
	          listeners[i].fn.call(listeners[i].context, a1);break;
	        case 3:
	          listeners[i].fn.call(listeners[i].context, a1, a2);break;
	        default:
	          if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} [context=this] The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this),
	      evt = prefix ? prefix + event : event;

	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];
	  }

	  return this;
	};

	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} [context=this] The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true),
	      evt = prefix ? prefix + event : event;

	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];
	  }

	  return this;
	};

	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Mixed} context Only remove listeners matching this context.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events || !this._events[evt]) return this;

	  var listeners = this._events[evt],
	      events = [];

	  if (fn) {
	    if (listeners.fn) {
	      if (listeners.fn !== fn || once && !listeners.once || context && listeners.context !== context) {
	        events.push(listeners);
	      }
	    } else {
	      for (var i = 0, length = listeners.length; i < length; i++) {
	        if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
	          events.push(listeners[i]);
	        }
	      }
	    }
	  }

	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[evt] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[evt];
	  }

	  return this;
	};

	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;

	  if (event) delete this._events[prefix ? prefix + event : event];else this._events = prefix ? {} : Object.create(null);

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};

	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;

	//
	// Expose the module.
	//
	if ('undefined' !== typeof module) {
	  module.exports = EventEmitter;
	}

/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var levels = ['error', 'warn', 'log', 'info'];
	var level = 'warn';

	function debug(method) {
	  if (levels.indexOf(method) <= levels.indexOf(level)) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    console[method].apply(console, args);
	  }
	}

	function namespace(ns) {
	  return levels.reduce(function (logger, method) {
	    logger[method] = debug.bind(console, method, ns);
	    return logger;
	  }, {});
	}

	debug.level = namespace.level = function (newLevel) {
	  level = newLevel;
	};

	exports.default = namespace;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.Code = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _block = __webpack_require__(33);

	var _block2 = _interopRequireDefault(_block);

	var _inline = __webpack_require__(36);

	var _inline2 = _interopRequireDefault(_inline);

	var _text = __webpack_require__(37);

	var _text2 = _interopRequireDefault(_text);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Code = function (_Inline) {
	  _inherits(Code, _Inline);

	  function Code() {
	    _classCallCheck(this, Code);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Code).apply(this, arguments));
	  }

	  return Code;
	}(_inline2.default);

	Code.blotName = 'code';
	Code.tagName = 'CODE';

	var CodeBlock = function (_Block) {
	  _inherits(CodeBlock, _Block);

	  function CodeBlock() {
	    _classCallCheck(this, CodeBlock);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(CodeBlock).apply(this, arguments));
	  }

	  _createClass(CodeBlock, [{
	    key: 'delta',
	    value: function delta() {
	      var _this3 = this;

	      var text = this.domNode.textContent;
	      if (text.endsWith('\n')) {
	        // Should always be true
	        text = text.slice(0, -1);
	      }
	      return text.split('\n').reduce(function (delta, frag) {
	        return delta.insert(frag).insert('\n', _this3.formats());
	      }, new _delta2.default());
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      if (name === this.statics.blotName && value) return;

	      var _descendant = this.descendant(_text2.default, this.length() - 1);

	      var _descendant2 = _slicedToArray(_descendant, 2);

	      var text = _descendant2[0];
	      var offset = _descendant2[1];

	      if (text != null) {
	        text.deleteAt(text.length() - 1, 1);
	      }
	      _get(Object.getPrototypeOf(CodeBlock.prototype), 'format', this).call(this, name, value);
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      if (length === 0) return;
	      if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK) == null || name === this.statics.blotName && value === this.statics.formats(this.domNode)) {
	        return;
	      }
	      var nextNewline = this.newlineIndex(index);
	      if (nextNewline < 0 || nextNewline >= index + length) return;
	      var prevNewline = this.newlineIndex(index, true) + 1;
	      var isolateLength = nextNewline - prevNewline + 1;
	      var blot = this.isolate(prevNewline, isolateLength);
	      var next = blot.next;
	      blot.format(name, value);
	      if (next instanceof CodeBlock) {
	        next.formatAt(0, index - prevNewline + length - isolateLength, name, value);
	      }
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (def != null) return;

	      var _descendant3 = this.descendant(_text2.default, index);

	      var _descendant4 = _slicedToArray(_descendant3, 2);

	      var text = _descendant4[0];
	      var offset = _descendant4[1];

	      text.insertAt(offset, value);
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      return this.domNode.textContent.length;
	    }
	  }, {
	    key: 'newlineIndex',
	    value: function newlineIndex(searchIndex) {
	      var reverse = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	      if (!reverse) {
	        var offset = this.domNode.textContent.slice(searchIndex).indexOf('\n');
	        return offset > -1 ? searchIndex + offset : -1;
	      } else {
	        return this.domNode.textContent.slice(0, searchIndex).lastIndexOf('\n');
	      }
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      if (!this.domNode.textContent.endsWith('\n')) {
	        this.appendChild(_parchment2.default.create('text', '\n'));
	      }
	      _get(Object.getPrototypeOf(CodeBlock.prototype), 'optimize', this).call(this);
	      var next = this.next;
	      if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && this.statics.formats(this.domNode) === next.statics.formats(next.domNode)) {
	        next.optimize();
	        next.moveChildren(this);
	        next.remove();
	      }
	    }
	  }, {
	    key: 'replace',
	    value: function replace(target) {
	      _get(Object.getPrototypeOf(CodeBlock.prototype), 'replace', this).call(this, target);
	      [].slice.call(this.domNode.querySelectorAll('*')).forEach(function (node) {
	        var blot = _parchment2.default.find(node);
	        if (blot == null) {
	          node.parentNode.removeChild(node);
	        } else if (blot instanceof _parchment2.default.Embed) {
	          blot.remove();
	        } else {
	          blot.unwrap();
	        }
	      });
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var domNode = _get(Object.getPrototypeOf(CodeBlock), 'create', this).call(this, value);
	      domNode.setAttribute('spellcheck', false);
	      return domNode;
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      return true;
	    }
	  }]);

	  return CodeBlock;
	}(_block2.default);

	CodeBlock.blotName = 'code-block';
	CodeBlock.tagName = 'PRE';
	CodeBlock.TAB = '  ';

	exports.Code = Code;
	exports.default = CodeBlock;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.BlockEmbed = exports.bubbleFormats = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _extend = __webpack_require__(26);

	var _extend2 = _interopRequireDefault(_extend);

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _break = __webpack_require__(34);

	var _break2 = _interopRequireDefault(_break);

	var _embed = __webpack_require__(35);

	var _embed2 = _interopRequireDefault(_embed);

	var _inline = __webpack_require__(36);

	var _inline2 = _interopRequireDefault(_inline);

	var _text = __webpack_require__(37);

	var _text2 = _interopRequireDefault(_text);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var NEWLINE_LENGTH = 1;

	var BlockEmbed = function (_Embed) {
	  _inherits(BlockEmbed, _Embed);

	  function BlockEmbed() {
	    _classCallCheck(this, BlockEmbed);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BlockEmbed).apply(this, arguments));
	  }

	  _createClass(BlockEmbed, [{
	    key: 'attach',
	    value: function attach() {
	      _get(Object.getPrototypeOf(BlockEmbed.prototype), 'attach', this).call(this);
	      this.attributes = new _parchment2.default.Attributor.Store(this.domNode);
	    }
	  }, {
	    key: 'delta',
	    value: function delta() {
	      return new _delta2.default().insert(this.value(), (0, _extend2.default)(this.formats(), this.attributes.values()));
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      var attribute = _parchment2.default.query(name, _parchment2.default.Scope.BLOCK_ATTRIBUTE);
	      if (attribute != null) {
	        this.attributes.attribute(attribute, value);
	      }
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      this.format(name, value);
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (typeof value === 'string' && value.endsWith('\n')) {
	        var block = _parchment2.default.create(Block.blotName);
	        this.parent.insertBefore(block, index === 0 ? this : this.next);
	        block.insertAt(0, value.slice(0, -1));
	      } else {
	        _get(Object.getPrototypeOf(BlockEmbed.prototype), 'insertAt', this).call(this, index, value, def);
	      }
	    }
	  }]);

	  return BlockEmbed;
	}(_embed2.default);

	BlockEmbed.scope = _parchment2.default.Scope.BLOCK_BLOT;
	// It is important for cursor behavior BlockEmbeds use tags that are block level elements


	var Block = function (_Parchment$Block) {
	  _inherits(Block, _Parchment$Block);

	  function Block() {
	    _classCallCheck(this, Block);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block).apply(this, arguments));
	  }

	  _createClass(Block, [{
	    key: 'delta',
	    value: function delta() {
	      return this.descendants(_parchment2.default.Leaf).reduce(function (delta, leaf) {
	        if (leaf.length() === 0) {
	          return delta;
	        } else {
	          return delta.insert(leaf.value(), bubbleFormats(leaf));
	        }
	      }, new _delta2.default()).insert('\n', bubbleFormats(this));
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      if (length <= 0) return;
	      if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
	        if (index + length === this.length()) {
	          this.format(name, value);
	        }
	      } else {
	        _get(Object.getPrototypeOf(Block.prototype), 'formatAt', this).call(this, index, Math.min(length, this.length() - index - 1), name, value);
	      }
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (def != null) return _get(Object.getPrototypeOf(Block.prototype), 'insertAt', this).call(this, index, value, def);
	      if (value.length === 0) return;
	      var lines = value.split('\n');
	      var text = lines.shift();
	      if (text.length > 0) {
	        if (index < this.length() - 1 || this.children.tail == null) {
	          _get(Object.getPrototypeOf(Block.prototype), 'insertAt', this).call(this, Math.min(index, this.length() - 1), text);
	        } else {
	          this.children.tail.insertAt(this.children.tail.length(), text);
	        }
	      }
	      var block = this;
	      lines.reduce(function (index, line) {
	        block = block.split(index, true);
	        block.insertAt(0, line);
	        return line.length;
	      }, index + text.length);
	    }
	  }, {
	    key: 'insertBefore',
	    value: function insertBefore(blot, ref) {
	      var head = this.children.head;
	      _get(Object.getPrototypeOf(Block.prototype), 'insertBefore', this).call(this, blot, ref);
	      if (head instanceof _break2.default) {
	        head.remove();
	      }
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      return _get(Object.getPrototypeOf(Block.prototype), 'length', this).call(this) + NEWLINE_LENGTH;
	    }
	  }, {
	    key: 'path',
	    value: function path(index) {
	      return _get(Object.getPrototypeOf(Block.prototype), 'path', this).call(this, index, true);
	    }
	  }, {
	    key: 'split',
	    value: function split(index) {
	      var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	      if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
	        var clone = this.clone();
	        if (index === 0) {
	          this.parent.insertBefore(clone, this);
	          return this;
	        } else {
	          this.parent.insertBefore(clone, this.next);
	          return clone;
	        }
	      } else {
	        return _get(Object.getPrototypeOf(Block.prototype), 'split', this).call(this, index, force);
	      }
	    }
	  }]);

	  return Block;
	}(_parchment2.default.Block);

	Block.blotName = 'block';
	Block.tagName = 'P';
	Block.defaultChild = 'break';
	Block.allowedChildren = [_inline2.default, _embed2.default, _text2.default];

	function bubbleFormats(blot) {
	  var formats = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  if (blot == null) return formats;
	  if (typeof blot.formats === 'function') {
	    formats = (0, _extend2.default)(formats, blot.formats());
	  }
	  if (blot.parent == null || blot.parent.blotName == 'scroll' || blot.parent.statics.scope !== blot.statics.scope) {
	    return formats;
	  }
	  return bubbleFormats(blot.parent, formats);
	}

	exports.bubbleFormats = bubbleFormats;
	exports.BlockEmbed = BlockEmbed;
	exports.default = Block;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(35);

	var _embed2 = _interopRequireDefault(_embed);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Break = function (_Embed) {
	  _inherits(Break, _Embed);

	  function Break() {
	    _classCallCheck(this, Break);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Break).apply(this, arguments));
	  }

	  _createClass(Break, [{
	    key: 'insertInto',
	    value: function insertInto(parent, ref) {
	      if (parent.children.length === 0) {
	        _get(Object.getPrototypeOf(Break.prototype), 'insertInto', this).call(this, parent, ref);
	      }
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      return 0;
	    }
	  }, {
	    key: 'value',
	    value: function value() {
	      return '';
	    }
	  }], [{
	    key: 'value',
	    value: function value(domNode) {
	      return undefined;
	    }
	  }]);

	  return Break;
	}(_embed2.default);

	Break.blotName = 'break';
	Break.tagName = 'BR';

	exports.default = Break;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Embed = function (_Parchment$Embed) {
	  _inherits(Embed, _Parchment$Embed);

	  function Embed() {
	    _classCallCheck(this, Embed);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Embed).apply(this, arguments));
	  }

	  return Embed;
	}(_parchment2.default.Embed);

	exports.default = Embed;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _extend = __webpack_require__(26);

	var _extend2 = _interopRequireDefault(_extend);

	var _embed = __webpack_require__(35);

	var _embed2 = _interopRequireDefault(_embed);

	var _text = __webpack_require__(37);

	var _text2 = _interopRequireDefault(_text);

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Inline = function (_Parchment$Inline) {
	  _inherits(Inline, _Parchment$Inline);

	  function Inline() {
	    _classCallCheck(this, Inline);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Inline).apply(this, arguments));
	  }

	  _createClass(Inline, [{
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      if (Inline.compare(this.statics.blotName, name) < 0 && _parchment2.default.query(name, _parchment2.default.Scope.BLOT)) {
	        var blot = this.isolate(index, length);
	        if (value) {
	          blot.wrap(name, value);
	        }
	      } else {
	        _get(Object.getPrototypeOf(Inline.prototype), 'formatAt', this).call(this, index, length, name, value);
	      }
	    }
	  }], [{
	    key: 'compare',
	    value: function compare(self, other) {
	      return Inline.order.indexOf(self) - Inline.order.indexOf(other);
	    }
	  }]);

	  return Inline;
	}(_parchment2.default.Inline);

	Inline.allowedChildren = [Inline, _embed2.default, _text2.default];
	// Lower index means deeper in the DOM tree, since not found (-1) is for embeds
	Inline.order = ['cursor', 'inline', // Must be lower
	'code', 'underline', 'strike', 'italic', 'bold', 'script', 'link' // Must be higher
	];

	exports.default = Inline;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TextBlot = function (_Parchment$Text) {
	  _inherits(TextBlot, _Parchment$Text);

	  function TextBlot() {
	    _classCallCheck(this, TextBlot);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(TextBlot).apply(this, arguments));
	  }

	  return TextBlot;
	}(_parchment2.default.Text);

	exports.default = TextBlot;

/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var clone = function () {
	  'use strict';

	  /**
	   * Clones (copies) an Object using deep copying.
	   *
	   * This function supports circular references by default, but if you are certain
	   * there are no circular references in your object, you can save some CPU time
	   * by calling clone(obj, false).
	   *
	   * Caution: if `circular` is false and `parent` contains circular references,
	   * your program may enter an infinite loop and crash.
	   *
	   * @param `parent` - the object to be cloned
	   * @param `circular` - set to true if the object to be cloned may contain
	   *    circular references. (optional - true by default)
	   * @param `depth` - set to a number if the object is only to be cloned to
	   *    a particular depth. (optional - defaults to Infinity)
	   * @param `prototype` - sets the prototype to be used when cloning an object.
	   *    (optional - defaults to parent prototype).
	  */

	  function clone(parent, circular, depth, prototype) {
	    var filter;
	    if ((typeof circular === 'undefined' ? 'undefined' : _typeof(circular)) === 'object') {
	      depth = circular.depth;
	      prototype = circular.prototype;
	      filter = circular.filter;
	      circular = circular.circular;
	    }
	    // maintain two arrays for circular references, where corresponding parents
	    // and children have the same index
	    var allParents = [];
	    var allChildren = [];

	    var useBuffer = typeof Buffer != 'undefined';

	    if (typeof circular == 'undefined') circular = true;

	    if (typeof depth == 'undefined') depth = Infinity;

	    // recurse this function so we don't reset allParents and allChildren
	    function _clone(parent, depth) {
	      // cloning null always returns null
	      if (parent === null) return null;

	      if (depth == 0) return parent;

	      var child;
	      var proto;
	      if ((typeof parent === 'undefined' ? 'undefined' : _typeof(parent)) != 'object') {
	        return parent;
	      }

	      if (clone.__isArray(parent)) {
	        child = [];
	      } else if (clone.__isRegExp(parent)) {
	        child = new RegExp(parent.source, __getRegExpFlags(parent));
	        if (parent.lastIndex) child.lastIndex = parent.lastIndex;
	      } else if (clone.__isDate(parent)) {
	        child = new Date(parent.getTime());
	      } else if (useBuffer && Buffer.isBuffer(parent)) {
	        child = new Buffer(parent.length);
	        parent.copy(child);
	        return child;
	      } else {
	        if (typeof prototype == 'undefined') {
	          proto = Object.getPrototypeOf(parent);
	          child = Object.create(proto);
	        } else {
	          child = Object.create(prototype);
	          proto = prototype;
	        }
	      }

	      if (circular) {
	        var index = allParents.indexOf(parent);

	        if (index != -1) {
	          return allChildren[index];
	        }
	        allParents.push(parent);
	        allChildren.push(child);
	      }

	      for (var i in parent) {
	        var attrs;
	        if (proto) {
	          attrs = Object.getOwnPropertyDescriptor(proto, i);
	        }

	        if (attrs && attrs.set == null) {
	          continue;
	        }
	        child[i] = _clone(parent[i], depth - 1);
	      }

	      return child;
	    }

	    return _clone(parent, depth);
	  }

	  /**
	   * Simple flat clone using prototype, accepts only objects, usefull for property
	   * override on FLAT configuration object (no nested props).
	   *
	   * USE WITH CAUTION! This may not behave as you wish if you do not know how this
	   * works.
	   */
	  clone.clonePrototype = function clonePrototype(parent) {
	    if (parent === null) return null;

	    var c = function c() {};
	    c.prototype = parent;
	    return new c();
	  };

	  // private utility functions

	  function __objToStr(o) {
	    return Object.prototype.toString.call(o);
	  };
	  clone.__objToStr = __objToStr;

	  function __isDate(o) {
	    return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && __objToStr(o) === '[object Date]';
	  };
	  clone.__isDate = __isDate;

	  function __isArray(o) {
	    return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && __objToStr(o) === '[object Array]';
	  };
	  clone.__isArray = __isArray;

	  function __isRegExp(o) {
	    return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && __objToStr(o) === '[object RegExp]';
	  };
	  clone.__isRegExp = __isRegExp;

	  function __getRegExpFlags(re) {
	    var flags = '';
	    if (re.global) flags += 'g';
	    if (re.ignoreCase) flags += 'i';
	    if (re.multiline) flags += 'm';
	    return flags;
	  };
	  clone.__getRegExpFlags = __getRegExpFlags;

	  return clone;
	}();

	if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
	  module.exports = clone;
	}

/***/ },
/* 39 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Module = function Module(quill) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  _classCallCheck(this, Module);

	  this.quill = quill;
	  this.options = options;
	};

	Module.DEFAULTS = {};

	exports.default = Module;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.Range = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _clone = __webpack_require__(38);

	var _clone2 = _interopRequireDefault(_clone);

	var _deepEqual = __webpack_require__(23);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _break = __webpack_require__(34);

	var _break2 = _interopRequireDefault(_break);

	var _emitter3 = __webpack_require__(29);

	var _emitter4 = _interopRequireDefault(_emitter3);

	var _logger = __webpack_require__(31);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var debug = (0, _logger2.default)('quill:selection');

	var Range = function Range(index) {
	  var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	  _classCallCheck(this, Range);

	  this.index = index;
	  this.length = length;
	};

	var Selection = function () {
	  function Selection(scroll, emitter) {
	    var _this = this;

	    _classCallCheck(this, Selection);

	    this.emitter = emitter;
	    this.scroll = scroll;
	    this.root = this.scroll.domNode;
	    this.cursor = _parchment2.default.create('cursor', this);
	    // savedRange is last non-null range
	    this.lastRange = this.savedRange = new Range(0, 0);
	    ['keyup', 'mouseup', 'mouseleave', 'touchend', 'touchleave', 'focus', 'blur'].forEach(function (eventName) {
	      _this.root.addEventListener(eventName, function () {
	        // When range used to be a selection and user click within the selection,
	        // the range now being a cursor has not updated yet without setTimeout
	        setTimeout(_this.update.bind(_this, _emitter4.default.sources.USER), 100);
	      });
	    });
	    var scrollTop = void 0;
	    this.root.addEventListener('blur', function () {
	      scrollTop = _this.root.scrollTop;
	    });
	    this.root.addEventListener('focus', function () {
	      if (scrollTop == null) return;
	      _this.root.scrollTop = scrollTop;
	    });
	    this.emitter.on(_emitter4.default.events.EDITOR_CHANGE, function (type, delta) {
	      if (type === _emitter4.default.events.TEXT_CHANGE && delta.length() > 0) {
	        _this.update(_emitter4.default.sources.SILENT);
	      }
	    });
	    this.emitter.on(_emitter4.default.events.SCROLL_BEFORE_UPDATE, function () {
	      var native = _this.getNativeRange();
	      if (native == null) return;
	      if (native.start.node === _this.cursor.textNode) return; // cursor.restore() will handle
	      // TODO unclear if this has negative side effects
	      _this.emitter.once(_emitter4.default.events.SCROLL_UPDATE, function () {
	        try {
	          _this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
	        } catch (ignored) {}
	      });
	    });
	    this.update(_emitter4.default.sources.SILENT);
	  }

	  _createClass(Selection, [{
	    key: 'focus',
	    value: function focus() {
	      if (this.hasFocus()) return;
	      this.root.focus();
	      this.setRange(this.savedRange);
	    }
	  }, {
	    key: 'format',
	    value: function format(_format, value) {
	      this.scroll.update();
	      var nativeRange = this.getNativeRange();
	      if (nativeRange == null || !nativeRange.native.collapsed || _parchment2.default.query(_format, _parchment2.default.Scope.BLOCK)) return;
	      if (nativeRange.start.node !== this.cursor.textNode) {
	        var blot = _parchment2.default.find(nativeRange.start.node, false);
	        if (blot == null) return;
	        // TODO Give blot ability to not split
	        if (blot instanceof _parchment2.default.Leaf) {
	          var after = blot.split(nativeRange.start.offset);
	          blot.parent.insertBefore(this.cursor, after);
	        } else {
	          blot.insertBefore(this.cursor, nativeRange.start.node); // Should never happen
	        }
	        this.cursor.attach();
	      }
	      this.cursor.format(_format, value);
	      this.scroll.optimize();
	      this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
	      this.update();
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds(index) {
	      var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	      var scrollLength = this.scroll.length();
	      index = Math.min(index, scrollLength - 1);
	      length = Math.min(index + length, scrollLength - 1) - index;
	      var bounds = void 0;var node = void 0;
	      var _scroll$leaf = this.scroll.leaf(index);

	      var _scroll$leaf2 = _slicedToArray(_scroll$leaf, 2);

	      var leaf = _scroll$leaf2[0];
	      var offset = _scroll$leaf2[1];

	      if (leaf == null) return null;

	      var _leaf$position = leaf.position(offset, true);

	      var _leaf$position2 = _slicedToArray(_leaf$position, 2);

	      node = _leaf$position2[0];
	      offset = _leaf$position2[1];

	      var range = document.createRange();
	      if (length > 0) {
	        range.setStart(node, offset);

	        var _scroll$leaf3 = this.scroll.leaf(index + length);

	        var _scroll$leaf4 = _slicedToArray(_scroll$leaf3, 2);

	        leaf = _scroll$leaf4[0];
	        offset = _scroll$leaf4[1];

	        if (leaf == null) return null;

	        var _leaf$position3 = leaf.position(offset, true);

	        var _leaf$position4 = _slicedToArray(_leaf$position3, 2);

	        node = _leaf$position4[0];
	        offset = _leaf$position4[1];

	        range.setEnd(node, offset);
	        bounds = range.getBoundingClientRect();
	      } else {
	        var side = 'left';
	        if (node instanceof Text) {
	          if (offset < node.data.length) {
	            range.setStart(node, offset);
	            range.setEnd(node, offset + 1);
	          } else {
	            range.setStart(node, offset - 1);
	            range.setEnd(node, offset);
	            side = 'right';
	          }
	          var rect = range.getBoundingClientRect();
	        } else {
	          var rect = leaf.domNode.getBoundingClientRect();
	          if (offset > 0) side = 'right';
	        }
	        bounds = {
	          height: rect.height,
	          left: rect[side],
	          width: 0,
	          top: rect.top
	        };
	      }
	      var containerBounds = this.root.parentNode.getBoundingClientRect();
	      return {
	        left: bounds.left - containerBounds.left,
	        right: bounds.left + bounds.width - containerBounds.left,
	        top: bounds.top - containerBounds.top,
	        bottom: bounds.top + bounds.height - containerBounds.top,
	        height: bounds.height,
	        width: bounds.width
	      };
	    }
	  }, {
	    key: 'getNativeRange',
	    value: function getNativeRange() {
	      var selection = document.getSelection();
	      if (selection == null || selection.rangeCount <= 0) return null;
	      var nativeRange = selection.getRangeAt(0);
	      if (nativeRange == null) return null;
	      if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
	        return null;
	      }
	      var range = {
	        start: { node: nativeRange.startContainer, offset: nativeRange.startOffset },
	        end: { node: nativeRange.endContainer, offset: nativeRange.endOffset },
	        native: nativeRange
	      };
	      [range.start, range.end].forEach(function (position) {
	        var node = position.node,
	            offset = position.offset;
	        while (!(node instanceof Text) && node.childNodes.length > 0) {
	          if (node.childNodes.length > offset) {
	            node = node.childNodes[offset];
	            offset = 0;
	          } else if (node.childNodes.length === offset) {
	            node = node.lastChild;
	            offset = node instanceof Text ? node.data.length : node.childNodes.length + 1;
	          } else {
	            break;
	          }
	        }
	        position.node = node, position.offset = offset;
	      });
	      debug.info('getNativeRange', range);
	      return range;
	    }
	  }, {
	    key: 'getRange',
	    value: function getRange() {
	      var _this2 = this;

	      if (!this.hasFocus()) return [null, null];
	      var range = this.getNativeRange();
	      if (range == null) return [null, null];
	      var positions = [[range.start.node, range.start.offset]];
	      if (!range.native.collapsed) {
	        positions.push([range.end.node, range.end.offset]);
	      }
	      var indexes = positions.map(function (position) {
	        var _position = _slicedToArray(position, 2);

	        var node = _position[0];
	        var offset = _position[1];

	        var blot = _parchment2.default.find(node, true);
	        var index = blot.offset(_this2.scroll);
	        if (offset === 0) {
	          return index;
	        } else if (blot instanceof _parchment2.default.Container) {
	          return index + blot.length();
	        } else {
	          return index + blot.index(node, offset);
	        }
	      });
	      var start = Math.min.apply(Math, _toConsumableArray(indexes)),
	          end = Math.max.apply(Math, _toConsumableArray(indexes));
	      return [new Range(start, end - start), range];
	    }
	  }, {
	    key: 'hasFocus',
	    value: function hasFocus() {
	      return document.activeElement === this.root;
	    }
	  }, {
	    key: 'scrollIntoView',
	    value: function scrollIntoView() {
	      var range = arguments.length <= 0 || arguments[0] === undefined ? this.lastRange : arguments[0];

	      if (range == null) return;
	      var bounds = this.getBounds(range.index, range.length);
	      if (bounds == null) return;
	      if (this.root.offsetHeight < bounds.bottom) {
	        var _scroll$line = this.scroll.line(range.index + range.length);

	        var _scroll$line2 = _slicedToArray(_scroll$line, 2);

	        var line = _scroll$line2[0];
	        var offset = _scroll$line2[1];

	        this.root.scrollTop = line.domNode.offsetTop + line.domNode.offsetHeight - this.root.offsetHeight;
	      } else if (bounds.top < 0) {
	        var _scroll$line3 = this.scroll.line(range.index);

	        var _scroll$line4 = _slicedToArray(_scroll$line3, 2);

	        var _line = _scroll$line4[0];
	        var _offset = _scroll$line4[1];

	        this.root.scrollTop = _line.domNode.offsetTop;
	      }
	    }
	  }, {
	    key: 'setNativeRange',
	    value: function setNativeRange(startNode, startOffset) {
	      var endNode = arguments.length <= 2 || arguments[2] === undefined ? startNode : arguments[2];
	      var endOffset = arguments.length <= 3 || arguments[3] === undefined ? startOffset : arguments[3];
	      var force = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

	      debug.info('setNativeRange', startNode, startOffset, endNode, endOffset);
	      if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || endNode.parentNode == null)) {
	        return;
	      }
	      var selection = document.getSelection();
	      if (selection == null) return;
	      if (startNode != null) {
	        if (!this.hasFocus()) this.root.focus();
	        var nativeRange = this.getNativeRange();
	        if (nativeRange == null || force || startNode !== nativeRange.start.node || startOffset !== nativeRange.start.offset || endNode !== nativeRange.end.node || endOffset !== nativeRange.end.offset) {
	          var range = document.createRange();
	          range.setStart(startNode, startOffset);
	          range.setEnd(endNode, endOffset);
	          selection.removeAllRanges();
	          selection.addRange(range);
	        }
	      } else {
	        selection.removeAllRanges();
	        this.root.blur();
	        document.body.focus(); // root.blur() not enough on IE11+Travis+SauceLabs (but not local VMs)
	      }
	    }
	  }, {
	    key: 'setRange',
	    value: function setRange(range) {
	      var _this3 = this;

	      var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	      var source = arguments.length <= 2 || arguments[2] === undefined ? _emitter4.default.sources.API : arguments[2];

	      if (typeof force === 'string') {
	        source = force;
	        force = false;
	      }
	      debug.info('setRange', range);
	      if (range != null) {
	        (function () {
	          var indexes = range.collapsed ? [range.index] : [range.index, range.index + range.length];
	          var args = [];
	          var scrollLength = _this3.scroll.length();
	          indexes.forEach(function (index, i) {
	            index = Math.min(scrollLength - 1, index);
	            var node = void 0;
	            var _scroll$leaf5 = _this3.scroll.leaf(index);

	            var _scroll$leaf6 = _slicedToArray(_scroll$leaf5, 2);

	            var leaf = _scroll$leaf6[0];
	            var offset = _scroll$leaf6[1];

	            var _leaf$position5 = leaf.position(offset, i !== 0);

	            var _leaf$position6 = _slicedToArray(_leaf$position5, 2);

	            node = _leaf$position6[0];
	            offset = _leaf$position6[1];

	            args.push(node, offset);
	          });
	          if (args.length < 2) {
	            args = args.concat(args);
	          }
	          _this3.setNativeRange.apply(_this3, _toConsumableArray(args).concat([force]));
	        })();
	      } else {
	        this.setNativeRange(null);
	      }
	      this.update(source);
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var source = arguments.length <= 0 || arguments[0] === undefined ? _emitter4.default.sources.USER : arguments[0];

	      var nativeRange = void 0,
	          oldRange = this.lastRange;

	      var _getRange = this.getRange();

	      var _getRange2 = _slicedToArray(_getRange, 2);

	      this.lastRange = _getRange2[0];
	      nativeRange = _getRange2[1];

	      if (this.lastRange != null) {
	        this.savedRange = this.lastRange;
	      }
	      if (!(0, _deepEqual2.default)(oldRange, this.lastRange)) {
	        var _emitter;

	        if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
	          this.cursor.restore();
	        }
	        var args = [_emitter4.default.events.SELECTION_CHANGE, (0, _clone2.default)(this.lastRange), (0, _clone2.default)(oldRange), source];
	        (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
	        if (source !== _emitter4.default.sources.SILENT) {
	          var _emitter2;

	          (_emitter2 = this.emitter).emit.apply(_emitter2, args);
	        }
	      }
	    }
	  }]);

	  return Selection;
	}();

	function contains(parent, descendant) {
	  try {
	    // Firefox inserts inaccessible nodes around video elements
	    descendant.parentNode;
	  } catch (e) {
	    return false;
	  }
	  // IE11 has bug with Text nodes
	  // https://connect.microsoft.com/IE/feedback/details/780874/node-contains-is-incorrect
	  if (descendant instanceof Text) {
	    descendant = descendant.parentNode;
	  }
	  return parent.contains(descendant);
	}

	exports.Range = Range;
	exports.default = Selection;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(26);

	var _extend2 = _interopRequireDefault(_extend);

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _logger = __webpack_require__(31);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var debug = (0, _logger2.default)('[quill:theme]');

	var Theme = function () {
	  function Theme(quill, options) {
	    var _this = this;

	    _classCallCheck(this, Theme);

	    this.quill = quill;
	    this.options = (0, _extend2.default)({}, this.constructor.DEFAULTS, options);
	    this.options.modules = Object.keys(this.options.modules).reduce(function (modules, name) {
	      var value = _this.options.modules[name];
	      // allow new Quill('#editor', { modules: { myModule: true }});
	      modules[name] = value === true ? {} : value;
	      return modules;
	    }, {});
	    this.modules = {};
	  }

	  _createClass(Theme, [{
	    key: 'init',
	    value: function init() {
	      var _this2 = this;

	      Object.keys(this.options.modules).forEach(function (name) {
	        if (_this2.modules[name] == null) {
	          _this2.addModule(name);
	        }
	      });
	    }
	  }, {
	    key: 'addModule',
	    value: function addModule(name) {
	      var moduleClass = this.quill.constructor.import('modules/' + name);
	      if (moduleClass == null) {
	        return debug.error('Cannot load ' + name + ' module. Are you sure you registered it?');
	      }
	      var userOptions = this.options.modules[name] || {};
	      if ((typeof userOptions === 'undefined' ? 'undefined' : _typeof(userOptions)) === 'object' && userOptions.constructor === Object) {
	        var themeOptions = (this.constructor.DEFAULTS.modules || {})[name];
	        userOptions = (0, _extend2.default)({}, moduleClass.DEFAULTS || {}, themeOptions, userOptions);
	      }
	      this.modules[name] = new moduleClass(this.quill, userOptions);
	      return this.modules[name];
	    }
	  }]);

	  return Theme;
	}();

	Theme.DEFAULTS = {
	  modules: {}
	};
	Theme.themes = {
	  'default': Theme
	};

	exports.default = Theme;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _block = __webpack_require__(33);

	var _block2 = _interopRequireDefault(_block);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Container = function (_Parchment$Container) {
	  _inherits(Container, _Parchment$Container);

	  function Container() {
	    _classCallCheck(this, Container);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Container).apply(this, arguments));
	  }

	  return Container;
	}(_parchment2.default.Container);

	Container.allowedChildren = [_block2.default, _block.BlockEmbed, Container];

	exports.default = Container;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _embed = __webpack_require__(35);

	var _embed2 = _interopRequireDefault(_embed);

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Cursor = function (_Embed) {
	  _inherits(Cursor, _Embed);

	  _createClass(Cursor, null, [{
	    key: 'value',
	    value: function value(domNode) {
	      return undefined;
	    }
	  }]);

	  function Cursor(domNode, selection) {
	    _classCallCheck(this, Cursor);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Cursor).call(this, domNode));

	    _this.selection = selection;
	    _this.textNode = document.createTextNode(Cursor.CONTENTS);
	    _this.domNode.appendChild(_this.textNode);
	    _this._length = 0;
	    _this.composing = false;
	    _this.selection.root.addEventListener('compositionstart', function () {
	      _this.composing = true;
	    });
	    _this.selection.root.addEventListener('compositionend', function () {
	      _this.composing = false;
	    });
	    return _this;
	  }

	  _createClass(Cursor, [{
	    key: 'detach',
	    value: function detach() {
	      // super.detach() will also clear domNode.__blot
	      if (this.parent != null) this.parent.children.remove(this);
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      if (this._length !== 0) {
	        return _get(Object.getPrototypeOf(Cursor.prototype), 'format', this).call(this, name, value);
	      }
	      var target = this,
	          index = 0;
	      this._length = Cursor.CONTENTS.length;
	      while (target != null && target.statics.scope !== _parchment2.default.Scope.BLOCK_BLOT) {
	        index += target.offset(target.parent);
	        target = target.parent;
	      }
	      if (target != null) {
	        target.formatAt(index, Cursor.CONTENTS.length, name, value);
	      }
	      this._length = 0;
	    }
	  }, {
	    key: 'index',
	    value: function index(node, offset) {
	      if (node === this.textNode) return 0;
	      return _get(Object.getPrototypeOf(Cursor.prototype), 'index', this).call(this, node, offset);
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      return this._length;
	    }
	  }, {
	    key: 'position',
	    value: function position(index) {
	      return [this.textNode, this.textNode.data.length];
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      _get(Object.getPrototypeOf(Cursor.prototype), 'remove', this).call(this);
	      this.parent = null;
	    }
	  }, {
	    key: 'restore',
	    value: function restore() {
	      var _this2 = this;

	      if (this.composing) return;
	      if (this.parent == null) return;
	      var textNode = this.textNode;
	      var range = this.selection.getNativeRange();
	      // Link format will insert text outside of anchor tag
	      while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
	        this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
	      }
	      if (this.textNode.data !== Cursor.CONTENTS) {
	        var native = this.selection.getNativeRange();
	        this.textNode.data = this.textNode.data.split(Cursor.CONTENTS).join('');
	        this.parent.insertBefore(_parchment2.default.create(this.textNode), this);
	        this.textNode = document.createTextNode(Cursor.CONTENTS);
	        this.domNode.appendChild(this.textNode);
	      }
	      this.remove();
	      if (range != null && range.start.node === textNode && range.end.node === textNode) {
	        this.selection.emitter.once(_emitter2.default.events.SCROLL_OPTIMIZE, function () {
	          var _map = [range.start.offset, range.end.offset].map(function (offset) {
	            return Math.max(0, Math.min(textNode.data.length, offset - 1));
	          });

	          var _map2 = _slicedToArray(_map, 2);

	          var start = _map2[0];
	          var end = _map2[1];

	          _this2.selection.setNativeRange(textNode, start, textNode, end);
	        });
	      }
	    }
	  }, {
	    key: 'update',
	    value: function update(mutations) {
	      var _this3 = this;

	      mutations.forEach(function (mutation) {
	        if (mutation.type === 'characterData' && mutation.target === _this3.textNode) {
	          _this3.restore();
	        }
	      });
	    }
	  }, {
	    key: 'value',
	    value: function value() {
	      return '';
	    }
	  }]);

	  return Cursor;
	}(_embed2.default);

	Cursor.blotName = 'cursor';
	Cursor.className = 'ql-cursor';
	Cursor.tagName = 'span';
	Cursor.CONTENTS = '﻿'; // Zero width no break space


	exports.default = Cursor;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _logger = __webpack_require__(31);

	var _logger2 = _interopRequireDefault(_logger);

	var _block = __webpack_require__(33);

	var _block2 = _interopRequireDefault(_block);

	var _container = __webpack_require__(42);

	var _container2 = _interopRequireDefault(_container);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:scroll');

	function isLine(blot) {
	  return blot instanceof _block2.default || blot instanceof _block.BlockEmbed;
	}

	var Scroll = function (_Parchment$Scroll) {
	  _inherits(Scroll, _Parchment$Scroll);

	  function Scroll(domNode, config) {
	    _classCallCheck(this, Scroll);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Scroll).call(this, domNode));

	    _this.emitter = config.emitter;
	    if (Array.isArray(config.whitelist)) {
	      _this.whitelist = config.whitelist.reduce(function (whitelist, format) {
	        whitelist[format] = true;
	        return whitelist;
	      }, {});
	    }
	    _this.optimize();
	    return _this;
	  }

	  _createClass(Scroll, [{
	    key: 'deleteAt',
	    value: function deleteAt(index, length) {
	      var _line = this.line(index);

	      var _line2 = _slicedToArray(_line, 2);

	      var first = _line2[0];
	      var firstOffset = _line2[1];

	      var _line3 = this.line(index + length);

	      var _line4 = _slicedToArray(_line3, 2);

	      var last = _line4[0];
	      var lastOffset = _line4[1];

	      _get(Object.getPrototypeOf(Scroll.prototype), 'deleteAt', this).call(this, index, length);
	      if (last != null && first !== last && firstOffset > 0 && !(first instanceof _block.BlockEmbed) && !(last instanceof _block.BlockEmbed)) {
	        last.moveChildren(first);
	        last.remove();
	        this.optimize();
	      }
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, format, value) {
	      if (this.whitelist != null && !this.whitelist[format]) return;
	      _get(Object.getPrototypeOf(Scroll.prototype), 'formatAt', this).call(this, index, length, format, value);
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (def != null && this.whitelist != null && !this.whitelist[value]) return;
	      if (index >= this.length()) {
	        if (def == null || _parchment2.default.query(value, _parchment2.default.Scope.BLOCK) == null) {
	          var blot = _parchment2.default.create(this.statics.defaultChild);
	          this.appendChild(blot);
	          if (def == null && value.endsWith('\n')) {
	            value = value.slice(0, -1);
	          }
	          blot.insertAt(0, value, def);
	        } else {
	          var embed = _parchment2.default.create(value, def);
	          this.appendChild(embed);
	        }
	        this.optimize();
	      } else {
	        _get(Object.getPrototypeOf(Scroll.prototype), 'insertAt', this).call(this, index, value, def);
	      }
	    }
	  }, {
	    key: 'insertBefore',
	    value: function insertBefore(blot, ref) {
	      if (blot.statics.scope === _parchment2.default.Scope.INLINE_BLOT) {
	        var wrapper = _parchment2.default.create(this.statics.defaultChild);
	        wrapper.appendChild(blot);
	        blot = wrapper;
	      }
	      _get(Object.getPrototypeOf(Scroll.prototype), 'insertBefore', this).call(this, blot, ref);
	    }
	  }, {
	    key: 'leaf',
	    value: function leaf(index) {
	      return this.path(index).pop() || [null, -1];
	    }
	  }, {
	    key: 'line',
	    value: function line(index) {
	      return this.descendant(isLine, index);
	    }
	  }, {
	    key: 'lines',
	    value: function lines() {
	      var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	      var length = arguments.length <= 1 || arguments[1] === undefined ? Number.MAX_VALUE : arguments[1];

	      var getLines = function getLines(blot, index, length) {
	        var lines = [],
	            lengthLeft = length;
	        blot.children.forEachAt(index, length, function (child, index, length) {
	          if (isLine(child)) {
	            lines.push(child);
	          } else if (child instanceof _parchment2.default.Container) {
	            lines = lines.concat(getLines(child, index, lengthLeft));
	          }
	          lengthLeft -= length;
	        });
	        return lines;
	      };
	      return getLines(this, index, length);
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      var mutations = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	      _get(Object.getPrototypeOf(Scroll.prototype), 'optimize', this).call(this, mutations);
	      if (mutations.length > 0) {
	        this.emitter.emit(_emitter2.default.events.SCROLL_OPTIMIZE, mutations);
	      }
	    }
	  }, {
	    key: 'path',
	    value: function path(index) {
	      return _get(Object.getPrototypeOf(Scroll.prototype), 'path', this).call(this, index).slice(1); // Exclude self
	    }
	  }, {
	    key: 'update',
	    value: function update(mutations) {
	      var source = _emitter2.default.sources.USER;
	      if (typeof mutations === 'string') {
	        source = mutations;
	      }
	      if (!Array.isArray(mutations)) {
	        mutations = this.observer.takeRecords();
	      }
	      if (mutations.length > 0) {
	        this.emitter.emit(_emitter2.default.events.SCROLL_BEFORE_UPDATE, source, mutations);
	      }
	      _get(Object.getPrototypeOf(Scroll.prototype), 'update', this).call(this, mutations.concat([])); // pass copy
	      if (mutations.length > 0) {
	        this.emitter.emit(_emitter2.default.events.SCROLL_UPDATE, source, mutations);
	      }
	    }
	  }]);

	  return Scroll;
	}(_parchment2.default.Scroll);

	Scroll.blotName = 'scroll';
	Scroll.className = 'ql-editor';
	Scroll.tagName = 'DIV';
	Scroll.defaultChild = 'block';
	Scroll.allowedChildren = [_block2.default, _block.BlockEmbed, _container2.default];

	exports.default = Scroll;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.matchText = exports.matchSpacing = exports.matchNewline = exports.matchBlot = exports.matchAttributor = exports.default = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(19);

	var _quill2 = _interopRequireDefault(_quill);

	var _logger = __webpack_require__(31);

	var _logger2 = _interopRequireDefault(_logger);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	var _block = __webpack_require__(33);

	var _align = __webpack_require__(46);

	var _background = __webpack_require__(47);

	var _color = __webpack_require__(48);

	var _direction = __webpack_require__(49);

	var _font = __webpack_require__(50);

	var _size = __webpack_require__(51);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:clipboard');

	var STYLE_ATTRIBUTORS = [_align.AlignStyle, _background.BackgroundStyle, _color.ColorStyle, _direction.DirectionStyle, _font.FontStyle, _size.SizeStyle].reduce(function (memo, attr) {
	  memo[attr.keyName] = attr;
	  return memo;
	}, {});

	var Clipboard = function (_Module) {
	  _inherits(Clipboard, _Module);

	  function Clipboard(quill, options) {
	    _classCallCheck(this, Clipboard);

	    if (options.matchers !== Clipboard.DEFAULTS.matchers) {
	      options.matchers = Clipboard.DEFAULTS.matchers.concat(options.matchers);
	    }

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Clipboard).call(this, quill, options));

	    _this.quill.root.addEventListener('paste', _this.onPaste.bind(_this));
	    _this.container = _this.quill.addContainer('ql-clipboard');
	    _this.container.setAttribute('contenteditable', true);
	    _this.container.setAttribute('tabindex', -1);
	    _this.matchers = [];
	    _this.options.matchers.forEach(function (pair) {
	      _this.addMatcher.apply(_this, _toConsumableArray(pair));
	    });
	    return _this;
	  }

	  _createClass(Clipboard, [{
	    key: 'addMatcher',
	    value: function addMatcher(selector, matcher) {
	      this.matchers.push([selector, matcher]);
	    }
	  }, {
	    key: 'convert',
	    value: function convert(html) {
	      var _this2 = this;

	      var DOM_KEY = '__ql-matcher';
	      if (typeof html === 'string') {
	        this.container.innerHTML = html;
	      }
	      var textMatchers = [],
	          elementMatchers = [];
	      this.matchers.forEach(function (pair) {
	        var _pair = _slicedToArray(pair, 2);

	        var selector = _pair[0];
	        var matcher = _pair[1];

	        switch (selector) {
	          case Node.TEXT_NODE:
	            textMatchers.push(matcher);
	            break;
	          case Node.ELEMENT_NODE:
	            elementMatchers.push(matcher);
	            break;
	          default:
	            [].forEach.call(_this2.container.querySelectorAll(selector), function (node) {
	              // TODO use weakmap
	              node[DOM_KEY] = node[DOM_KEY] || [];
	              node[DOM_KEY].push(matcher);
	            });
	            break;
	        }
	      });
	      var traverse = function traverse(node) {
	        // Post-order
	        if (node.nodeType === node.TEXT_NODE) {
	          return textMatchers.reduce(function (delta, matcher) {
	            return matcher(node, delta);
	          }, new _delta2.default());
	        } else if (node.nodeType === node.ELEMENT_NODE) {
	          return [].reduce.call(node.childNodes || [], function (delta, childNode) {
	            var childrenDelta = traverse(childNode);
	            if (childNode.nodeType === node.ELEMENT_NODE) {
	              childrenDelta = elementMatchers.reduce(function (childrenDelta, matcher) {
	                return matcher(childNode, childrenDelta);
	              }, childrenDelta);
	              childrenDelta = (childNode[DOM_KEY] || []).reduce(function (childrenDelta, matcher) {
	                return matcher(childNode, childrenDelta);
	              }, childrenDelta);
	            }
	            return delta.concat(childrenDelta);
	          }, new _delta2.default());
	        } else {
	          return new _delta2.default();
	        }
	      };
	      var delta = traverse(this.container);
	      // Remove trailing newline
	      if (deltaEndsWith(delta, '\n') && delta.ops[delta.ops.length - 1].attributes == null) {
	        delta = delta.compose(new _delta2.default().retain(delta.length() - 1).delete(1));
	      }
	      debug.log('convert', this.container.innerHTML, delta);
	      this.container.innerHTML = '';
	      return delta;
	    }
	  }, {
	    key: 'onPaste',
	    value: function onPaste(e) {
	      var _this3 = this;

	      if (e.defaultPrevented) return;
	      var range = this.quill.getSelection();
	      var clipboard = e.clipboardData || window.clipboardData;
	      var delta = new _delta2.default().retain(range.index).delete(range.length);
	      this.container.focus();
	      setTimeout(function () {
	        var html = _this3.container.innerHTML;
	        delta = delta.concat(_this3.convert());
	        _this3.quill.updateContents(delta, _quill2.default.sources.USER);
	        // range.length contributes to delta.length()
	        _this3.quill.setSelection(delta.length() - range.length, _quill2.default.sources.SILENT);
	        _this3.quill.selection.scrollIntoView();
	      }, 1);
	    }
	  }]);

	  return Clipboard;
	}(_module2.default);

	Clipboard.DEFAULTS = {
	  matchers: [[Node.TEXT_NODE, matchText], ['br', matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchSpacing], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ['b', matchAlias.bind(matchAlias, 'bold')], ['i', matchAlias.bind(matchAlias, 'italic')]]
	};

	function computeStyle(node) {
	  if (node.nodeType !== Node.ELEMENT_NODE) return {};
	  var DOM_KEY = '__ql-computed-style';
	  return node[DOM_KEY] || (node[DOM_KEY] = window.getComputedStyle(node));
	}

	function deltaEndsWith(delta, text) {
	  var endText = "";
	  for (var i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
	    var op = delta.ops[i];
	    if (typeof op.insert !== 'string') break;
	    endText = op.insert + endText;
	  }
	  return endText.slice(-1 * text.length) === text;
	}

	function isLine(node) {
	  if (node.childNodes.length === 0) return false; // Exclude embed blocks
	  var style = computeStyle(node);
	  return ['block', 'list-item'].indexOf(style.display) > -1;
	}

	function matchAlias(format, node, delta) {
	  return delta.compose(new _delta2.default().retain(delta.length(), _defineProperty({}, format, true)));
	}

	function matchAttributor(node, delta) {
	  var attributes = _parchment2.default.Attributor.Attribute.keys(node);
	  var classes = _parchment2.default.Attributor.Class.keys(node);
	  var styles = _parchment2.default.Attributor.Style.keys(node);
	  var formats = {};
	  attributes.concat(classes).concat(styles).forEach(function (name) {
	    var attr = _parchment2.default.query(name, _parchment2.default.Scope.ATTRIBUTE) || STYLE_ATTRIBUTORS[name];
	    if (attr != null) {
	      formats[attr.attrName] = attr.value(node);
	    }
	  });
	  if (Object.keys(formats).length > 0) {
	    delta = delta.compose(new _delta2.default().retain(delta.length(), formats));
	  }
	  return delta;
	}

	function matchBlot(node, delta) {
	  var match = _parchment2.default.query(node);
	  if (match == null) return delta;
	  if (match.prototype instanceof _parchment2.default.Embed) {
	    var embed = {};
	    var value = match.value(node);
	    if (value != null) {
	      embed[match.blotName] = value;
	      delta.insert(embed, match.formats(node));
	    }
	  } else if (typeof match.formats === 'function') {
	    var formats = _defineProperty({}, match.blotName, match.formats(node));
	    delta = delta.compose(new _delta2.default().retain(delta.length(), formats));
	  }
	  return delta;
	}

	function matchBreak(node, delta) {
	  if (!deltaEndsWith(delta, '\n')) {
	    delta.insert('\n');
	  }
	  return delta;
	}

	function matchNewline(node, delta) {
	  if (isLine(node) && !deltaEndsWith(delta, '\n')) {
	    delta.insert('\n');
	  }
	  return delta;
	}

	function matchSpacing(node, delta) {
	  if (isLine(node) && node.nextElementSibling != null && !deltaEndsWith(delta, '\n\n')) {
	    var nodeHeight = node.offsetHeight + parseFloat(computeStyle(node).marginTop) + parseFloat(computeStyle(node).marginBottom);
	    if (node.nextElementSibling.offsetTop > node.offsetTop + nodeHeight * 1.5) {
	      delta.insert('\n');
	    }
	  }
	  return delta;
	}

	function matchStyles(node, delta) {
	  var formats = {};
	  var style = node.style || {};
	  if (style.fontWeight && computeStyle(node).fontWeight === 'bold') {
	    formats.bold = true;
	  }
	  if (Object.keys(formats).length > 0) {
	    delta = delta.compose(new _delta2.default().retain(delta.length(), formats));
	  }
	  if (parseFloat(style.textIndent || 0) > 0) {
	    // Could be 0.5in
	    delta = new _delta2.default().insert('\t').concat(delta);
	  }
	  return delta;
	}

	function matchText(node, delta) {
	  var text = node.data;
	  // Word represents empty line with <o:p>&nbsp;</o:p>
	  if (node.parentNode.tagName === 'O:P') {
	    return delta.insert(text.trim());
	  }
	  if (!computeStyle(node.parentNode).whiteSpace.startsWith('pre')) {
	    var replacer = function replacer(collapse, match) {
	      match = match.replace(/[^\u00a0]/g, ''); // \u00a0 is nbsp;
	      return match.length < 1 && collapse ? ' ' : match;
	    };

	    text = text.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
	    text = text.replace(/\s\s+/g, replacer.bind(replacer, true)); // collapse whitespace
	    if (node.previousSibling == null && isLine(node.parentNode) || node.previousSibling != null && isLine(node.previousSibling)) {
	      text = text.replace(/^\s+/, replacer.bind(replacer, false));
	    }
	    if (node.nextSibling == null && isLine(node.parentNode) || node.nextSibling != null && isLine(node.nextSibling)) {
	      text = text.replace(/\s+$/, replacer.bind(replacer, false));
	    }
	  }
	  return delta.insert(text);
	}

	exports.default = Clipboard;
	exports.matchAttributor = matchAttributor;
	exports.matchBlot = matchBlot;
	exports.matchNewline = matchNewline;
	exports.matchSpacing = matchSpacing;
	exports.matchText = matchText;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AlignStyle = exports.AlignClass = undefined;

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {
	  scope: _parchment2.default.Scope.BLOCK,
	  whitelist: ['right', 'center', 'justify']
	};

	var AlignClass = new _parchment2.default.Attributor.Class('align', 'ql-align', config);
	var AlignStyle = new _parchment2.default.Attributor.Style('align', 'text-align', config);

	exports.AlignClass = AlignClass;
	exports.AlignStyle = AlignStyle;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.BackgroundStyle = exports.BackgroundClass = undefined;

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _color = __webpack_require__(48);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BackgroundClass = new _parchment2.default.Attributor.Class('background', 'ql-bg', {
	  scope: _parchment2.default.Scope.INLINE
	});
	var BackgroundStyle = new _color.ColorAttributor('background', 'background-color', {
	  scope: _parchment2.default.Scope.INLINE
	});

	exports.BackgroundClass = BackgroundClass;
	exports.BackgroundStyle = BackgroundStyle;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ColorStyle = exports.ColorClass = exports.ColorAttributor = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ColorAttributor = function (_Parchment$Attributor) {
	  _inherits(ColorAttributor, _Parchment$Attributor);

	  function ColorAttributor() {
	    _classCallCheck(this, ColorAttributor);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ColorAttributor).apply(this, arguments));
	  }

	  _createClass(ColorAttributor, [{
	    key: 'value',
	    value: function value(domNode) {
	      var value = _get(Object.getPrototypeOf(ColorAttributor.prototype), 'value', this).call(this, domNode);
	      if (!value.startsWith('rgb(')) return value;
	      value = value.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');
	      return '#' + value.split(',').map(function (component) {
	        return ('00' + parseInt(component).toString(16)).slice(-2);
	      }).join('');
	    }
	  }]);

	  return ColorAttributor;
	}(_parchment2.default.Attributor.Style);

	var ColorClass = new _parchment2.default.Attributor.Class('color', 'ql-color', {
	  scope: _parchment2.default.Scope.INLINE
	});
	var ColorStyle = new ColorAttributor('color', 'color', {
	  scope: _parchment2.default.Scope.INLINE
	});

	exports.ColorAttributor = ColorAttributor;
	exports.ColorClass = ColorClass;
	exports.ColorStyle = ColorStyle;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DirectionStyle = exports.DirectionClass = undefined;

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {
	  scope: _parchment2.default.Scope.BLOCK,
	  whitelist: ['rtl']
	};

	var DirectionClass = new _parchment2.default.Attributor.Class('direction', 'ql-direction', config);
	var DirectionStyle = new _parchment2.default.Attributor.Style('direction', 'direction', config);

	exports.DirectionClass = DirectionClass;
	exports.DirectionStyle = DirectionStyle;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FontClass = exports.FontStyle = undefined;

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {
	  scope: _parchment2.default.Scope.INLINE,
	  whitelist: ['serif', 'monospace']
	};

	var FontClass = new _parchment2.default.Attributor.Class('font', 'ql-font', config);
	var FontStyle = new _parchment2.default.Attributor.Style('font', 'font-family', config);

	exports.FontStyle = FontStyle;
	exports.FontClass = FontClass;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SizeStyle = exports.SizeClass = undefined;

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SizeClass = new _parchment2.default.Attributor.Class('size', 'ql-size', {
	  scope: _parchment2.default.Scope.INLINE,
	  whitelist: ['small', 'large', 'huge']
	});
	var SizeStyle = new _parchment2.default.Attributor.Style('size', 'font-size', {
	  scope: _parchment2.default.Scope.INLINE,
	  whitelist: ['10px', '18px', '32px']
	});

	exports.SizeClass = SizeClass;
	exports.SizeStyle = SizeStyle;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getLastChangeIndex = exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(19);

	var _quill2 = _interopRequireDefault(_quill);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var History = function (_Module) {
	  _inherits(History, _Module);

	  function History(quill, options) {
	    _classCallCheck(this, History);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(History).call(this, quill, options));

	    _this.lastRecorded = 0;
	    _this.ignoreChange = false;
	    _this.clear();
	    _this.quill.on(_quill2.default.events.TEXT_CHANGE, function (delta, oldDelta, source) {
	      if (_this.ignoreChange) return;
	      if (!_this.options.userOnly || source === _quill2.default.sources.USER) {
	        _this.record(delta, oldDelta);
	      } else {
	        _this.transform(delta);
	      }
	    });
	    _this.quill.keyboard.addBinding({ key: 'Z', shortKey: true }, _this.undo.bind(_this));
	    _this.quill.keyboard.addBinding({ key: 'Z', shortKey: true, shiftKey: true }, _this.redo.bind(_this));
	    if (/Win/i.test(navigator.platform)) {
	      _this.quill.keyboard.addBinding({ key: 'Y', shortKey: true }, _this.redo.bind(_this));
	    }
	    return _this;
	  }

	  _createClass(History, [{
	    key: 'change',
	    value: function change(source, dest) {
	      if (this.stack[source].length === 0) return;
	      var delta = this.stack[source].pop();
	      this.lastRecorded = 0;
	      this.ignoreChange = true;
	      this.quill.updateContents(delta[source], _quill2.default.sources.USER);
	      this.ignoreChange = false;
	      var index = getLastChangeIndex(delta[source]);
	      this.quill.setSelection(index);
	      this.quill.selection.scrollIntoView();
	      this.stack[dest].push(delta);
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.stack = { undo: [], redo: [] };
	    }
	  }, {
	    key: 'record',
	    value: function record(changeDelta, oldDelta) {
	      if (changeDelta.ops.length === 0) return;
	      this.stack.redo = [];
	      var undoDelta = this.quill.getContents().diff(oldDelta);
	      var timestamp = Date.now();
	      if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
	        var delta = this.stack.undo.pop();
	        undoDelta = undoDelta.compose(delta.undo);
	        changeDelta = delta.redo.compose(changeDelta);
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
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      this.change('redo', 'undo');
	    }
	  }, {
	    key: 'transform',
	    value: function transform(delta) {
	      this.stack.undo.forEach(function (change) {
	        change.undo = delta.transform(change.undo, true);
	        change.redo = delta.transform(change.redo, true);
	      });
	      this.stack.redo.forEach(function (change) {
	        change.undo = delta.transform(change.undo, true);
	        change.redo = delta.transform(change.redo, true);
	      });
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      this.change('undo', 'redo');
	    }
	  }]);

	  return History;
	}(_module2.default);

	History.DEFAULTS = {
	  delay: 1000,
	  maxStack: 100,
	  userOnly: false
	};

	function endsWithNewlineChange(delta) {
	  var lastOp = delta.ops[delta.ops.length - 1];
	  if (lastOp == null) return false;
	  if (lastOp.insert != null) {
	    return typeof lastOp.insert === 'string' && lastOp.insert.endsWith('\n');
	  }
	  if (lastOp.attributes != null) {
	    return Object.keys(lastOp.attributes).some(function (attr) {
	      return _parchment2.default.query(attr, _parchment2.default.Scope.BLOCK) != null;
	    });
	  }
	  return false;
	}

	function getLastChangeIndex(delta) {
	  var deleteLength = delta.ops.reduce(function (length, op) {
	    length += op.delete || 0;
	    return length;
	  }, 0);
	  var changeIndex = delta.length() - deleteLength;
	  if (endsWithNewlineChange(delta)) {
	    changeIndex -= 1;
	  }
	  return changeIndex;
	}

	exports.default = History;
	exports.getLastChangeIndex = getLastChangeIndex;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _clone = __webpack_require__(38);

	var _clone2 = _interopRequireDefault(_clone);

	var _deepEqual = __webpack_require__(23);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _extend = __webpack_require__(26);

	var _extend2 = _interopRequireDefault(_extend);

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(19);

	var _quill2 = _interopRequireDefault(_quill);

	var _logger = __webpack_require__(31);

	var _logger2 = _interopRequireDefault(_logger);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	var _selection = __webpack_require__(40);

	var _block = __webpack_require__(33);

	var _block2 = _interopRequireDefault(_block);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:keyboard');

	var SHORTKEY = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';

	var Keyboard = function (_Module) {
	  _inherits(Keyboard, _Module);

	  _createClass(Keyboard, null, [{
	    key: 'match',
	    value: function match(evt, binding) {
	      binding = normalize(binding);
	      if (!!binding.shortKey !== evt[SHORTKEY] && binding.shortKey !== null) return false;
	      if (['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].some(function (key) {
	        return key != SHORTKEY && !!binding[key] !== evt[key] && binding[key] !== null;
	      })) {
	        return false;
	      }
	      return binding.key === (evt.which || evt.keyCode);
	    }
	  }]);

	  function Keyboard(quill, options) {
	    _classCallCheck(this, Keyboard);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Keyboard).call(this, quill, options));

	    _this.options.bindings = (0, _extend2.default)({}, Keyboard.DEFAULTS.bindings, options.bindings);
	    _this.bindings = {};
	    Object.keys(_this.options.bindings).forEach(function (name) {
	      if (_this.options.bindings[name]) {
	        var _this$options$binding = _slicedToArray(_this.options.bindings[name], 3);

	        var key = _this$options$binding[0];
	        var context = _this$options$binding[1];
	        var handler = _this$options$binding[2];

	        _this.addBinding(key, context, handler);
	      }
	    });
	    _this.addBinding({ key: Keyboard.keys.ENTER, shiftKey: null }, handleEnter);
	    _this.addBinding({ key: Keyboard.keys.ENTER, metaKey: null, ctrlKey: null, altKey: null }, function () {});
	    _this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: true, prefix: /^$/ }, function (range) {
	      if (range.index === 0) return;
	      this.quill.deleteText(range.index - 1, 1, _quill2.default.sources.USER);
	      this.quill.selection.scrollIntoView();
	    });
	    _this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: true, suffix: /^$/ }, function (range) {
	      if (range.index >= this.quill.getLength() - 1) return;
	      this.quill.deleteText(range.index, 1, _quill2.default.sources.USER);
	    });
	    _this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: false }, handleDelete);
	    _this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: false }, handleDelete);
	    _this.listen();
	    return _this;
	  }

	  _createClass(Keyboard, [{
	    key: 'addBinding',
	    value: function addBinding(binding, context, handler) {
	      binding = normalize(binding);
	      if (binding == null) {
	        return debug.warn('Attempted to add invalid keyboard binding', binding);
	      }
	      if (typeof context === 'function') {
	        handler = context;
	        context = {};
	      }
	      this.bindings[binding.key] = this.bindings[binding.key] || [];
	      this.bindings[binding.key].push([binding, context, handler]);
	    }
	  }, {
	    key: 'listen',
	    value: function listen() {
	      var _this2 = this;

	      this.quill.root.addEventListener('keydown', function (evt) {
	        if (evt.defaultPrevented) return;
	        var which = evt.which || evt.keyCode;
	        var bindings = (_this2.bindings[which] || []).filter(function (tuple) {
	          return Keyboard.match(evt, tuple[0]);
	        });
	        if (bindings.length === 0) return;
	        var range = _this2.quill.getSelection();
	        if (range == null) return; // implies we do not have focus

	        var _quill$scroll$line = _this2.quill.scroll.line(range.index);

	        var _quill$scroll$line2 = _slicedToArray(_quill$scroll$line, 2);

	        var line = _quill$scroll$line2[0];
	        var offset = _quill$scroll$line2[1];

	        var _quill$scroll$leaf = _this2.quill.scroll.leaf(range.index);

	        var _quill$scroll$leaf2 = _slicedToArray(_quill$scroll$leaf, 2);

	        var leafStart = _quill$scroll$leaf2[0];
	        var offsetStart = _quill$scroll$leaf2[1];

	        var _ref = range.length === 0 ? [leafStart, offsetStart] : _this2.quill.scroll.leaf(range.index + range.length);

	        var _ref2 = _slicedToArray(_ref, 2);

	        var leafEnd = _ref2[0];
	        var offsetEnd = _ref2[1];

	        var prefixText = leafStart instanceof _parchment2.default.Text ? leafStart.value().slice(0, offsetStart) : '';
	        var suffixText = leafEnd instanceof _parchment2.default.Text ? leafEnd.value().slice(offsetEnd) : '';
	        var curContext = {
	          collapsed: range.length === 0,
	          empty: range.length === 0 && line.length() <= 1,
	          format: _this2.quill.getFormat(range),
	          offset: offset,
	          prefix: prefixText,
	          suffix: suffixText
	        };
	        var prevented = bindings.some(function (tuple) {
	          var _tuple = _slicedToArray(tuple, 3);

	          var key = _tuple[0];
	          var context = _tuple[1];
	          var handler = _tuple[2];

	          if (context.collapsed != null && context.collapsed !== curContext.collapsed) return false;
	          if (context.empty != null && context.empty !== curContext.empty) return false;
	          if (context.offset != null && context.offset !== curContext.offset) return false;
	          if (Array.isArray(context.format)) {
	            // any format is present
	            if (context.format.every(function (name) {
	              return curContext.format[name] == null;
	            })) {
	              return false;
	            }
	          } else if (_typeof(context.format) === 'object') {
	            // all formats must match
	            if (!Object.keys(context.format).every(function (name) {
	              if (context.format[name] === true) return curContext.format[name] != null;
	              if (context.format[name] === false) return curContext.format[name] == null;
	              return (0, _deepEqual2.default)(context.format[name], curContext.format[name]);
	            })) {
	              return false;
	            }
	          }
	          if (context.prefix != null && !context.prefix.test(curContext.prefix)) return false;
	          if (context.suffix != null && !context.suffix.test(curContext.suffix)) return false;
	          return handler.call(_this2, range, curContext) !== true;
	        });
	        if (prevented) {
	          evt.preventDefault();
	        }
	      });
	    }
	  }]);

	  return Keyboard;
	}(_module2.default);

	Keyboard.keys = {
	  BACKSPACE: 8,
	  TAB: 9,
	  ENTER: 13,
	  ESCAPE: 27,
	  LEFT: 37,
	  UP: 38,
	  RIGHT: 39,
	  DOWN: 40,
	  DELETE: 46
	};

	Keyboard.DEFAULTS = {
	  bindings: {
	    'bold': makeFormatHandler('bold'),
	    'italic': makeFormatHandler('italic'),
	    'underline': makeFormatHandler('underline'),
	    'indent': [
	    // highlight tab or tab at beginning of list, indent or blockquote
	    { key: Keyboard.keys.TAB }, { format: ['blockquote', 'indent', 'list'] }, function (range, context) {
	      if (context.collapsed && context.offset !== 0) return true;
	      this.quill.format('indent', '+1', _quill2.default.sources.USER);
	    }],
	    'outdent': [{ key: Keyboard.keys.TAB, shiftKey: true }, { format: ['blockquote', 'indent', 'list'] },
	    // highlight tab or tab at beginning of list, indent or blockquote
	    function (range, context) {
	      if (context.collapsed && context.offset !== 0) return true;
	      this.quill.format('indent', '-1', _quill2.default.sources.USER);
	    }],
	    'outdent backspace': [{ key: Keyboard.keys.BACKSPACE }, { collapsed: true, format: ['blockquote', 'indent', 'list'], offset: 0 }, function (range, context) {
	      if (context.format.indent != null) {
	        this.quill.format('indent', '-1', _quill2.default.sources.USER);
	      } else if (context.format.blockquote != null) {
	        this.quill.format('blockquote', false, _quill2.default.sources.USER);
	      } else if (context.format.list != null) {
	        this.quill.format('list', false, _quill2.default.sources.USER);
	      }
	    }],
	    'indent code-block': makeCodeBlockHandler(true),
	    'outdent code-block': makeCodeBlockHandler(false),
	    'tab': [{ key: Keyboard.keys.TAB, shiftKey: null }, {}, function (range, context) {
	      if (!context.collapsed) {
	        this.quill.scroll.deleteAt(range.index, range.length);
	      }
	      this.quill.insertText(range.index, '\t', _quill2.default.sources.USER);
	    }],
	    'list empty enter': [{ key: Keyboard.keys.ENTER }, { collapsed: true, format: ['list'], empty: true }, function (range, context) {
	      this.quill.format('list', false, _quill2.default.sources.USER);
	      if (context.format.indent) {
	        this.quill.format('indent', false, _quill2.default.sources.USER);
	      }
	    }],
	    'header enter': [{ key: Keyboard.keys.ENTER }, { collapsed: true, format: ['header'], suffix: /^$/ }, function (range) {
	      this.quill.scroll.insertAt(range.index, '\n');
	      this.quill.formatText(range.index + 1, 1, 'header', false, _quill2.default.sources.USER);
	      this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
	      this.quill.selection.scrollIntoView();
	    }],
	    'list autofill': [{ key: ' ' }, { collapsed: true, format: { list: false }, prefix: /^(1\.|-)$/ }, function (range, context) {
	      var length = context.prefix.length;
	      this.quill.scroll.deleteAt(range.index - length, length);
	      this.quill.formatLine(range.index - length, 1, 'list', length === 1 ? 'bullet' : 'ordered', _quill2.default.sources.USER);
	      this.quill.setSelection(range.index - length, _quill2.default.sources.SILENT);
	    }]
	  }
	};

	function handleDelete(range) {
	  this.quill.deleteText(range, _quill2.default.sources.USER);
	  this.quill.setSelection(range.index, _quill2.default.sources.SILENT);
	  this.quill.selection.scrollIntoView();
	}

	function handleEnter(range, context) {
	  var _this3 = this;

	  if (range.length > 0) {
	    this.quill.scroll.deleteAt(range.index, range.length); // So we do not trigger text-change
	  }
	  var lineFormats = Object.keys(context.format).reduce(function (lineFormats, format) {
	    if (_parchment2.default.query(format, _parchment2.default.Scope.BLOCK) && !Array.isArray(context.format[format])) {
	      lineFormats[format] = context.format[format];
	    }
	    return lineFormats;
	  }, {});
	  this.quill.insertText(range.index, '\n', lineFormats, _quill2.default.sources.USER);
	  this.quill.selection.scrollIntoView();
	  Object.keys(context.format).forEach(function (name) {
	    if (lineFormats[name] != null) return;
	    if (Array.isArray(context.format[name])) return;
	    if (name === 'link') return;
	    _this3.quill.format(name, context.format[name], _quill2.default.sources.USER);
	  });
	}

	function makeCodeBlockHandler(indent) {
	  var handler = function handler(range) {
	    var CodeBlock = _parchment2.default.query('code-block');
	    var index = range.index,
	        length = range.length;

	    var _quill$scroll$descend = this.quill.scroll.descendant(CodeBlock, index);

	    var _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2);

	    var block = _quill$scroll$descend2[0];
	    var offset = _quill$scroll$descend2[1];

	    if (block == null) return;
	    var scrollOffset = this.quill.scroll.offset(block);
	    var start = block.newlineIndex(offset, true) + 1;
	    var end = block.newlineIndex(scrollOffset + offset + length);
	    var lines = block.domNode.textContent.slice(start, end).split('\n');
	    offset = 0;
	    lines.forEach(function (line, i) {
	      if (indent) {
	        block.insertAt(start + offset, CodeBlock.TAB);
	        offset += CodeBlock.TAB.length;
	        if (i === 0) {
	          index += CodeBlock.TAB.length;
	        } else {
	          length += CodeBlock.TAB.length;
	        }
	      } else if (line.startsWith(CodeBlock.TAB)) {
	        block.deleteAt(start + offset, CodeBlock.TAB.length);
	        offset -= CodeBlock.TAB.length;
	        if (i === 0) {
	          index -= CodeBlock.TAB.length;
	        } else {
	          length -= CodeBlock.TAB.length;
	        }
	      }
	      offset += line.length + 1;
	    });
	    this.quill.update(_quill2.default.sources.USER);
	    this.quill.setSelection(index, length, _quill2.default.sources.SILENT);
	  };
	  return [{ key: Keyboard.keys.TAB, shiftKey: !indent }, { format: { 'code-block': true } }, handler];
	}

	function makeFormatHandler(format) {
	  var key = { key: format[0].toUpperCase(), shortKey: true };
	  var handler = function handler(range, context) {
	    this.quill.format(format, !context.format[format], _quill2.default.sources.USER);
	  };
	  return [key, {}, handler];
	}

	function normalize(binding) {
	  switch (typeof binding === 'undefined' ? 'undefined' : _typeof(binding)) {
	    case 'string':
	      if (Keyboard.keys[binding.toUpperCase()] != null) {
	        binding = { key: Keyboard.keys[binding.toUpperCase()] };
	      } else if (binding.length === 1) {
	        binding = { key: binding.toUpperCase().charCodeAt(0) };
	      } else {
	        return null;
	      }
	      break;
	    case 'number':
	      binding = { key: binding };
	      break;
	    case 'object':
	      binding = (0, _clone2.default)(binding, false);
	      break;
	    default:
	      return null;
	  }
	  if (typeof binding.key === 'string') {
	    binding.key = binding.key.toUpperCase().charCodeAt(0);
	  }
	  return binding;
	}

	exports.default = Keyboard;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.IndentClass = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var IdentAttributor = function (_Parchment$Attributor) {
	  _inherits(IdentAttributor, _Parchment$Attributor);

	  function IdentAttributor() {
	    _classCallCheck(this, IdentAttributor);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(IdentAttributor).apply(this, arguments));
	  }

	  _createClass(IdentAttributor, [{
	    key: 'add',
	    value: function add(node, value) {
	      if (value === '+1' || value === '-1') {
	        var indent = this.value(node) || 0;
	        value = value === '+1' ? indent + 1 : indent - 1;
	      }
	      if (value === 0) {
	        this.remove(node);
	        return true;
	      } else {
	        return _get(Object.getPrototypeOf(IdentAttributor.prototype), 'add', this).call(this, node, value);
	      }
	    }
	  }, {
	    key: 'value',
	    value: function value(node) {
	      return parseInt(_get(Object.getPrototypeOf(IdentAttributor.prototype), 'value', this).call(this, node)) || undefined; // Don't return NaN
	    }
	  }]);

	  return IdentAttributor;
	}(_parchment2.default.Attributor.Class);

	var IndentClass = new IdentAttributor('indent', 'ql-indent', {
	  scope: _parchment2.default.Scope.BLOCK,
	  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
	});

	exports.IndentClass = IndentClass;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _block = __webpack_require__(33);

	var _block2 = _interopRequireDefault(_block);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Blockquote = function (_Block) {
	  _inherits(Blockquote, _Block);

	  function Blockquote() {
	    _classCallCheck(this, Blockquote);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Blockquote).apply(this, arguments));
	  }

	  return Blockquote;
	}(_block2.default);

	Blockquote.blotName = 'blockquote';
	Blockquote.tagName = 'blockquote';

	exports.default = Blockquote;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _block = __webpack_require__(33);

	var _block2 = _interopRequireDefault(_block);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Header = function (_Block) {
	  _inherits(Header, _Block);

	  function Header() {
	    _classCallCheck(this, Header);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Header).apply(this, arguments));
	  }

	  _createClass(Header, null, [{
	    key: 'formats',
	    value: function formats(domNode) {
	      return this.tagName.indexOf(domNode.tagName) + 1;
	    }
	  }]);

	  return Header;
	}(_block2.default);

	Header.blotName = 'header';
	Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

	exports.default = Header;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.ListItem = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _extend = __webpack_require__(26);

	var _extend2 = _interopRequireDefault(_extend);

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _block = __webpack_require__(33);

	var _block2 = _interopRequireDefault(_block);

	var _container = __webpack_require__(42);

	var _container2 = _interopRequireDefault(_container);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ListItem = function (_Block) {
	  _inherits(ListItem, _Block);

	  function ListItem() {
	    _classCallCheck(this, ListItem);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ListItem).apply(this, arguments));
	  }

	  _createClass(ListItem, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (name === List.blotName && !value) {
	        this.replaceWith(_parchment2.default.create(this.statics.scope));
	      } else {
	        _get(Object.getPrototypeOf(ListItem.prototype), 'format', this).call(this, name, value);
	      }
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      if (this.prev == null && this.next == null) {
	        this.parent.remove();
	      } else {
	        _get(Object.getPrototypeOf(ListItem.prototype), 'remove', this).call(this);
	      }
	    }
	  }, {
	    key: 'replaceWith',
	    value: function replaceWith(name, value) {
	      this.parent.isolate(this.offset(this.parent), this.length());
	      if (name === List.blotName) {
	        this.parent.replaceWith(name, value);
	        return this;
	      } else {
	        this.parent.unwrap();
	        return _get(Object.getPrototypeOf(ListItem.prototype), 'replaceWith', this).call(this, name, value);
	      }
	    }
	  }], [{
	    key: 'formats',
	    value: function formats(domNode) {
	      return domNode.tagName === ListItem.tagName ? undefined : _get(Object.getPrototypeOf(ListItem), 'formats', this).call(this, domNode);
	    }
	  }]);

	  return ListItem;
	}(_block2.default);

	ListItem.blotName = 'list-item';
	ListItem.tagName = 'LI';

	var List = function (_Container) {
	  _inherits(List, _Container);

	  function List() {
	    _classCallCheck(this, List);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(List).apply(this, arguments));
	  }

	  _createClass(List, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (this.children.length > 0) {
	        this.children.tail.format(name, value);
	      }
	    }
	  }, {
	    key: 'formats',
	    value: function formats() {
	      // We don't inherit from FormatBlot
	      return _defineProperty({}, this.statics.blotName, this.statics.formats(this.domNode));
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      _get(Object.getPrototypeOf(List.prototype), 'optimize', this).call(this);
	      var next = this.next;
	      if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && next.domNode.tagName === this.domNode.tagName) {
	        next.moveChildren(this);
	        next.remove();
	      }
	    }
	  }, {
	    key: 'replace',
	    value: function replace(target) {
	      if (target.statics.blotName !== this.statics.blotName) {
	        var item = _parchment2.default.create(this.statics.defaultChild);
	        target.moveChildren(item);
	        this.appendChild(item);
	      }
	      _get(Object.getPrototypeOf(List.prototype), 'replace', this).call(this, target);
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      if (value === 'ordered') {
	        value = 'OL';
	      } else if (value === 'bullet') {
	        value = 'UL';
	      }
	      return _get(Object.getPrototypeOf(List), 'create', this).call(this, value);
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      if (domNode.tagName === 'OL') return 'ordered';
	      if (domNode.tagName === 'UL') return 'bullet';
	      return undefined;
	    }
	  }]);

	  return List;
	}(_container2.default);

	List.blotName = 'list';
	List.scope = _parchment2.default.Scope.BLOCK_BLOT;
	List.tagName = ['OL', 'UL'];
	List.defaultChild = 'list-item';
	List.allowedChildren = [ListItem];

	exports.ListItem = ListItem;
	exports.default = List;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _inline = __webpack_require__(36);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Bold = function (_Inline) {
	  _inherits(Bold, _Inline);

	  function Bold() {
	    _classCallCheck(this, Bold);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Bold).apply(this, arguments));
	  }

	  return Bold;
	}(_inline2.default);

	Bold.blotName = 'bold';
	Bold.tagName = 'STRONG';

	exports.default = Bold;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _inline = __webpack_require__(36);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Italic = function (_Inline) {
	  _inherits(Italic, _Inline);

	  function Italic() {
	    _classCallCheck(this, Italic);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Italic).apply(this, arguments));
	  }

	  return Italic;
	}(_inline2.default);

	Italic.blotName = 'italic';
	Italic.tagName = 'EM';

	exports.default = Italic;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sanitize = exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inline = __webpack_require__(36);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Link = function (_Inline) {
	  _inherits(Link, _Inline);

	  function Link() {
	    _classCallCheck(this, Link);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Link).apply(this, arguments));
	  }

	  _createClass(Link, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (name !== this.statics.blotName || !value) return _get(Object.getPrototypeOf(Link.prototype), 'format', this).call(this, name, value);
	      value = this.constructor.sanitize(value);
	      this.domNode.setAttribute('href', value);
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(Object.getPrototypeOf(Link), 'create', this).call(this, value);
	      value = this.sanitize(value);
	      node.setAttribute('href', value);
	      node.setAttribute('target', '_blank');
	      return node;
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      return domNode.getAttribute('href');
	    }
	  }, {
	    key: 'sanitize',
	    value: function sanitize(url) {
	      return _sanitize(url, ['http', 'https', 'mailto']) ? url : this.SANITIZED_URL;
	    }
	  }]);

	  return Link;
	}(_inline2.default);

	Link.blotName = 'link';
	Link.tagName = 'A';
	Link.SANITIZED_URL = 'about:blank';

	function _sanitize(url, protocols) {
	  var anchor = document.createElement('a');
	  anchor.href = url;
	  var protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
	  return protocols.indexOf(protocol) > -1;
	}

	exports.default = Link;
	exports.sanitize = _sanitize;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inline = __webpack_require__(36);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Script = function (_Inline) {
	  _inherits(Script, _Inline);

	  function Script() {
	    _classCallCheck(this, Script);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Script).apply(this, arguments));
	  }

	  _createClass(Script, null, [{
	    key: 'create',
	    value: function create(value) {
	      if (value === 'super') {
	        return document.createElement('sup');
	      } else if (value === 'sub') {
	        return document.createElement('sub');
	      } else {
	        return _get(Object.getPrototypeOf(Script), 'create', this).call(this, value);
	      }
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      if (domNode.tagName === 'SUB') return 'sub';
	      if (domNode.tagName === 'SUP') return 'super';
	      return undefined;
	    }
	  }]);

	  return Script;
	}(_inline2.default);

	Script.blotName = 'script';
	Script.tagName = ['SUB', 'SUP'];

	exports.default = Script;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _inline = __webpack_require__(36);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Strike = function (_Inline) {
	  _inherits(Strike, _Inline);

	  function Strike() {
	    _classCallCheck(this, Strike);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Strike).apply(this, arguments));
	  }

	  return Strike;
	}(_inline2.default);

	Strike.blotName = 'strike';
	Strike.tagName = 'S';

	exports.default = Strike;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _inline = __webpack_require__(36);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Underline = function (_Inline) {
	  _inherits(Underline, _Inline);

	  function Underline() {
	    _classCallCheck(this, Underline);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Underline).apply(this, arguments));
	  }

	  return Underline;
	}(_inline2.default);

	Underline.blotName = 'underline';
	Underline.tagName = 'U';

	exports.default = Underline;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(35);

	var _embed2 = _interopRequireDefault(_embed);

	var _link = __webpack_require__(60);

	var _link2 = _interopRequireDefault(_link);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Image = function (_Embed) {
	  _inherits(Image, _Embed);

	  function Image() {
	    _classCallCheck(this, Image);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Image).apply(this, arguments));
	  }

	  _createClass(Image, null, [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(Object.getPrototypeOf(Image), 'create', this).call(this, value);
	      if (typeof value === 'string') {
	        node.setAttribute('src', this.sanitize(value));
	      }
	      return node;
	    }
	  }, {
	    key: 'match',
	    value: function match(url) {
	      return (/\.(jpe?g|gif|png)$/.test(url)
	      );
	    }
	  }, {
	    key: 'sanitize',
	    value: function sanitize(url) {
	      return (0, _link.sanitize)(url, ['http', 'https', 'data']) ? url : '//:0';
	    }
	  }, {
	    key: 'value',
	    value: function value(domNode) {
	      return domNode.getAttribute('src');
	    }
	  }]);

	  return Image;
	}(_embed2.default);

	Image.blotName = 'image';
	Image.tagName = 'IMG';

	exports.default = Image;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _block = __webpack_require__(33);

	var _link = __webpack_require__(60);

	var _link2 = _interopRequireDefault(_link);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Video = function (_BlockEmbed) {
	  _inherits(Video, _BlockEmbed);

	  function Video() {
	    _classCallCheck(this, Video);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Video).apply(this, arguments));
	  }

	  _createClass(Video, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (name === 'height' || name === 'width') {
	        if (value) {
	          this.domNode.setAttribute(name, value);
	        } else {
	          this.domNode.removeAttribute(name);
	        }
	      } else {
	        _get(Object.getPrototypeOf(Video.prototype), 'format', this).call(this, name, value);
	      }
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(Object.getPrototypeOf(Video), 'create', this).call(this, value);
	      node.setAttribute('frameborder', '0');
	      node.setAttribute('allowfullscreen', true);
	      node.setAttribute('src', this.sanitize(value));
	      return node;
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      var formats = {};
	      if (domNode.hasAttribute('height')) formats['height'] = domNode.getAttribute('height');
	      if (domNode.hasAttribute('width')) formats['width'] = domNode.getAttribute('width');
	      return formats;
	    }
	  }, {
	    key: 'sanitize',
	    value: function sanitize(url) {
	      return _link2.default.sanitize(url);
	    }
	  }, {
	    key: 'value',
	    value: function value(domNode) {
	      return domNode.getAttribute('src');
	    }
	  }]);

	  return Video;
	}(_block.BlockEmbed);

	Video.blotName = 'video';
	Video.className = 'ql-video';
	Video.tagName = 'IFRAME';

	exports.default = Video;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.FormulaBlot = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(35);

	var _embed2 = _interopRequireDefault(_embed);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FormulaBlot = function (_Embed) {
	  _inherits(FormulaBlot, _Embed);

	  function FormulaBlot() {
	    _classCallCheck(this, FormulaBlot);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(FormulaBlot).apply(this, arguments));
	  }

	  _createClass(FormulaBlot, [{
	    key: 'index',
	    value: function index(node, offset) {
	      return 1;
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(Object.getPrototypeOf(FormulaBlot), 'create', this).call(this, value);
	      if (typeof value === 'string') {
	        katex.render(value, node);
	        node.dataset.value = value;
	      }
	      node.setAttribute('contenteditable', false);
	      return node;
	    }
	  }, {
	    key: 'value',
	    value: function value(domNode) {
	      return domNode.dataset.value;
	    }
	  }]);

	  return FormulaBlot;
	}(_embed2.default);

	FormulaBlot.blotName = 'formula';
	FormulaBlot.className = 'ql-formula';
	FormulaBlot.tagName = 'SPAN';

	function Formula() {
	  if (window.katex == null) {
	    throw new Error('Formula module requires KaTeX.');
	  }
	  Quill.register(FormulaBlot, true);
	}

	exports.FormulaBlot = FormulaBlot;
	exports.default = Formula;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.CodeToken = exports.CodeBlock = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(19);

	var _quill2 = _interopRequireDefault(_quill);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	var _code = __webpack_require__(32);

	var _code2 = _interopRequireDefault(_code);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SyntaxCodeBlock = function (_CodeBlock) {
	  _inherits(SyntaxCodeBlock, _CodeBlock);

	  function SyntaxCodeBlock() {
	    _classCallCheck(this, SyntaxCodeBlock);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SyntaxCodeBlock).apply(this, arguments));
	  }

	  _createClass(SyntaxCodeBlock, [{
	    key: 'replaceWith',
	    value: function replaceWith(block) {
	      this.domNode.textContent = this.domNode.textContent;
	      this.attach();
	      _get(Object.getPrototypeOf(SyntaxCodeBlock.prototype), 'replaceWith', this).call(this, block);
	    }
	  }, {
	    key: 'highlight',
	    value: function highlight(_highlight) {
	      if (this.cachedHTML !== this.domNode.innerHTML) {
	        var text = this.domNode.textContent;
	        if (text.trim().length > 0 || this.cachedHTML == null) {
	          this.domNode.innerHTML = _highlight(text);
	          this.attach();
	        }
	        this.cachedHTML = this.domNode.innerHTML;
	      }
	    }
	  }]);

	  return SyntaxCodeBlock;
	}(_code2.default);

	SyntaxCodeBlock.className = 'ql-syntax';

	var CodeToken = new _parchment2.default.Attributor.Class('token', 'hljs', {
	  scope: _parchment2.default.Scope.INLINE
	});

	var Syntax = function (_Module) {
	  _inherits(Syntax, _Module);

	  function Syntax(quill, options) {
	    _classCallCheck(this, Syntax);

	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Syntax).call(this, quill, options));

	    if (typeof _this2.options.highlight !== 'function') {
	      throw new Error('Syntax module requires highlight.js. Please include the library on the page before Quill.');
	    }
	    _quill2.default.register(CodeToken, true);
	    _quill2.default.register(SyntaxCodeBlock, true);
	    var timer = null;
	    _this2.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function () {
	      if (timer != null) return;
	      timer = setTimeout(function () {
	        _this2.highlight();
	        timer = null;
	      }, 100);
	    });
	    _this2.highlight();
	    return _this2;
	  }

	  _createClass(Syntax, [{
	    key: 'highlight',
	    value: function highlight() {
	      var _this3 = this;

	      var range = this.quill.getSelection();
	      this.quill.scroll.descendants(SyntaxCodeBlock).forEach(function (code) {
	        code.highlight(_this3.options.highlight);
	      });
	      this.quill.update(_quill2.default.sources.SILENT);
	      if (range != null) {
	        this.quill.setSelection(range, _quill2.default.sources.SILENT);
	      }
	    }
	  }]);

	  return Syntax;
	}(_module2.default);

	Syntax.DEFAULTS = {
	  highlight: function () {
	    if (window.hljs == null) return null;
	    return function (text) {
	      var result = window.hljs.highlightAuto(text);
	      return result.value;
	    };
	  }()
	};

	exports.CodeBlock = SyntaxCodeBlock;
	exports.CodeToken = CodeToken;
	exports.default = Syntax;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.addControls = exports.default = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(26);

	var _extend2 = _interopRequireDefault(_extend);

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(19);

	var _quill2 = _interopRequireDefault(_quill);

	var _logger = __webpack_require__(31);

	var _logger2 = _interopRequireDefault(_logger);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	var _selection = __webpack_require__(40);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:toolbar');

	var Toolbar = function (_Module) {
	  _inherits(Toolbar, _Module);

	  function Toolbar(quill, options) {
	    _classCallCheck(this, Toolbar);

	    options.handlers = (0, _extend2.default)({}, Toolbar.DEFAULTS.handlers, options.handlers);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Toolbar).call(this, quill, options));

	    if (typeof _this.options.container === 'string') {
	      _this.container = document.querySelector(_this.options.container);
	    } else if (Array.isArray(_this.options.container)) {
	      var container = document.createElement('div');
	      addControls(container, _this.options.container);
	      quill.container.parentNode.insertBefore(container, quill.container);
	      _this.container = container;
	    } else {
	      _this.container = _this.options.container;
	    }
	    if (!(_this.container instanceof HTMLElement)) {
	      var _ret;

	      return _ret = debug.error('Container required for toolbar', _this.options), _possibleConstructorReturn(_this, _ret);
	    }
	    _this.container.classList.add('ql-toolbar');
	    _this.controls = [];
	    _this.handlers = {};
	    Object.keys(_this.options.handlers).forEach(function (format) {
	      _this.addHandler(format, _this.options.handlers[format]);
	    });
	    _this.container.addEventListener('mousedown', function (e) {
	      e.preventDefault(); // Prevent blur
	    });
	    [].forEach.call(_this.container.querySelectorAll('button, select'), function (input) {
	      _this.attach(input);
	    });
	    _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function (type, range) {
	      if (type === _quill2.default.events.SELECTION_CHANGE) {
	        _this.update(range);
	      }
	    });
	    _this.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function () {
	      var _this$quill$selection = _this.quill.selection.getRange();

	      var _this$quill$selection2 = _slicedToArray(_this$quill$selection, 1);

	      var range = _this$quill$selection2[0]; // quill.getSelection triggers update

	      _this.update(range);
	    });
	    return _this;
	  }

	  _createClass(Toolbar, [{
	    key: 'addHandler',
	    value: function addHandler(format, handler) {
	      this.handlers[format] = handler;
	    }
	  }, {
	    key: 'attach',
	    value: function attach(input) {
	      var _this2 = this;

	      var format = [].find.call(input.classList, function (className) {
	        return className.indexOf('ql-') === 0;
	      });
	      if (!format) return;
	      format = format.slice('ql-'.length);
	      if (input.tagName === 'BUTTON') {
	        input.setAttribute('type', 'button');
	      }
	      if (this.handlers[format] == null) {
	        if (this.quill.scroll.whitelist != null && this.quill.scroll.whitelist[format] == null) {
	          debug.warn('ignoring attaching to disabled format', format, input);
	          return;
	        }
	        if (_parchment2.default.query(format) == null) {
	          debug.warn('ignoring attaching to nonexistent format', format, input);
	          return;
	        }
	      }
	      var eventName = input.tagName === 'SELECT' ? 'change' : 'click';
	      input.addEventListener(eventName, function (e) {
	        var value = void 0;
	        if (input.tagName === 'SELECT') {
	          if (input.selectedIndex < 0) return;
	          var selected = input.options[input.selectedIndex];
	          if (selected.hasAttribute('selected')) {
	            value = false;
	          } else {
	            value = selected.value || false;
	          }
	        } else {
	          value = input.classList.contains('ql-active') ? false : input.value || true;
	          e.preventDefault();
	        }
	        _this2.quill.focus();

	        var _quill$selection$getR = _this2.quill.selection.getRange();

	        var _quill$selection$getR2 = _slicedToArray(_quill$selection$getR, 1);

	        var range = _quill$selection$getR2[0];

	        if (_this2.handlers[format] != null) {
	          _this2.handlers[format].call(_this2, value);
	        } else if (_parchment2.default.query(format).prototype instanceof _parchment2.default.Embed) {
	          _this2.quill.updateContents(new _delta2.default().retain(range.index).delete(range.length).insert(_defineProperty({}, format, true)), _quill2.default.sources.USER);
	        } else {
	          _this2.quill.format(format, value, _quill2.default.sources.USER);
	        }
	        _this2.update(range);
	      });
	      // TODO use weakmap
	      this.controls.push([format, input]);
	    }
	  }, {
	    key: 'update',
	    value: function update(range) {
	      var formats = range == null ? {} : this.quill.getFormat(range);
	      this.controls.forEach(function (pair) {
	        var _pair = _slicedToArray(pair, 2);

	        var format = _pair[0];
	        var input = _pair[1];

	        if (input.tagName === 'SELECT') {
	          var option = void 0;
	          if (formats[format] == null) {
	            option = input.querySelector('option[selected]');
	          } else if (!Array.isArray(formats[format])) {
	            var value = formats[format];
	            if (typeof value === 'string') {
	              value = value.replace(/\"/g, '&quot;');
	            }
	            option = input.querySelector('option[value="' + value + '"]');
	          }
	          if (option == null) {
	            input.value = ''; // TODO make configurable?
	            input.selectedIndex = -1;
	          } else {
	            option.selected = true;
	          }
	        }if (input.value) {
	          var active = input.value === formats[format] || formats[format] != null && input.value === formats[format].toString();
	          input.classList.toggle('ql-active', active);
	        } else {
	          input.classList.toggle('ql-active', formats[format] === true || format === 'link' && formats[format] != null);
	        }
	      });
	    }
	  }]);

	  return Toolbar;
	}(_module2.default);

	Toolbar.DEFAULTS = {};

	function addButton(container, format, value) {
	  var input = document.createElement('button');
	  input.setAttribute('type', 'button');
	  input.classList.add('ql-' + format);
	  if (value != null) {
	    input.value = value;
	  }
	  container.appendChild(input);
	}

	function addControls(container, groups) {
	  if (!Array.isArray(groups[0])) {
	    groups = [groups];
	  }
	  groups.forEach(function (controls) {
	    var group = document.createElement('span');
	    group.classList.add('ql-formats');
	    controls.forEach(function (control) {
	      if (typeof control === 'string') {
	        addButton(group, control);
	      } else {
	        var format = Object.keys(control)[0];
	        var value = control[format];
	        if (Array.isArray(value)) {
	          addSelect(group, format, value);
	        } else {
	          addButton(group, format, value);
	        }
	      }
	    });
	    container.appendChild(group);
	  });
	}

	function addSelect(container, format, values) {
	  var input = document.createElement('select');
	  input.classList.add('ql-' + format);
	  values.forEach(function (value) {
	    var option = document.createElement('option');
	    if (value !== false) {
	      option.setAttribute('value', value);
	    } else {
	      option.setAttribute('selected', 'selected');
	    }
	    input.appendChild(option);
	  });
	  container.appendChild(input);
	}

	Toolbar.DEFAULTS = {
	  container: null,
	  handlers: {
	    clean: function clean(value) {
	      var _this3 = this;

	      var range = this.quill.getSelection();
	      if (range == null) return;
	      if (range.length == 0) {
	        var formats = this.quill.getFormat();
	        Object.keys(formats).forEach(function (name) {
	          // Clean functionality in existing apps only clean inline formats
	          if (_parchment2.default.query(name, _parchment2.default.Scope.INLINE) != null) {
	            _this3.quill.format(name, false);
	          }
	        });
	      } else {
	        this.quill.removeFormat(range, _quill2.default.sources.USER);
	      }
	    },
	    direction: function direction(value) {
	      var align = this.quill.getFormat()['align'];
	      if (value === 'rtl' && align == null) {
	        this.quill.format('align', 'right', _quill2.default.sources.USER);
	      } else if (!value && align === 'right') {
	        this.quill.format('align', false, _quill2.default.sources.USER);
	      }
	      this.quill.format('direction', value, _quill2.default.sources.USER);
	    },
	    indent: function indent(value) {
	      var range = this.quill.getSelection();
	      var formats = this.quill.getFormat(range);
	      var indent = parseInt(formats.indent || 0);
	      if (value === '+1') {
	        this.quill.format('indent', indent + 1, _quill2.default.sources.USER);
	      } else if (value === '-1') {
	        this.quill.format('indent', indent - 1, _quill2.default.sources.USER);
	      }
	    }
	  }
	};

	exports.default = Toolbar;
	exports.addControls = addControls;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  'align': {
	    '': __webpack_require__(70),
	    'center': __webpack_require__(71),
	    'right': __webpack_require__(72),
	    'justify': __webpack_require__(73)
	  },
	  'background': __webpack_require__(74),
	  'blockquote': __webpack_require__(75),
	  'bold': __webpack_require__(76),
	  'clean': __webpack_require__(77),
	  'code-block': __webpack_require__(78),
	  'color': __webpack_require__(79),
	  'direction': {
	    '': __webpack_require__(80),
	    'rtl': __webpack_require__(81)
	  },
	  'float': {
	    'center': __webpack_require__(82),
	    'full': __webpack_require__(83),
	    'left': __webpack_require__(84),
	    'right': __webpack_require__(85)
	  },
	  'formula': __webpack_require__(86),
	  'header': {
	    '1': __webpack_require__(87),
	    '2': __webpack_require__(88)
	  },
	  'italic': __webpack_require__(89),
	  'image': __webpack_require__(90),
	  'indent': {
	    '+1': __webpack_require__(91),
	    '-1': __webpack_require__(92)
	  },
	  'link': __webpack_require__(93),
	  'list': {
	    'ordered': __webpack_require__(94),
	    'bullet': __webpack_require__(95)
	  },
	  'script': {
	    'sub': __webpack_require__(96),
	    'super': __webpack_require__(97)
	  },
	  'strike': __webpack_require__(98),
	  'underline': __webpack_require__(99),
	  'video': __webpack_require__(100)
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=13 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=9 y1=4 y2=4></line> </svg>";

/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=14 x2=4 y1=14 y2=14></line> <line class=ql-stroke x1=12 x2=6 y1=4 y2=4></line> </svg>";

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=5 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=9 y1=4 y2=4></line> </svg>";

/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=3 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=3 y1=4 y2=4></line> </svg>";

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <g class=\"ql-fill ql-color-label\"> <polygon points=\"6 6.868 6 6 5 6 5 7 5.942 7 6 6.868\"></polygon> <rect height=1 width=1 x=4 y=4></rect> <polygon points=\"6.817 5 6 5 6 6 6.38 6 6.817 5\"></polygon> <rect height=1 width=1 x=2 y=6></rect> <rect height=1 width=1 x=3 y=5></rect> <rect height=1 width=1 x=4 y=7></rect> <polygon points=\"4 11.439 4 11 3 11 3 12 3.755 12 4 11.439\"></polygon> <rect height=1 width=1 x=2 y=12></rect> <rect height=1 width=1 x=2 y=9></rect> <rect height=1 width=1 x=2 y=15></rect> <polygon points=\"4.63 10 4 10 4 11 4.192 11 4.63 10\"></polygon> <rect height=1 width=1 x=3 y=8></rect> <path d=M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z></path> <path d=M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z></path> <path d=M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z></path> <rect height=1 width=1 x=12 y=2></rect> <rect height=1 width=1 x=11 y=3></rect> <path d=M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z></path> <rect height=1 width=1 x=2 y=3></rect> <rect height=1 width=1 x=6 y=2></rect> <rect height=1 width=1 x=3 y=2></rect> <rect height=1 width=1 x=5 y=3></rect> <rect height=1 width=1 x=9 y=2></rect> <rect height=1 width=1 x=15 y=14></rect> <polygon points=\"13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174\"></polygon> <rect height=1 width=1 x=13 y=7></rect> <rect height=1 width=1 x=15 y=5></rect> <rect height=1 width=1 x=14 y=6></rect> <rect height=1 width=1 x=15 y=8></rect> <rect height=1 width=1 x=14 y=9></rect> <path d=M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z></path> <rect height=1 width=1 x=14 y=3></rect> <polygon points=\"12 6.868 12 6 11.62 6 12 6.868\"></polygon> <rect height=1 width=1 x=15 y=2></rect> <rect height=1 width=1 x=12 y=5></rect> <rect height=1 width=1 x=13 y=4></rect> <polygon points=\"12.933 9 13 9 13 8 12.495 8 12.933 9\"></polygon> <rect height=1 width=1 x=9 y=14></rect> <rect height=1 width=1 x=8 y=15></rect> <path d=M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z></path> <rect height=1 width=1 x=5 y=15></rect> <path d=M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z></path> <rect height=1 width=1 x=11 y=15></rect> <path d=M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z></path> <rect height=1 width=1 x=14 y=15></rect> <rect height=1 width=1 x=15 y=11></rect> </g> <polyline class=ql-stroke points=\"5.5 13 9 5 12.5 13\"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=11 y2=11></line> </svg>";

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=\"ql-fill ql-stroke\" height=3 width=3 x=4 y=5></rect> <rect class=\"ql-fill ql-stroke\" height=3 width=3 x=11 y=5></rect> <path class=\"ql-even ql-fill ql-stroke\" d=M7,8c0,4.031-3,5-3,5></path> <path class=\"ql-even ql-fill ql-stroke\" d=M14,8c0,4.031-3,5-3,5></path> </svg>";

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-stroke d=M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z></path> <path class=ql-stroke d=M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z></path> </svg>";

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = "<svg class=\"\" viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=5 x2=13 y1=3 y2=3></line> <line class=ql-stroke x1=6 x2=9.35 y1=12 y2=3></line> <line class=ql-stroke x1=11 x2=15 y1=11 y2=15></line> <line class=ql-stroke x1=15 x2=11 y1=11 y2=15></line> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=7 x=2 y=14></rect> </svg>";

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polyline class=\"ql-even ql-stroke\" points=\"5 7 3 9 5 11\"></polyline> <polyline class=\"ql-even ql-stroke\" points=\"13 7 15 9 13 11\"></polyline> <line class=ql-stroke x1=10 x2=8 y1=5 y2=13></line> </svg>";

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=\"ql-color-label ql-stroke ql-transparent\" x1=3 x2=15 y1=15 y2=15></line> <polyline class=ql-stroke points=\"5.5 11 9 3 12.5 11\"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=9 y2=9></line> </svg>";

/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=\"ql-stroke ql-fill\" points=\"3 11 5 9 3 7 3 11\"></polygon> <line class=\"ql-stroke ql-fill\" x1=15 x2=11 y1=4 y2=4></line> <path class=ql-fill d=M11,3a3,3,0,0,0,0,6h1V3H11Z></path> <rect class=ql-fill height=11 width=1 x=11 y=4></rect> <rect class=ql-fill height=11 width=1 x=13 y=4></rect> </svg>";

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=\"ql-stroke ql-fill\" points=\"15 12 13 10 15 8 15 12\"></polygon> <line class=\"ql-stroke ql-fill\" x1=9 x2=5 y1=4 y2=4></line> <path class=ql-fill d=M5,3A3,3,0,0,0,5,9H6V3H5Z></path> <rect class=ql-fill height=11 width=1 x=5 y=4></rect> <rect class=ql-fill height=11 width=1 x=7 y=4></rect> </svg>";

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M14,16H4a1,1,0,0,1,0-2H14A1,1,0,0,1,14,16Z /> <path class=ql-fill d=M14,4H4A1,1,0,0,1,4,2H14A1,1,0,0,1,14,4Z /> <rect class=ql-fill x=3 y=6 width=12 height=6 rx=1 ry=1 /> </svg>";

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M13,16H5a1,1,0,0,1,0-2h8A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H5A1,1,0,0,1,5,2h8A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=2 y=6 width=14 height=6 rx=1 ry=1 /> </svg>";

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15,8H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,8Z /> <path class=ql-fill d=M15,12H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,12Z /> <path class=ql-fill d=M15,16H5a1,1,0,0,1,0-2H15A1,1,0,0,1,15,16Z /> <path class=ql-fill d=M15,4H5A1,1,0,0,1,5,2H15A1,1,0,0,1,15,4Z /> <rect class=ql-fill x=2 y=6 width=8 height=6 rx=1 ry=1 /> </svg>";

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M5,8H3A1,1,0,0,1,3,6H5A1,1,0,0,1,5,8Z /> <path class=ql-fill d=M5,12H3a1,1,0,0,1,0-2H5A1,1,0,0,1,5,12Z /> <path class=ql-fill d=M13,16H3a1,1,0,0,1,0-2H13A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H3A1,1,0,0,1,3,2H13A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=8 y=6 width=8 height=6 rx=1 ry=1 transform=\"translate(24 18) rotate(-180)\"/> </svg>";

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z></path> <rect class=ql-fill height=1.6 rx=0.8 ry=0.8 width=5 x=5.15 y=6.2></rect> <path class=ql-fill d=M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z></path> </svg>";

/***/ },
/* 87 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=3 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=11 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=3 y1=9 y2=9></line> <line class=\"ql-stroke ql-thin\" x1=13.5 x2=15.5 y1=14.5 y2=14.5></line> <path class=ql-fill d=M14.5,15a0.5,0.5,0,0,1-.5-0.5V12.085l-0.276.138A0.5,0.5,0,0,1,13.053,12c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,15,11.5v3A0.5,0.5,0,0,1,14.5,15Z></path> </svg>";

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=3 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=11 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=3 y1=9 y2=9></line> <path class=\"ql-stroke ql-thin\" d=M15.5,14.5h-2c0-.234,1.85-1.076,1.85-2.234a0.959,0.959,0,0,0-1.85-.109></path> </svg>";

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=13 y1=4 y2=4></line> <line class=ql-stroke x1=5 x2=11 y1=14 y2=14></line> <line class=ql-stroke x1=8 x2=10 y1=14 y2=4></line> </svg>";

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=ql-stroke height=10 width=12 x=3 y=4></rect> <circle class=ql-fill cx=6 cy=7 r=1></circle> <polyline class=\"ql-even ql-fill\" points=\"5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12\"></polyline> </svg>";

/***/ },
/* 91 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=\"ql-fill ql-stroke\" points=\"3 7 3 11 5 9 3 7\"></polyline> </svg>";

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points=\"5 7 5 11 3 9 5 7\"></polyline> </svg>";

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=11 y1=7 y2=11></line> <path class=\"ql-even ql-stroke\" d=M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z></path> <path class=\"ql-even ql-stroke\" d=M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z></path> </svg>";

/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=7 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=7 x2=15 y1=14 y2=14></line> <line class=\"ql-stroke ql-thin\" x1=2.5 x2=4.5 y1=5.5 y2=5.5></line> <path class=ql-fill d=M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z></path> <path class=\"ql-stroke ql-thin\" d=M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156></path> <path class=\"ql-stroke ql-thin\" d=M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109></path> </svg>";

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=6 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=6 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=6 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=3 y1=4 y2=4></line> <line class=ql-stroke x1=3 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=3 y1=14 y2=14></line> </svg>";

/***/ },
/* 96 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z /> <path class=ql-fill d=M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z /> </svg>";

/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z /> <path class=ql-fill d=M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z /> </svg>";

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=\"ql-stroke ql-thin\" x1=15.5 x2=2.5 y1=8.5 y2=9.5></line> <path class=ql-fill d=M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z></path> <path class=ql-fill d=M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z></path> </svg>";

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-stroke d=M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3></path> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=12 x=3 y=15></rect> </svg>";

/***/ },
/* 100 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=ql-stroke height=12 width=12 x=3 y=3></rect> <rect class=ql-fill height=12 width=1 x=5 y=3></rect> <rect class=ql-fill height=12 width=1 x=12 y=3></rect> <rect class=ql-fill height=2 width=8 x=5 y=8></rect> <rect class=ql-fill height=1 width=3 x=3 y=5></rect> <rect class=ql-fill height=1 width=3 x=3 y=7></rect> <rect class=ql-fill height=1 width=3 x=3 y=10></rect> <rect class=ql-fill height=1 width=3 x=3 y=12></rect> <rect class=ql-fill height=1 width=3 x=12 y=5></rect> <rect class=ql-fill height=1 width=3 x=12 y=7></rect> <rect class=ql-fill height=1 width=3 x=12 y=10></rect> <rect class=ql-fill height=1 width=3 x=12 y=12></rect> </svg>";

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dropdown = __webpack_require__(102);

	var _dropdown2 = _interopRequireDefault(_dropdown);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Picker = function () {
	  function Picker(select) {
	    var _this = this;

	    _classCallCheck(this, Picker);

	    this.select = select;
	    this.container = document.createElement('span');
	    this.buildPicker();
	    this.select.style.display = 'none';
	    this.select.parentNode.insertBefore(this.container, this.select);
	    this.label.addEventListener('click', function (event) {
	      _this.container.classList.toggle('ql-expanded');
	    });
	    this.select.addEventListener('change', this.update.bind(this));
	  }

	  _createClass(Picker, [{
	    key: 'buildItem',
	    value: function buildItem(option) {
	      var _this2 = this;

	      var item = document.createElement('span');
	      item.classList.add('ql-picker-item');
	      if (option.hasAttribute('value')) {
	        item.dataset.value = option.getAttribute('value');
	      }
	      if (option.textContent) {
	        item.dataset.label = option.textContent;
	      }
	      item.addEventListener('click', function (event) {
	        _this2.selectItem(item, true);
	      });
	      return item;
	    }
	  }, {
	    key: 'buildLabel',
	    value: function buildLabel() {
	      var label = document.createElement('span');
	      label.classList.add('ql-picker-label');
	      label.innerHTML = _dropdown2.default;
	      this.container.appendChild(label);
	      return label;
	    }
	  }, {
	    key: 'buildOptions',
	    value: function buildOptions() {
	      var _this3 = this;

	      var options = document.createElement('span');
	      options.classList.add('ql-picker-options');
	      [].slice.call(this.select.options).forEach(function (option) {
	        var item = _this3.buildItem(option);
	        options.appendChild(item);
	        if (option.hasAttribute('selected')) {
	          _this3.selectItem(item);
	        }
	      });
	      this.container.appendChild(options);
	    }
	  }, {
	    key: 'buildPicker',
	    value: function buildPicker() {
	      var _this4 = this;

	      [].slice.call(this.select.attributes).forEach(function (item) {
	        _this4.container.setAttribute(item.name, item.value);
	      });
	      this.container.classList.add('ql-picker');
	      this.label = this.buildLabel();
	      this.buildOptions();
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.container.classList.remove('ql-expanded');
	    }
	  }, {
	    key: 'selectItem',
	    value: function selectItem(item) {
	      var trigger = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	      var selected = this.container.querySelector('.ql-selected');
	      if (item === selected) return;
	      if (selected != null) {
	        selected.classList.remove('ql-selected');
	      }
	      if (item != null) {
	        item.classList.add('ql-selected');
	        this.select.selectedIndex = [].indexOf.call(item.parentNode.children, item);
	        if (item.dataset.value) {
	          this.label.dataset.value = item.dataset.value;
	        } else if (this.label.dataset.value) {
	          delete this.label.dataset.value;
	        }
	        if (item.dataset.label) {
	          this.label.dataset.label = item.dataset.label;
	        } else if (this.label.dataset.label) {
	          delete this.label.dataset.label;
	        }
	        if (trigger) {
	          if (typeof Event === 'function') {
	            this.select.dispatchEvent(new Event('change'));
	          } else if ((typeof Event === 'undefined' ? 'undefined' : _typeof(Event)) === 'object') {
	            // IE11
	            var event = document.createEvent('Event');
	            event.initEvent('change', true, true);
	            this.select.dispatchEvent(event);
	          }
	          this.close();
	        }
	      } else {
	        if (this.label.dataset.value) delete this.label.dataset.value;
	        if (this.label.dataset.label) delete this.label.dataset.label;
	      }
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var option = void 0;
	      if (this.select.selectedIndex > -1) {
	        var item = this.container.querySelector('.ql-picker-options').children[this.select.selectedIndex];
	        option = this.select.options[this.select.selectedIndex];
	        this.selectItem(item);
	      } else {
	        this.selectItem(null);
	      }
	      var isActive = option != null && option !== this.select.querySelector('option[selected]');
	      this.label.classList.toggle('ql-active', isActive);
	    }
	  }]);

	  return Picker;
	}();

	exports.default = Picker;

/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=ql-stroke points=\"7 11 9 13 11 11 7 11\"></polygon> <polygon class=ql-stroke points=\"7 7 9 5 11 7 7 7\"></polygon> </svg>";

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _picker = __webpack_require__(101);

	var _picker2 = _interopRequireDefault(_picker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ColorPicker = function (_Picker) {
	  _inherits(ColorPicker, _Picker);

	  function ColorPicker(select, label) {
	    _classCallCheck(this, ColorPicker);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorPicker).call(this, select));

	    _this.label.innerHTML = label;
	    _this.container.classList.add('ql-color-picker');
	    [].slice.call(_this.container.querySelectorAll('.ql-picker-item'), 0, 7).forEach(function (item) {
	      item.classList.add('ql-primary');
	    });
	    return _this;
	  }

	  _createClass(ColorPicker, [{
	    key: 'buildItem',
	    value: function buildItem(option) {
	      var item = _get(Object.getPrototypeOf(ColorPicker.prototype), 'buildItem', this).call(this, option);
	      item.style.backgroundColor = option.getAttribute('value') || '';
	      return item;
	    }
	  }, {
	    key: 'selectItem',
	    value: function selectItem(item, trigger) {
	      _get(Object.getPrototypeOf(ColorPicker.prototype), 'selectItem', this).call(this, item, trigger);
	      var colorLabel = this.label.querySelector('.ql-color-label');
	      var value = item ? item.dataset.value || '' : '';
	      if (colorLabel) {
	        if (colorLabel.tagName === 'line') {
	          colorLabel.style.stroke = value;
	        } else {
	          colorLabel.style.fill = value;
	        }
	      }
	    }
	  }]);

	  return ColorPicker;
	}(_picker2.default);

	exports.default = ColorPicker;

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _picker = __webpack_require__(101);

	var _picker2 = _interopRequireDefault(_picker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var IconPicker = function (_Picker) {
	  _inherits(IconPicker, _Picker);

	  function IconPicker(select, icons) {
	    _classCallCheck(this, IconPicker);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IconPicker).call(this, select));

	    _this.container.classList.add('ql-icon-picker');
	    [].forEach.call(_this.container.querySelectorAll('.ql-picker-item'), function (item) {
	      item.innerHTML = icons[item.dataset.value || ''];
	    });
	    _this.selectItem(_this.container.querySelector('.ql-selected'));
	    return _this;
	  }

	  _createClass(IconPicker, [{
	    key: 'selectItem',
	    value: function selectItem(item, trigger) {
	      _get(Object.getPrototypeOf(IconPicker.prototype), 'selectItem', this).call(this, item, trigger);
	      this.label.innerHTML = item.innerHTML;
	    }
	  }]);

	  return IconPicker;
	}(_picker2.default);

	exports.default = IconPicker;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _keyboard = __webpack_require__(53);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tooltip = function () {
	  function Tooltip(quill, boundsContainer) {
	    var _this = this;

	    _classCallCheck(this, Tooltip);

	    this.quill = quill;
	    this.boundsContainer = boundsContainer;
	    this.root = quill.addContainer('ql-tooltip');
	    this.root.innerHTML = this.constructor.TEMPLATE;
	    var offset = parseInt(window.getComputedStyle(this.root).marginTop);
	    this.quill.root.addEventListener('scroll', function () {
	      _this.root.style.marginTop = -1 * _this.quill.root.scrollTop + offset + 'px';
	      _this.checkBounds();
	    });
	    this.textbox = this.root.querySelector('input[type="text"]');
	    this.listen();
	    this.hide();
	  }

	  _createClass(Tooltip, [{
	    key: 'checkBounds',
	    value: function checkBounds() {
	      this.root.classList.toggle('ql-out-top', this.root.offsetTop <= 0);
	      this.root.classList.remove('ql-out-bottom');
	      this.root.classList.toggle('ql-out-bottom', this.root.offsetTop + this.root.offsetHeight >= this.quill.root.offsetHeight);
	    }
	  }, {
	    key: 'listen',
	    value: function listen() {
	      var _this2 = this;

	      this.root.addEventListener('mousedown', function (e) {
	        e.preventDefault();
	      });
	      this.textbox.addEventListener('keydown', function (event) {
	        if (_keyboard2.default.match(event, 'enter')) {
	          _this2.save();
	          event.preventDefault();
	        } else if (_keyboard2.default.match(event, 'escape')) {
	          _this2.cancel();
	          event.preventDefault();
	        }
	      });
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.hide();
	    }
	  }, {
	    key: 'edit',
	    value: function edit() {
	      var mode = arguments.length <= 0 || arguments[0] === undefined ? 'link' : arguments[0];
	      var preview = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	      this.root.classList.remove('ql-hidden');
	      this.root.classList.add('ql-editing');
	      if (preview != null) {
	        this.textbox.value = preview;
	      } else if (mode !== this.root.dataset.mode) {
	        this.textbox.value = '';
	      }
	      this.textbox.select();
	      this.textbox.setAttribute('placeholder', this.textbox.dataset[mode] || '');
	      this.root.dataset.mode = mode;
	      this.position(this.quill.getBounds(this.quill.selection.savedRange));
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.root.classList.add('ql-hidden');
	    }
	  }, {
	    key: 'position',
	    value: function position(reference) {
	      var left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
	      var top = reference.bottom + this.quill.root.scrollTop;
	      this.root.style.left = left + 'px';
	      this.root.style.top = top + 'px';
	      var containerBounds = this.boundsContainer.getBoundingClientRect();
	      var rootBounds = this.root.getBoundingClientRect();
	      var shift = 0;
	      if (rootBounds.right > containerBounds.right) {
	        shift = containerBounds.right - rootBounds.right;
	        this.root.style.left = left + shift + 'px';
	      }
	      if (rootBounds.left < containerBounds.left) {
	        shift = containerBounds.left - rootBounds.left;
	        this.root.style.left = left + shift + 'px';
	      }
	      this.checkBounds();
	      return shift;
	    }
	  }, {
	    key: 'save',
	    value: function save() {
	      switch (this.root.dataset.mode) {
	        case 'link':
	          var url = this.textbox.value;
	          var scrollTop = this.quill.root.scrollTop;
	          if (this.linkRange) {
	            this.quill.formatText(this.linkRange, 'link', url, _emitter2.default.sources.USER);
	            delete this.linkRange;
	          } else {
	            this.quill.focus();
	            this.quill.format('link', url, _emitter2.default.sources.USER);
	          }
	          this.quill.root.scrollTop = scrollTop;
	          break;
	        case 'formula': // fallthrough
	        case 'video':
	          var range = this.quill.getSelection(true);
	          var index = range.index + range.length;
	          if (range != null) {
	            this.quill.insertEmbed(index, this.root.dataset.mode, this.textbox.value, _emitter2.default.sources.USER);
	            if (this.root.dataset.mode === 'formula') {
	              this.quill.insertText(index + 1, ' ', _emitter2.default.sources.USER);
	            }
	            this.quill.setSelection(index + 2, _emitter2.default.sources.USER);
	          }
	          break;
	        default:
	      }
	      this.textbox.value = '';
	      this.hide();
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      this.root.classList.remove('ql-editing');
	      this.root.classList.remove('ql-hidden');
	    }
	  }]);

	  return Tooltip;
	}();

	exports.default = Tooltip;

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _keyboard = __webpack_require__(53);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	var _base = __webpack_require__(107);

	var _base2 = _interopRequireDefault(_base);

	var _icons = __webpack_require__(69);

	var _icons2 = _interopRequireDefault(_icons);

	var _selection = __webpack_require__(40);

	var _tooltip = __webpack_require__(105);

	var _tooltip2 = _interopRequireDefault(_tooltip);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BubbleTheme = function (_BaseTheme) {
	  _inherits(BubbleTheme, _BaseTheme);

	  function BubbleTheme(quill, options) {
	    _classCallCheck(this, BubbleTheme);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BubbleTheme).call(this, quill, options));

	    _this.quill.container.classList.add('ql-bubble');
	    return _this;
	  }

	  _createClass(BubbleTheme, [{
	    key: 'extendToolbar',
	    value: function extendToolbar(toolbar) {
	      this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
	      this.tooltip.root.appendChild(toolbar.container);
	      this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')));
	      this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')));
	    }
	  }]);

	  return BubbleTheme;
	}(_base2.default);

	BubbleTheme.DEFAULTS = {
	  modules: {
	    toolbar: {
	      container: [['bold', 'italic', 'link'], [{ header: 1 }, { header: 2 }, 'blockquote']],
	      handlers: {
	        formula: function formula(value) {
	          this.quill.theme.tooltip.edit('formula');
	        },
	        link: function link(value) {
	          if (!value) {
	            this.quill.format('link', false);
	          } else {
	            this.quill.theme.tooltip.edit();
	          }
	        },
	        video: function video(value) {
	          this.quill.theme.tooltip.edit('video');
	        }
	      }
	    }
	  }
	};

	var BubbleTooltip = function (_Tooltip) {
	  _inherits(BubbleTooltip, _Tooltip);

	  function BubbleTooltip(quill, bounds) {
	    _classCallCheck(this, BubbleTooltip);

	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(BubbleTooltip).call(this, quill, bounds));

	    _this2.quill.on(_emitter2.default.events.SELECTION_CHANGE, function (range) {
	      if (range != null && range.length > 0) {
	        _this2.show();
	        // Lock our width so we will expand beyond our offsetParent boundaries
	        _this2.root.style.left = '0px';
	        _this2.root.style.width = '';
	        _this2.root.style.width = _this2.root.offsetWidth + 'px';
	        var lines = _this2.quill.scroll.lines(range.index, range.length);
	        if (lines.length === 1) {
	          _this2.position(_this2.quill.getBounds(range));
	        } else {
	          var lastLine = lines[lines.length - 1];
	          var index = lastLine.offset(_this2.quill.scroll);
	          var length = Math.min(lastLine.length() - 1, range.index + range.length - index);
	          var _bounds = _this2.quill.getBounds(new _selection.Range(index, length));
	          _this2.position(_bounds);
	        }
	      } else if (document.activeElement !== _this2.textbox && _this2.quill.hasFocus()) {
	        _this2.hide();
	      }
	    });
	    return _this2;
	  }

	  _createClass(BubbleTooltip, [{
	    key: 'listen',
	    value: function listen() {
	      var _this3 = this;

	      _get(Object.getPrototypeOf(BubbleTooltip.prototype), 'listen', this).call(this);
	      this.root.querySelector('.ql-close').addEventListener('click', function (event) {
	        _this3.root.classList.remove('ql-editing');
	      });
	      this.quill.on(_emitter2.default.events.SCROLL_OPTIMIZE, function () {
	        // Let selection be restored by toolbar handlers before repositioning
	        setTimeout(function () {
	          if (_this3.root.classList.contains('ql-hidden')) return;
	          var range = _this3.quill.getSelection();
	          if (range != null) {
	            _this3.position(_this3.quill.getBounds(range));
	          }
	        }, 1);
	      });
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.show();
	    }
	  }, {
	    key: 'position',
	    value: function position(reference) {
	      var shift = _get(Object.getPrototypeOf(BubbleTooltip.prototype), 'position', this).call(this, reference);
	      if (shift === 0) return shift;
	      var arrow = this.root.querySelector('.ql-tooltip-arrow');
	      arrow.style.marginLeft = '';
	      arrow.style.marginLeft = -1 * shift - arrow.offsetWidth / 2 + 'px';
	    }
	  }]);

	  return BubbleTooltip;
	}(_tooltip2.default);

	BubbleTooltip.TEMPLATE = ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', '</div>'].join('');

	exports.default = BubbleTheme;

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _extend = __webpack_require__(26);

	var _extend2 = _interopRequireDefault(_extend);

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _theme = __webpack_require__(41);

	var _theme2 = _interopRequireDefault(_theme);

	var _colorPicker = __webpack_require__(103);

	var _colorPicker2 = _interopRequireDefault(_colorPicker);

	var _iconPicker = __webpack_require__(104);

	var _iconPicker2 = _interopRequireDefault(_iconPicker);

	var _picker = __webpack_require__(101);

	var _picker2 = _interopRequireDefault(_picker);

	var _icons = __webpack_require__(69);

	var _icons2 = _interopRequireDefault(_icons);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ALIGNS = [false, 'center', 'right', 'justify'];

	var COLORS = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008A00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];

	var FONTS = [false, 'serif', 'monospace'];

	var HEADERS = ['1', '2', '3', false];

	var SIZES = ['small', false, 'large', 'huge'];

	var BaseTheme = function (_Theme) {
	  _inherits(BaseTheme, _Theme);

	  function BaseTheme(quill, options) {
	    _classCallCheck(this, BaseTheme);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseTheme).call(this, quill, options));

	    _this.options.modules.toolbar = _this.options.modules.toolbar || {};
	    if (_this.options.modules.toolbar.constructor !== Object) {
	      _this.options.modules.toolbar = {
	        container: _this.options.modules.toolbar,
	        handlers: {}
	      };
	    }
	    _this.options.modules.toolbar.handlers = (0, _extend2.default)({}, BaseTheme.DEFAULTS.modules.toolbar.handlers, _this.constructor.DEFAULTS.modules.toolbar.handlers || {}, _this.options.modules.toolbar.handlers || {});
	    var listener = function listener(e) {
	      if (!document.body.contains(quill.root)) {
	        return document.body.removeEventListener('click', listener);
	      }
	      if (_this.tooltip != null && !_this.tooltip.root.contains(e.target) && document.activeElement !== _this.tooltip.textbox && !_this.quill.hasFocus()) {
	        _this.tooltip.hide();
	      }
	      if (_this.pickers != null) {
	        _this.pickers.forEach(function (picker) {
	          if (!picker.container.contains(e.target)) {
	            picker.close();
	          }
	        });
	      }
	    };
	    document.body.addEventListener('click', listener);
	    return _this;
	  }

	  _createClass(BaseTheme, [{
	    key: 'addModule',
	    value: function addModule(name) {
	      var module = _get(Object.getPrototypeOf(BaseTheme.prototype), 'addModule', this).call(this, name);
	      if (name === 'toolbar') {
	        this.extendToolbar(module);
	      }
	      return module;
	    }
	  }, {
	    key: 'buildButtons',
	    value: function buildButtons(buttons) {
	      buttons.forEach(function (button) {
	        var className = button.getAttribute('class') || '';
	        className.split(/\s+/).forEach(function (name) {
	          if (!name.startsWith('ql-')) return;
	          name = name.slice('ql-'.length);
	          if (_icons2.default[name] == null) return;
	          if (name === 'direction') {
	            button.innerHTML = _icons2.default[name][''] + _icons2.default[name]['rtl'];
	          } else if (typeof _icons2.default[name] === 'string') {
	            button.innerHTML = _icons2.default[name];
	          } else {
	            var value = button.value || '';
	            if (value != null && _icons2.default[name][value]) {
	              button.innerHTML = _icons2.default[name][value];
	            }
	          }
	        });
	      });
	    }
	  }, {
	    key: 'buildPickers',
	    value: function buildPickers(selects) {
	      var _this2 = this;

	      this.pickers = selects.map(function (select) {
	        if (select.classList.contains('ql-align')) {
	          if (select.querySelector('option') == null) {
	            fillSelect(select, ALIGNS);
	          }
	          return new _iconPicker2.default(select, _icons2.default.align);
	        } else if (select.classList.contains('ql-background') || select.classList.contains('ql-color')) {
	          var format = select.classList.contains('ql-background') ? 'background' : 'color';
	          if (select.querySelector('option') == null) {
	            fillSelect(select, COLORS, format === 'background' ? '#ffffff' : '#000000');
	          }
	          return new _colorPicker2.default(select, _icons2.default[format]);
	        } else {
	          if (select.querySelector('option') == null) {
	            if (select.classList.contains('ql-font')) {
	              fillSelect(select, FONTS);
	            } else if (select.classList.contains('ql-header')) {
	              fillSelect(select, HEADERS);
	            } else if (select.classList.contains('ql-size')) {
	              fillSelect(select, SIZES);
	            }
	          }
	          return new _picker2.default(select);
	        }
	      });
	      var update = function update() {
	        _this2.pickers.forEach(function (picker) {
	          picker.update();
	        });
	      };
	      this.quill.on(_emitter2.default.events.SELECTION_CHANGE, update).on(_emitter2.default.events.SCROLL_OPTIMIZE, update);
	    }
	  }]);

	  return BaseTheme;
	}(_theme2.default);

	BaseTheme.DEFAULTS = {
	  modules: {
	    toolbar: {
	      handlers: {
	        image: function image(value) {
	          var _this3 = this;

	          var fileInput = this.container.querySelector('input.ql-image[type=file]');
	          if (fileInput == null) {
	            fileInput = document.createElement('input');
	            fileInput.setAttribute('type', 'file');
	            fileInput.setAttribute('accept', 'image/*');
	            fileInput.classList.add('ql-image');
	            fileInput.addEventListener('change', function () {
	              if (fileInput.files != null && fileInput.files[0] != null) {
	                var reader = new FileReader();
	                reader.onload = function (e) {
	                  var range = _this3.quill.getSelection(true);
	                  _this3.quill.updateContents(new _delta2.default().retain(range.index).delete(range.length).insert({ image: e.target.result }), _emitter2.default.sources.USER);
	                  fileInput.value = "";
	                };
	                reader.readAsDataURL(fileInput.files[0]);
	              }
	            });
	            this.container.appendChild(fileInput);
	          }
	          fileInput.click();
	        }
	      }
	    }
	  }
	};

	function fillSelect(select, values) {
	  var defaultValue = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	  values.forEach(function (value) {
	    var option = document.createElement('option');
	    if (value === defaultValue) {
	      option.setAttribute('selected', 'selected');
	    } else {
	      option.setAttribute('value', value);
	    }
	    select.appendChild(option);
	  });
	}

	exports.default = BaseTheme;

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _base = __webpack_require__(107);

	var _base2 = _interopRequireDefault(_base);

	var _link = __webpack_require__(60);

	var _link2 = _interopRequireDefault(_link);

	var _picker = __webpack_require__(101);

	var _picker2 = _interopRequireDefault(_picker);

	var _selection = __webpack_require__(40);

	var _tooltip = __webpack_require__(105);

	var _tooltip2 = _interopRequireDefault(_tooltip);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SnowTheme = function (_BaseTheme) {
	  _inherits(SnowTheme, _BaseTheme);

	  function SnowTheme(quill, options) {
	    _classCallCheck(this, SnowTheme);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SnowTheme).call(this, quill, options));

	    _this.quill.container.classList.add('ql-snow');
	    return _this;
	  }

	  _createClass(SnowTheme, [{
	    key: 'extendToolbar',
	    value: function extendToolbar(toolbar) {
	      toolbar.container.classList.add('ql-snow');
	      this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')));
	      this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')));
	      this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
	      if (toolbar.container.querySelector('.ql-link')) {
	        this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, function (range, context) {
	          toolbar.handlers['link'].call(toolbar, !context.format.link);
	        });
	      }
	    }
	  }]);

	  return SnowTheme;
	}(_base2.default);

	SnowTheme.DEFAULTS = {
	  modules: {
	    toolbar: {
	      container: [[{ header: ['1', '2', '3', false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
	      handlers: {
	        formula: function formula(value) {
	          this.quill.theme.tooltip.edit('formula');
	        },
	        link: function link(value) {
	          if (value) {
	            var range = this.quill.getSelection();
	            if (range == null || range.length == 0) return;
	            var preview = this.quill.getText(range);
	            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
	              preview = 'mailto:' + preview;
	            }
	            var tooltip = this.quill.theme.tooltip;
	            tooltip.edit('link', preview);
	          } else {
	            this.quill.format('link', false);
	          }
	        },
	        video: function video(value) {
	          this.quill.theme.tooltip.edit('video');
	        }
	      }
	    }
	  }
	};

	var SnowTooltip = function (_Tooltip) {
	  _inherits(SnowTooltip, _Tooltip);

	  function SnowTooltip(quill, bounds) {
	    _classCallCheck(this, SnowTooltip);

	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(SnowTooltip).call(this, quill, bounds));

	    _this2.preview = _this2.root.querySelector('a.ql-preview');
	    return _this2;
	  }

	  _createClass(SnowTooltip, [{
	    key: 'listen',
	    value: function listen() {
	      var _this3 = this;

	      _get(Object.getPrototypeOf(SnowTooltip.prototype), 'listen', this).call(this);
	      this.root.querySelector('a.ql-action').addEventListener('click', function (event) {
	        if (_this3.root.classList.contains('ql-editing')) {
	          _this3.save();
	        } else {
	          _this3.edit('link', _this3.preview.textContent);
	        }
	      });
	      this.root.querySelector('a.ql-remove').addEventListener('click', function (event) {
	        if (_this3.linkRange != null) {
	          _this3.quill.focus();
	          _this3.quill.formatText(_this3.linkRange, 'link', false, _emitter2.default.sources.USER);
	          delete _this3.linkRange;
	        }
	        _this3.hide();
	      });
	      this.quill.on(_emitter2.default.events.SELECTION_CHANGE, function (range) {
	        if (range == null) return;
	        if (range.length === 0) {
	          var _quill$scroll$descend = _this3.quill.scroll.descendant(_link2.default, range.index);

	          var _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2);

	          var link = _quill$scroll$descend2[0];
	          var offset = _quill$scroll$descend2[1];

	          if (link != null) {
	            _this3.linkRange = new _selection.Range(range.index - offset, link.length());
	            var preview = _link2.default.formats(link.domNode);
	            _this3.preview.textContent = preview;
	            _this3.preview.setAttribute('href', preview);
	            _this3.show();
	            _this3.position(_this3.quill.getBounds(_this3.linkRange));
	            return;
	          }
	        }
	        _this3.hide();
	      });
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      _get(Object.getPrototypeOf(SnowTooltip.prototype), 'show', this).call(this);
	      if (this.root.dataset.mode) {
	        delete this.root.dataset.mode;
	      }
	    }
	  }]);

	  return SnowTooltip;
	}(_tooltip2.default);

	SnowTooltip.TEMPLATE = ['<a class="ql-preview" target="_blank" href="about:blank"></a>', '<input type="text" data-formula-holder="e=mc^2" data-link-holder="quilljs.com" data-video-holder="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join('');

	exports.default = SnowTheme;

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _selection = __webpack_require__(40);

	var _selection2 = _interopRequireDefault(_selection);

	var _scroll = __webpack_require__(44);

	var _scroll2 = _interopRequireDefault(_scroll);

	var _quill = __webpack_require__(19);

	var _quill2 = _interopRequireDefault(_quill);

	var _deepEqual = __webpack_require__(23);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var div = document.createElement('div');
	div.id = 'test-container';
	document.body.appendChild(div);

	beforeEach(function () {
	  jasmine.addMatchers({
	    toEqualHTML: function toEqualHTML() {
	      return { compare: compareHTML };
	    },
	    toBeApproximately: function toBeApproximately() {
	      return { compare: compareApproximately };
	    }
	  });

	  div.innerHTML = '<div></div>';
	  this.container = div.firstChild;
	  this.initialize = initialize.bind(this);
	});

	function compareApproximately(actual, expected, tolerance) {
	  var pass = Math.abs(actual - expected) <= tolerance;
	  return {
	    pass: pass,
	    message: actual + ' is ' + (pass ? '' : 'not') + ' approximately ' + expected
	  };
	}

	function compareHTML(actual, expected, ignoreClassId) {
	  var _map = [actual, expected].map(function (html) {
	    if (html instanceof HTMLElement) {
	      html = html.innerHTML;
	    }
	    var div = document.createElement('div');
	    div.innerHTML = html.replace(/\n\s*/g, '');
	    return div;
	  });

	  var _map2 = _slicedToArray(_map, 2);

	  var div1 = _map2[0];
	  var div2 = _map2[1];

	  var ignoredAttributes = ['width', 'height'];
	  if (ignoreClassId) {
	    ignoredAttributes = ignoredAttributes.concat(['class', 'id']);
	  }
	  var message = compareNodes(div1, div2, ignoredAttributes);
	  if (message != null) {
	    console.error(div1.innerHTML);
	    console.error(div2.innerHTML);
	    return { pass: false, message: message };
	  } else {
	    return { pass: true, message: 'HTMLs equal' };
	  }
	}

	function compareNodes(node1, node2) {
	  var ignoredAttributes = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

	  var attr1 = void 0,
	      attr2 = void 0,
	      message = void 0,
	      ref = void 0;
	  if (node1.nodeType !== node2.nodeType) {
	    return 'Expected nodeType \'' + node1.nodeType + '\' to equal \'' + node2.nodeType + '\'';
	  }
	  if (node1.nodeType === node1.ELEMENT_NODE) {
	    var _ret = function () {
	      if (node1.tagName !== node2.tagName) {
	        return {
	          v: 'Expected tagName \'' + node1.tagName + '\' to equal \'' + node2.tagName + '\''
	        };
	      }

	      var _map3 = [node1, node2].map(function (node) {
	        return [].reduce.call(node.attributes || {}, function (attr, elem) {
	          if (ignoredAttributes.indexOf(elem.name) < 0) {
	            attr[elem.name] = elem.name === 'style' ? elem.value.trim() : elem.value;
	          }
	          return attr;
	        }, {});
	      });

	      var _map4 = _slicedToArray(_map3, 2);

	      var attr1 = _map4[0];
	      var attr2 = _map4[1];

	      if (!(0, _deepEqual2.default)(attr1, attr2)) {
	        return {
	          v: 'Expected attributes ' + jasmine.pp(attr1) + ' to equal ' + jasmine.pp(attr2)
	        };
	      }
	      if (node1.childNodes.length !== node2.childNodes.length) {
	        return {
	          v: 'Expected node childNodes length \'' + node1.childNodes.length + '\' to equal \'' + node2.childNodes.length + '\''
	        };
	      }
	      if (node1.childNodes.length === 0) return {
	          v: null
	        };
	      var message = '';
	      if ([].some.call(node1.childNodes, function (child1, i) {
	        message = compareNodes(child1, node2.childNodes[i], ignoredAttributes);
	        return message;
	      })) {
	        return {
	          v: message
	        };
	      }
	    }();

	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  } else if (node1.data !== node2.data) {
	    return 'Expected node text \'' + node1.data + '\' to equal \'' + node2.data + '\'';
	  }
	  return null;
	}

	function initialize(klass, html) {
	  var container = arguments.length <= 2 || arguments[2] === undefined ? this.container : arguments[2];

	  if ((typeof html === 'undefined' ? 'undefined' : _typeof(html)) === 'object') {
	    container.innerHTML = html.html;
	  } else {
	    container.innerHTML = html.replace(/\n\s*/g, '');
	  }
	  if (klass === HTMLElement) return container;
	  if (klass === _quill2.default) return new _quill2.default(container);
	  var emitter = new _emitter2.default();
	  var scroll = new _scroll2.default(container, { emitter: emitter });
	  if (klass === _scroll2.default) return scroll;
	  var editor = new _editor2.default(scroll, emitter);
	  if (klass === _editor2.default) return editor;
	  var selection = new _selection2.default(scroll, emitter);
	  if (klass === _selection2.default) return selection;
	  if (klass[0] === _editor2.default && klass[1] === _selection2.default) return [editor, selection];
	}

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _selection = __webpack_require__(40);

	var _selection2 = _interopRequireDefault(_selection);

	var _cursor = __webpack_require__(43);

	var _cursor2 = _interopRequireDefault(_cursor);

	var _scroll = __webpack_require__(44);

	var _scroll2 = _interopRequireDefault(_scroll);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Scroll', function () {
	  it('initialize empty document', function () {
	    var scroll = this.initialize(_scroll2.default, '');
	    expect(scroll.domNode).toEqualHTML('<p><br></p>');
	  });

	  it('api change', function () {
	    var scroll = this.initialize(_scroll2.default, '<p>Hello World!</p>');
	    spyOn(scroll.emitter, 'emit').and.callThrough();
	    scroll.insertAt(5, '!');
	    expect(scroll.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.SCROLL_OPTIMIZE, jasmine.any(Array));
	  });

	  it('user change', function (done) {
	    var scroll = this.initialize(_scroll2.default, '<p>Hello World!</p>');
	    spyOn(scroll.emitter, 'emit').and.callThrough();
	    scroll.domNode.firstChild.appendChild(document.createTextNode('!'));
	    setTimeout(function () {
	      expect(scroll.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.SCROLL_OPTIMIZE, jasmine.any(Array));
	      expect(scroll.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.SCROLL_UPDATE, _emitter2.default.sources.USER, jasmine.any(Array));
	      done();
	    }, 1);
	  });

	  it('whitelist', function () {
	    var scroll = _parchment2.default.create('scroll', { emitter: new _emitter2.default(), whitelist: ['bold'] });
	    scroll.insertAt(0, 'Hello World!');
	    scroll.formatAt(0, 5, 'bold', true);
	    scroll.formatAt(6, 5, 'italic', true);
	    expect(scroll.domNode.firstChild).toEqualHTML('<strong>Hello</strong> World!');
	  });

	  describe('leaf()', function () {
	    it('text', function () {
	      var scroll = this.initialize(_scroll2.default, '<p>Tests</p>');

	      var _scroll$leaf = scroll.leaf(2);

	      var _scroll$leaf2 = _slicedToArray(_scroll$leaf, 2);

	      var leaf = _scroll$leaf2[0];
	      var offset = _scroll$leaf2[1];

	      expect(leaf.value()).toEqual('Tests');
	      expect(offset).toEqual(2);
	    });

	    it('precise', function () {
	      var scroll = this.initialize(_scroll2.default, '<p><u>0</u><s>1</s><u>2</u><s>3</s><u>4</u></p>');

	      var _scroll$leaf3 = scroll.leaf(3);

	      var _scroll$leaf4 = _slicedToArray(_scroll$leaf3, 2);

	      var leaf = _scroll$leaf4[0];
	      var offset = _scroll$leaf4[1];

	      expect(leaf.value()).toEqual('2');
	      expect(offset).toEqual(1);
	    });

	    it('newline', function () {
	      var scroll = this.initialize(_scroll2.default, '<p>0123</p><p>5678</p>');

	      var _scroll$leaf5 = scroll.leaf(4);

	      var _scroll$leaf6 = _slicedToArray(_scroll$leaf5, 2);

	      var leaf = _scroll$leaf6[0];
	      var offset = _scroll$leaf6[1];

	      expect(leaf.value()).toEqual('0123');
	      expect(offset).toEqual(4);
	    });

	    it('cursor', function () {
	      var selection = this.initialize(_selection2.default, '<p><u>0</u>1<u>2</u></p>');
	      selection.setRange(new _selection.Range(2));
	      selection.format('strike', true);

	      var _selection$scroll$lea = selection.scroll.leaf(2);

	      var _selection$scroll$lea2 = _slicedToArray(_selection$scroll$lea, 2);

	      var leaf = _selection$scroll$lea2[0];
	      var offset = _selection$scroll$lea2[1];

	      expect(leaf instanceof _cursor2.default).toBe(true);
	      expect(offset).toEqual(0);
	    });

	    it('beyond document', function () {
	      var scroll = this.initialize(_scroll2.default, '<p>Test</p>');

	      var _scroll$leaf7 = scroll.leaf(10);

	      var _scroll$leaf8 = _slicedToArray(_scroll$leaf7, 2);

	      var leaf = _scroll$leaf8[0];
	      var offset = _scroll$leaf8[1];

	      expect(leaf).toEqual(null);
	      expect(offset).toEqual(-1);
	    });
	  });
	});

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _scroll = __webpack_require__(44);

	var _scroll2 = _interopRequireDefault(_scroll);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Block', function () {
	  it('childless', function () {
	    var block = _parchment2.default.create('block');
	    block.optimize();
	    expect(block.domNode).toEqualHTML('<br>');
	  });

	  it('insert into empty', function () {
	    var block = _parchment2.default.create('block');
	    block.insertAt(0, 'Test');
	    expect(block.domNode).toEqualHTML('Test');
	  });

	  it('insert newlines', function () {
	    var scroll = this.initialize(_scroll2.default, '<p><br></p>');
	    scroll.insertAt(0, '\n\n\n');
	    expect(scroll.domNode).toEqualHTML('<p><br></p><p><br></p><p><br></p><p><br></p>');
	  });

	  it('insert multiline', function () {
	    var scroll = this.initialize(_scroll2.default, '<p>Hello World!</p>');
	    scroll.insertAt(6, 'pardon\nthis\n\ninterruption\n');
	    expect(scroll.domNode).toEqualHTML('\n      <p>Hello pardon</p>\n      <p>this</p>\n      <p><br></p>\n      <p>interruption</p>\n      <p>World!</p>\n    ');
	  });

	  it('insert into formatted', function () {
	    var scroll = this.initialize(_scroll2.default, '<h1>Welcome</h1>');
	    scroll.insertAt(3, 'l\n');
	    expect(scroll.domNode.firstChild.outerHTML).toEqualHTML('<h1>Well</h1>');
	    expect(scroll.domNode.childNodes[1].outerHTML).toEqualHTML('<h1>come</h1>');
	  });

	  it('delete line contents', function () {
	    var scroll = this.initialize(_scroll2.default, '<p>Hello</p><p>World!</p>');
	    scroll.deleteAt(0, 5);
	    expect(scroll.domNode).toEqualHTML('<p><br></p><p>World!</p>');
	  });

	  it('join lines', function () {
	    var scroll = this.initialize(_scroll2.default, '<h1>Hello</h1><h2>World!</h2>');
	    scroll.deleteAt(5, 1);
	    expect(scroll.domNode).toEqualHTML('<h1>HelloWorld!</h1>');
	  });

	  it('join empty lines', function () {
	    var scroll = this.initialize(_scroll2.default, '<h1><br></h1><p><br></p>');
	    scroll.deleteAt(1, 1);
	    expect(scroll.domNode).toEqualHTML('<h1><br></h1>');
	  });

	  it('format empty', function () {
	    var scroll = this.initialize(_scroll2.default, '<p><br></p>');
	    scroll.formatAt(0, 1, 'header', 1);
	    expect(scroll.domNode).toEqualHTML('<h1><br></h1>');
	  });

	  it('format newline', function () {
	    var scroll = this.initialize(_scroll2.default, '<h1>Hello</h1>');
	    scroll.formatAt(5, 1, 'header', 2);
	    expect(scroll.domNode).toEqualHTML('<h2>Hello</h2>');
	  });
	});

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _scroll = __webpack_require__(44);

	var _scroll2 = _interopRequireDefault(_scroll);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Block Embed', function () {
	  it('insert', function () {
	    var scroll = this.initialize(_scroll2.default, '<p>0123</p>');
	    scroll.insertAt(2, 'video', '#');
	    expect(scroll.domNode).toEqualHTML('\n      <p>01</p>\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n      <p>23</p>\n    ');
	  });

	  it('split newline', function () {
	    var scroll = this.initialize(_scroll2.default, '<p>0123</p>');
	    scroll.insertAt(4, 'video', '#');
	    expect(scroll.domNode).toEqualHTML('\n      <p>0123</p>\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n      <p><br></p>\n    ');
	  });

	  it('insert end of document', function () {
	    var scroll = this.initialize(_scroll2.default, '<p>0123</p>');
	    scroll.insertAt(5, 'video', '#');
	    expect(scroll.domNode).toEqualHTML('\n      <p>0123</p>\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n    ');
	  });

	  it('insert text before', function () {
	    var scroll = this.initialize(_scroll2.default, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
	    scroll.insertAt(0, 'Test');
	    expect(scroll.domNode).toEqualHTML('\n      <p>Test</p>\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n    ');
	  });

	  it('insert text after', function () {
	    var scroll = this.initialize(_scroll2.default, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
	    scroll.insertAt(1, 'Test');
	    expect(scroll.domNode).toEqualHTML('\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n      <p>Test</p>\n    ');
	  });

	  it('insert inline embed before', function () {
	    var scroll = this.initialize(_scroll2.default, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
	    scroll.insertAt(0, 'image', '/assets/favicon.png');
	    expect(scroll.domNode).toEqualHTML('\n      <p><img src="/assets/favicon.png"></p>\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n    ');
	  });

	  it('insert inline embed after', function () {
	    var scroll = this.initialize(_scroll2.default, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
	    scroll.insertAt(1, 'image', '/assets/favicon.png');
	    expect(scroll.domNode).toEqualHTML('\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n      <p><img src="/assets/favicon.png"></p>\n    ');
	  });

	  it('insert block embed before', function () {
	    var scroll = this.initialize(_scroll2.default, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
	    scroll.insertAt(0, 'video', '#1');
	    expect(scroll.domNode).toEqualHTML('\n      <iframe src="#1" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n    ');
	  });

	  it('insert block embed after', function () {
	    var scroll = this.initialize(_scroll2.default, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
	    scroll.insertAt(1, 'video', '#1');
	    expect(scroll.domNode).toEqualHTML('\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n      <iframe src="#1" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n    ');
	  });

	  it('insert newline before', function () {
	    var scroll = this.initialize(_scroll2.default, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
	    scroll.insertAt(0, '\n');
	    scroll.optimize();
	    expect(scroll.domNode).toEqualHTML('\n      <p><br></p>\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n    ');
	  });

	  it('insert newline after', function () {
	    var scroll = this.initialize(_scroll2.default, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
	    scroll.insertAt(1, '\n');
	    scroll.optimize();
	    expect(scroll.domNode).toEqualHTML('\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n      <p><br></p>\n    ');
	  });

	  it('delete preceding newline', function () {
	    var scroll = this.initialize(_scroll2.default, '<p>0123</p><iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
	    scroll.deleteAt(4, 1);
	    expect(scroll.domNode).toEqualHTML('\n      <p>0123</p>\n      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>\n    ');
	  });
	});

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _scroll = __webpack_require__(44);

	var _scroll2 = _interopRequireDefault(_scroll);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Inline', function () {
	  it('format order', function () {
	    var scroll = this.initialize(_scroll2.default, '<p>Hello World!</p>');
	    scroll.formatAt(0, 1, 'bold', true);
	    scroll.formatAt(0, 1, 'italic', true);
	    scroll.formatAt(2, 1, 'italic', true);
	    scroll.formatAt(2, 1, 'bold', true);
	    expect(scroll.domNode).toEqualHTML('<p><strong><em>H</em></strong>e<strong><em>l</em></strong>lo World!</p>');
	  });
	});

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _selection = __webpack_require__(40);

	var _selection2 = _interopRequireDefault(_selection);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Editor', function () {
	  describe('insert', function () {
	    it('text', function () {
	      var editor = this.initialize(_editor2.default, '<p><strong>0123</strong></p>');
	      editor.insertText(2, '!!');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('01!!23', { bold: true }).insert('\n'));
	      expect(this.container).toEqualHTML('<p><strong>01!!23</strong></p>');
	    });

	    it('embed', function () {
	      var editor = this.initialize(_editor2.default, '<p><strong>0123</strong></p>');
	      editor.insertEmbed(2, 'image', '/assets/favicon.png');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('01', { bold: true }).insert({ image: '/assets/favicon.png' }, { bold: true }).insert('23', { bold: true }).insert('\n'));
	      expect(this.container).toEqualHTML('<p><strong>01<img src="/assets/favicon.png">23</strong></p>');
	    });

	    it('on empty line', function () {
	      var editor = this.initialize(_editor2.default, '<p>0</p><p><br></p><p>3</p>');
	      editor.insertText(2, '!');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('0\n!\n3\n'));
	      expect(this.container).toEqualHTML('<p>0</p><p>!</p><p>3</p>');
	    });

	    it('end of document', function () {
	      var editor = this.initialize(_editor2.default, '<p>Hello</p>');
	      editor.insertText(6, 'World!');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('Hello\nWorld!\n'));
	      expect(this.container).toEqualHTML('<p>Hello</p><p>World!</p>');
	    });

	    it('end of document with newline', function () {
	      var editor = this.initialize(_editor2.default, '<p>Hello</p>');
	      editor.insertText(6, 'World!\n');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('Hello\nWorld!\n'));
	      expect(this.container).toEqualHTML('<p>Hello</p><p>World!</p>');
	    });

	    it('embed at end of document with newline', function () {
	      var editor = this.initialize(_editor2.default, '<p>Hello</p>');
	      editor.insertEmbed(6, 'image', '/assets/favicon.png');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('Hello\n').insert({ image: '/assets/favicon.png' }).insert('\n'));
	      expect(this.container).toEqualHTML('<p>Hello</p><p><img src="/assets/favicon.png"></p>');
	    });

	    it('newline splitting', function () {
	      var editor = this.initialize(_editor2.default, '<p><strong>0123</strong></p>');
	      editor.insertText(2, '\n');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('01', { bold: true }).insert('\n').insert('23', { bold: true }).insert('\n'));
	      expect(this.container).toEqualHTML('\n        <p><strong>01</strong></p>\n        <p><strong>23</strong></p>');
	    });

	    it('prepend newline', function () {
	      var editor = this.initialize(_editor2.default, '<p><strong>0123</strong></p>');
	      editor.insertText(0, '\n');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('\n').insert('0123', { bold: true }).insert('\n'));
	      expect(this.container).toEqualHTML('\n        <p><br></p>\n        <p><strong>0123</strong></p>');
	    });

	    it('append newline', function () {
	      var editor = this.initialize(_editor2.default, '<p><strong>0123</strong></p>');
	      editor.insertText(4, '\n');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123', { bold: true }).insert('\n\n'));
	      expect(this.container).toEqualHTML('\n        <p><strong>0123</strong></p>\n        <p><br></p>');
	    });

	    it('multiline text', function () {
	      var editor = this.initialize(_editor2.default, '<p><strong>0123</strong></p>');
	      editor.insertText(2, '\n!!\n!!\n');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('01', { bold: true }).insert('\n').insert('!!', { bold: true }).insert('\n').insert('!!', { bold: true }).insert('\n').insert('23', { bold: true }).insert('\n'));
	      expect(this.container).toEqualHTML('\n        <p><strong>01</strong></p>\n        <p><strong>!!</strong></p>\n        <p><strong>!!</strong></p>\n        <p><strong>23</strong></p>');
	    });

	    it('multiple newlines', function () {
	      var editor = this.initialize(_editor2.default, '<p><strong>0123</strong></p>');
	      editor.insertText(2, '\n\n');
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('01', { bold: true }).insert('\n\n').insert('23', { bold: true }).insert('\n'));
	      expect(this.container).toEqualHTML('\n        <p><strong>01</strong></p>\n        <p><br></p>\n        <p><strong>23</strong></p>');
	    });

	    it('text removing formatting', function () {
	      var editor = this.initialize(_editor2.default, '<p><s>01</s></p>');
	      editor.insertText(2, '23', { bold: false, strike: false });
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('01', { strike: true }).insert('23\n'));
	    });
	  });

	  describe('delete', function () {
	    it('inner node', function () {
	      var editor = this.initialize(_editor2.default, '<p><strong><em>0123</em></strong></p>');
	      editor.deleteText(1, 2);
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('03', { bold: true, italic: true }).insert('\n'));
	      expect(this.container).toEqualHTML('<p><strong><em>03</em></strong></p>');
	    });

	    it('parts of multiple lines', function () {
	      var editor = this.initialize(_editor2.default, '<p><em>0123</em></p><p><em>5678</em></p>');
	      editor.deleteText(2, 5);
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('0178', { italic: true }).insert('\n'));
	      expect(this.container).toEqualHTML('<p><em>0178</em></p>');
	    });

	    it('entire line keeping newline', function () {
	      var editor = this.initialize(_editor2.default, '<p><strong><em>0123</em></strong></p>');
	      editor.deleteText(0, 4);
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('\n'));
	      expect(this.container).toEqualHTML('<p><br></p>');
	    });

	    it('newline', function () {
	      var editor = this.initialize(_editor2.default, '<p><em>0123</em></p><p><em>5678</em></p>');
	      editor.deleteText(4, 1);
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('01235678', { italic: true }).insert('\n'));
	      expect(this.container).toEqualHTML('<p><em>01235678</em></p>');
	    });

	    it('entire document', function () {
	      var editor = this.initialize(_editor2.default, '<p><strong><em>0123</em></strong></p>');
	      editor.deleteText(0, 5);
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('\n'));
	      expect(this.container).toEqualHTML('<p><br></p>');
	    });

	    it('multiple complete lines', function () {
	      var editor = this.initialize(_editor2.default, '<p><em>012</em></p><p><em>456</em></p><p><em>890</em></p>');
	      editor.deleteText(0, 8);
	      expect(editor.getDelta()).toEqual(new _delta2.default().insert('890', { italic: true }).insert('\n'));
	      expect(this.container).toEqualHTML('<p><em>890</em></p>');
	    });
	  });

	  describe('format', function () {
	    it('line', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      editor.formatLine(1, 1, { header: 1 });
	      expect(editor.scroll.domNode).toEqualHTML('<h1>0123</h1>');
	    });
	  });

	  describe('removeFormat', function () {
	    it('unwrap', function () {
	      var editor = this.initialize(_editor2.default, '<p>0<em>12</em>3</p>');
	      editor.removeFormat(1, 2);
	      expect(this.container).toEqualHTML('<p>0123</p>');
	    });

	    it('split inline', function () {
	      var editor = this.initialize(_editor2.default, '<p>0<strong><em>12</em></strong>3</p>');
	      editor.removeFormat(1, 1);
	      expect(this.container).toEqualHTML('<p>01<strong><em>2</em></strong>3</p>');
	    });

	    it('partial line', function () {
	      var editor = this.initialize(_editor2.default, '<ul><li>01</li></ul><ol><li>34</li></ol>');
	      editor.removeFormat(1, 3);
	      expect(this.container).toEqualHTML('<p>01</p><p>34</p>');
	    });

	    it('remove embed', function () {
	      var editor = this.initialize(_editor2.default, '<p>0<img src="/assets/favicon.png">2</p>');
	      editor.removeFormat(1, 1);
	      expect(this.container).toEqualHTML('<p>02</p>');
	    });

	    it('combined', function () {
	      var editor = this.initialize(_editor2.default, '\n        <ul>\n          <li>01<img src="/assets/favicon.png">3</li>\n        </ul>\n        <ol>\n          <li>5<strong>6<em>78</em>9</strong>0</li>\n        </ol>\n      ');
	      editor.removeFormat(1, 7);
	      expect(this.container).toEqualHTML('\n        <p>013</p>\n        <p>567<strong><em>8</em>9</strong>0</p>\n      ');
	    });

	    it('end of document', function () {
	      var editor = this.initialize(_editor2.default, '\n        <ul>\n          <li>0123</li>\n          <li>5678</li>\n        </ol>\n      ');
	      editor.removeFormat(0, 12);
	      expect(this.container).toEqualHTML('\n        <p>0123</p>\n        <p>5678</p>\n      ');
	    });
	  });

	  describe('applyDelta', function () {
	    it('insert', function () {
	      var editor = this.initialize(_editor2.default, '<p></p>');
	      editor.applyDelta(new _delta2.default().insert('01'));
	      expect(this.container).toEqualHTML('<p>01</p>');
	    });

	    it('attributed insert', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      editor.applyDelta(new _delta2.default().retain(2).insert('|', { bold: true }));
	      expect(this.container).toEqualHTML('<p>01<strong>|</strong>23</p>');
	    });

	    it('format', function () {
	      var editor = this.initialize(_editor2.default, '<p>01</p>');
	      editor.applyDelta(new _delta2.default().retain(2, { bold: true }));
	      expect(this.container).toEqualHTML('<p><strong>01</strong></p>');
	    });

	    it('discontinuous formats', function () {
	      var editor = this.initialize(_editor2.default, '');
	      var delta = new _delta2.default().insert('ab', { bold: true }).insert('23\n45').insert('cd', { bold: true });
	      editor.applyDelta(delta);
	      expect(this.container).toEqualHTML('<p><strong>ab</strong>23</p><p>45<strong>cd</strong></p>');
	    });

	    it('unformatted insert', function () {
	      var editor = this.initialize(_editor2.default, '<p><em>01</em></p>');
	      editor.applyDelta(new _delta2.default().retain(1).insert('|'));
	      expect(this.container).toEqualHTML('<p><em>0</em>|<em>1</em></p>');
	    });

	    it('insert at format boundary', function () {
	      var editor = this.initialize(_editor2.default, '<p><em>0</em><u>1</u></p>');
	      editor.applyDelta(new _delta2.default().retain(1).insert('|', { strike: true }));
	      expect(this.container).toEqualHTML('<p><em>0</em><s>|</s><u>1</u></p>');
	    });

	    it('unformatted newline', function () {
	      var editor = this.initialize(_editor2.default, '<h1>01</h1>');
	      editor.applyDelta(new _delta2.default().retain(2).insert('\n'));
	      expect(this.container).toEqualHTML('<p>01</p><h1><br></h1>');
	    });

	    it('formatted embed', function () {
	      var editor = this.initialize(_editor2.default, '');
	      editor.applyDelta(new _delta2.default().insert({ image: '/assets/favicon.png' }, { italic: true }));
	      expect(this.container).toEqualHTML('<p><em><img src="/assets/favicon.png"></em>');
	    });

	    it('old embed', function () {
	      var editor = this.initialize(_editor2.default, '');
	      editor.applyDelta(new _delta2.default().insert(1, { image: '/assets/favicon.png', italic: true }));
	      expect(this.container).toEqualHTML('<p><em><img src="/assets/favicon.png"></em>');
	    });

	    it('old list', function () {
	      var editor = this.initialize(_editor2.default, '');
	      editor.applyDelta(new _delta2.default().insert('\n', { bullet: true }).insert('\n', { list: true }));
	      expect(this.container).toEqualHTML('<ul><li><br></li></ul><ol><li><br></li></ol><p><br></p>');
	    });

	    it('improper block embed insert', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      editor.applyDelta(new _delta2.default().retain(2).insert({ video: '#' }));
	      expect(this.container).toEqualHTML('<p>01</p><iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe><p>23</p>');
	    });

	    it('append formatted block embed', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p><p><br></p>');
	      editor.applyDelta(new _delta2.default().retain(5).insert({ video: '#' }, { align: 'right' }));
	      expect(this.container).toEqualHTML('<p>0123</p><iframe src="#" class="ql-video ql-align-right" frameborder="0" allowfullscreen="true"></iframe><p><br></p>');
	    });

	    it('append', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      editor.applyDelta(new _delta2.default().retain(5).insert('5678'));
	      expect(this.container).toEqualHTML('<p>0123</p><p>5678</p>');
	    });

	    it('append newline', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      editor.applyDelta(new _delta2.default().retain(5).insert('\n', { header: 2 }));
	      expect(this.container).toEqualHTML('<p>0123</p><h2><br></h2>');
	    });

	    it('append text with newline', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      editor.applyDelta(new _delta2.default().retain(5).insert('5678').insert('\n', { header: 2 }));
	      expect(this.container).toEqualHTML('<p>0123</p><h2>5678</h2>');
	    });

	    it('append non-isolated newline', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      editor.applyDelta(new _delta2.default().retain(5).insert('5678\n', { header: 2 }));
	      expect(this.container).toEqualHTML('<p>0123</p><h2>5678</h2>');
	    });

	    it('eventual append', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      editor.applyDelta(new _delta2.default().retain(2).insert('ab\n', { header: 1 }).retain(3).insert('cd\n', { header: 2 }));
	      expect(this.container).toEqualHTML('<h1>01ab</h1><p>23</p><h2>cd</h2>');
	    });

	    it('append text, embed and newline', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      editor.applyDelta(new _delta2.default().retain(5).insert('5678').insert({ image: '/assets/favicon.png' }).insert('\n', { header: 2 }));
	      expect(this.container).toEqualHTML('<p>0123</p><h2>5678<img src="/assets/favicon.png"></h2>');
	    });

	    it('append multiple lines', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      editor.applyDelta(new _delta2.default().retain(5).insert('56').insert('\n', { header: 1 }).insert('89').insert('\n', { header: 2 }));
	      expect(this.container).toEqualHTML('<p>0123</p><h1>56</h1><h2>89</h2>');
	    });
	  });

	  describe('getFormat()', function () {
	    it('unformatted', function () {
	      var editor = this.initialize(_editor2.default, '<p>0123</p>');
	      expect(editor.getFormat(1)).toEqual({});
	    });

	    it('formatted', function () {
	      var editor = this.initialize(_editor2.default, '<h1><em>0123</em></h1>');
	      expect(editor.getFormat(1)).toEqual({ header: 1, italic: true });
	    });

	    it('cursor', function () {
	      var editor = this.initialize(_editor2.default, '<h1><strong><em>0123</em></strong></h1><h2><u>5678</u></h2>');
	      expect(editor.getFormat(2)).toEqual({ bold: true, italic: true, header: 1 });
	    });

	    it('cursor with preformat', function () {
	      var _initialize = this.initialize([_editor2.default, _selection2.default], '<h1><strong><em>0123</em></strong></h1>');

	      var _initialize2 = _slicedToArray(_initialize, 2);

	      var editor = _initialize2[0];
	      var selection = _initialize2[1];

	      selection.setRange(new _selection.Range(2));
	      selection.format('underline', true);
	      selection.format('color', 'red');
	      expect(editor.getFormat(2)).toEqual({ bold: true, italic: true, header: 1, color: 'red', underline: true });
	    });

	    it('across leaves', function () {
	      var editor = this.initialize(_editor2.default, '\n        <h1>\n          <strong class="ql-size-small"><em>01</em></strong>\n          <em class="ql-size-large"><u>23</u></em>\n          <em class="ql-size-huge"><u>45</u></em>\n        </h1>\n      ');
	      expect(editor.getFormat(1, 4)).toEqual({ italic: true, header: 1, size: ['small', 'large', 'huge'] });
	    });

	    it('across lines', function () {
	      var editor = this.initialize(_editor2.default, '\n        <h1 class="ql-align-right"><em>01</em></h1>\n        <h1 class="ql-align-center"><em>34</em></h1>\n      ');
	      expect(editor.getFormat(1, 3)).toEqual({ italic: true, header: 1, align: ['right', 'center'] });
	    });
	  });

	  describe('events', function () {
	    beforeEach(function () {
	      this.editor = this.initialize(_editor2.default, '<p>0123</p>');
	      this.editor.update();
	      spyOn(this.editor.emitter, 'emit').and.callThrough();
	    });

	    it('api text insert', function () {
	      var old = this.editor.getDelta();
	      this.editor.insertText(2, '!');
	      var delta = new _delta2.default().retain(2).insert('!');
	      expect(this.editor.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, delta, old, _emitter2.default.sources.API);
	    });

	    it('user text insert', function (done) {
	      var _this = this;

	      var old = this.editor.getDelta();
	      this.container.firstChild.firstChild.data = '01!23';
	      var delta = new _delta2.default().retain(2).insert('!');
	      setTimeout(function () {
	        expect(_this.editor.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, delta, old, _emitter2.default.sources.USER);
	        done();
	      }, 1);
	    });
	  });
	});

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _selection = __webpack_require__(40);

	var _selection2 = _interopRequireDefault(_selection);

	var _cursor = __webpack_require__(43);

	var _cursor2 = _interopRequireDefault(_cursor);

	var _scroll = __webpack_require__(44);

	var _scroll2 = _interopRequireDefault(_scroll);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Selection', function () {
	  beforeEach(function () {
	    var _this = this;

	    this.setup = function (html, index) {
	      _this.selection = _this.initialize(_selection2.default, html);
	      _this.selection.setRange(new _selection.Range(index));
	    };
	  });

	  describe('focus()', function () {
	    beforeEach(function () {
	      this.initialize(HTMLElement, '<textarea>Test</textarea><div></div>');
	      this.selection = this.initialize(_selection2.default, '<p>0123</p>', this.container.lastChild);
	      this.textarea = this.container.querySelector('textarea');
	      this.textarea.focus();
	      this.textarea.select();
	    });

	    it('initial focus', function () {
	      expect(this.selection.hasFocus()).toBe(false);
	      this.selection.focus();
	      expect(this.selection.hasFocus()).toBe(true);
	    });

	    it('restore last range', function () {
	      var range = new _selection.Range(1, 2);
	      this.selection.setRange(range);
	      this.textarea.focus();
	      this.textarea.select();
	      expect(this.selection.hasFocus()).toBe(false);
	      this.selection.focus();
	      expect(this.selection.hasFocus()).toBe(true);
	      expect(this.selection.getRange()[0]).toEqual(range);
	    });
	  });

	  describe('getRange()', function () {
	    it('empty document', function () {
	      var selection = this.initialize(_selection2.default, '');
	      selection.setNativeRange(this.container.querySelector('br'), 0);

	      var _selection$getRange = selection.getRange();

	      var _selection$getRange2 = _slicedToArray(_selection$getRange, 1);

	      var range = _selection$getRange2[0];

	      expect(range.index).toEqual(0);
	      expect(range.length).toEqual(0);
	    });

	    it('empty line', function () {
	      var selection = this.initialize(_selection2.default, '<p>0</p><p><br></p><p>3</p>');
	      selection.setNativeRange(this.container.querySelector('br'), 0);

	      var _selection$getRange3 = selection.getRange();

	      var _selection$getRange4 = _slicedToArray(_selection$getRange3, 1);

	      var range = _selection$getRange4[0];

	      expect(range.index).toEqual(2);
	      expect(range.length).toEqual(0);
	    });

	    it('end of line', function () {
	      var selection = this.initialize(_selection2.default, '<p>0</p>');
	      selection.setNativeRange(this.container.firstChild.firstChild, 1);

	      var _selection$getRange5 = selection.getRange();

	      var _selection$getRange6 = _slicedToArray(_selection$getRange5, 1);

	      var range = _selection$getRange6[0];

	      expect(range.index).toEqual(1);
	      expect(range.length).toEqual(0);
	    });

	    it('text node', function () {
	      var selection = this.initialize(_selection2.default, '<p>0123</p>');
	      selection.setNativeRange(this.container.firstChild.firstChild, 1);

	      var _selection$getRange7 = selection.getRange();

	      var _selection$getRange8 = _slicedToArray(_selection$getRange7, 1);

	      var range = _selection$getRange8[0];

	      expect(range.index).toEqual(1);
	      expect(range.length).toEqual(0);
	    });

	    it('line boundaries', function () {
	      var selection = this.initialize(_selection2.default, '<p><br></p><p>12</p>');
	      selection.setNativeRange(this.container.firstChild, 0, this.container.lastChild.lastChild, 2);

	      var _selection$getRange9 = selection.getRange();

	      var _selection$getRange10 = _slicedToArray(_selection$getRange9, 1);

	      var range = _selection$getRange10[0];

	      expect(range.index).toEqual(0);
	      expect(range.length).toEqual(3);
	    });

	    it('nested text node', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p><strong><em>01</em></strong></p>\n        <ul>\n          <li><em><u>34</u></em></li>\n        </ul>');
	      selection.setNativeRange(this.container.querySelector('em').firstChild, 1, this.container.querySelector('u').firstChild, 1);

	      var _selection$getRange11 = selection.getRange();

	      var _selection$getRange12 = _slicedToArray(_selection$getRange11, 1);

	      var range = _selection$getRange12[0];

	      expect(range.index).toEqual(1);
	      expect(range.length).toEqual(3);
	    });

	    it('between embed', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p>\n          <img src="/assets/favicon.png">\n          <img src="/assets/favicon.png">\n        </p>\n        <ul>\n          <li>\n            <img src="/assets/favicon.png">\n            <img src="/assets/favicon.png">\n          </li>\n        </ul>');
	      selection.setNativeRange(this.container.firstChild, 1, this.container.lastChild.lastChild, 1);

	      var _selection$getRange13 = selection.getRange();

	      var _selection$getRange14 = _slicedToArray(_selection$getRange13, 1);

	      var range = _selection$getRange14[0];

	      expect(range.index).toEqual(1);
	      expect(range.length).toEqual(3);
	    });

	    it('between inlines', function () {
	      var selection = this.initialize(_selection2.default, '<p><em>01</em><s>23</s><u>45</u></p>');
	      selection.setNativeRange(this.container.firstChild, 1, this.container.firstChild, 2);

	      var _selection$getRange15 = selection.getRange();

	      var _selection$getRange16 = _slicedToArray(_selection$getRange15, 1);

	      var range = _selection$getRange16[0];

	      expect(range.index).toEqual(2);
	      expect(range.length).toEqual(2);
	    });

	    it('between blocks', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p>01</p>\n        <p><br></p>\n        <ul>\n          <li>45</li>\n          <li>78</li>\n        </ul>');
	      selection.setNativeRange(this.container, 1, this.container.lastChild, 1);

	      var _selection$getRange17 = selection.getRange();

	      var _selection$getRange18 = _slicedToArray(_selection$getRange17, 1);

	      var range = _selection$getRange18[0];

	      expect(range.index).toEqual(3);
	      expect(range.length).toEqual(4);
	    });

	    it('no focus', function () {
	      var selection = this.initialize(_selection2.default, '');

	      var _selection$getRange19 = selection.getRange();

	      var _selection$getRange20 = _slicedToArray(_selection$getRange19, 1);

	      var range = _selection$getRange20[0];

	      expect(range).toEqual(null);
	    });

	    it('wrong input', function () {
	      var container = this.initialize(HTMLElement, '\n        <textarea>Test</textarea>\n        <div></div>');
	      var selection = this.initialize(_selection2.default, '<p>0123</p>', container.lastChild);
	      container.firstChild.select();

	      var _selection$getRange21 = selection.getRange();

	      var _selection$getRange22 = _slicedToArray(_selection$getRange21, 1);

	      var range = _selection$getRange22[0];

	      expect(range).toEqual(null);
	    });
	  });

	  describe('setRange()', function () {
	    it('empty document', function () {
	      var selection = this.initialize(_selection2.default, '');
	      var expected = new _selection.Range(0);
	      selection.setRange(expected);

	      var _selection$getRange23 = selection.getRange();

	      var _selection$getRange24 = _slicedToArray(_selection$getRange23, 1);

	      var range = _selection$getRange24[0];

	      expect(range).toEqual(expected);
	      expect(selection.hasFocus()).toBe(true);
	    });

	    it('empty lines', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p><br></p>\n        <ul>\n          <li><br></li>\n        </ul>');
	      var expected = new _selection.Range(0, 1);
	      selection.setRange(expected);

	      var _selection$getRange25 = selection.getRange();

	      var _selection$getRange26 = _slicedToArray(_selection$getRange25, 1);

	      var range = _selection$getRange26[0];

	      expect(range).toEqual(range);
	      expect(selection.hasFocus()).toBe(true);
	    });

	    it('nested text node', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p><strong><em>01</em></strong></p>\n        <ul>\n          <li><em><u>34</u></em></li>\n        </ul>');
	      var expected = new _selection.Range(1, 3);
	      selection.setRange(expected);

	      var _selection$getRange27 = selection.getRange();

	      var _selection$getRange28 = _slicedToArray(_selection$getRange27, 1);

	      var range = _selection$getRange28[0];

	      expect(range).toEqual(expected);
	      expect(selection.hasFocus()).toBe(true);
	    });

	    it('between inlines', function () {
	      var selection = this.initialize(_selection2.default, '<p><em>01</em><s>23</s><u>45</u></p>');
	      var expected = new _selection.Range(2, 2);
	      selection.setRange(expected);

	      var _selection$getRange29 = selection.getRange();

	      var _selection$getRange30 = _slicedToArray(_selection$getRange29, 1);

	      var range = _selection$getRange30[0];

	      expect(range).toEqual(expected);
	      expect(selection.hasFocus()).toBe(true);
	    });

	    it('single embed', function () {
	      var selection = this.initialize(_selection2.default, '<p><img src="/assets/favicon.png"></p>');
	      var expected = new _selection.Range(1, 0);
	      selection.setRange(expected);

	      var _selection$getRange31 = selection.getRange();

	      var _selection$getRange32 = _slicedToArray(_selection$getRange31, 1);

	      var range = _selection$getRange32[0];

	      expect(range).toEqual(expected);
	      expect(selection.hasFocus()).toBe(true);
	    });

	    it('between embeds', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p>\n          <img src="/assets/favicon.png">\n          <img src="/assets/favicon.png">\n        </p>\n        <ul>\n          <li>\n            <img src="/assets/favicon.png">\n            <img src="/assets/favicon.png">\n          </li>\n        </ul>');
	      var expected = new _selection.Range(1, 3);
	      selection.setRange(expected);

	      var _selection$getRange33 = selection.getRange();

	      var _selection$getRange34 = _slicedToArray(_selection$getRange33, 1);

	      var range = _selection$getRange34[0];

	      expect(range).toEqual(expected);
	      expect(selection.hasFocus()).toBe(true);
	    });

	    it('null', function () {
	      var selection = this.initialize(_selection2.default, '<p>0123</p>');
	      selection.setRange(new _selection.Range(1));

	      var _selection$getRange35 = selection.getRange();

	      var _selection$getRange36 = _slicedToArray(_selection$getRange35, 1);

	      var range = _selection$getRange36[0];

	      expect(range).not.toEqual(null);
	      selection.setRange(null);

	      var _selection$getRange37 = selection.getRange();

	      var _selection$getRange38 = _slicedToArray(_selection$getRange37, 1);

	      range = _selection$getRange38[0];

	      expect(range).toEqual(null);
	      expect(selection.hasFocus()).toBe(false);
	    });
	  });

	  describe('format()', function () {
	    it('trailing', function () {
	      this.setup('<p>0123</p>', 4);
	      this.selection.format('bold', true);
	      expect(this.selection.getRange()[0].index).toEqual(4);
	      expect(this.container).toEqualHTML('\n        <p>0123<strong><span class="ql-cursor">' + _cursor2.default.CONTENTS + '</span></strong></p>\n      ');
	    });

	    it('split nodes', function () {
	      this.setup('<p><em>0123</em></p>', 2);
	      this.selection.format('bold', true);
	      expect(this.selection.getRange()[0].index).toEqual(2);
	      expect(this.container).toEqualHTML('\n        <p>\n          <em>01</em>\n          <strong><em><span class="ql-cursor">' + _cursor2.default.CONTENTS + '</span></em></strong>\n          <em>23</em>\n        </p>\n      ');
	    });

	    it('between characters', function () {
	      this.setup('<p><em>0</em><strong>1</strong></p>', 1);
	      this.selection.format('underline', true);
	      expect(this.selection.getRange()[0].index).toEqual(1);
	      expect(this.container).toEqualHTML('\n        <p><em>0<u><span class="ql-cursor">' + _cursor2.default.CONTENTS + '</span></u></em><strong>1</strong></p>\n      ');
	    });

	    it('empty line', function () {
	      this.setup('<p><br></p>', 0);
	      this.selection.format('bold', true);
	      expect(this.selection.getRange()[0].index).toEqual(0);
	      expect(this.container).toEqualHTML('\n        <p><strong><span class="ql-cursor">' + _cursor2.default.CONTENTS + '</span></strong></p>\n      ');
	    });

	    it('cursor interference', function () {
	      this.setup('<p>0123</p>', 2);
	      this.selection.format('underline', true);
	      this.selection.scroll.update();
	      var native = this.selection.getNativeRange();
	      expect(native.start.node).toEqual(this.selection.cursor.textNode);
	    });

	    it('multiple', function () {
	      this.setup('<p>0123</p>', 2);
	      this.selection.format('color', 'red');
	      this.selection.format('italic', true);
	      this.selection.format('underline', true);
	      this.selection.format('background', 'blue');
	      expect(this.selection.getRange()[0].index).toEqual(2);
	      expect(this.container).toEqualHTML('\n        <p>\n          01\n          <em style="color: red; background-color: blue;"><u>\n            <span class="ql-cursor">' + _cursor2.default.CONTENTS + '</span>\n          </u></em>\n          23\n        </p>\n      ');
	    });

	    it('remove format', function () {
	      this.setup('<p><strong>0123</strong></p>', 2);
	      this.selection.format('italic', true);
	      this.selection.format('underline', true);
	      this.selection.format('italic', false);
	      expect(this.selection.getRange()[0].index).toEqual(2);
	      expect(this.container).toEqualHTML('\n        <p>\n          <strong>\n            01<u><span class="ql-cursor">' + _cursor2.default.CONTENTS + '</span></u>23\n          </strong>\n        </p>\n      ');
	    });

	    it('selection change cleanup', function () {
	      this.setup('<p>0123</p>', 2);
	      this.selection.format('italic', true);
	      this.selection.setRange(new _selection.Range(0, 0));
	      this.selection.scroll.update();
	      expect(this.container).toEqualHTML('<p>0123</p>');
	    });

	    it('text change cleanup', function () {
	      this.setup('<p>0123</p>', 2);
	      this.selection.format('italic', true);
	      this.selection.cursor.textNode.data = _cursor2.default.CONTENTS + '|';
	      this.selection.setNativeRange(this.selection.cursor.textNode, 2);
	      this.selection.scroll.update();
	      expect(this.container).toEqualHTML('<p>01<em>|</em>23</p>');
	    });

	    it('no cleanup', function () {
	      this.setup('<p>0123</p><p><br></p>', 2);
	      this.selection.format('italic', true);
	      this.container.removeChild(this.container.lastChild);
	      this.selection.scroll.update();
	      expect(this.selection.getRange()[0].index).toEqual(2);
	      expect(this.container).toEqualHTML('\n        <p>01<em><span class="ql-cursor">' + _cursor2.default.CONTENTS + '</span></em>23</p>\n      ');
	    });
	  });

	  describe('getBounds()', function () {
	    beforeEach(function () {
	      this.container.classList.add('ql-editor');
	      this.container.style.fontFamily = 'monospace';
	      this.container.style.lineHeight = /Trident/i.test(navigator.userAgent) ? '18px' : 'initial';
	      this.container.style.position = 'relative';
	      this.initialize(HTMLElement, '<div></div><div>&nbsp;</div>');
	      this.div = this.container.firstChild;
	      this.div.style.border = '1px solid #777';
	      // this.float is for visually a check, does not affect test itself
	      this.float = this.container.lastChild;
	      this.float.style.backgroundColor = 'red';
	      this.float.style.position = 'absolute';
	      this.float.style.width = '1px';
	      if (this.reference != null) return;
	      this.initialize(HTMLElement, '<p><span>0</span></p>', this.div);
	      var span = this.div.firstChild.firstChild;
	      span.style.display = 'inline-block'; // IE11 needs this to respect line height
	      this.reference = {
	        height: span.offsetHeight,
	        left: span.offsetLeft,
	        lineHeight: span.parentNode.offsetHeight,
	        width: span.offsetWidth,
	        top: span.offsetTop
	      };
	      this.initialize(HTMLElement, '', this.div);
	    });

	    afterEach(function () {
	      this.float.style.left = this.bounds.left + 'px';
	      this.float.style.top = this.bounds.top + 'px';
	      this.float.style.height = this.bounds.height + 'px';
	    });

	    it('empty document', function () {
	      var selection = this.initialize(_selection2.default, '<p><br></p>', this.div);
	      this.bounds = selection.getBounds(0);
	      if (/Android/i.test(navigator.userAgent)) return; // false positive on emulators atm
	      expect(this.bounds.left).toBeApproximately(this.reference.left, 1);
	      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
	      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
	    });

	    it('empty line', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p>0000</p>\n        <p><br></p>\n        <p>0000</p>', this.div);
	      this.bounds = selection.getBounds(5);
	      if (/Android/i.test(navigator.userAgent)) return; // false positive on emulators atm
	      expect(this.bounds.left).toBeApproximately(this.reference.left, 1);
	      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
	      expect(this.bounds.top).toBeApproximately(this.reference.top + this.reference.lineHeight, 2);
	    });

	    it('plain text', function () {
	      var selection = this.initialize(_selection2.default, '<p>0123</p>', this.div);
	      this.bounds = selection.getBounds(2);
	      expect(this.bounds.left).toBeApproximately(this.reference.left + this.reference.width * 2, 2);
	      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
	      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
	    });

	    it('multiple characters', function () {
	      var selection = this.initialize(_selection2.default, '<p>0123</p>', this.div);
	      this.bounds = selection.getBounds(1, 2);
	      expect(this.bounds.left).toBeApproximately(this.reference.left + this.reference.width, 2);
	      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
	      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
	      expect(this.bounds.width).toBeApproximately(this.reference.width * 2, 2);
	    });

	    it('start of line', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p>0000</p>\n        <p>0000</p>', this.div);
	      this.bounds = selection.getBounds(5);
	      expect(this.bounds.left).toBeApproximately(this.reference.left, 1);
	      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
	      expect(this.bounds.top).toBeApproximately(this.reference.top + this.reference.lineHeight, 1);
	    });

	    it('end of line', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p>0000</p>\n        <p>0000</p>\n        <p>0000</p>', this.div);
	      this.bounds = selection.getBounds(9);
	      expect(this.bounds.left).toBeApproximately(this.reference.left + this.reference.width * 4, 4);
	      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
	      expect(this.bounds.top).toBeApproximately(this.reference.top + this.reference.lineHeight, 1);
	    });

	    it('multiple lines', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p>0000</p>\n        <p>0000</p>\n        <p>0000</p>', this.div);
	      this.bounds = selection.getBounds(2, 4);
	      expect(this.bounds.left).toBeApproximately(this.reference.left, 1);
	      expect(this.bounds.height).toBeApproximately(this.reference.height * 2, 2);
	      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
	      expect(this.bounds.width).toBeGreaterThan(3 * this.reference.width);
	    });

	    it('large text', function () {
	      var selection = this.initialize(_selection2.default, '<p><span class="ql-size-large">0000</span></p>', this.div);
	      var span = this.div.querySelector('span');
	      if (/Trident/i.test(navigator.userAgent)) {
	        span.style.lineHeight = '21px';
	      }
	      this.bounds = selection.getBounds(2);
	      expect(this.bounds.left).toBeApproximately(this.reference.left + span.offsetWidth / 2, 1);
	      expect(this.bounds.height).toBeApproximately(span.offsetHeight, 1);
	      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
	    });

	    it('image', function () {
	      var selection = this.initialize(_selection2.default, '\n        <p>\n          <img src="/assets/favicon.png" width="32px" height="32px">\n          <img src="/assets/favicon.png" width="32px" height="32px">\n        </p>', this.div);
	      this.bounds = selection.getBounds(1);
	      expect(this.bounds.left).toBeApproximately(this.reference.left + 32, 1);
	      expect(this.bounds.height).toBeApproximately(32, 1);
	      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
	    });

	    it('beyond document', function () {
	      var _this2 = this;

	      var selection = this.initialize(_selection2.default, '<p>0123</p>');
	      expect(function () {
	        _this2.bounds = selection.getBounds(10, 0);
	      }).not.toThrow();
	      expect(function () {
	        _this2.bounds = selection.getBounds(0, 10);
	      }).not.toThrow();
	    });
	  });
	});

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _quill = __webpack_require__(19);

	var _quill2 = _interopRequireDefault(_quill);

	var _emitter = __webpack_require__(29);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _selection = __webpack_require__(40);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Quill', function () {
	  it('imports', function () {
	    Object.keys(_quill2.default.imports).forEach(function (path) {
	      expect(_quill2.default.import(path)).toBeTruthy();
	    });
	  });

	  describe('construction', function () {
	    it('empty', function () {
	      var quill = this.initialize(_quill2.default, '');
	      expect(quill.getContents()).toEqual(new _delta2.default().insert('\n'));
	      expect(quill.root).toEqualHTML('<p><br></p>');
	    });

	    it('text', function () {
	      var quill = this.initialize(_quill2.default, '0123');
	      expect(quill.getContents()).toEqual(new _delta2.default().insert('0123\n'));
	      expect(quill.root).toEqualHTML('<p>0123</p>');
	    });

	    it('newlines', function () {
	      var quill = this.initialize(_quill2.default, '<p><br></p><p><br></p><p><br></p>');
	      expect(quill.getContents()).toEqual(new _delta2.default().insert('\n\n\n'));
	      expect(quill.root).toEqualHTML('<p><br></p><p><br></p><p><br></p>');
	    });

	    it('formatted ending', function () {
	      var quill = this.initialize(_quill2.default, '<p class="ql-align-center">Test</p>');
	      expect(quill.getContents()).toEqual(new _delta2.default().insert('Test').insert('\n', { align: 'center' }));
	      expect(quill.root).toEqualHTML('<p class="ql-align-center">Test</p>');
	    });
	  });

	  describe('api', function () {
	    beforeEach(function () {
	      this.quill = this.initialize(_quill2.default, '<p>0123<em>45</em>67</p>');
	      this.oldDelta = this.quill.getContents();
	      spyOn(this.quill.emitter, 'emit').and.callThrough();
	    });

	    it('deleteText()', function () {
	      this.quill.deleteText(3, 2);
	      var change = new _delta2.default().retain(3).delete(2);
	      expect(this.quill.root).toEqualHTML('<p>012<em>5</em>67</p>');
	      expect(this.quill.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, change, this.oldDelta, _emitter2.default.sources.API);
	    });

	    it('format', function () {
	      this.quill.setSelection(3, 2);
	      this.quill.format('bold', true);
	      var change = new _delta2.default().retain(3).retain(2, { bold: true });
	      expect(this.quill.root).toEqualHTML('<p>012<strong>3<em>4</em></strong><em>5</em>67</p>');
	      expect(this.quill.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, change, this.oldDelta, _emitter2.default.sources.API);
	      expect(this.quill.getSelection()).toEqual(new _selection.Range(3, 2));
	    });

	    it('formatLine()', function () {
	      this.quill.formatLine(1, 1, 'header', 2);
	      var change = new _delta2.default().retain(8).retain(1, { header: 2 });
	      expect(this.quill.root).toEqualHTML('<h2>0123<em>45</em>67</h2>');
	      expect(this.quill.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, change, this.oldDelta, _emitter2.default.sources.API);
	    });

	    it('formatText()', function () {
	      this.quill.formatText(3, 2, 'bold', true);
	      var change = new _delta2.default().retain(3).retain(2, { bold: true });
	      expect(this.quill.root).toEqualHTML('<p>012<strong>3<em>4</em></strong><em>5</em>67</p>');
	      expect(this.quill.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, change, this.oldDelta, _emitter2.default.sources.API);
	    });

	    it('insertEmbed()', function () {
	      this.quill.insertEmbed(5, 'image', '/assets/favicon.png');
	      var change = new _delta2.default().retain(5).insert({ image: '/assets/favicon.png' }, { italic: true });
	      expect(this.quill.root).toEqualHTML('<p>0123<em>4<img src="/assets/favicon.png">5</em>67</p>');
	      expect(this.quill.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, change, this.oldDelta, _emitter2.default.sources.API);
	    });

	    it('insertText()', function () {
	      this.quill.insertText(5, '|', 'bold', true);
	      var change = new _delta2.default().retain(5).insert('|', { bold: true, italic: true });
	      expect(this.quill.root).toEqualHTML('<p>0123<em>4</em><strong><em>|</em></strong><em>5</em>67</p>');
	      expect(this.quill.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, change, this.oldDelta, _emitter2.default.sources.API);
	    });

	    it('enable/disable', function () {
	      this.quill.disable();
	      expect(this.quill.root.getAttribute('contenteditable')).toEqual('false');
	      this.quill.enable();
	      expect(this.quill.root.getAttribute('contenteditable')).toBeTruthy();
	    });

	    it('getBounds() index', function () {
	      var bounds = this.quill.selection.getBounds(1);
	      expect(this.quill.getBounds(1)).toEqual(bounds);
	    });

	    it('getBounds() range', function () {
	      var bounds = this.quill.selection.getBounds(3, 4);
	      expect(this.quill.getBounds(new _selection.Range(3, 4))).toEqual(bounds);
	    });

	    it('getFormat()', function () {
	      var formats = this.quill.getFormat(5);
	      expect(formats).toEqual({ italic: true });
	    });

	    it('getSelection()', function () {
	      expect(this.quill.getSelection()).toEqual(null);
	      var range = new _selection.Range(1, 2);
	      this.quill.setSelection(range);
	      expect(this.quill.getSelection()).toEqual(range);
	    });

	    it('pasteHTML(html)', function () {
	      this.quill.pasteHTML('<i>ab</i><b>cd</b>');
	      expect(this.quill.root).toEqualHTML('<p><em>ab</em><strong>cd</strong></p>');
	    });

	    it('pasteHTML(index, html)', function () {
	      this.quill.pasteHTML(2, '<b>ab</b>');
	      expect(this.quill.root).toEqualHTML('<p>01<strong>ab</strong>23<em>45</em>67</p>');
	    });

	    it('removeFormat()', function () {
	      this.quill.removeFormat(5, 1);
	      var change = new _delta2.default().retain(5).retain(1, { italic: null });
	      expect(this.quill.root).toEqualHTML('<p>0123<em>4</em>567</p>');
	      expect(this.quill.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, change, this.oldDelta, _emitter2.default.sources.API);
	    });

	    it('updateContents() delta', function () {
	      var delta = new _delta2.default().retain(5).insert('|');
	      this.quill.updateContents(delta);
	      expect(this.quill.root).toEqualHTML('<p>0123<em>4</em>|<em>5</em>67</p>');
	      expect(this.quill.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, delta, this.oldDelta, _emitter2.default.sources.API);
	    });

	    it('updateContents() ops array', function () {
	      var delta = new _delta2.default().retain(5).insert('|');
	      this.quill.updateContents(delta.ops);
	      expect(this.quill.root).toEqualHTML('<p>0123<em>4</em>|<em>5</em>67</p>');
	      expect(this.quill.emitter.emit).toHaveBeenCalledWith(_emitter2.default.events.TEXT_CHANGE, delta, this.oldDelta, _emitter2.default.sources.API);
	    });
	  });

	  describe('setContents()', function () {
	    it('empty', function () {
	      var quill = this.initialize(_quill2.default, '');
	      var delta = new _delta2.default().insert('\n');
	      quill.setContents(delta);
	      expect(quill.getContents()).toEqual(delta);
	      expect(quill.root).toEqualHTML('<p><br></p>');
	    });

	    it('single line', function () {
	      var quill = this.initialize(_quill2.default, '');
	      var delta = new _delta2.default().insert('Hello World!\n');
	      quill.setContents(delta);
	      expect(quill.getContents()).toEqual(delta);
	      expect(quill.root).toEqualHTML('<p>Hello World!</p>');
	    });

	    it('multiple lines', function () {
	      var quill = this.initialize(_quill2.default, '');
	      var delta = new _delta2.default().insert('Hello\n\nWorld!\n');
	      quill.setContents(delta);
	      expect(quill.getContents()).toEqual(delta);
	      expect(quill.root).toEqualHTML('<p>Hello</p><p><br></p><p>World!</p>');
	    });

	    it('basic formats', function () {
	      var quill = this.initialize(_quill2.default, '');
	      var delta = new _delta2.default().insert('Welcome').insert('\n', { header: 1 }).insert('Hello\n').insert('World').insert('!', { bold: true }).insert('\n');
	      quill.setContents(delta);
	      expect(quill.getContents()).toEqual(delta);
	      expect(quill.root).toEqualHTML('\n        <h1>Welcome</h1>\n        <p>Hello</p>\n        <p>World<strong>!</strong></p>\n      ');
	    });

	    it('array of operations', function () {
	      var quill = this.initialize(_quill2.default, '');
	      var delta = new _delta2.default().insert('test').insert('123', { bold: true }).insert('\n');
	      quill.setContents(delta.ops);
	      expect(quill.getContents()).toEqual(delta);
	    });

	    it('json', function () {
	      var quill = this.initialize(_quill2.default, '');
	      var delta = { ops: [{ insert: 'test\n' }] };
	      quill.setContents(delta);
	      expect(quill.getContents()).toEqual(new _delta2.default(delta));
	    });

	    it('no trailing newline', function () {
	      var quill = this.initialize(_quill2.default, '<h1>Welcome</h1>');
	      quill.setContents(new _delta2.default().insert('0123'));
	      expect(quill.getContents()).toEqual(new _delta2.default().insert('0123\n'));
	    });
	  });

	  describe('setText()', function () {
	    it('overwrite', function () {
	      var quill = this.initialize(_quill2.default, '<h1>Welcome</h1>');
	      quill.setText('abc');
	      expect(quill.root).toEqualHTML('<p>abc</p>');
	    });

	    it('set to newline', function () {
	      var quill = this.initialize(_quill2.default, '<h1>Welcome</h1>');
	      quill.setText('\n');
	      expect(quill.root).toEqualHTML('<p><br></p>');
	    });

	    it('multiple newlines', function () {
	      var quill = this.initialize(_quill2.default, '<h1>Welcome</h1>');
	      quill.setText('\n\n');
	      expect(quill.root).toEqualHTML('<p><br></p><p><br></p>');
	    });

	    it('content with trailing newline', function () {
	      var quill = this.initialize(_quill2.default, '<h1>Welcome</h1>');
	      quill.setText('abc\n');
	      expect(quill.root).toEqualHTML('<p>abc</p>');
	    });

	    it('return carriage', function () {
	      var quill = this.initialize(_quill2.default, '<p>Test</p>');
	      quill.setText('\r');
	      expect(quill.root).toEqualHTML('<p><br></p>');
	    });

	    it('return carriage newline', function () {
	      var quill = this.initialize(_quill2.default, '<p>Test</p>');
	      quill.setText('\r\n');
	      expect(quill.root).toEqualHTML('<p><br></p>');
	    });
	  });

	  describe('overload', function () {
	    it('(index:number, length:number)', function () {
	      var _overload = (0, _quill.overload)(0, 1);

	      var _overload2 = _slicedToArray(_overload, 4);

	      var index = _overload2[0];
	      var length = _overload2[1];
	      var formats = _overload2[2];
	      var source = _overload2[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({});
	      expect(source).toBe(_quill2.default.sources.API);
	    });

	    it('(index:number, length:number, format:string, value:boolean, source:string)', function () {
	      var _overload3 = (0, _quill.overload)(0, 1, 'bold', true, _quill2.default.sources.USER);

	      var _overload4 = _slicedToArray(_overload3, 4);

	      var index = _overload4[0];
	      var length = _overload4[1];
	      var formats = _overload4[2];
	      var source = _overload4[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ bold: true });
	      expect(source).toBe(_quill2.default.sources.USER);
	    });

	    it('(index:number, length:number, format:string, value:string, source:string)', function () {
	      var _overload5 = (0, _quill.overload)(0, 1, 'color', _quill2.default.sources.USER, _quill2.default.sources.USER);

	      var _overload6 = _slicedToArray(_overload5, 4);

	      var index = _overload6[0];
	      var length = _overload6[1];
	      var formats = _overload6[2];
	      var source = _overload6[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ color: _quill2.default.sources.USER });
	      expect(source).toBe(_quill2.default.sources.USER);
	    });

	    it('(index:number, length:number, format:string, value:string)', function () {
	      var _overload7 = (0, _quill.overload)(0, 1, 'color', _quill2.default.sources.USER);

	      var _overload8 = _slicedToArray(_overload7, 4);

	      var index = _overload8[0];
	      var length = _overload8[1];
	      var formats = _overload8[2];
	      var source = _overload8[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ color: _quill2.default.sources.USER });
	      expect(source).toBe(_quill2.default.sources.API);
	    });

	    it('(index:number, length:number, format:object)', function () {
	      var _overload9 = (0, _quill.overload)(0, 1, { bold: true });

	      var _overload10 = _slicedToArray(_overload9, 4);

	      var index = _overload10[0];
	      var length = _overload10[1];
	      var formats = _overload10[2];
	      var source = _overload10[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ bold: true });
	      expect(source).toBe(_quill2.default.sources.API);
	    });

	    it('(index:number, length:number, format:object, source:string)', function () {
	      var _overload11 = (0, _quill.overload)(0, 1, { bold: true }, _quill2.default.sources.USER);

	      var _overload12 = _slicedToArray(_overload11, 4);

	      var index = _overload12[0];
	      var length = _overload12[1];
	      var formats = _overload12[2];
	      var source = _overload12[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ bold: true });
	      expect(source).toBe(_quill2.default.sources.USER);
	    });

	    it('(index:number, length:number, source:string)', function () {
	      var _overload13 = (0, _quill.overload)(0, 1, _quill2.default.sources.USER);

	      var _overload14 = _slicedToArray(_overload13, 4);

	      var index = _overload14[0];
	      var length = _overload14[1];
	      var formats = _overload14[2];
	      var source = _overload14[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({});
	      expect(source).toBe(_quill2.default.sources.USER);
	    });

	    it('(index:number, source:string)', function () {
	      var _overload15 = (0, _quill.overload)(0, _quill2.default.sources.USER);

	      var _overload16 = _slicedToArray(_overload15, 4);

	      var index = _overload16[0];
	      var length = _overload16[1];
	      var formats = _overload16[2];
	      var source = _overload16[3];

	      expect(index).toBe(0);
	      expect(length).toBe(0);
	      expect(formats).toEqual({});
	      expect(source).toBe(_quill2.default.sources.USER);
	    });

	    it('(range:range)', function () {
	      var _overload17 = (0, _quill.overload)(new _selection.Range(0, 1));

	      var _overload18 = _slicedToArray(_overload17, 4);

	      var index = _overload18[0];
	      var length = _overload18[1];
	      var formats = _overload18[2];
	      var source = _overload18[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({});
	      expect(source).toBe(_quill2.default.sources.API);
	    });

	    it('(range:range, format:string, value:boolean, source:string)', function () {
	      var _overload19 = (0, _quill.overload)(new _selection.Range(0, 1), 'bold', true, _quill2.default.sources.USER);

	      var _overload20 = _slicedToArray(_overload19, 4);

	      var index = _overload20[0];
	      var length = _overload20[1];
	      var formats = _overload20[2];
	      var source = _overload20[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ bold: true });
	      expect(source).toBe(_quill2.default.sources.USER);
	    });

	    it('(range:range, format:string, value:string, source:string)', function () {
	      var _overload21 = (0, _quill.overload)(new _selection.Range(0, 1), 'color', _quill2.default.sources.API, _quill2.default.sources.USER);

	      var _overload22 = _slicedToArray(_overload21, 4);

	      var index = _overload22[0];
	      var length = _overload22[1];
	      var formats = _overload22[2];
	      var source = _overload22[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ color: _quill2.default.sources.API });
	      expect(source).toBe(_quill2.default.sources.USER);
	    });

	    it('(range:range, format:string, value:string)', function () {
	      var _overload23 = (0, _quill.overload)(new _selection.Range(0, 1), 'color', _quill2.default.sources.USER);

	      var _overload24 = _slicedToArray(_overload23, 4);

	      var index = _overload24[0];
	      var length = _overload24[1];
	      var formats = _overload24[2];
	      var source = _overload24[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ color: _quill2.default.sources.USER });
	      expect(source).toBe(_quill2.default.sources.API);
	    });

	    it('(range:range, format:object)', function () {
	      var _overload25 = (0, _quill.overload)(new _selection.Range(0, 1), { bold: true });

	      var _overload26 = _slicedToArray(_overload25, 4);

	      var index = _overload26[0];
	      var length = _overload26[1];
	      var formats = _overload26[2];
	      var source = _overload26[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ bold: true });
	      expect(source).toBe(_quill2.default.sources.API);
	    });

	    it('(range:range, format:object, source:string)', function () {
	      var _overload27 = (0, _quill.overload)(new _selection.Range(0, 1), { bold: true }, _quill2.default.sources.USER);

	      var _overload28 = _slicedToArray(_overload27, 4);

	      var index = _overload28[0];
	      var length = _overload28[1];
	      var formats = _overload28[2];
	      var source = _overload28[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ bold: true });
	      expect(source).toBe(_quill2.default.sources.USER);
	    });

	    it('(range:range, source:string)', function () {
	      var _overload29 = (0, _quill.overload)(new _selection.Range(0, 1), _quill2.default.sources.USER);

	      var _overload30 = _slicedToArray(_overload29, 4);

	      var index = _overload30[0];
	      var length = _overload30[1];
	      var formats = _overload30[2];
	      var source = _overload30[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({});
	      expect(source).toBe(_quill2.default.sources.USER);
	    });

	    it('(range:range)', function () {
	      var _overload31 = (0, _quill.overload)(new _selection.Range(0, 1));

	      var _overload32 = _slicedToArray(_overload31, 4);

	      var index = _overload32[0];
	      var length = _overload32[1];
	      var formats = _overload32[2];
	      var source = _overload32[3];

	      expect(index).toBe(0);
	      expect(length).toBe(1);
	      expect(formats).toEqual({});
	      expect(source).toBe(_quill2.default.sources.API);
	    });

	    it('(range:range, dummy:number)', function () {
	      var _overload33 = (0, _quill.overload)(new _selection.Range(10, 1), 0);

	      var _overload34 = _slicedToArray(_overload33, 4);

	      var index = _overload34[0];
	      var length = _overload34[1];
	      var formats = _overload34[2];
	      var source = _overload34[3];

	      expect(index).toBe(10);
	      expect(length).toBe(1);
	      expect(formats).toEqual({});
	      expect(source).toBe(_quill2.default.sources.API);
	    });

	    it('(range:range, dummy:number, format:string, value:boolean)', function () {
	      var _overload35 = (0, _quill.overload)(new _selection.Range(10, 1), 0, 'bold', true);

	      var _overload36 = _slicedToArray(_overload35, 4);

	      var index = _overload36[0];
	      var length = _overload36[1];
	      var formats = _overload36[2];
	      var source = _overload36[3];

	      expect(index).toBe(10);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ bold: true });
	      expect(source).toBe(_quill2.default.sources.API);
	    });

	    it('(range:range, dummy:number, format:object, source:string)', function () {
	      var _overload37 = (0, _quill.overload)(new _selection.Range(10, 1), 0, { bold: true }, _quill2.default.sources.USER);

	      var _overload38 = _slicedToArray(_overload37, 4);

	      var index = _overload38[0];
	      var length = _overload38[1];
	      var formats = _overload38[2];
	      var source = _overload38[3];

	      expect(index).toBe(10);
	      expect(length).toBe(1);
	      expect(formats).toEqual({ bold: true });
	      expect(source).toBe(_quill2.default.sources.USER);
	    });
	  });

	  describe('placeholder', function () {
	    beforeEach(function () {
	      this.initialize(HTMLElement, '<div><p></p></div>');
	      this.quill = new _quill2.default(this.container.firstChild, {
	        'placeholder': 'a great day to be a placeholder'
	      });
	      this.original = this.quill.getContents();
	    });

	    it('blank editor', function () {
	      expect(this.quill.root.dataset.placeholder).toEqual('a great day to be a placeholder');
	      expect(this.quill.root.classList).toContain('ql-blank');
	    });

	    it('with text', function () {
	      this.quill.setText('test');
	      expect(this.quill.root.classList).not.toContain('ql-blank');
	    });

	    it('formatted line', function () {
	      this.quill.formatLine(0, 1, 'list', 'ordered');
	      expect(this.quill.root.classList).not.toContain('ql-blank');
	    });
	  });
	});

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Color', function () {
	  it('add', function () {
	    var editor = this.initialize(_editor2.default, '<p>0123</p>');
	    editor.formatText(1, 2, { color: 'red' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0').insert('12', { color: 'red' }).insert('3\n'));
	    expect(editor.scroll.domNode).toEqualHTML('<p>0<span style="color: red;">12</span>3</p>');
	  });

	  it('remove', function () {
	    var editor = this.initialize(_editor2.default, '<p>0<strong style="color: red;">12</strong>3</p>');
	    editor.formatText(1, 2, { color: false });
	    var delta = new _delta2.default().insert('0').insert('12', { bold: true }).insert('3\n');
	    expect(editor.getDelta()).toEqual(delta);
	    expect(editor.scroll.domNode).toEqualHTML('<p>0<strong>12</strong>3</p>');
	  });

	  it('remove unwrap', function () {
	    var editor = this.initialize(_editor2.default, '<p>0<span style="color: red;">12</span>3</p>');
	    editor.formatText(1, 2, { color: false });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123\n'));
	    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
	  });

	  it('invalid scope', function () {
	    var editor = this.initialize(_editor2.default, '<p>0123</p>');
	    var initial = editor.scroll.domNode.innerHTML;
	    editor.formatText(4, 1, { color: 'red' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123\n'));
	    expect(editor.scroll.domNode).toEqualHTML(initial);
	  });
	});

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	var _link = __webpack_require__(60);

	var _link2 = _interopRequireDefault(_link);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Link', function () {
	  it('add', function () {
	    var editor = this.initialize(_editor2.default, '<p>0123</p>');
	    editor.formatText(1, 2, { link: 'https://quilljs.com' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0').insert('12', { link: 'https://quilljs.com' }).insert('3\n'));
	    expect(editor.scroll.domNode).toEqualHTML('<p>0<a href="https://quilljs.com" target="_blank">12</a>3</p>');
	  });

	  it('add invalid', function () {
	    var editor = this.initialize(_editor2.default, '<p>0123</p>');
	    editor.formatText(1, 2, { link: 'javascript:alert(0);' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0').insert('12', { link: _link2.default.SANITIZED_URL }).insert('3\n'));
	  });

	  it('change', function () {
	    var editor = this.initialize(_editor2.default, '<p>0<a href="https://github.com" target="_blank">12</a>3</p>');
	    editor.formatText(1, 2, { link: 'https://quilljs.com' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0').insert('12', { link: 'https://quilljs.com' }).insert('3\n'));
	    expect(editor.scroll.domNode).toEqualHTML('<p>0<a href="https://quilljs.com" target="_blank">12</a>3</p>');
	  });

	  it('remove', function () {
	    var editor = this.initialize(_editor2.default, '<p>0<a class="ql-size-large" href="https://quilljs.com" target="_blank">12</a>3</p>');
	    editor.formatText(1, 2, { link: false });
	    var delta = new _delta2.default().insert('0').insert('12', { size: 'large' }).insert('3\n');
	    expect(editor.getDelta()).toEqual(delta);
	    expect(editor.scroll.domNode).toEqualHTML('<p>0<span class="ql-size-large">12</span>3</p>');
	  });
	});

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Script', function () {
	  it('add', function () {
	    var editor = this.initialize(_editor2.default, '<p>a<sup>2</sup> + b2 = c<sup>2</sup></p>');
	    editor.formatText(6, 1, { script: 'super' });
	    expect(editor.scroll.domNode).toEqualHTML('<p>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></p>');
	  });

	  it('remove', function () {
	    var editor = this.initialize(_editor2.default, '<p>a<sup>2</sup> + b<sup>2</sup></p>');
	    editor.formatText(1, 1, { script: false });
	    expect(editor.scroll.domNode).toEqualHTML('<p>a2 + b<sup>2</sup></p>');
	  });

	  it('replace', function () {
	    var editor = this.initialize(_editor2.default, '<p>a<sup>2</sup> + b<sup>2</sup></p>');
	    editor.formatText(1, 1, { script: 'sub' });
	    expect(editor.scroll.domNode).toEqualHTML('<p>a<sub>2</sub> + b<sup>2</sup></p>');
	  });
	});

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Align', function () {
	  it('add', function () {
	    var editor = this.initialize(_editor2.default, '<p>0123</p>');
	    editor.formatText(4, 1, { align: 'center' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { align: 'center' }));
	    expect(editor.scroll.domNode).toEqualHTML('<p class="ql-align-center">0123</p>');
	  });

	  it('remove', function () {
	    var editor = this.initialize(_editor2.default, '<p class="ql-align-center">0123</p>');
	    editor.formatText(4, 1, { align: false });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123\n'));
	    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
	  });

	  it('whitelist', function () {
	    var editor = this.initialize(_editor2.default, '<p class="ql-align-center">0123</p>');
	    var initial = editor.scroll.domNode.innerHTML;
	    editor.formatText(4, 1, { align: 'middle' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { align: 'center' }));
	    expect(editor.scroll.domNode).toEqualHTML(initial);
	  });

	  it('invalid scope', function () {
	    var editor = this.initialize(_editor2.default, '<p>0123</p>');
	    var initial = editor.scroll.domNode.innerHTML;
	    editor.formatText(1, 2, { align: 'center' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123\n'));
	    expect(editor.scroll.domNode).toEqualHTML(initial);
	  });
	});

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _parchment = __webpack_require__(3);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	var _code = __webpack_require__(32);

	var _code2 = _interopRequireDefault(_code);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Code', function () {
	  beforeEach(function () {
	    _parchment2.default.register(_code2.default);
	  });

	  it('newline', function () {
	    var editor = this.initialize(_editor2.default, '\n      <pre></pre>\n      <p><br></p>\n      <pre>\n</pre>\n      <p><br></p>\n      <pre>\n\n</pre>\n      <p><br></p>\n    ');
	    expect(editor.scroll.domNode).toEqualHTML('\n      <pre>\n</pre>\n      <p><br></p>\n      <pre>\n</pre>\n      <p><br></p>\n      <pre>\n\n</pre>\n      <p><br></p>\n    ');
	  });

	  it('default child', function () {
	    var editor = this.initialize(_editor2.default, '<p><br></p>');
	    editor.formatLine(0, 1, { 'code-block': true });
	    expect(editor.scroll.domNode.innerHTML).toEqual('<pre spellcheck="false">\n</pre>');
	  });

	  it('merge', function () {
	    var editor = this.initialize(_editor2.default, '\n      <pre>0</pre>\n      <pre>0</pre>\n      <p><br></p>\n      <pre>0</pre>\n      <pre>1\n</pre>\n      <p><br></p>\n      <pre>0</pre>\n      <pre>2\n\n</pre>\n      <p><br></p>\n      <pre>1\n</pre>\n      <pre>0</pre>\n      <p><br></p>\n      <pre>1\n</pre>\n      <pre>1\n</pre>\n      <p><br></p>\n      <pre>1\n</pre>\n      <pre>2\n\n</pre>\n      <p><br></p>\n      <pre>2\n\n</pre>\n      <pre>0</pre>\n      <p><br></p>\n      <pre>2\n\n</pre>\n      <pre>1\n</pre>\n      <p><br></p>\n      <pre>2\n\n</pre>\n      <pre>2\n\n</pre>\n    ');
	    editor.scroll.optimize();
	    expect(editor.scroll.domNode).toEqualHTML('\n      <pre>0\n0\n</pre>\n      <p><br></p>\n      <pre>0\n1\n</pre>\n      <p><br></p>\n      <pre>0\n2\n\n</pre>\n      <p><br></p>\n      <pre>1\n0\n</pre>\n      <p><br></p>\n      <pre>1\n1\n</pre>\n      <p><br></p>\n      <pre>1\n2\n\n</pre>\n      <p><br></p>\n      <pre>2\n\n0\n</pre>\n      <p><br></p>\n      <pre>2\n\n1\n</pre>\n      <p><br></p>\n      <pre>2\n\n2\n\n</pre>\n    ');
	  });

	  it('merge multiple', function () {
	    var editor = this.initialize(_editor2.default, '\n      <pre>0</pre>\n      <pre>1</pre>\n      <pre>2</pre>\n      <pre>3</pre>\n    ');
	    editor.scroll.optimize();
	    expect(editor.scroll.domNode).toEqualHTML('\n      <pre>0\n1\n2\n3\n</pre>\n    ');
	  });

	  it('add', function () {
	    var editor = this.initialize(_editor2.default, '<p><em>0123</em></p><p>5678</p>');
	    editor.formatLine(2, 5, { 'code-block': true });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { 'code-block': true }).insert('5678').insert('\n', { 'code-block': true }));
	    expect(editor.scroll.domNode.innerHTML).toEqual('<pre spellcheck="false">0123\n5678\n</pre>');
	  });

	  it('remove', function () {
	    var editor = this.initialize(_editor2.default, '<pre>0123</pre>');
	    editor.formatText(4, 1, { 'code-block': false });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123\n'));
	    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
	  });

	  it('replace', function () {
	    var editor = this.initialize(_editor2.default, '<pre>0123</pre>');
	    editor.formatText(4, 1, { 'header': 1 });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { header: 1 }));
	    expect(editor.scroll.domNode).toEqualHTML('<h1>0123</h1>');
	  });

	  it('replace multiple', function () {
	    var editor = this.initialize(_editor2.default, { html: '<pre>01\n23\n</pre>' });
	    editor.formatText(0, 6, { 'header': 1 });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('01').insert('\n', { header: 1 }).insert('23').insert('\n', { header: 1 }));
	    expect(editor.scroll.domNode).toEqualHTML('<h1>01</h1><h1>23</h1>');
	  });

	  it('format interior line', function () {
	    var editor = this.initialize(_editor2.default, { html: '<pre>01\n23\n45\n</pre>' });
	    editor.formatText(5, 1, { 'header': 1 });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('01').insert('\n', { 'code-block': true }).insert('23').insert('\n', { 'header': 1 }).insert('45').insert('\n', { 'code-block': true }));
	    expect(editor.scroll.domNode.innerHTML).toEqual('<pre>01\n</pre><h1>23</h1><pre>45\n</pre>');
	  });

	  it('format imprecise bounds', function () {
	    var editor = this.initialize(_editor2.default, { html: '<pre>01\n23\n45\n</pre>' });
	    editor.formatText(1, 6, { 'header': 1 });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('01').insert('\n', { 'header': 1 }).insert('23').insert('\n', { 'header': 1 }).insert('45').insert('\n', { 'code-block': true }));
	    expect(editor.scroll.domNode.innerHTML).toEqual('<h1>01</h1><h1>23</h1><pre>45\n</pre>');
	  });

	  it('format without newline', function () {
	    var editor = this.initialize(_editor2.default, { html: '<pre>01\n23\n45\n</pre>' });
	    editor.formatText(3, 1, { 'header': 1 });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('01').insert('\n', { 'code-block': true }).insert('23').insert('\n', { 'code-block': true }).insert('45').insert('\n', { 'code-block': true }));
	    expect(editor.scroll.domNode.innerHTML).toEqual('<pre>01\n23\n45\n</pre>');
	  });

	  it('format line', function () {
	    var editor = this.initialize(_editor2.default, { html: '<pre>01\n23\n45\n</pre>' });
	    editor.formatLine(3, 1, { 'header': 1 });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('01').insert('\n', { 'code-block': true }).insert('23').insert('\n', { 'header': 1 }).insert('45').insert('\n', { 'code-block': true }));
	    expect(editor.scroll.domNode.innerHTML).toEqual('<pre>01\n</pre><h1>23</h1><pre>45\n</pre>');
	  });

	  it('ignore formatAt', function () {
	    var editor = this.initialize(_editor2.default, '<pre>0123</pre>');
	    editor.formatText(1, 1, { bold: true });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { 'code-block': true }));
	    expect(editor.scroll.domNode).toEqualHTML('<pre>0123</pre>');
	  });
	});

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Header', function () {
	  it('add', function () {
	    var editor = this.initialize(_editor2.default, '<p><em>0123</em></p>');
	    editor.formatText(4, 1, { header: 1 });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123', { italic: true }).insert('\n', { header: 1 }));
	    expect(editor.scroll.domNode).toEqualHTML('<h1><em>0123</em></h1>');
	  });

	  it('remove', function () {
	    var editor = this.initialize(_editor2.default, '<h1><em>0123</em></h1>');
	    editor.formatText(4, 1, { header: false });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123', { italic: true }).insert('\n'));
	    expect(editor.scroll.domNode).toEqualHTML('<p><em>0123</em></p>');
	  });

	  it('change', function () {
	    var editor = this.initialize(_editor2.default, '<h1><em>0123</em></h1>');
	    editor.formatText(4, 1, { header: 2 });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123', { italic: true }).insert('\n', { header: 2 }));
	    expect(editor.scroll.domNode).toEqualHTML('<h2><em>0123</em></h2>');
	  });
	});

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Indent', function () {
	  it('+1', function () {
	    var editor = this.initialize(_editor2.default, '<ul><li>0123</li></ul>');
	    editor.formatText(4, 1, { 'indent': '+1' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { list: 'bullet', indent: 1 }));
	    expect(editor.scroll.domNode).toEqualHTML('<ul><li class="ql-indent-1">0123</li></ul>');
	  });

	  it('-1', function () {
	    var editor = this.initialize(_editor2.default, '<ul><li class="ql-indent-1">0123</li></ul>');
	    editor.formatText(4, 1, { 'indent': '-1' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { list: 'bullet' }));
	    expect(editor.scroll.domNode).toEqualHTML('<ul><li>0123</li></ul>');
	  });
	});

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _editor = __webpack_require__(28);

	var _editor2 = _interopRequireDefault(_editor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('List', function () {
	  it('add', function () {
	    var editor = this.initialize(_editor2.default, '\n      <p>0123</p>\n      <p>5678</p>\n      <p>0123</p>');
	    editor.formatText(9, 1, { list: 'ordered' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123\n5678').insert('\n', { list: 'ordered' }).insert('0123\n'));
	    expect(this.container).toEqualHTML('\n      <p>0123</p>\n      <ol><li>5678</li></ol>\n      <p>0123</p>\n    ');
	  });

	  it('remove', function () {
	    var editor = this.initialize(_editor2.default, '\n      <p>0123</p>\n      <ol><li>5678</li></ol>\n      <p>0123</p>\n    ');
	    editor.formatText(9, 1, { list: null });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123\n5678\n0123\n'));
	    expect(this.container).toEqualHTML('\n      <p>0123</p>\n      <p>5678</p>\n      <p>0123</p>\n    ');
	  });

	  it('replace', function () {
	    var editor = this.initialize(_editor2.default, '\n      <p>0123</p>\n      <ol><li>5678</li></ol>\n      <p>0123</p>\n    ');
	    editor.formatText(9, 1, { list: 'bullet' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123\n5678').insert('\n', { list: 'bullet' }).insert('0123\n'));
	    expect(this.container).toEqualHTML('\n      <p>0123</p>\n      <ul><li>5678</li></ul>\n      <p>0123</p>\n    ');
	  });

	  it('replace with attributes', function () {
	    var editor = this.initialize(_editor2.default, '<ol><li class="ql-align-center">0123</li></ol>');
	    editor.formatText(4, 1, { list: 'bullet' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { align: 'center', list: 'bullet' }));
	    expect(this.container).toEqualHTML('<ul><li class="ql-align-center">0123</li></ul>');
	  });

	  it('format merge', function () {
	    var editor = this.initialize(_editor2.default, '\n      <ol><li>0123</li></ol>\n      <p>5678</p>\n      <ol><li>0123</li></ol>\n    ');
	    editor.formatText(9, 1, { list: 'ordered' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { list: 'ordered' }).insert('5678').insert('\n', { list: 'ordered' }).insert('0123').insert('\n', { list: 'ordered' }));
	    expect(this.container).toEqualHTML('\n      <ol>\n        <li>0123</li>\n        <li>5678</li>\n        <li>0123</li>\n      </ol>');
	  });

	  it('replace merge', function () {
	    var editor = this.initialize(_editor2.default, '\n      <ol><li>0123</li></ol>\n      <ul><li>5678</li></ul>\n      <ol><li>0123</li></ol>');
	    editor.formatText(9, 1, { list: 'ordered' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { list: 'ordered' }).insert('5678').insert('\n', { list: 'ordered' }).insert('0123').insert('\n', { list: 'ordered' }));
	    expect(this.container).toEqualHTML('\n      <ol>\n        <li>0123</li>\n        <li>5678</li>\n        <li>0123</li>\n      </ol>');
	  });

	  it('delete merge', function () {
	    var editor = this.initialize(_editor2.default, '\n      <ol><li>0123</li></ol>\n      <p>5678</p>\n      <ol><li>0123</li></ol>');
	    editor.deleteText(5, 5);
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { list: 'ordered' }).insert('0123').insert('\n', { list: 'ordered' }));
	    expect(this.container).toEqualHTML('\n      <ol>\n        <li>0123</li>\n        <li>0123</li>\n      </ol>');
	  });

	  it('replace split', function () {
	    var editor = this.initialize(_editor2.default, '\n      <ol>\n        <li>0123</li>\n        <li>5678</li>\n        <li>0123</li>\n      </ol>');
	    editor.formatText(9, 1, { list: 'bullet' });
	    expect(editor.getDelta()).toEqual(new _delta2.default().insert('0123').insert('\n', { list: 'ordered' }).insert('5678').insert('\n', { list: 'bullet' }).insert('0123').insert('\n', { list: 'ordered' }));
	    expect(this.container).toEqualHTML('\n      <ol><li>0123</li></ol>\n      <ul><li>5678</li></ul>\n      <ol><li>0123</li></ol>');
	  });

	  it('empty line interop', function () {
	    var editor = this.initialize(_editor2.default, '<ol><li><br></li></ol>');
	    editor.insertText(0, 'Test');
	    expect(this.container).toEqualHTML('<ol><li>Test</li></ol>');
	    editor.deleteText(0, 4);
	    expect(this.container).toEqualHTML('<ol><li><br></li></ol>');
	  });

	  it('delete multiple items', function () {
	    var editor = this.initialize(_editor2.default, '\n      <ol>\n        <li>0123</li>\n        <li>5678</li>\n        <li>0123</li>\n      </ol>');
	    editor.deleteText(2, 5);
	    expect(this.container).toEqualHTML('\n      <ol>\n        <li>0178</li>\n        <li>0123</li>\n      </ol>');
	  });

	  it('delete across last item', function () {
	    var editor = this.initialize(_editor2.default, '\n      <ol><li>0123</li></ol>\n      <p>5678</p>');
	    editor.deleteText(2, 5);
	    expect(this.container).toEqualHTML('<ol><li>0178</li></ol>');
	  });

	  it('delete partial', function () {
	    var editor = this.initialize(_editor2.default, '<p>0123</p><ul><li>5678</li></ul>');
	    editor.deleteText(2, 5);
	    expect(this.container).toEqualHTML('<p>0178</p>');
	  });

	  it('nested list replacement', function () {
	    var editor = this.initialize(_editor2.default, '\n      <ol>\n        <li>One</li>\n        <li class=\'ql-indent-1\'>Alpha</li>\n        <li>Two</li>\n      </ol>\n    ');
	    editor.formatLine(1, 10, { list: 'bullet' });
	    expect(this.container).toEqualHTML('\n      <ul>\n        <li>One</li>\n        <li class=\'ql-indent-1\'>Alpha</li>\n        <li>Two</li>\n      </ul>\n    ');
	  });

	  it('copy atttributes', function () {
	    var editor = this.initialize(_editor2.default, '<p class="ql-align-center">Test</p>');
	    editor.formatLine(4, 1, { list: 'bullet' });
	    expect(this.container).toEqualHTML('<ul><li class="ql-align-center">Test</li></ul>');
	  });
	});

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _selection = __webpack_require__(40);

	var _core = __webpack_require__(2);

	var _core2 = _interopRequireDefault(_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Clipboard', function () {
	  describe('events', function () {
	    beforeEach(function () {
	      this.event = {
	        clipboardData: {
	          getData: function getData() {},
	          setData: function setData() {}
	        },
	        preventDefault: function preventDefault() {}
	      };
	      this.quill = this.initialize(_core2.default, '<h1>0123</h1><p>5<em>67</em>8</p>');
	      this.quill.setSelection(2, 5);
	    });

	    it('paste', function (done) {
	      var _this = this;

	      this.event.clipboardData.types = ['text'];
	      spyOn(this.event.clipboardData, 'getData').and.returnValue('|');
	      this.quill.clipboard.container.innerHTML = '<strong>|</strong>';
	      this.quill.clipboard.onPaste(this.event);
	      setTimeout(function () {
	        expect(_this.quill.root).toEqualHTML('<h1>01<strong>|</strong><em>7</em>8</h1>');
	        expect(_this.quill.getSelection()).toEqual(new _selection.Range(3));
	        done();
	      }, 2);
	    });
	  });

	  describe('convert', function () {
	    beforeEach(function () {
	      var quill = this.initialize(_core2.default, '');
	      this.clipboard = quill.clipboard;
	    });

	    it('plain text', function () {
	      var delta = this.clipboard.convert('simple plain text');
	      expect(delta).toEqual(new _delta2.default().insert('simple plain text'));
	    });

	    it('whitespace', function () {
	      var html = '<div> 0 </div> <div> <div> 1 2 <span> 3 </span> 4 </div> </div>' + '<div><span>5 </span><span>6 </span><span> 7</span><span> 8</span></div>';
	      var delta = this.clipboard.convert(html);
	      expect(delta).toEqual(new _delta2.default().insert('0\n1 2  3  4\n5 6  7 8'));
	    });

	    it('inline whitespace', function () {
	      var html = '<p>0 <strong>1</strong> 2</p>';
	      var delta = this.clipboard.convert(html);
	      expect(delta).toEqual(new _delta2.default().insert('0 ').insert('1', { bold: true }).insert(' 2'));
	    });

	    it('intentional whitespace', function () {
	      var html = '0&nbsp;<strong>1</strong>&nbsp;2';
	      var delta = this.clipboard.convert(html);
	      expect(delta).toEqual(new _delta2.default().insert('0 ').insert('1', { bold: true }).insert(' 2'));
	    });

	    it('consecutive intentional whitespace', function () {
	      var html = '<strong>&nbsp;&nbsp;1&nbsp;&nbsp;</strong>';
	      var delta = this.clipboard.convert(html);
	      expect(delta).toEqual(new _delta2.default().insert('  1  ', { bold: true }));
	    });

	    it('break', function () {
	      var html = '<div>0<br>1</div><div>2<br></div><div>3</div><div><br>4</div><div><br></div><div>5</div>';
	      var delta = this.clipboard.convert(html);
	      expect(delta).toEqual(new _delta2.default().insert('0\n1\n2\n3\n\n4\n\n5'));
	    });

	    it('alias', function () {
	      var delta = this.clipboard.convert('<b>Bold</b><i>Italic</i>');
	      expect(delta).toEqual(new _delta2.default().insert('Bold', { bold: true }).insert('Italic', { italic: true }));
	    });

	    it('pre', function () {
	      var html = '<div style="white-space: pre;"> 01 \n 23 </div>';
	      var delta = this.clipboard.convert(html);
	      expect(delta).toEqual(new _delta2.default().insert(' 01 \n 23 '));
	    });

	    it('nested list', function () {
	      var delta = this.clipboard.convert('<ol><li>One</li><li class="ql-indent-1">Alpha</li></ol>');
	      expect(delta).toEqual(new _delta2.default().insert('One\n', { list: 'ordered' }).insert('Alpha\n', { list: 'ordered', indent: 1 }));
	    });

	    it('embeds', function () {
	      var delta = this.clipboard.convert('<div>01<img src="/assets/favicon.png">34</div>');
	      expect(delta).toEqual(new _delta2.default().insert('01').insert({ image: '/assets/favicon.png' }).insert('34'));
	    });

	    it('block embed', function () {
	      var delta = this.clipboard.convert('<p>01</p><iframe src="#"></iframe><p>34</p>');
	      expect(delta).toEqual(new _delta2.default().insert('01\n').insert({ video: '#' }).insert('34'));
	    });

	    it('custom matcher', function () {
	      this.clipboard.addMatcher(Node.TEXT_NODE, function (node, delta) {
	        var index = 0;
	        var regex = /https?:\/\/[^\s]+/g;
	        var match = null;
	        var composer = new _delta2.default();
	        while ((match = regex.exec(node.data)) !== null) {
	          composer.retain(match.index - index);
	          index = regex.lastIndex;
	          composer.retain(match[0].length, { link: match[0] });
	        }
	        return delta.compose(composer);
	      });
	      var delta = this.clipboard.convert('http://github.com https://quilljs.com');
	      var expected = new _delta2.default().insert('http://github.com', { link: 'http://github.com' }).insert(' ').insert('https://quilljs.com', { link: 'https://quilljs.com' });
	      expect(delta).toEqual(expected);
	    });
	  });
	});

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _delta = __webpack_require__(21);

	var _delta2 = _interopRequireDefault(_delta);

	var _core = __webpack_require__(2);

	var _core2 = _interopRequireDefault(_core);

	var _history = __webpack_require__(52);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('History', function () {
	  describe('getLastChangeIndex', function () {
	    it('delete', function () {
	      var delta = new _delta2.default().retain(4).delete(2);
	      expect((0, _history.getLastChangeIndex)(delta)).toEqual(4);
	    });

	    it('delete with inserts', function () {
	      var delta = new _delta2.default().retain(4).insert('test').delete(2);
	      expect((0, _history.getLastChangeIndex)(delta)).toEqual(8);
	    });

	    it('insert text', function () {
	      var delta = new _delta2.default().retain(4).insert('testing');
	      expect((0, _history.getLastChangeIndex)(delta)).toEqual(11);
	    });

	    it('insert embed', function () {
	      var delta = new _delta2.default().retain(4).insert({ image: true });
	      expect((0, _history.getLastChangeIndex)(delta)).toEqual(5);
	    });

	    it('insert with deletes', function () {
	      var delta = new _delta2.default().retain(4).delete(3).insert('!');
	      expect((0, _history.getLastChangeIndex)(delta)).toEqual(5);
	    });

	    it('format', function () {
	      var delta = new _delta2.default().retain(4).retain(3, { bold: true });
	      expect((0, _history.getLastChangeIndex)(delta)).toEqual(7);
	    });

	    it('format newline', function () {
	      var delta = new _delta2.default().retain(4).retain(1, { align: 'left' });
	      expect((0, _history.getLastChangeIndex)(delta)).toEqual(4);
	    });

	    it('format mixed', function () {
	      var delta = new _delta2.default().retain(4).retain(1, { align: 'left', bold: true });
	      expect((0, _history.getLastChangeIndex)(delta)).toEqual(4);
	    });

	    it('insert newline', function () {
	      var delta = new _delta2.default().retain(4).insert('a\n');
	      expect((0, _history.getLastChangeIndex)(delta)).toEqual(5);
	    });

	    it('mutliple newline inserts', function () {
	      var delta = new _delta2.default().retain(4).insert('ab\n\n');
	      expect((0, _history.getLastChangeIndex)(delta)).toEqual(7);
	    });
	  });

	  describe('undo/redo', function () {
	    beforeEach(function () {
	      this.initialize(HTMLElement, '<div><p>The lazy fox</p></div>');
	      this.quill = new _core2.default(this.container.firstChild, {
	        modules: {
	          'history': { delay: 400 }
	        }
	      });
	      this.original = this.quill.getContents();
	    });

	    it('user change', function () {
	      this.quill.root.firstChild.innerHTML = 'The lazy foxes';
	      this.quill.update();
	      var changed = this.quill.getContents();
	      expect(changed).not.toEqual(this.original);
	      this.quill.history.undo();
	      expect(this.quill.getContents()).toEqual(this.original);
	      this.quill.history.redo();
	      expect(this.quill.getContents()).toEqual(changed);
	    });

	    it('merge changes', function () {
	      expect(this.quill.history.stack.undo.length).toEqual(0);
	      this.quill.updateContents(new _delta2.default().retain(12).insert('e'));
	      expect(this.quill.history.stack.undo.length).toEqual(1);
	      this.quill.updateContents(new _delta2.default().retain(13).insert('s'));
	      expect(this.quill.history.stack.undo.length).toEqual(1);
	      this.quill.history.undo();
	      expect(this.quill.getContents()).toEqual(this.original);
	      expect(this.quill.history.stack.undo.length).toEqual(0);
	    });

	    it('dont merge changes', function (done) {
	      var _this = this;

	      expect(this.quill.history.stack.undo.length).toEqual(0);
	      this.quill.updateContents(new _delta2.default().retain(12).insert('e'));
	      expect(this.quill.history.stack.undo.length).toEqual(1);
	      setTimeout(function () {
	        _this.quill.updateContents(new _delta2.default().retain(13).insert('s'));
	        expect(_this.quill.history.stack.undo.length).toEqual(2);
	        done();
	      }, this.quill.history.options.delay * 1.25);
	    });

	    it('multiple undos', function (done) {
	      var _this2 = this;

	      expect(this.quill.history.stack.undo.length).toEqual(0);
	      this.quill.updateContents(new _delta2.default().retain(12).insert('e'));
	      var contents = this.quill.getContents();
	      setTimeout(function () {
	        _this2.quill.updateContents(new _delta2.default().retain(13).insert('s'));
	        _this2.quill.history.undo();
	        expect(_this2.quill.getContents()).toEqual(contents);
	        _this2.quill.history.undo();
	        expect(_this2.quill.getContents()).toEqual(_this2.original);
	        done();
	      }, this.quill.history.options.delay * 1.25);
	    });

	    it('transform api change', function () {
	      this.quill.history.options.userOnly = true;
	      this.quill.updateContents(new _delta2.default().retain(12).insert('es'), _core2.default.sources.USER);
	      this.quill.history.lastRecorded = 0;
	      this.quill.updateContents(new _delta2.default().retain(14).insert('!'), _core2.default.sources.USER);
	      this.quill.history.undo();
	      this.quill.updateContents(new _delta2.default().retain(4).delete(5), _core2.default.sources.API);
	      expect(this.quill.getContents()).toEqual(new _delta2.default().insert('The foxes\n'));
	      this.quill.history.undo();
	      expect(this.quill.getContents()).toEqual(new _delta2.default().insert('The fox\n'));
	      this.quill.history.redo();
	      expect(this.quill.getContents()).toEqual(new _delta2.default().insert('The foxes\n'));
	      this.quill.history.redo();
	      expect(this.quill.getContents()).toEqual(new _delta2.default().insert('The foxes!\n'));
	    });

	    it('transform preserve intention', function () {
	      var url = 'https://www.google.com/';
	      this.quill.history.options.userOnly = true;
	      this.quill.updateContents(new _delta2.default().insert(url, { link: url }), _core2.default.sources.USER);
	      this.quill.history.lastRecorded = 0;
	      this.quill.updateContents(new _delta2.default().delete(url.length).insert('Google', { link: url }), _core2.default.sources.API);
	      this.quill.history.lastRecorded = 0;
	      this.quill.updateContents(new _delta2.default().retain(this.quill.getLength() - 1).insert('!'), _core2.default.sources.USER);
	      this.quill.history.lastRecorded = 0;
	      expect(this.quill.getContents()).toEqual(new _delta2.default().insert('Google', { link: url }).insert('The lazy fox!\n'));
	      this.quill.history.undo();
	      expect(this.quill.getContents()).toEqual(new _delta2.default().insert('Google', { link: url }).insert('The lazy fox\n'));
	      this.quill.history.undo();
	      expect(this.quill.getContents()).toEqual(new _delta2.default().insert('Google', { link: url }).insert('The lazy fox\n'));
	    });

	    it('ignore remote changes', function () {
	      this.quill.history.options.delay = 0;
	      this.quill.history.options.userOnly = true;
	      this.quill.setText('\n');
	      this.quill.insertText(0, 'a', _core2.default.sources.USER);
	      this.quill.insertText(1, 'b', _core2.default.sources.API);
	      this.quill.insertText(2, 'c', _core2.default.sources.USER);
	      this.quill.insertText(3, 'd', _core2.default.sources.API);
	      expect(this.quill.getText()).toEqual('abcd\n');
	      this.quill.history.undo();
	      expect(this.quill.getText()).toEqual('abd\n');
	      this.quill.history.undo();
	      expect(this.quill.getText()).toEqual('bd\n');
	      this.quill.history.redo();
	      expect(this.quill.getText()).toEqual('abd\n');
	      this.quill.history.redo();
	      expect(this.quill.getText()).toEqual('abcd\n');
	    });
	  });
	});

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _toolbar = __webpack_require__(68);

	var _toolbar2 = _interopRequireDefault(_toolbar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Toolbar', function () {
	  describe('add controls', function () {
	    it('single level', function () {
	      (0, _toolbar.addControls)(this.container, ['bold', 'italic']);
	      expect(this.container).toEqualHTML('\n        <span class="ql-formats">\n          <button type="button" class="ql-bold"></button>\n          <button type="button" class="ql-italic"></button>\n        </span>\n      ');
	    });

	    it('nested group', function () {
	      (0, _toolbar.addControls)(this.container, [['bold', 'italic'], ['underline', 'strike']]);
	      expect(this.container).toEqualHTML('\n        <span class="ql-formats">\n          <button type="button" class="ql-bold"></button>\n          <button type="button" class="ql-italic"></button>\n        </span>\n        <span class="ql-formats">\n          <button type="button" class="ql-underline"></button>\n          <button type="button" class="ql-strike"></button>\n        </span>\n      ');
	    });

	    it('button value', function () {
	      (0, _toolbar.addControls)(this.container, ['bold', { header: '2' }]);
	      expect(this.container).toEqualHTML('\n        <span class="ql-formats">\n          <button type="button" class="ql-bold"></button>\n          <button type="button" class="ql-header" value="2"></button>\n        </span>\n      ');
	    });

	    it('select', function () {
	      (0, _toolbar.addControls)(this.container, [{ size: ['10px', false, '18px', '32px'] }]);
	      expect(this.container).toEqualHTML('\n        <span class="ql-formats">\n          <select class="ql-size">\n            <option value="10px"></option>\n            <option selected="selected"></option>\n            <option value="18px"></option>\n            <option value="32px"></option>\n          </select>\n        </span>\n      ');
	    });

	    it('everything', function () {
	      (0, _toolbar.addControls)(this.container, [[{ font: [false, 'sans-serif', 'monospace'] }, { size: ['10px', false, '18px', '32px'] }], ['bold', 'italic', 'underline', 'strike'], [{ list: 'ordered' }, { list: 'bullet' }, { align: [false, 'center', 'right', 'justify'] }], ['link', 'image']]);
	      expect(this.container).toEqualHTML('\n        <span class="ql-formats">\n          <select class="ql-font">\n            <option selected="selected"></option>\n            <option value="sans-serif"></option>\n            <option value="monospace"></option>\n          </select>\n          <select class="ql-size">\n            <option value="10px"></option>\n            <option selected="selected"></option>\n            <option value="18px"></option>\n            <option value="32px"></option>\n          </select>\n        </span>\n        <span class="ql-formats">\n          <button type="button" class="ql-bold"></button>\n          <button type="button" class="ql-italic"></button>\n          <button type="button" class="ql-underline"></button>\n          <button type="button" class="ql-strike"></button>\n        </span>\n        <span class="ql-formats">\n          <button type="button" class="ql-list" value="ordered"></button>\n          <button type="button" class="ql-list" value="bullet"></button>\n          <select class="ql-align">\n            <option selected="selected"></option>\n            <option value="center"></option>\n            <option value="right"></option>\n            <option value="justify"></option>\n          </select>\n        </span>\n        <span class="ql-formats">\n          <button type="button" class="ql-link"></button>\n          <button type="button" class="ql-image"></button>\n        </span>\n      ');
	    });
	  });
	});

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _quill = __webpack_require__(19);

	var _quill2 = _interopRequireDefault(_quill);

	var _snow = __webpack_require__(108);

	var _snow2 = _interopRequireDefault(_snow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Snow', function () {
	  describe('options', function () {
	    beforeEach(function () {
	      this.container.innerHTML = '<div id="toolbar"></div><div id="editor"></div>';
	      this.quill = this.initialize(_quill2.default, '', this.container.lastChild);
	    });

	    it('default', function () {
	      var theme = new _snow2.default(this.quill, {
	        modules: {
	          toolbar: true
	        }
	      });
	      var toolbar = theme.addModule('toolbar');
	      expect(toolbar.container.querySelector('.ql-bold')).toBeTruthy();
	      expect(toolbar.container.querySelector('.ql-italic')).toBeTruthy();
	    });

	    it('selector', function () {
	      var theme = new _snow2.default(this.quill, {
	        modules: {
	          toolbar: '#toolbar'
	        }
	      });
	      var toolbar = theme.addModule('toolbar');
	      expect(toolbar.container).toEqual(this.container.firstChild);
	    });

	    it('dom node', function () {
	      var theme = new _snow2.default(this.quill, {
	        modules: {
	          toolbar: document.querySelector('#toolbar')
	        }
	      });
	      var toolbar = theme.addModule('toolbar');
	      expect(toolbar.container).toEqual(this.container.firstChild);
	    });

	    it('array', function () {
	      var theme = new _snow2.default(this.quill, {
	        modules: {
	          toolbar: ['bold']
	        }
	      });
	      var toolbar = theme.addModule('toolbar');
	      expect(toolbar.container.querySelector('.ql-bold')).toBeTruthy();
	      expect(toolbar.container.querySelector('.ql-italic')).toBeFalsy();
	    });

	    it('custom handler, default container', function () {
	      var theme = new _snow2.default(this.quill, {
	        modules: {
	          toolbar: {
	            handlers: {
	              bold: function bold(value) {}
	            }
	          }
	        }
	      });
	      var toolbar = theme.addModule('toolbar');
	      expect(toolbar.container.querySelector('.ql-bold')).toBeTruthy();
	      expect(toolbar.container.querySelector('.ql-italic')).toBeTruthy();
	    });
	  });
	});

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _picker = __webpack_require__(101);

	var _picker2 = _interopRequireDefault(_picker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	describe('Picker', function () {
	  it('initialization', function () {
	    this.container.innerHTML = '<select><option selected>0</option><option value="1">1</option></select>';
	    var picker = new _picker2.default(this.container.firstChild);
	    expect(this.container.querySelector('.ql-picker')).toBeTruthy();
	    expect(this.container.querySelector('.ql-active')).toBeFalsy();
	    expect(this.container.querySelector('.ql-picker-item.ql-selected').outerHTML).toEqualHTML('<span class="ql-picker-item ql-selected" data-label="0"></span>');
	    expect(this.container.querySelector('.ql-picker-item:not(.ql-selected)').outerHTML).toEqualHTML('<span class="ql-picker-item" data-value="1" data-label="1"></span>');
	  });
	});

/***/ }
/******/ ])
});
;