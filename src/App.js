import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = '6cac7d8a'

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selectedID, setSelectedID] = useState('')

  function handleGetSelectedID(selectedId) {
    setSelectedID(selectedId)
  }

  function handleCloseMovieDetails() {
    setSelectedID('')
  }

  function handleAddWatchedMovie(newwatchedMovie) {
    setWatched(watched => [...watched, newwatchedMovie])
  }

  function handleDeleteWactedMovie(id) {
    setWatched(watched => watched.filter(watched=> watched.imdbID !== id))
  }

  useEffect(function() {
    async function fetchMovies() {
      try{
        setIsLoading(true)
        const res = await fetch(`http://www.omdbapi.com/?apikey=${key}&s=${query}`)
        const data = await res.json()
        if(data.Error === 'Movie not found!') throw new Error('Movie Not found 🚫')  
        setMovies(data.Search)
        
      }catch(err) {
        setError(err.message)
      }finally {
        setIsLoading(false)
      }
      if(query.length < 3) {
        setMovies([])
        setError('')
      }
    }

    fetchMovies()
  }, [query])

  return (
    <>
     <NavBar movies={movies}>
       <SearchBar query={query} setQuery={setQuery}/>
       <SearchResult movies={movies}/>
     </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !isError && <MovieUl movies={movies} onSelectedID={handleGetSelectedID}/>} 
          {isError && <ErrorText message={isError}/>}
        </Box>

        <Box>
          {selectedID ? <MovieDetailsBox selectedID={selectedID} onCloseSelectedID={handleCloseMovieDetails} onAddWatchedMovie={handleAddWatchedMovie} watched={watched} /> : <>
            <MovieSummary watched={watched}/>
            <MovieWatchedUl watched={watched} onDeleteWatchedMovie={handleDeleteWactedMovie} />
          </> }
         
        </Box>
      </Main>
    </>
  );
}

//Loader
function Loader() {
  return (
    <div className="loader">
    <p>Loading...</p>
  </div>
  )
}
//ERROR
function ErrorText({message}) {
  return (
    <div className="error">
      <p>{message}</p>
    </div>
  )
}

function NavBar({children}) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
  </nav>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function SearchBar({query, setQuery}) {
  return (
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  )
}

function SearchResult({movies}) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Main({children}) {
  return (
    <main className="main">
         {children}
      </main>
  )
}


function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && (children )}
  </div>
  )
}

// function MoviesWatchedBox({children}) {
//   const [isOpen2, setIsOpen2] = useState(true);
//   return (
//     <div className="box">
//     <button
//       className="btn-toggle"
//       onClick={() => setIsOpen2((open) => !open)}
//     >
//       {isOpen2 ? "–" : "+"}
//     </button>
//     {isOpen2 && (children)}
//   </div>
//   )
// }


function MovieDetailsBox({selectedID, onCloseSelectedID,  onAddWatchedMovie, watched}) {
  const [movieInfo, setMovieInfo] = useState({})
  const [userRating, setRating] = useState('')
  console.log(userRating)

  const isWatched = watched.map(watched => watched.imdbID).includes(selectedID)
  console.log(isWatched)
  const watchedUserRating = watched.find(watched => watched.imdbID === selectedID)?.userRating

   useEffect(function() {
    async function fetchMovieDetails() {
      const res = await fetch(`http://www.omdbapi.com/?apikey=${key}&i=${selectedID}`)
      const data = await res.json()
      setMovieInfo(data)
    }
    fetchMovieDetails()
   }, [selectedID])

   function handleClickAddWatchedMovie(watchedMovie) {
    const watchedMovieInfo = {...watchedMovie, userRating}
    onAddWatchedMovie(watchedMovieInfo)
    onCloseSelectedID()
   }

  return (
    <div className="details">
      <header>
       <button className="btn-back" onClick={onCloseSelectedID}>&larr;</button>
       <img src={movieInfo.Poster} alt={`Moovie Poster of ${movieInfo.Title}`} />
       <div className="details-overview">
       <h2>{movieInfo.Title}</h2>
        <p>{movieInfo.Released}&bull; {movieInfo.Runtime}</p>
        <p>{movieInfo.Genre}</p>
        <p><span>🌟</span>{movieInfo.imdbRating}</p>
        <p>Starring {movieInfo.Actors}</p>
        <p>Directed by {movieInfo.Director}</p>
       </div>
      </header>
      <section>
        <div className="rating">
        {isWatched ? <p>You have Rated this Movie {watchedUserRating} 🌟</p> : <>
        <StarRating maxRating={10} size={24} color = '#fcc419' onSetMovieRating={setRating}/>
        {userRating > 0 && <button className="btn-add" onClick={() => handleClickAddWatchedMovie(movieInfo)}> + Add to Watched List</button>}  </> }  
        </div>
        <p><em>{movieInfo.Plot}</em></p>
        
      </section>
    
    </div>
    
  )
}

function MovieUl({movies, onSelectedID}) {
  return (
    <ul className="list">
    {movies?.map((movie) => (
      <MovieList movie={movie} key={movie.imdbID} onSelectedID={onSelectedID} />
    ))}
  </ul>
  )
}

function MovieList({movie, onSelectedID}) {
  return (
    <li onClick={() => onSelectedID(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
  )
}

function MovieWatchedUl({watched, onDeleteWatchedMovie}) {
  return ( 
    <ul className="list">
    {watched.map((movie) => ( <WatchedMovieList movie={movie} key={movie.imdbID} onDeleteWatchedMovie={onDeleteWatchedMovie}/>))}
  </ul>
  )
}

function WatchedMovieList({movie, onDeleteWatchedMovie}) {
  return (
    <li>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.Runtime}</span>
      </p>
    </div>
    <button className="btn-delete" onClick={() => onDeleteWatchedMovie(movie.imdbID)} >X</button>
  </li>
  )
}

function MovieSummary({watched}) {
  console.log(watched)
  const avgImdbRating = Math.trunc(average(watched.map((movie) => movie.imdbRating)));
  const avgUserRating = Math.trunc(average(watched.map((movie) => movie.userRating)));
  const avgRuntime = average(watched.map((movie) => +movie.Runtime.split(' ')[0]));
  console.log(avgRuntime)
  return(
    <div className="summary">
          <h2>Movies you watched</h2>
          <div>
            <p>
              <span>#️⃣</span>
              <span>{watched.length} movies</span>
            </p>
            <p>
              <span>⭐️</span>
              <span>{avgImdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{avgUserRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{avgRuntime} min</span>
            </p>
          </div>
        </div>
  )
}