import React, { Component } from 'react';
import './App.css';

class CarInfo extends Component {
  render() {

    let carClass;
    switch (this.props.selectedCar.class_id) {
      case 5:
        carClass = 'Challenger';
        break;
      case 6:
        carClass = 'cruiser';
        break;
      case 7:
        carClass = 'Adventure';
        break;
      default:
        carClass = 'Unknown';
    }

    const urlCarName = this.props.selectedCar.id + '-' + this.props.selectedCar.name.toLowerCase().replace(/ /g, '-');

    return (
      <div className="car-info-container">
        <div
          className="clear-selected"
          onClick={this.props.clearSelected}>
          Close
        </div>

        <h1>{this.props.selectedCar.name}</h1>
        <h2>{this.props.selectedCar.number} - {this.props.selectedCar.car_name}</h2>

        <div className="car-class">{carClass}</div>

        <label>
          <span className="label">Distance Travelled</span>
          <span className="value">{this.props.selectedCar.dist_darwin}</span>
        </label>

        <label>
          <span className="label">Distance Remaining</span>
          <span className="value">{this.props.selectedCar.dist_adelaide}</span>
        </label>

        <label>
          <span className="label">Trailered</span>
          <span className="value">{this.props.selectedCar.trailered === 0 ? 'No' : 'Yes'}</span>
        </label>

        <ul>
          <li>
            <a href={"https://www.worldsolarchallenge.org/team/view/" + urlCarName} target="_blank">Team Overview</a>
          </li>
        </ul>

        <label className="gps-info">
          <span className="label">Last GPS Update</span>
          <span className="value">{this.props.selectedCar.gps_age}</span>
        </label>
      </div>
    );
  }
}

export default CarInfo;
