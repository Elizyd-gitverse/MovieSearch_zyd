import { useEffect, useState } from "react";

export function useLocalStorage(emptArr, key) {

  const [watched, setWatched] = useState(function() {
  const storeMovie = JSON.parse(localStorage.getItem(key))
    return storeMovie || []
  });

   useEffect(function() {
    localStorage.setItem(key, JSON.stringify(watched))
   })

   return [watched, setWatched]
}