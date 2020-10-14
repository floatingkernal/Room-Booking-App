import React, { Component } from 'react';
import './marker.css';

class Marker extends Component {

    route(id) {
        window.location.href="/Room?id=" + id;
    }

    render() {
        return <div>
                    <div className="Marker" onClick={this.route.bind(this, this.props.id)}></div>
                </div>
    }
}

export default Marker;