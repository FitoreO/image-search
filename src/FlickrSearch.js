import React, { Component } from "react";
import Loader from "./components/Loader";
import Images from "./components/ImageGrid";
import "./FlickrSearch.less";
import axios from "axios";

const FLICKER_API = "https://api.flickr.com/services/rest";
const FLICKER_API_KEY = "a1ee798f56b9554e1a0687ea543dbbdd";

class FlickrSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      search: "",
      isLoading: false,
      recent: JSON.parse(localStorage.getItem("recentSearch")) || []
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.showMySearches = this.showMySearches.bind(this);
    this.recentSearch = this.recentSearch.bind(this);
    this.handleRecentClick = this.handleRecentClick.bind(this);
  }

  handleSearch(input) {
    let val = input.target.value;

    this.setState(prevState => ({
      ...prevState,
      search: val
    }));
  }

  showMySearches(event) {
    if (event) {
      event.preventDefault();
    }

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
        per_page: 30
      }
    }).then(res => {
      this.setState(prevState => ({
        ...prevState,
        results: res,
        isLoading: false
      }));
    });
  }

  // Recent search handlers
  recentSearch(query) {
    let recent = this.state.recent;

    if (recent.length > 9) recent.shift();

    recent.push(query);
    localStorage.setItem("recentSearch", JSON.stringify(recent));
  }
  handleRecentClick(ev) {
    let text = ev.target.textContent.trim();
    this.setState(
      prevState => ({
        ...prevState,
        search: text
      }),
      () => {
        this.showMySearches(false);
      }
    );
  }

  render() {
    return (
      <div className="App">
        <section className="container">
          <div className="search-wrapper">
            <form onSubmit={this.showMySearches}>
              <input
                type="search"
                className="input"
                placeholder="Search for images on flickr"
                value={this.state.search}
                onChange={this.handleSearch}
                required
              />
              <button className="searchButton" type="submit">
                <svg height="32" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19.427 21.427a8.5 8.5 0 112-2l5.585 5.585c.55.55.546 1.43 0 1.976l-.024.024a1.399 1.399 0 01-1.976 0l-5.585-5.585zM14.5 21a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
                    fill="#929292"
                  />
                </svg>
              </button>
            </form>
            <div className="recent-wrapper">
              <h3>Recent searches:</h3>
              <ul>
                {this.state.recent
                  .slice(0)
                  .reverse()
                  .map((element, i) => {
                    return (
                      <li key={i}>
                        <span onClick={this.handleRecentClick}>{element}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="results">
            {this.state.isLoading ? (
              <Loader />
            ) : Object.entries(this.state.results).length ? (
              <Images data={this.state.results.data.photos} />
            ) : (
              "Images will appear here..."
            )}
          </div>
        </section>
      </div>
    );
  }
}

export default FlickrSearch;
