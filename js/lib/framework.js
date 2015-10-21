import Rx from 'rx';
import _  from 'lodash';

export function dispatch(source, ...args) {
    source.onNext(args);
}

export function makeDispatcher(source, ...args) {
    return function() {
        dispatch(source, ...args);
    };
}

export function makeSink(fn) {
    var partialFn = _.curryRight(fn);
    return function(args) {
        return args === undefined ? fn : partialFn(...args);
    };
}

export function makeApp() {
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
