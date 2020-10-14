/* global google */
import React from 'react';
import NavBar from '../NavBar/navbar';
import { BrowserRouter as Link } from "react-router-dom";
import "./HomePage.css";
import logo from "./logo.png";

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.autocompleteInput = React.createRef();
        this.autocomplete = null;
        this.handlePlaceChanged = this.handlePlaceChanged.bind(this);

        this.state = {
            showModal: false,
            loading: false,
            error: null,
            recoverPasswordSuccess: null,
        };
    }

    /* Google maps autocomplete functionality implemented with assistance from:
    https://stackoverflow.com/questions/52907859/using-google-place-autocomplete-api-in-react
    */
    componentDidMount() {
        this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current,
            {"types": ["geocode"]});

        this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
    }


    handlePlaceChanged() {
        const place = this.autocomplete.getPlace();
    }

    render() {
        return (
            <div>
                <NavBar/>
                <div id="homepage" className="uk-width-medium-1-1">
                    <div className="uk-container uk-container-center uk-text-center">
                        <div id="main-form" className="uk-position-center">
                            <a href="/">
                                <img alt="logo" className="logo" src={logo}/>
                            </a>
                            <h1 className="uk-margin-remove text-kerning uk-text-contrast">
                                <p className="slogan">Room booking at your fingertips</p>
                            </h1>
                            <form className="uk-form" id="submit-form" action="/search">
                                <div id="form-title">City: </div>
                                <input ref={this.autocompleteInput} className="uk-input uk-border-rounded" id="autocomplete" placeholder="City" type="text" name="location" required/>
                                <div id="form-title">Date: </div>
                                <input className="uk-input uk-border-rounded" id="check-in" placeholder="Check-in" type="date" name="date" required/>
                                <input className="uk-button-primary uk-border-rounded" id="find-room" type="submit" value="Find Room"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;