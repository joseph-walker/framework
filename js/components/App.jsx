import React                      from 'react';
import increment                  from 'actions/increment.js';
import decrement                  from 'actions/decrement.js';
import incrementBy                from 'actions/incrementBy.js';
import {dispatch, makeDispatcher} from 'lib/framework.js';

export default class App extends React.Component {    
    incrementBy = () => {
        dispatch(incrementBy, parseInt(this.refs.incrementer.value) || 0);
    }
    
    render() {
        return (
            <div>
                <h1>Hello World: {this.props.counter}</h1>
                <button
                    onClick={makeDispatcher(increment)}>
                    Add One
                </button>
                <button
                    onClick={makeDispatcher(incrementBy, 4)}>
                    Add Four
                </button>
                <button
                    onClick={makeDispatcher(decrement)}>
                    Subtract One
                </button>
                <input
                    ref="incrementer"
                    type="number"
                    min="-5"
                    max="5"
                    placeholder="0" />
                <button
                    onClick={this.incrementBy}>
                    Modify
                </button>
            </div>
        );
    }
}
