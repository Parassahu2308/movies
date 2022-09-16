import React, { Component } from "react";
import { API_KEY } from "../secret";
import axios from "axios";

export default class Favourite extends Component {
    constructor(){
        super();
       this.state={
        movies:[],
        genre :[],
        currGenre: "All Genre",
        currText: "",
        limit: 5,
        currPage: 1,
       }
    }

    async componentDidMount(){
      // let ans = await axios.get(
      //   `https://api.themoviedb.org/3/movie/popular/?api_key=${API_KEY}&language=en-US&page=1`
      //   );
      let results = JSON.parse(localStorage.getItem("movies"));
        let genreId = {
          28: "Action",
          12: "Adventure",
          16: "Animation",
          35: "Comedy",
          80: "Crime",
          99: "Documentary",
          18: "Drama",
          10751: "Family",
          14: "Fantasy",
          36: "History",
          27: "Horror",
          10402: "Music",
          9648: "Mystery",
          10749: "Romance",
          878: "Sci-Fi",
          10770: "TV",
          53: "Thriller",
          10752: "War",
          37: "Western",
        };
        let genreArr = [];
        results.map((movieObj) => {
          if(!genreArr.includes(genreId[movieObj.genre_ids[0]])){
            genreArr.push(genreId[movieObj.genre_ids[0]]);
          }
        })

        // console.log("1:", genreArr);
        genreArr.unshift("All Genre");
        // console.log("2:",genreArr);

        this.setState({
          movies: [...results],
          genre: [...genreArr]
        });
      }

    handleCurrGenre (genre) {
      this.setState({
        currGenre: genre
      })
    }

    handleText = (e) => {
      this.setState({
        currText: e.target.value,
      });
    };

    sortPopularityAsc = () => {
      let allMovies = this.state.movies;
      allMovies.sort((objA, objB) => {
        return objA.popularity - objB.popularity;
      });
      this.setState({
        movies: [...allMovies],
      });
    };
  
    sortPopularityDesc = () => {
      let allMovies = this.state.movies;
      allMovies.sort((objA, objB) => {
        return objB.popularity - objA.popularity;
      });
      this.setState({
        movies: [...allMovies],
      });
    };

    sortRatingAsc = () => {
      let allMovies = this.state.movies;
      allMovies.sort((objA, objB) => {
        return objA.vote_average - objB.vote_average;
      });
      this.setState({
        movies: [...allMovies],
      });
    };
  
    sortRatingDesc = () => {
      let allMovies = this.state.movies;
      allMovies.sort((objA, objB) => {
        return objB.vote_average - objA.vote_average;
      });
      this.setState({
        movies: [...allMovies],
      });
    };

    handlePageNum = (page) => {
      this.setState({
        currPage: page,
      });
    };

    handleDelete = (id) => {
      let newMovies = this.state.movies.filter((movieObj) => {
        return movieObj.id != id;
      });
      this.setState({
        movies:[...newMovies]
      })
      localStorage.setItem("movies", JSON.stringify(newMovies));
  
    }

  render() {
    let genreId = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Sci-Fi",
      10770: "TV",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    let filteredMovies = this.state.movies;

    //search movie
    if (this.state.currText === "") {
      filteredMovies = this.state.movies;
    } else {
      filteredMovies = filteredMovies.filter((movieObj) => {
        let movieName = movieObj.original_title.toLowerCase();
        return movieName.includes(this.state.currText);
      });
    }

    // Movie acc. to genre
    if (this.state.currGenre != "All Genre") {
      filteredMovies = filteredMovies.filter(
        (movieObj) => genreId[movieObj.genre_ids[0]] == this.state.currGenre
      );
    }


    //Pagination in Favourite
    let numOfPages = Math.ceil(filteredMovies.length / this.state.limit);
    let pagesArr = [];
    for (let i = 1; i <= numOfPages; i++) {
      pagesArr.push(i); //[1,2]
    }
    let si = (this.state.currPage - 1) * this.state.limit;
    let ei = si + this.state.limit - 1;
    filteredMovies = filteredMovies.slice(si, ei + 1);

    return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3 favourites-list">
          <ul className="list-group">
          {this.state.genre.map((genre) =>
            this.state.currGenre == genre ? (
              <li className="list-group-item active" aria-current="true">
                {genre}
              </li>
            ) : (
              <li className="list-group-item" aria-current="true" onClick={() => this.handleCurrGenre(genre)} >
                {genre}
              </li>
            )
          )}
          </ul>
        </div>
        <div className="col favourites-table" >
          <div className="row">
               <input type="text" className="col" placeholder="search" value={this.state.currText} onChange={this.handleText}></input>
               <input type="number" className="col" 
               value={this.state.limit}
               onChange={(e) => this.setState({ limit: e.target.value })}
               ></input>
          </div>
          <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Genere</th>
                <th scope="col">
                  <i className="fa-solid fa-caret-up" onClick={this.sortPopularityAsc}></i>
                  Popularity
                  <i className="fa-solid fa-caret-down" onClick={this.sortPopularityDesc}></i>
                </th>
                <th scope="col">
                  <i className="fa-solid fa-caret-up" onClick={this.sortRatingAsc}></i>
                  Rating
                  <i className="fa-solid fa-caret-down" onClick={this.sortRatingDesc}></i>
                </th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {   
              filteredMovies.map((movieObj)=>(
                <tr>
                <td scope="row">
                 <img
                   src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`}
                   style={{ width: "8rem" }}
                  />
                  <strong className="ms-3">{movieObj.original_title}</strong>
                </td>
                <td>{genreId[movieObj.genre_ids[0]]}</td>
                <td>{movieObj.popularity}</td>
                <td>{movieObj.vote_average}</td>
                <td><button
                className="btn btn-outline-danger"  onClick={() => this.handleDelete(movieObj.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
      <nav aria-label="Page navigation example">
          <ul className="pagination">
            {pagesArr.map((page) => (
              <li className="page-item">
                <a className="page-link" onClick={() => this.handlePageNum(page)}>
                  {page}
                </a>
              </li>
            ))}
          </ul>
        </nav>
    </div>
    );
  }
}
