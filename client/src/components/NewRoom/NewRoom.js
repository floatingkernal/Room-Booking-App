import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './NewRoom.css';
import NavBar from '../NavBar/navbar';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { withCookies, Cookies } from 'react-cookie';

const axios = require('axios');

class NewRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: undefined,
            address: undefined,
            city: undefined,
            description: '',
            images: [],
            price: undefined,
            purposes: [],
            days: [],
            hours: {
                start: 0,
                end: 0,
            },
            capacity: undefined,
            page: 1,
            purposeOptionMap: [
                {name: "Social", isSelected: true},
                {name: "Business", isSelected: false},
                {name: "Personal", isSelected: false}
            ],
            dayOptionMap: [
                {day: "Monday", isSelected: true},
                {day: "Tuesday", isSelected: false},
                {day: "Wednesday", isSelected: false},
                {day: "Thursday", isSelected: false},
                {day: "Friday", isSelected: false},
                {day: "Saturday", isSelected: false},
                {day: "Sunday", isSelected: false}
            ],
            temp_time: ['8:00', '12:00'],
            isValid: true,
            isValidTime: true,
            redirect: false,
            success: undefined,
            response: undefined,
            error: undefined,
            loggedIn: false
        };
        this.toggleField = this.toggleField.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.submit = this.submit.bind(this);
        this.selectTime = this.selectTime.bind(this);
        this.convertTime = this.convertTime.bind(this);

    }

    
    handleChange(e, field) {
        let value = (field === "images") ? e.target.files : e.target.value;
        this.setState({
            [field]: value
        });
      }

    toggleField(e, field, index) {
        e.preventDefault();
        let newField = this.state[field].slice();
        newField[index].isSelected = !newField[index].isSelected;
        this.setState({
            [field] : newField
        });
    }

    validSelection(field) {
        for (let i = 0; i < field.length; i++) {
            if (field[i].isSelected) return true;
        }
        return false;
    }

    convertTime() {
        let start_str = this.state.temp_time[0];
        let end_str = this.state.temp_time[1];
        let s_index = start_str.indexOf(":");
        let e_index = end_str.indexOf(":");
        let start_minutes = (Number(start_str.substring(0, s_index)) * 60) + Number(start_str.substring(s_index+1, start_str.length));
        let end_minutes = (Number(end_str.substring(0, e_index)) * 60) + Number(end_str.substring(e_index+1, end_str.length));
        if (start_minutes >= end_minutes) {
            this.setState({
                isValidTime: false
            });
            return -1;
        }
        this.setState({
            hours: {
                start: start_minutes.toString(),
                end: end_minutes.toString()
            }
        });
    }

    next() {
        if (this.state.page === 1 && !(this.state.title && this.state.address && this.state.city
            && this.validSelection(this.state.purposeOptionMap))) {
                this.setState({
                    isValid: false
                });
        } else if (this.state.page === 2 && !(this.state.price && this.state.capacity && this.state.temp_time 
            && this.validSelection(this.state.dayOptionMap) && this.convertTime() !== -1)) {
                this.setState({
                    isValid: false
                });
        } else {
            switch(this.state.page){
                case 1: 
                    let purposes = [];
                    this.state.purposeOptionMap.forEach(purpose => {
                        if (purpose.isSelected) purposes.push(purpose.name);
                    });
                    this.setState({
                        purposes: purposes
                    });
                    break;
                case 2:
                    let days = []
                    this.state.dayOptionMap.forEach(dayOption => {
                        if (dayOption.isSelected) days.push(dayOption.day);
                    });
                    this.setState({
                        days: days
                    });
                    break;
            }

            this.setState({
                page: this.state.page + 1,
                isValid: true
            });
        }
    }

    submit() {
        const cookie = this.props.cookies;
        let currentComponent = this;
        if (this.state.images.length === 0) {
            this.setState({
                isValid: false
            });
        } else {
            let headers = {
                'Content-Type': 'multipart/form-data; boundary=XXX'
            }
            let data = new FormData();
            data.append("title", this.state.title);
            data.append("address", this.state.address);
            data.append("city", this.state.city);
            data.append("description", this.state.description);

             data.append("price", this.state.price);
            data.append("purposes", this.state.purposes);
            data.append("days", this.state.days);
            data.append("hours", JSON.stringify(this.state.hours));
            data.append("capacity", this.state.capacity);
            data.append("owner", cookie.get("u.id"));

             for (let i = 0; i < this.state.images.length; i++) {
                data.append("images", this.state.images[i]);
            }
            
            axios.post("/api/rooms/new",
                data,
                {
                    headers: headers
                }).then(function (response) {
                    currentComponent.setState({
                        redirect: true,
                        success: true,
                        response: response
                    });
                    
                }).catch(function (error) {
                    currentComponent.setState({
                        success: false,
                        error: error
                    });
                });

        }
    }

    prev() {
        this.setState({
            page: this.state.page - 1
        });
    }

    selectTime = time => {
        this.setState({
            temp_time: time
        });
    }

    componentDidMount() {
        let currentComponent = this;

        axios.get('/api/private')
          .then(function (response) {
            currentComponent.setState({
                loggedIn: true
            });
          })
          .catch(function (error) {
            currentComponent.setState({
                loggedIn: false
            });
          })
    }


    render () {
        if (this.state.redirect) {
            return <Redirect to="/"/>
        }

        if (!this.state.loggedIn) {
            let element =  <div className="unauthorized">
                            <NavBar></NavBar>
                            <div className="uk-card uk-card-default uk-align-center  uk-card-body uk-width-3-4@m ">
                                <h1 className="uk-align-center">401 Access Denied</h1>
                                <p className="uk-align-center error_message">Please sign in to access this page</p>
                            </div>

                        </div>;
            return element;
        }

        if (this.state.redirect) return <Redirect to='/'/>;

        const options = this.state.purposeOptionMap.map((purpose, index) =>
            <button className={"uk-button purpose_buttons" + (purpose.isSelected ? " uk-button-primary" : " uk-button-default")} key={index} 
                onClick={(e) => this.toggleField(e, "purposeOptionMap", index)}>
                {purpose.name}
            </button>
        );
        const dayOptions = this.state.dayOptionMap.map((dayOption, index) => 
            <button className={"uk-button uk-button-text uk-active day_button" + (dayOption.isSelected ? " uk-button-primary" : " uk-button-text")}
                key={index} onClick={(e) => this.toggleField(e, "dayOptionMap", index)}>
                {dayOption.day}
             </button>
        );

        return (
            <div className='container'>
                <NavBar></NavBar>

                <div className="input-card uk-align-center ">
                    <h1 className="uk-heading-line"><span>Post a New Room</span></h1>

                    <div className="uk-card uk-card-default uk-align-center  uk-card-body uk-width-3-4@m room_form">
                        <p className={"error_message" + (this.state.isValid ? ' invisible' : ' visible')}>Please fill out all inputs</p>
                        <form>
                            {/* first stage of input form */}
                            <div className={(this.state.page === 1 ? 'visible' : 'invisible')}>
                                <input required className="uk-input uk-width-3-4 input_box" type="text" placeholder="Room Title" value={this.state.title} onChange={(e) => this.handleChange(e, "title")}/>
                                <input required className="uk-input uk-width-3-4 input_box" type="text" placeholder="Address" value={this.state.address} onChange={(e) => this.handleChange(e, "address")}/>
                                <input required className="uk-input uk-width-3-4 input_box" type="text" placeholder="City" value={this.state.city} onChange={(e) => this.handleChange(e, "city")}/>
                                
                                <p>Purposes</p>
                                <div className="purposes">{options}</div>
                            </div>

                            {/* second stage of input form */}
                            <div className={(this.state.page === 2 ? 'visible' : 'invisible')}>
                                <input required className="uk-input uk-width-3-4 input_box" type="text" placeholder="Price (CAD)" value={this.state.price} onChange={(e) => this.handleChange(e, "price")}/>
                                <input required className="uk-input uk-width-3-4 input_box" type="text" placeholder="Capacity" value={this.state.capacity} onChange={(e) => this.handleChange(e, "capacity")}/>
                                <p>Days Available</p>
                                <ul uk-tab>{dayOptions}</ul>
                                <TimeRangePicker onChange={this.selectTime} value={this.state.temp_time} required/>
                                <p className={"error_message" + (this.state.isValidTime ? ' invisible' : ' visible')}>Invalid Date Range</p>
                            </div>

                            {/* Third stage of input form */}
                            <div className={(this.state.page === 3 ? 'visible' : 'invisible')}>
                            <p>Let users know what your room looks like</p>
                                
                                <input required type="file" multiple className="uk-width-3-4 input_box" onChange={(e) => this.handleChange(e, "images")}/>
                                <textarea rows="6" cols="50" className="uk-input uk-width-3-4 input_box" type="text" placeholder="Description" value={this.state.description} onChange={(e) => this.handleChange(e, "description")}/>
                            </div>

                        </form>
                    </div>


                    <ul className="uk-pagination">
                        {this.state.page > 1 &&
                            <button className="uk-button uk-button-text" onClick={this.prev}><span class="uk-margin-small-right" uk-pagination-previous></span>Previous</button>
                        }
                        {this.state.page < 3 &&
                            <button className="uk-button uk-button-text uk-margin-auto-left" onClick={this.next}>Next <span class="uk-margin-small-left" uk-pagination-next></span></button>
                        }
                        {this.state.page === 3 &&
                            <button className="uk-button uk-button-text uk-margin-auto-left" onClick={this.submit}>Submit <span class="uk-margin-small-left" uk-pagination-next></span></button>
                        }
                    </ul>
                </div>
            </div>
            
        );
    }
}

export default NewRoom;