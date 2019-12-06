import React, { Component } from 'react';
import './App.less';
import axios from 'axios';

const FLICKER_API = "https://api.flickr.com/services/rest";
const FLICKER_API_KEY = "a1ee798f56b9554e1a0687ea543dbbdd";

class Images extends Component {
  render() {
    return (
      <div className="results-wrapper">
        {this.props.data.photo.map((img, i) => {
          let imageUrl = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_q.jpg`;
          return <img key={img.id} src={imageUrl} title={img.title} alt={img.title}></img>
        })}
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      search: "",
      isLoading: false,
    }

    this.handleSearch = this.handleSearch.bind(this);
    this.showMySearches = this.showMySearches.bind(this);
  }

  componentDidMount() {
    //this.showMySearches();
  }

  handleSearch(input) {
    let val = input.target.value;

    this.setState(prevState => ({
      search: val
    }));
  };


  showMySearches(ev) {
    ev.preventDefault();
    
    this.setState(prevState => ({
      isLoading: true
    }));
    axios({
      method: "GET",
      url: FLICKER_API,
      params: {
        api_key: FLICKER_API_KEY,
        method: "flickr.photos.search",
        text: this.state.search,
        format: "json",
        nojsoncallback: true,
        privacy_filter: 1,
        per_page: 20
      }
    }).then(res => {
      this.setState(prevState => ({
        results: res,
        isLoading: false,
      }));
      console.log(this.state);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.showMySearches}>
            <input
              type="search"
              className="input"
              placeholder="Search for images on flickr"
              value={this.state.search}
              onChange={this.handleSearch}
              required
            />
            <button className="searchButton" type="submit">Find images</button>
          </form>
          
          <div className="results">
            {Object.entries(this.state.results).length ? <Images data={this.state.results.data.photos} /> : ""}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
