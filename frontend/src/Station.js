import React, { Component } from 'react';

class Station extends Component {
  render() {
    const departures = this.props.departures.map((dep, index) => {
      const realtime = dep.realtime ? (<i className="realtime" />) : null;
      return <div key={index} className="departure">
        <div className="departureTimeContainer">
          {realtime}
          <span className="departureTime">{dep.expectedDeparture}</span>
        </div>
        <span className="departureLine">{dep.line}</span>
      </div>
    });
    return (
      <div className="station">
        <h2>{this.props.name}</h2>
        <div>
          {departures}
        </div>
      </div>
    );
  }
}

export default Station;