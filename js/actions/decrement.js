import {makeSink} from 'lib/framework.js';
import {app}      from 'app/app.js';

function decrement(state) {
    state.counter--; return state;
}

var decrementSource = app.source();
var decrementSink   = app.sink(decrementSource.map(makeSink(decrement)));

export default decrementSource;
