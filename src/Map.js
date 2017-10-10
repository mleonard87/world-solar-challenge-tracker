import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import GetContainerDimensions from "react-dimensions";
import DeckGL, { IconLayer, ScatterplotLayer } from 'deck.gl';
import { PerspectiveMercatorViewport } from 'viewport-mercator-project';
import './App.css';

const ICON_MAPPING = {
  adventure: {
    x: 0,
    y: 0,
    width: 70,
    height: 87,
    // mask: true
  },
  challenger: {
    x: 82,
    y: 0,
    width: 70,
    height: 87,
    // mask: true
  },
  cruiser: {
    x: 175,
    y: 0,
    width: 70,
    height: 87,
    // mask: true
  },
  hidden: {
    x: 255,
    y: 0,
    width: 70,
    height: 87,
    // mask: true
  },
};

const CLASS_MAPPING = {
  5: 'challenger',
  6: 'cruiser',
  7: 'adventure',
};


class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: {
        latitude: -35.333502,
        longitude: 149.170508,
        zoom: 9,
        pitch: 0,
        bearing: 0,
      },
    };
  }

  componentDidMount = () => {
    this.setBounds(this.props);
  };

  setBounds = (props) => {
    if (props.positions.length === 0) {
      return;
    }
    const perspectiveViewport = new PerspectiveMercatorViewport({
      width: props.containerWidth,
      height: props.containerHeight
    });

    let minLat, maxLat, minLng, maxLng;
    for (let i in props.positions) {
      const position = props.positions[i];
      if (!minLat || position.lat < minLat) minLat = position.lat;
      if (!maxLat || position.lat > minLat) maxLat = position.lat;
      if (!minLng || position.lng < minLng) minLng = position.lng;
      if (!maxLng || position.lng > maxLng) maxLng = position.lng;
    }

    console.log(minLng, minLat, maxLng, maxLat);

    const bounds = perspectiveViewport.fitBounds(
      [[minLng, minLat], [maxLng + 0.001, maxLat + 0.001]],
      {padding: 100, offset: [0, 0]}
    );

    this.setState({
      map: {
        latitude: bounds.latitude,
        longitude: bounds.longitude,
        zoom: bounds.zoom,
      }
    });
  };

  render() {

    const viewport = {
      width: this.props.containerWidth,
      height: this.props.containerHeight,
      latitude: this.state.map.latitude,
      longitude: this.state.map.longitude,
      pitch: this.state.map.pitch,
      bearing: this.state.map.bearing,
      zoom: this.state.map.zoom,
      onViewportChange: (viewport) => {
        const {width, height, latitude, longitude, zoom, pitch, bearing} = viewport;
        this.setState({
          map: {
            width: width,
            height: height,
            latitude: latitude,
            longitude: longitude,
            zoom: zoom,
            pitch: pitch,
            bearing: bearing,
          }
        });
      },
      mapStyle: "mapbox://styles/mapbox/navigation-guidance-day-v2",
    };

    const layer = new IconLayer({
      id: 'car-layer',
      data: this.props.positions.map((p) => {
        return {
          position: [p.lng, p.lat],
          icon: p.visible ? CLASS_MAPPING[p.class_id] : 'hidden',
          size: 100,
          color: [255, 0, 0],
          name: p.name,
          number: p.number,
        }
      }),
      iconAtlas: "/carmap.png",
      iconMapping: ICON_MAPPING,
      pickable: true,
      onClick: (info) => {
        this.props.onClick(info.object.name);
      },
      onHover: (info) => {
        if (info.object) {
          this.setState({
            hoverName: info.object.number + ' - ' + info.object.name,
            tooltipX: info.x,
            tooltipY: info.y,
          });
        } else {
          this.setState({
            hoverName: null,
            tooltipX: info.x,
            tooltipY: info.y,
          });
        }
      },
    });

    return (
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1Ijoic3dpdGNodHJ1ZSIsImEiOiJjajhrcGtsbzkwZzYxMnFxaWdrZWg2eDliIn0.8Mb_sABSoL0827CCStDicw">
        <DeckGL {...viewport} layers={[layer]} />

        {this.state.hoverName
          ? <div style={{
              left: this.state.tooltipX,
              top: this.state.tooltipY,
              position: "absolute",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              fontSize: "12px",
              padding: "8px 8px 8px 16px",
              opacity: "0.8",
              fontWeight: "bold",
              pointerEvents: "none",
            }}>
            {this.state.hoverName}
          </div>
          : null}

      </ReactMapGL>
    );
  }
}

export default GetContainerDimensions()(Map);
