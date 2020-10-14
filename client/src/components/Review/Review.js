import React, { Component } from 'react';
import './Review.css';

class Review extends Component{

    render() {
        let data = this.props.data;

        return (
            <div className="review-entry">
                <h2 className="review-author">Author: {data.author}</h2>
                <p className="review-date">Date: {data.date}</p>
                <p className="review-rating">Rating: {data.rating}/5</p>
                <p className="review-content">{data.comment}</p>
            </div>
        )
    }
}

export default Review;