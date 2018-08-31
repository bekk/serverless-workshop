import React, { Component } from 'react';
import fetch from 'node-fetch';
import Station from './Station';
import './App.css';

const API_URL = 'https://1wp8xzhe90.execute-api.eu-west-3.amazonaws.com/latest/vippetangen';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Stations: []
    }
  }

  async fetchData () {
    const response = await fetch(API_URL);
    const json = await response.json();
    this.setState({
      Stations: [json.Item]
    })
  }

  componentDidMount() {
    this.fetchData();
    setInterval(() => this.fetchData(), 10000);
  }
  render() {
    const stations = this.state.Stations.map((station, index) => {
      return (
        <Station key={index} name={station.StopPlace} departures={station.Times} />
      );
    });
    return (
      <div className="App">
        <h1>EnTur Sanntid</h1>
        {stations}
      </div>
    );
  }
}

export default App;
