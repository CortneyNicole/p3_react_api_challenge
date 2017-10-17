import React from 'react';
import Counter from './Counter';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counts: []
    }

    this.increment = this.increment.bind(this)
    this.decrement = this.decrement.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.addNewCounter = this.addNewCounter.bind(this)
  }

  addNewCounter(event) {
    event.preventDefault()
    const newCounts = this.state.counts.concat([{value: 0, countBy: parseInt(this.state.nextCountBy)}])
    this.setState({ counts: newCounts, nextCountBy: "" })
  }

  removeCounter(index) {
    this.state.counts.splice(index, 1)
    this.setState({ counts: this.state.counts })
  }

  axiosCall(id, randomNum) {
    return axios.put(`http://numbers-api.herokuapp.com/counters/${id}`, { counter: { count_by: randomNum}})
  }

  upDateArray(id, randomNum) {
    const copiedEntireArray = this.state.counts.slice()
      const index = copiedEntireArray.findIndex((counter) => counter.id === id)
      copiedEntireArray[index].value +=  randomNum
      // console.log(response)
      this.setState({counts: copiedEntireArray })
  }

  increment(id) {
    const randomNum = Math.floor(Math.random() * 100);
    this.axiosCall(id, randomNum)
    .then(response => {
      this.upDateArray(id, randomNum)
    });
  }

  decrement(id) {
    const randomNum = Math.floor(Math.random() * -100);
    this.axiosCall(id, randomNum)
    .then(response => {
      this.upDateArray(id, randomNum)
    });

  }

  total(){
    return this.state.counts.reduce(function(total, counterData) {
      return total + counterData.value
    }, 0)
  }

  handleInput(event) {
    this.setState({ nextCountBy: event.target.value })
  }

  componentDidMount() {
    axios.get(`http://numbers-api.herokuapp.com/counters`)
      .then(response => {
        this.setState({counts: response.data})
      });
  }

  render() {
    return (
      <div className="page-center-frame">
        {this.state.counts.map((counterData, index) =>
          <Counter
            value={counterData.value}
            removeCounter={() => this.removeCounter(index)}
            increment={() => this.increment(counterData.id)}
            decrement={() => this.decrement(counterData.id)}
            />
        )}

        <p>Total: {this.total()}</p>

        <form action="" onSubmit={this.addNewCounter}>
          <input
            type="number"
            onChange={this.handleInput}
            value={this.state.nextCountBy}
            />
          <button>Add Counter</button>
        </form>
      </div>
    );
  }
}

export default App;
