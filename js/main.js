import * as framework from './lib/framework.js';

window.framework = framework;

function addSomeNumber(state, number) {
    state.numbers.push(number); return state;
}

function deQueueSomeNumber(state) {
    if(state.numbers.length >= 1) {
      state.numbers = state.numbers.slice(1);
    }

    return state;
}

var app                 = framework.makeApp();

var addSomeNumberSource = app.source();
var addSomeNumberSink   = addSomeNumberSource.map(framework.makeSink(addSomeNumber));
app.sink(addSomeNumberSink);

var deQueueSomeNumberSource = app.source();
var deQueueSomeNumberSink   = deQueueSomeNumberSource.map(framework.makeSink(deQueueSomeNumber));
app.sink(deQueueSomeNumberSink);

async function onChange(state) {
  if(state.numbers.length === 0){
    //render loading
    console.log('loading...');
    //get new numbers, but just once
    await getNewNumbers();
  } else {
    //render app
    console.log(JSON.stringify(state));
  }
}

app.start({numbers: []}, onChange);

function getNewNumbers() {
  fetch('/numbers.json')
    .then(function(response) {
      return response.json()
    }).then(function(numbers) {
    numbers.map(number => framework.dispatch(addSomeNumberSource, number));
  });
}

var button = document.createElement('button');

button.textContent = 'Consume Number';
button.onclick = () => {
  framework.dispatch(deQueueSomeNumberSource);
};

document.body.appendChild(button);
