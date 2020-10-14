import React, { Component } from 'react';
import './Room.css'
import Rating from "../Rating/Rating"
import Booking from "../Booking/Booking"
import Tabs from 'react-bootstrap/Tabs'
import Tab from "react-bootstrap/Tab";
import Gallery from 'react-grid-gallery';
import NavBar from "../NavBar/navbar";

const axios = require('axios');



class Room extends Component{
    constructor(props) {
        super(props);
        let path = this.props.location.pathname + this.props.location.search;
        let id = this.params(path, "id");
        this.state = {
            id: id,
            key: 'location',
            data: null,
            isLoaded: false,
            images: []
        };
    }

    componentDidMount() {
        let currentComponent = this;
        let getcmd = '/api/room=' +  this.state.id;
        axios.get(getcmd)
            .then((response) => {
                currentComponent.setState({
                    data: response.data,
                    isLoaded: true
                });

            }).catch((error) => {
                console.log(error);
                currentComponent.setState({isLoaded:false})
        })
    }

    params(path, param){
        let url = new URL("https://placeholder" + path);
        let value = url.searchParams.get(param);
        return value;
    }

    getImages(images){
    let res = [];

        for (let i=0; i < images.length; i++){
            let newImg = { src: "/api/image/" + images[i].id, thumbnail: "/api/image/" + images[i].id, thumbnailWidth: 320, thumbnailHeight: 212};

            res.push(newImg);
        }

    return res;
    }

    render() {
        let room = this.state.data;
        let images = [];

        if (room){
            images = this.getImages(room.images);
        }
        let content = null;
        let render = null;
        if (this.state.isLoaded) {
            switch (this.state.key) {
                case 'location' : content = <div>
                    <div className={"Address uk-margin"}>Address: {room.address}</div>
                    <div className={"City uk-margin"}>City: {room.city}</div>
                </div>; break;
                case 'description' : content = <div>
                    <div className={"Description uk-margin"}>Description: {room.description}</div>
                    <div className={"Purpose uk-margin"}>Purposes: {room.purposes.join(", ")}</div>
                </div>; break;
                case 'other' : content = <div>
                    <div className={"Capacity uk-margin"}>Capacity: {room.capacity}</div>
                    {room.numberOfVists ? <div className={"NumberOfVisits uk-margin"}>Number of Visits: {room.numberOfVisits}</div> : null}
                </div>
            }
            render = (<div className={"Room uk-background-muted uk-padding"}>
                <div className={"Title"}>{room.title}</div>
                <div className={"Content-Select uk-card"}>
                    <Tabs activeKey={this.state.key} onSelect={key => this.setState({ key })}>
                        <Tab eventKey="location" title="Location"/>
                        <Tab eventKey="description" title="Description"/>
                        <Tab eventKey="other" title="Other"/>
                    </Tabs>
                </div>
                <div className={"Content uk-card uk-card-body uk-card-default uk-p"}>
                    {content}
                </div>
                <div className={"Images"}>
                    <Gallery images={images} rowHeight={445/2}/>
                </div>
                <div className={"TopRight uk-card uk-card-hover uk-padding"}>
                    {/*<div className={"Owner"}>{room.owner}</div>*/}
                    <div className={"Rating"}>
                        <Rating rate={room.rating}/>
                    </div>
                </div>
                <div className={"Reviews"}>
                    {/*{room.reviews}*/}
                </div>
                <Booking
                    id={room._id}
                    price={room.price}
                    startTime={room.hours.start}
                    endTime={room.hours.end}
                    rate={"hour"}
                    purposes={room.purposes}
                />
            </div>);

        }

        return (<div>
                <NavBar/>
                {render}
            </div>
            );
    }
}

export default Room;
