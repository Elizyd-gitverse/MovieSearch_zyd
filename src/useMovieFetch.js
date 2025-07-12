import { useEffect, useState } from "react"

const key = '6cac7d8a'
export function useMovieFetch(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setError] = useState('')

     useEffect(function() {
    //killing the prviou details
    const controller = new AbortController()
    async function fetchMovies() {
      try{
        setIsLoading(true)
        setError("")
        const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&s=${query}`, {signal: controller.signal})
        const data = await res.json()
        if(data.Error === 'Movie not found!') throw new Error('Movie Not found 🚫')  
        setMovies(data.Search)
        setError("")
        
      }catch(err) {
        if(err.name !== 'AbortError') {
          setError(err.message)
        }
      }finally {
        setIsLoading(false)
      }
    }

    if(query.length < 3) {
      setMovies([])
      setError('')
      return
    }

    fetchMovies()
    return function() {
      controller.abort()
    }
  }, [query])

  return [movies, isLoading, isError]
}
