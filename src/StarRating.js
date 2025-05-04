import { useState } from "react"
import PropTypes from 'prop-types' //in case we have reusable props to make them highlight what exactly have to be pass in that component of proplike is it no. string, function etc not necessary depends

//STYLING ( CSS ) IN REACT FOR PROPERTY NAME WE USE CAMELCASE THIS IS BETTER PASS IN AS OBJECT OBVIOUSLY I KNOW THAT
const constainerStar = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
}

const starContainerStyle = {
    display: 'flex',
}

//for propType warning not necessary
StarRating.propTypes = {
    maxRating: PropTypes.number.isRequired,
    color: PropTypes.string,
    size: PropTypes.number,
    className: PropTypes.string,
    message: PropTypes.array,
    onSetMovieRating: PropTypes.func
    // there is for boolean && function

}

export  function Text({children, color = 'orange'}) {
    return (<span style={{color}}>
        {children}
    </span>)
}

export default function StarRating({maxRating = 5, color = '#fcc419', size = 48, className = '', message = [], onSetMovieRating}) {
    //adding props to props to internal data from external data
    // message =[] we pass in as array but default
    const textStyle = {
        lineHeight: '1',
        margin:'0',
        color,
        fontSize: `${size/1.8}px`
    }

    const [rating, setRating] = useState(0)
    const [tempRating, setTempRating] = useState(0)

    function HandleRating(rating) {
        setRating(rating)
        // onSetMovieRating(rating)
        //external useState been use internal data
    }

    function handleHoverRateIn(rating) {
        setTempRating(rating)
        onSetMovieRating(rating)
    }

    function handlerHoverRateOut(rating) {
        setTempRating(rating)
    }

    return (
        <div style={constainerStar}>
           <div style={starContainerStyle}>
             {Array.from({length:maxRating}, (_, key) => key)
             .map(key=> <Star 
             onHnadleRate={()=>HandleRating(key + 1)} 
             onHoverIn={() => handleHoverRateIn(key + 1)} 
             onHoverOut={() => handlerHoverRateOut(0)} 
             full={tempRating ? tempRating >= key + 1 : rating >= key + 1} 
             color={color}
             size={size}
             key={key}/>)}
                {/* useing CHILD TO PARENT COMMUNICATION cuz based on the key we recive on clicking the star the 1 gets added to it we cannot use rating from useState cuz thats not what we want to update i get what i said   */}
                {/* full case when the 2d star is clicked the rating from useState becomes 2 now 2 >= 0 + 1 , 1 + 1 true star full(true) now 2 is not greater equal to 2 + 1 so empt star(false) */}
           </div>
           <p style={textStyle}>{message.length === maxRating ? message[tempRating ? tempRating - 1 : rating - 1]: tempRating || rating || ''}</p>
        </div>
    )
}



function Star({onHnadleRate, full, onHoverIn, onHoverOut, color, size}) {

    const startStyle = {
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
        cursor: 'pointer',
    }

    return (
     <span role="button" style={startStyle} onClick={onHnadleRate} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}>
        {full ? <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
         >
         <path
           d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
         />
        </svg> : <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
         >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="{2}"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
         />
        </svg>}
      </span>    
     
    )
}