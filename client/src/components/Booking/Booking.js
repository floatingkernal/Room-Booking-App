import React, { Component } from 'react';
import './Booking.css';
import Form from "react-bootstrap/Form";
import Select from "react-select";
import * as PropTypes from "prop-types";

const axios = require('axios');

class Booking extends Component{

    constructor(props) {
        super(props);
        this.state = {
            roomid: this.props.id,
            start : this.props.startTime,
            end : this.props.endTime,
            purposes: [],
            day : null
        };
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleFinishChange = this.handleFinishChange.bind(this);
        this.handlePurposeChange = this.handlePurposeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
    }

    minToTime(min) {
        if (min > 1440) return null;
        let hour = (min/60) >> 0;
        let minutes = min % 60;
        let strMinutes = (minutes < 10) ? "0" + minutes.toString(10) : minutes.toString(10);
        let strHour = (hour < 10) ? "0" + hour.toString(10) : hour.toString(10);

        return strHour + ":" + strMinutes
    }

    genTime(start, end) {
        let res = [];
        for (let i = start; i <= end; i++ ) {
            let time = this.minToTime(i);
            res.push(<option key={i} value={i}>{time}</option>);
        }
        return res;
    }

    handleStartChange(event) {
        this.setState({start: event.target.value});
    }
    handleFinishChange(event) {
        this.setState({end: event.target.value});
    }
    handleDayChange(event) {
        this.setState({day: event.target.value})
    }
    handlePurposeChange(event) {
        this.setState({purposes:event.map(e => e.value)})
    }

    handleSubmit(event) {
        let start = this.state.start;
        let end = this.state.end;
        let time = {start:start, end:end};
        let day = this.state.day;
        let purposes = this.state.purposes;
        let roomId = this.props.id;
        let body = {
            roomId: roomId,
            day: day,
            purposes: purposes,
            time: time,
        }
        axios.post("/api/rooms/book/", body)
            .then(function (response) {
                // do something when booked
                alert("Room was successfully booked. The owner will contact you shortly");

            })
            .catch(function (error) {
                // handle error call
                console.log(error);
                alert("Please login to book a room");
            });
        event.preventDefault();
    }

    render() {

        let price = this.props.price;
        let start = this.props.startTime;
        let end = this.props.endTime;
        let rate = this.props.rate;
        let purposes = this.props.purposes.map(p => {return {value: p, label:p}});
        return (
            <Form className={"Booking uk-card uk-card-default uk-card-hover uk-padding"} onSubmit={this.handleSubmit}>
                <div className={"Price uk-card-title"}>Rate: ${price}/{rate}</div>
                <br/>
                <label>Available from {this.minToTime(start)} to {this.minToTime(end)}</label>
                <br/><br/>
                <label className={"DatePicker"}>
                    Pick a date and time to book the room
                    <input className="uk-input uk-border-rounded"
                           type="date"
                           name="date"
                           onChange={this.handleDayChange}
                           required/>
                </label>
                <label>
                    From:
                    <select className={"uk-select"} value={this.state.start} onChange={this.handleStartChange}>
                        {this.genTime(start, end)}
                    </select>
                </label>
                <br/>
                <label>
                    To:
                    <select className={"uk-select"} value={this.state.end} onChange={this.handleFinishChange}>
                        {this.genTime(start, end)}
                    </select>
                </label>
                <label>
                    Purposes:
                    <Select
                        options={purposes}
                        isMulti
                        onChange={this.handlePurposeChange}
                    />
                </label>
                <input className={"Button uk-button uk-button-primary"} type={"submit"} value={"Book This Room"}/>
            </Form>
        )
    }
}

Booking.protoTypes = {roomId: PropTypes.string.isRequired}

export default Booking