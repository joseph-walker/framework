import Rx from 'rx';

export function dispatch(source) {
    source.onNext();
}

export function makeDispatcher(source) {
    return function() {
        source.onNext();
    };
}

export function makeSink(fn) {
    return function() {
        return fn;
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
