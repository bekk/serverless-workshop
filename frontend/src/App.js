import React, { Component } from 'react';
import Station from './Station';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: []
    }
  }

  componentDidMount() {
    const json = [
      {
        StopPlace: 'Vippetangen',
        Times: [
          {
            line: "Vippetangen - Tonsenhagen",
            expectedDeparture: "15:17",
            realtime: true
          },
          {
            line: "Vippetangen - Tonsenhagen",
            expectedDeparture: "15:32",
            realtime: false
          }
        ]
      },
      {
        StopPlace: 'Oslo S',
        Times: [
          {
            line: "Oslo S - Bygdøy",
            expectedDeparture: "15:17",
            realtime: true
          },
          {
            line: "Oslo S - Helsfyr",
            expectedDeparture: "15:32",
            realtime: false
          },
          {
            line: "Oslo S - Helsfyr",
            expectedDeparture: "15:32",
            realtime: true
          }
        ]
      }
    ];

    this.setState({
      places: json
    })
  }
  render() {
    const stations = this.state.places.map((place, index) => {
        return (
            <Station key={index} name={place.StopPlace} departures={place.Times} />
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
