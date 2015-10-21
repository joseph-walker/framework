import {makeSink} from 'lib/framework.js';
import {app}      from 'app/app.js';

function incrementLater(state) {
    state.counter++; return state;
}

var incrementLaterSource = app.source();
var incrementLaterSink   = app.sink(incrementLaterSource.delay(500).map(makeSink(incrementLater)));

export default incrementLaterSource;
