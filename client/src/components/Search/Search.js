import React, { Component } from 'react';
import './Search.css';
import RoomItem from "../RoomItem/RoomItem";
import GMap from "../GMap/gmap";
import NavBar from "../NavBar/navbar"

const axios = require('axios');

class Search extends Component {

    constructor(props){
        super(props);

        this.params = this.params.bind(this);

        let path = this.props.location.pathname + this.props.location.search;
        let location = this.params(path, "location");
        let date = this.params(path, "date");

        this.state = {
            location: location,
            date: date,
            data: null,
            error: false,
            isLoaded: false
        };
    }

    componentDidMount() {
        let currentComponent = this;
        axios.get('/api/search?location=' + this.state.location + "&date=" + this.state.date)
          .then(function (response) {
            currentComponent.setState({
                isLoaded: true,
                data: response.data
            });
          })
          .catch(function (error) {
            console.log(error);
            currentComponent.setState({
                error: true
            });
          })
    }

    roomItems(rooms) {
        if (rooms == null){
            return [];
        } else {
            let res = [];
            Array.from(rooms).forEach((room) => res.push(<RoomItem data={room}/>));
            return res;
        }
    }

    // Retrieve request param from url
    params(path, param){
        let url = new URL("https://placeholder" + path);
        let value = url.searchParams.get(param);
        return value;
    }

    render() {
        let rooms = <div className={"empty-rooms"}>
                        <h2>There are no rooms are available on {this.state.date} in {this.state.location}</h2>
                    </div>;

        if (this.state.data){
            rooms = this.roomItems(this.state.data);
            
            // If there are no rooms, we tell the user
            if (rooms.length === 0){
                rooms = <div className={"empty-rooms"}>
                            <h2>There are no rooms are available on {this.state.date} in {this.state.location}</h2>
                        </div>
            }
        }

        return (
            <div className={'Search'}>
                <NavBar/>
                <GMap rooms={this.state.data} location={this.state.location}>
                </GMap>
                <div className={"Results"}>
                    <div className={"Rooms"}>
                        {rooms}
                    </div>
                </div>
            </div>
        );
    }
}
export default Search;