'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var Rx = require('rx');
var _ = require('lodash');

module.exports.dispatch = function dispatch(source) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    source.onNext(args);
};

module.exports.makeDispatcher = function makeDispatcher(source) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
    }

    return function () {
        dispatch.apply(undefined, [source].concat(args));
    };
};

module.exports.makeSink = function makeSink(fn) {
    var partialFn = _.curryRight(fn);
    return function (args) {
        // If we're given a single argument not in an list, make it into a singleton
        if (args !== undefined && !Array.isArray(args)) args = [args];

        return args === undefined ? fn : partialFn.apply(undefined, _toConsumableArray(args));
    };
};

module.exports.makeApp = function makeApp() {
    var sinks = [];
    var updateState = function updateState(state, fn) {
        return fn(state);
    };

    return {
        source: function source() {
            return new Rx.Subject();
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
            var state = Rx.Observable.merge(sinks).scan(updateState, initialState).startWith(initialState);

            return state.subscribe(fn);
        }
    };
};

