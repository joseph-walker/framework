import {app} from 'app/app.js';

export default app.directlySink(function(state) {
    state.counter++; return state;
});
