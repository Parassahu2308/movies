import React, { Component } from "react";
import { movies } from "./getMovies";
import axios from "axios";
import {API_KEY} from "../secret";

export default class List extends Component {
  constructor() {
    super();
    this.state = {
      hover: "",
      parr: [1],
      currPage: 1,
      movies: [],
    };
  }

  handleEnter = (id) => {
    this.setState({
      hover: id,
    });
  };

  handleLeave = () => {
    this.setState({
      hover: "",
    });
  };

  changeMovies = async () =>{
    let ans = await axios.get(
      `https://api.themoviedb.org/3/movie/popular/?api_key=${API_KEY}&language=en-US&page=${this.state.currPage}`
    );
    this.setState({
      movies: [...ans.data.results],
    });
  }

  handleNext = () =>{
    let tempArr = [];
    for(let i=1;i<=this.state.parr.length+1;i++){
       tempArr.push(i);
    }
    this.setState({
      parr: [...tempArr],
      currPage : this.state.currPage+1
    },this.changeMovies);
  }

  handlePrev = () =>{
    if(this.state.currPage!=1){
      this.setState({
        currPage:this.state.currPage-1
      },this.changeMovies);
    }
  }

  async componentDidMount() {
    let ans = await axios.get(
      `https://api.themoviedb.org/3/movie/popular/?api_key=${API_KEY}&language=en-US&page=${this.state.currPage}`
    );
    this.setState({
      movies: [...ans.data.results],
    });
  }

  render() {
    // let movie = movies.results;
    return (
      <>
        {this.state.movies.length == 0 ? (
          <div className="spinner-grow text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div>
            <h3 className="text-center">
              <strong>Trending</strong>
            </h3>
            <div className="movies-list">
              {this.state.movies.map((movieObj) => (
                <div
                  className="card movie-card"
                  onMouseEnter={() => this.handleEnter(movieObj.id)}
                  onMouseLeave={this.handleLeave}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`}
                    className="card-img-top banner-img"
                    alt="..."
                    style={{ height: "40vh" }}
                  />
                  <h5 className="card-title movie-title">
                    {movieObj.original_title}
                  </h5>
                  {/* <p className="card-text movie-text">
                        {movieObj.overview}
                   </p> */}
                  <div className="button-wrapper">
                    {this.state.hover == movieObj.id && (
                      <a href="#" class="btn btn-primary movie-button">
                        Add to Favourites
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination">
              <nav aria-label="Page navigation example">
                <ul class="pagination">
                  <li class="page-item">
                    <a class="page-link" onClick={this.handlePrev}>
                      Previous
                    </a>
                  </li>
                  {
                    this.state.parr.map(pageNum => (
                      <li class="page-item">
                      <a class="page-link" href="#">
                        {pageNum}
                      </a>
                    </li>
                    ))
                  }
                  <li class="page-item">
                    <a class="page-link" onClick={this.handleNext}>
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }
}
