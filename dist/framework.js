'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var Rx = require('rx');

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

/**
 * Provides a function that partially applies the given function
 * that accepts n arguments, by calling it with an array of arguments [2, 3, ... n] arguments, 
 * and then returning a function closed over that accepts the 1st argument and evaluates.
 * Since the source has to dispatch its arguments via an array, the simplest way to accept
 * the arguments to curry is an array.
 *
 * The function called from `makeSink` is called internally, so this less-than-pretty API
 * of passing arguments via array is never truly exposed to the end user.
 * 
 * @param  {Function} fn Function to 'curry'
 * @return {Function}    Function that will be dispatched
 */
function makeSink(fn) {
    return function (args) {
        if (args.length !== fn.length - 1) // Because we expect 1 argument - state
            throw 'Given function expected ' + (fn.length - 1) + ' arguments, but you provided ' + args.length;

        return function (state) {
            return fn.apply(undefined, [state].concat(_toConsumableArray(args)));
        };
    };
}

function makeApp() {
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
}

module.exports = {
    dispatch: dispatch,
    makeDispatcher: makeDispatcher,
    makeSink: makeSink,
    makeApp: makeApp
};

