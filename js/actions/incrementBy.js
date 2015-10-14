import {makeSink} from 'lib/framework.js';
import {app}      from 'app/app.js';

function incrementBy(state, amount) {
    state.counter += amount; return state;
}

var incrementBySource = app.source();
var incrementBySink   = app.sink(incrementBySource.map(makeSink(incrementBy)));

export default incrementBySource;
