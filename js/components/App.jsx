import React            from 'react';
import increment        from 'actions/increment.js';
import decrement        from 'actions/decrement.js';
import {makeDispatcher} from 'lib/framework.js';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello World: {this.props.counter}</h1>
                <button onClick={makeDispatcher(increment)}>Add One</button>
                <button onClick={makeDispatcher(decrement)}>Subtract One</button>
            </div>
        );
    }
}
