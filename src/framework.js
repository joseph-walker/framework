var Rx = require('rx');

function dispatch(source, ...args) {
    source.onNext(args);
}

function makeDispatcher(source, ...args) {
    return function() {
        dispatch(source, ...args);
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
    return function(args) {
        if (args.length !== fn.length - 1) // Because we expect 1 argument - state
            throw 'Given function expected ' + (fn.length - 1) + ' arguments, but you provided ' + args.length;

        return function(state) {
            return fn(state, ...args);
        };
    };
}

function makeApp() {
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
        sinkAndThen: function(fnNow, promiseGenerator, fnLater) {
            var source    = this.source();
            var sinkNow   = makeSink(fnNow);
            var sinkLater = makeSink(fnLater);

            app.sink(
                sinkNow
            );

            app.sink(
                source
                    .flatMapLatest(args => Rx.Observable.fromPromise(promiseGenerator(args)))
                    .map(sinkLater)
            );

            return source;
        },
        start: function(initialState, fn) {
            var state = Rx.Observable
                .merge(sinks)
                .scan(updateState, initialState);

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
