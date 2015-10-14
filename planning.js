// app.js
// -----------------------------------------------------------------------------

import {makeApp} from '/lib/friar.js';

export var app  = makeApp();
export var sink = app.sink;

// nextStep.js
// -----------------------------------------------------------------------------

import {sink} from '/app.js';
import {makeSink, makeSource} from '/lib/friar.js';

var goToNextStep = function(state) {
    return state.set('currentStep', state.get('currentStep') + 1);
};

export var nextStepSource = makeSource();
export var nextStepSink   = sink(nextStepSource.map(makeSink(goToNextStep)));

// App.jsx
// -----------------------------------------------------------------------------

import {dispatch} from '/lib/friar.js';
import {nextStepSource as nextStep} from '/nextStep.js';

export class App extends React.Component {
    render() {
        return (
            <div className="app">
                <h1>You are on step {this.props.currentStep}</h1>
                <button onClick={dispatch(nextStep)}></button>
            </div>
        );
    }
}

dispatch(nextStep);

// main.js
// -----------------------------------------------------------------------------

import {app} from '/app.js';
import {App} from '/components/App.jsx';

var initialState = {
    'currentStep': 0
};

app.start(initialState, function(state) {
    React.render(<App {...state.toJs()} />, document.getElementById('app'));
});
