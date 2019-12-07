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
      recent: JSON.parse(localStorage.getItem("recentSearch")) || []
    }

    this.handleSearch = this.handleSearch.bind(this);
    this.showMySearches = this.showMySearches.bind(this);
    this.recentSearch = this.recentSearch.bind(this);
    this.handleRecentClick = this.handleRecentClick.bind(this);
  }

  handleSearch(input) {
    let val = input.target.value;

    this.setState(prevState => ({
      search: val
    }));
  };


  showMySearches(ev) {
    if (ev) 
      ev.preventDefault();

    this.recentSearch(this.state.search);
    this.setState(prevState => ({
      ...prevState,
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
        per_page: 10
      }
    }).then(res => {
      this.setState(prevState => ({
        ...prevState,
        results: res,
        isLoading: false,
      }));
    });
  }

  // Recent search handlers
  recentSearch(query) {
    let recent = this.state.recent;

    if (recent.length > 9)
      recent.shift();
    
    recent.push(query);
    localStorage.setItem('recentSearch', JSON.stringify(recent));
  }
  handleRecentClick(ev) {
    let text = ev.target.text.trim();
    this.setState(prevState => ({
      ...prevState,
      search: text
    }), () => {
      this.showMySearches();
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
          <div>
            {this.state.recent.slice(0).reverse().map((element, i) => {
              return <a href="#" onClick={this.handleRecentClick} key={i} style={{display: "block"}}>{element}</a>
            })}
          </div>
          
          <div className="results">
            {Object.entries(this.state.results).length ? <Images data={this.state.results.data.photos} /> : ""}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
