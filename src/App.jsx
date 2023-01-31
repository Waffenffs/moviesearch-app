import { useState } from 'react'
import { AiOutlineFileImage } from 'react-icons/ai'
import './App.css'

export default function App(){
  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState([])
  const [movieDetails, setMovieDetails] = useState([])

  /* 
    features:
        1. when user clicks search, movies that are similar to input should show.
        2. make sure failure is graceful if api errors
        3. use movie database api
  */

  // get image from here: http://image.tmdb.org/t/p/w500/{your_poster_path}

  function getGenres(genreArray){
    const genres = genreArray.map((genre) => {
      const id = genre.id
      const type = genre.name

      return(
        <div className="genreBox">
          {type}
        </div>
      )
    })

    return genres
  }


  // component
  const MovieCard = ({title, photo, overview, genres}) => (
    <div className="cardContainer">
      <div className="movieTitleContainer">
        <h1 className="movieTitle">{title}</h1>
      </div>
      <div className="centerImageContainer">
        <div className="imgContainer">
          {typeof photo === 'object' ? 
            <div className="iconC">
              <AiOutlineFileImage className='imageIcon' />
            </div> 
          : 
            <img src={`http://image.tmdb.org/t/p/w500/${photo}`} />}
        </div>
      </div>
      <div className="genreContainer">
        {getGenres(genres)}
      </div>
      <p>{overview}</p>
    </div>
  )

  const cardElements = movieDetails.map((movie) => {
    return <MovieCard 
    title={movie.title} 
    photo={movie.poster_path}
    overview={movie.overview}
    genres={movie.genres}
    />
  })

  console.log(movieDetails)

  function getMovieDetails(){
    return movies.map((movie) => {
      const fetchDetails = async () => {
        const details = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=30e7868ff41a161a753b6ffa4a8f6a9e`)
        details.json().then((detail) => setMovieDetails(prevDetails => [...prevDetails, detail]))
      }

      fetchDetails()
    })
  }

  const getMovieId = async () => {
    const fetchId = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=30e7868ff41a161a753b6ffa4a8f6a9e&query=${search}`)
    fetchId.json().then((id) => {
      // reset moviedetails each search iteration
      if(movieDetails.length > 0){
        setMovieDetails([]) 
      }
      setMovies(id.results)
      getMovieDetails()
    })
  }



  return(
    <div className="main">
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      <button onClick={getMovieId}>Search</button>

      <div className="container">
        {cardElements}
      </div>
    </div>
  )
}