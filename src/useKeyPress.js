import { useEffect } from "react"

export function useKeyPress(Key, onCloseSelectedID) {
      //USEEFFECT 
      useEffect(function() {
            function closeMovieDetails(e) {
              if(e.key === Key) {
                 onCloseSelectedID()
                 console.log('closing')
              }
            }
            document.addEventListener('keydown', closeMovieDetails)
            return function() {
              document.removeEventListener('keydown', closeMovieDetails)
            }
          }, [Key, onCloseSelectedID])
}