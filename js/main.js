import * as framework from './lib/framework.js';

function addSomeNumber(state, number) {
    state.numbers.push(number); return state;
}

function deQueueSomeNumber(state) {
    return state.numbers.slice(1);
}

var app                 = framework.makeApp();

var addSomeNumberSource = app.source();
var addSomeNumberSink   = addSomeNumberSource.map(framework.makeSink(addSomeNumber));
app.sink(addSomeNumberSink);

var deQueueSomeNumberSource = app.source();
var deQueueSomeNumberSink   = deQueueSomeNumberSource.map(framework.makeSink(deQueueSomeNumber));
app.sink(deQueueSomeNumberSink);

async function onchange(state) {
  if(state.numbers.length === 0){
    await getNewNumbers();
  }

  console.log(state.numbers);
}

app.start({numbers: []}, onchange);

function getNewNumbers() {
  fetch('/numbers.json')
    .then(function(response) {
      return response.json()
    }).then(function(numbers) {
    numbers.map(number => framework.dispatch(addSomeNumberSource, number));
  });
}

setInterval(() => {
  framework.dispatch(deQueueSomeNumber);
}, 1000);
