import * as framework from './lib/framework.js';

// Pure State Manipulations
function pushNumberToState(state, number) {
    state.numbers.push(number); return state;
}

function shiftNumberFromState(state) {
    if (state.numbers.length <= 1) {
        framework.dispatch(getMoreNumbers);
    }
    
    return {
        numbers: state.numbers.slice(1)
    };
}

function getNumbers() {
    return fetch('/numbers.json')
        .then((response) => response.json());
}

// App Delcaration
var app = framework.makeApp();

// Sources & Sinks
var getMoreNumbers = app.source();
var getMoreNumbersSink =
    getMoreNumbers
        .flatMapLatest(() => {
            return Rx.Observable.fromPromise(getNumbers());
        })
        .flatMap((numbers) => {
            return Rx.Observable.from(numbers);
        })
        .map(framework.makeSink(pushNumberToState));
    
var shiftNumberOnInterval = Rx.Observable.interval(1000);
var shiftNumberSink =
    shiftNumberOnInterval
        .map(() => framework.makeSink(shiftNumberFromState));
        
// Register the sinks
app.sink(getMoreNumbersSink);
app.sink(shiftNumberSink);

// Initial State
var initialState = {
    numbers: []
};

// Application
app.start(initialState, (state) => {
    console.log(state.numbers);
});
