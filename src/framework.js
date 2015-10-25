var Rx = require('rx');
var _  = require('lodash');

module.exports.dispatch = function dispatch(source, ...args) {
    source.onNext(args);
}

module.exports.makeDispatcher = function makeDispatcher(source, ...args) {
    return function() {
        dispatch(source, ...args);
    };
}

module.exports.makeSink = function makeSink(fn) {
    var partialFn = _.curryRight(fn);
    return function(args) {
        // If we're given a single argument not in an list, make it into a singleton
        if (args !== undefined && !Array.isArray(args))
            args = [args];
            
        return args === undefined ? fn : partialFn(...args);
    };
}

module.exports.makeApp = function makeApp() {
    var sinks = [];
    var updateState = function(state, fn) {
        return fn(state);
    };
    
    return {
        source: function() {
            return new Rx.Subject();
        },
        sink: function(observable) {
            sinks.push(observable);
            
            return this;
        },
        directlySink: function(fn) {
            var source = this.source();
            this.sink(source.map(makeSink(fn)));
            
            return source;
        },
        start: function(initialState, fn) {
            var state = Rx.Observable
                .merge(sinks)
                .scan(updateState, initialState)
                .startWith(initialState);
                
            return state.subscribe(fn);
        }
    };
}
