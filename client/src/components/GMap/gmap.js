/* global google */
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from '../Marker/marker';

let geocoder = new google.maps.Geocoder();

class GMap extends Component {

  constructor(props){
    super(props);

    let city = this.props.location.split(",")[0];
    this.getMarkers = this.getMarkers.bind(this);

    this.state = {
        city: city,
        latlng: []
    };
  }

  static defaultProps = {
    center: {
      lat: 43.758006,
      lng: -79.410246
    },
    zoom: 11
  };

  getLatLng(rooms) {
    let currentComponent = this;
    let res = [];

    if(rooms){
      for (let i=0; i<rooms.length; i++){
        geocoder.geocode( { 'address': rooms[i].address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
              res.push({id: rooms[i]._id, lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() });
              currentComponent.getMarkers(res);
          }
        });
      }
    }

    return res;
  }

  getMarkers(latlng) {
    let res = [];
    if (latlng){
      latlng.forEach(function(element){
        res.push(<Marker
                  lat={element.lat}
                  lng={element.lng}
                  id={element.id}
                  />
        )
      })
    }
    this.setState({
      latlng:res
    })
  }

  render() {
    // Get markers (must be here since it updates state periodically)
    this.getLatLng(this.props.rooms);

    return (
      // Important! Always set the container height explicitly
      <div className="GMap">
        <GoogleMapReact
          // KEY REMOVED HERE
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
        {this.state.latlng}
        </GoogleMapReact>
      </div>
    );
  }
}

export default GMap;
