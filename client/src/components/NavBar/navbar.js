import React, { Component } from 'react';
import Login from '../Login/login';
import { Link, Redirect } from "react-router-dom";
import "./navbar.css";
import logo from "../HomePage/logo.png";

const axios = require('axios');

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.renderRedirect = this.renderRedirect.bind(this);

        this.state = {
            loggedIn: false
        };
    }

    renderRedirect = () => {
        return <Redirect to='/NewRoom'/>
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

    render() {
        const isLoggedIn = this.state.loggedIn;
        let login;
        let currentComponent = this;

        let test = function(){
            axios.get('/api/signout')
          .then(function (response) {
            currentComponent.setState({
                loggedIn: true
            });
            window.location.reload();
          })
          .catch(function (error) {
            currentComponent.setState({
                loggedIn: false
            });
          })
        }

        if (isLoggedIn) {
          login =
                      <button onClick={test} className="uk-button uk-button-primary uk-border-rounded" id="signout">Signout
                      </button>
        } else {
          login = <Login></Login>;
        }
        return (
            <header className="header">
                <div className="tm-headerbar uk-clearfix uk-hidden-small uk-margin-remove uk-contrast">
                    <nav className="tm-navbar uk-navbar uk-margin-remove uk-text-right">
                        <div className="uk-navbar-item">
                            <a href="/"><img className="navLogo" src={logo}/></a>
                        </div>

                        <div className="uk-navbar-right">
                            <div className="uk-navbar-item">
                                {login}
                            </div>

                            <div className={"uk-navbar-item " + (this.state.loggedIn ? "visible" : "invisible")}>
                                <a href="/NewRoom">
                                    <button className="uk-button uk-border-rounded uk-button-primary">
                                        Add Room
                                    </button>
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        );
    }
}


export default NavBar;