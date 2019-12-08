import React, { Component } from "react";

/**
 * Image result container component
 */
class Images extends Component {
  render() {
    return (
      <div className="results-wrapper">
        {this.props.data.photo.map(img => {
          let imageUrl = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_q.jpg`;
          return (
            <img
              className="image"
              key={img.id}
              src={imageUrl}
              title={img.title}
              alt={img.title}
            ></img>
          );
        })}
      </div>
    );
  }
}

export default Images;
