import React, { Component } from 'react';
import moment from 'moment';

class Station extends Component {

  formatDepartureTime = expectedDeparture => {
    const momentDate = moment(expectedDeparture);
    const duration = moment.duration(momentDate.diff(moment()));
    const minutes = Math.ceil(duration.asMinutes());

    if (minutes === 0) {
      return 'nå';
    } else if (minutes <= 10) {
      return minutes + ' min';
    } else {
      return momentDate.format("HH:mm");
    }
  }

  render() {
    const departures = this.props.departures.map((dep, index) => {
      const realtime = dep.realtime ? (<i className="realtime" />) : null;
      const formattedDepartureTime = this.formatDepartureTime(dep.expectedDeparture);

      return <div key={index} className="departure">
        <div className="departureTimeContainer">
          {realtime}
          <span className="departureTime">{formattedDepartureTime}</span>
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