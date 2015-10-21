import {app} from 'app/app.js';

export default app.directlySink(function(state, amount) {
    state.counter += amount; return state;
});
