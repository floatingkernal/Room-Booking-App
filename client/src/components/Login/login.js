import React from "react";
import ReactModalLogin from "react-modal-login";

// import { facebookConfig, googleConfig } from "social-config";

const google = {
  client_id: "647375100699-avlue8ntamo8f60br4l2gs6j4ns2edio.apps.googleusercontent.com",
  scope: "profile email"
};

const axios = require('axios');

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            loading: false,
            error: null,
            recoverPasswordSuccess: null,
            loggedIn: false
        };
    }

    onLogin() {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        let currentComponent = this;

        axios.post('/api/signin/',
            {email: email,
             password: password
            })
          .then(function (response) {
            currentComponent.setState({
                loggedIn: true
            });
            currentComponent.closeModal();
            window.location.reload();
          })
          .catch(function (error) {
            currentComponent.setState({
                error: error,
                loggedIn: false
            });

          })

        if (!email || !password) {
          this.setState({
            error: true
          })
        }
    }

    onRegister() {
        const first = document.querySelector('#first').value;
        const last = document.querySelector('#last').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const city = document.querySelector('#city').value;
        const birthday = document.querySelector('#birthday').value;
        let currentComponent = this;

        axios.post('/api/signup/', {
            firstname: first,
            lastname: last,
            email: email,
            password: password,
            location: city,
            birthday: birthday
        })
          .then(function (response) {
            if (response.status === 200){
                currentComponent.setState({
                    loggedIn: true
                });
                currentComponent.closeModal();
                window.location.reload();
            } else {
                const error = new Error(response.error);
                throw error;
            }
          })
          .catch(function (error) {
            currentComponent.setState({
                error: error,
                loggedIn: false
            });

          })

        if (!first || !last || !email || !password || !city || !birthday) {
          this.setState({
            error: true
          })
        }
    }

    openModal() {
        this.setState({
            showModal: true
        });
    }

    closeModal() {
        this.setState({
            showModal: false,
            error: null
        });
    }

    startLoading() {
        this.setState({
            loading: true
        });
    }

    finishLoading() {
        this.setState({
            loading: false
        });
    }

    afterTabsChange() {
        this.setState({
            error: null,
            recoverPasswordSuccess: false
        });
    }


    render() {
        return (
            <div>
                <button className="uk-button uk-border-rounded uk-button-primary"
                        onClick={() => this.openModal()}>Login/Signup

                </button>

                <ReactModalLogin
                    visible={this.state.showModal}
                    onCloseModal={this.closeModal.bind(this)}
                    loading={this.state.loading}
                    error={this.state.error}
                    tabs={{
                        afterChange: this.afterTabsChange.bind(this)
                    }}
                    loginError={{
                        label: "Couldn't sign in, please try again."
                    }}
                    registerError={{
                        label: "Couldn't sign up, please try again."
                    }}
                    startLoading={this.startLoading.bind(this)}
                    finishLoading={this.finishLoading.bind(this)}
                    form={{
                        loginBtn: {
                          label: "Sign in"
                        },
                        registerBtn: {
                          label: "Sign up"
                        },
                        loginInputs:  [
                            {containerClass: 'RML-form-group', label: 'Email', type: 'email', inputClass: 'RML-form-control', id: 'email', name: 'email', placeholder: 'Email'},
                            {containerClass: 'RML-form-group', label: 'Password', type: 'password', inputClass: 'RML-form-control', id: 'password', name: 'password', placeholder: 'Password'}
                        ],
                        registerInputs: [
                            {containerClass: 'RML-form-group', label: 'First Name', type: 'text', inputClass: 'RML-form-control', id: 'first', name: 'first', placeholder: 'First Name'},
                            {containerClass: 'RML-form-group', label: 'Last Name', type: 'text', inputClass: 'RML-form-control', id: 'last', name: 'last', placeholder: 'Last Name'},
                            {containerClass: 'RML-form-group', label: 'Email', type: 'email', inputClass: 'RML-form-control', id: 'email', name: 'email', placeholder: 'Email'},
                            {containerClass: 'RML-form-group', label: 'Password', type: 'password', inputClass: 'RML-form-control', id: 'password', name: 'password', placeholder: 'Password (8+ characters)'},
                            {containerClass: 'RML-form-group', label: 'Confirm Password', type: 'password', inputClass: 'RML-form-control', id: 'conf-password', name: 'password', placeholder: 'Confirm Password'},
                            {containerClass: 'RML-form-group', label: 'City', type: 'text', inputClass: 'RML-form-control', id: 'city', name: 'city', placeholder: 'City'},
                            {containerClass: 'RML-form-group', label: 'Birthday', type: 'date', inputClass: 'RML-form-control', id: 'birthday', name: 'birthday'},
                        ],
                        onLogin: this.onLogin.bind(this),
                        onRegister: this.onRegister.bind(this)
                    }}
                />
            </div>
        );
    }
}
export default Login;
export const googleConfig = google;
