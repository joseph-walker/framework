import {makeSink} from 'lib/framework.js';
import {app}      from 'app/app.js';

function increment(state) {
    state.counter++; return state;
}

var incrementSource = app.source();
var incrementSink   = app.sink(incrementSource.map(makeSink(increment)));

export default incrementSource;
