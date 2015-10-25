/******/ (function(modules) { // webpackBootstrap
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

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _libFrameworkJs = __webpack_require__(1);

	var framework = _interopRequireWildcard(_libFrameworkJs);

	module.exports = {
	    dispatch: framework.dispatch,
	    makeDispatcher: framework.makeDispatcher,
	    makeSink: framework.makeSink,
	    makeApp: framework.makeApp
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.dispatch = dispatch;
	exports.makeDispatcher = makeDispatcher;
	exports.makeSink = makeSink;
	exports.makeApp = makeApp;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	var _rx = __webpack_require__(2);

	var _rx2 = _interopRequireDefault(_rx);

	var _lodash = __webpack_require__(3);

	var _lodash2 = _interopRequireDefault(_lodash);

	function dispatch(source) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	    }

	    source.onNext(args);
	}

	function makeDispatcher(source) {
	    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	    }

	    return function () {
	        dispatch.apply(undefined, [source].concat(args));
	    };
	}

	function makeSink(fn) {
	    var partialFn = _lodash2['default'].curryRight(fn);
	    return function (args) {
	        // If we're given a single argument not in an list, make it into a singleton
	        if (args !== undefined && !Array.isArray(args)) args = [args];

	        return args === undefined ? fn : partialFn.apply(undefined, _toConsumableArray(args));
	    };
	}

	function makeApp() {
	    var sinks = [];
	    var updateState = function updateState(state, fn) {
	        return fn(state);
	    };

	    return {
	        source: function source() {
	            return new _rx2['default'].Subject();
	        },
	        sink: function sink(observable) {
	            sinks.push(observable);

	            return this;
	        },
	        directlySink: function directlySink(fn) {
	            var source = this.source();
	            this.sink(source.map(makeSink(fn)));

	            return source;
	        },
	        start: function start(initialState, fn) {
	            var state = _rx2['default'].Observable.merge(sinks).scan(updateState, initialState).startWith(initialState);

	            return state.subscribe(fn);
	        }
	    };
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = Rx;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = _;

/***/ }
/******/ ]);