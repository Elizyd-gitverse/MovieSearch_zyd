import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovieFetch } from "./useMovieFetch";
import { useLocalStorage } from "./useLocalStorage";
import { useKeyPress } from "./useKeyPress";

const average = (arr) => arr?.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = '6cac7d8a'

export default function App() {
  const [query, setQuery] = useState('')
  const [selectedID, setSelectedID] = useState(null)
  const [movies, isLoading, isError] = useMovieFetch(query)
  const [watched, setWatched] = useLocalStorage([], 'Watched')
 
  function handleGetSelectedID(selectedId) {
    setSelectedID(selectedID => selectedID === selectedId ? null : selectedId)
  }

  function handleCloseMovieDetails() {
    setSelectedID(null)
  }

  function handleAddWatchedMovie(newwatchedMovie) {
    setWatched(watched => [...watched, newwatchedMovie])
  }

  function handleDeleteWactedMovie(id) {
    setWatched(watched => watched.filter(watched=> watched.imdbID !== id))
  }

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
  const inputEl = useRef(null)

  useKeyPress('Enter', function() {
      if(document.activeElement === inputEl.current) return;
      inputEl.current.focus()
      setQuery("")
  })

  return (
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    ref={inputEl}
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
  const [isLoading, setIsLoading] = useState(false)
  const [movieInfo, setMovieInfo] = useState({})
  const [userRating, setRating] = useState('')

  const isWatched = watched.map(watched => watched.imdbID).includes(selectedID)
  const watchedUserRating = watched.find(watched => watched.imdbID === selectedID)?.userRating

  useKeyPress('Escape', onCloseSelectedID)
 
  useEffect(function() {
    async function fetchMovieDetails() {
      setIsLoading(true)
      const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&i=${selectedID}`)
      const data = await res.json()
      setMovieInfo(data)
      setIsLoading(false)
    }
    fetchMovieDetails()
  }, [selectedID])


  useEffect(function() {
      document.title = `Movie: ${movieInfo.Title}`
      return function() {
        document.title = '🍿usePopCorn'
      }
  }, [movieInfo.Title])

   function handleClickAddWatchedMovie(watchedMovie) {
    const watchedMovieInfo = {...watchedMovie, userRating}
    onAddWatchedMovie(watchedMovieInfo)
    onCloseSelectedID()
   }

  return (
   isLoading ? <Loader /> : 
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
    <li >
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
  const avgImdbRating = Math.trunc(average(watched.map((movie) => movie.imdbRating)));
  const avgUserRating = Math.trunc(average(watched.map((movie) => movie.userRating)));
  const avgRuntime = Math.trunc(average(watched.map((movie) => +movie.Runtime.split(' ')[0])));
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