import React, { Component } from 'react';
import './RoomItem.css';
import Rating from "../Rating/Rating";
import Review from "../Review/Review";

class RoomItem extends Component{

    minToTime(min) {
        if (min > 1440) return null;
        let hour = (min/60) >> 0;
        let minutes = min % 60;
        let strMinutes = (minutes < 10) ? "0" + minutes.toString(10) : minutes.toString(10);
        let strHour = (hour < 10) ? "0" + hour.toString(10) : hour.toString(10);

        return strHour + ":" + strMinutes
    }

    arrayToStringConvert(list) {
        let result = "";
        for (let i=0; i < list.length; i++){
            result = result + list[i].charAt(0).toUpperCase() + list[i].slice(1) + "s, ";
        }

        return result.substring(0, result.length-2);
    }

    // Get two reviews
    getReviews(reviews){
        let twoReviews = reviews.slice(0,2);
        let res = [];
        twoReviews.forEach((review) => res.push(<Review data={review}/>));
        return res;
    }

    route(id) {
        window.location.href="/Room?id=" + id;
    }

    render() {
        let data = this.props.data;

        return (
            <div id={data._id} className="RoomItem uk-card uk-card-default" onClick={this.route.bind(this, data._id)}>
                <div className="uk-card-header">
                    <div className="uk-grid-small uk-flex-middle uk-grid">
                        <div className="uk-width-expand">
                            <h3 className="title uk-card-title">{data.title}</h3><Rating rate={data.rating}/>
                            <p className="address uk-text-meta">Address: {data.address}</p>
                            <p className="price uk-text-meta">Price: ${data.price}/hr</p>
                            <p className="day uk-text-meta">From: {this.minToTime(data.hours.start)} To:
                            {this.minToTime(data.hours.end)} on {this.arrayToStringConvert(data.days)}</p>
                            <p className="purposes uk-text-meta">Purposes: {this.arrayToStringConvert(data.purposes)}</p>
                            <p className="capacity uk-text-meta">Maximum Capacity: {data.capacity}</p>
                        </div>
                    </div>
                </div>
                <div className="uk-card-body">
                    <div className="description">
                        Description:
                    </div>
                    <div className="description-content">
                        {data.description}
                    </div>
                </div>
            </div>
        )
    }
}

export default RoomItem;