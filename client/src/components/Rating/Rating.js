import React, { Component } from 'react';
import './Rating.css'

class Rating extends Component {

    render() {
        let res = [];
        let max_rate = 5;
        if (this.props.rate) {
            for (let i = 1; i <= max_rate; i++) {
                if (i === 1) {
                    i <= this.props.rate ?
                    res.push(<span key={i} className="fa fa-first fa-star checked"/>) :
                    res.push(<span key={i} className="fa fa-star "/>);
                } else {
                    i <= this.props.rate ?
                    res.push(<span key={i} className="fa fa-star checked"/>) :
                    res.push(<span key={i} className="fa fa-star "/>);
                }
            }
        }
        return res;
    }
}

export default Rating;