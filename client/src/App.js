import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Search from './components/Search/Search';
import Room from './components/Room/Room';
import HomePage from './components/HomePage/HomePage';
import NewRoom from './components/NewRoom/NewRoom';
import { withCookies } from 'react-cookie';

class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Switch>
                      <Route exact path='/' 
                        render={() => (<HomePage cookies={this.props.cookies}/>)}
                      />
                      <Route path='/search' component={Search}/>
                      <Route exact path='/NewRoom' 
                        render={() => (<NewRoom cookies={this.props.cookies}/>)}
                      />
                      <Route path={'/Room'} component={Room} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default withCookies(App);