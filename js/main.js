import {app}    from 'app/app.js';
import App      from 'components/App.jsx';
import ReactDOM from 'react-dom';

let initialState = {
    counter: 0
};

app.start(initialState, function(state) {
    ReactDOM.render(<App {...state} />, document.getElementById('app'));
});
