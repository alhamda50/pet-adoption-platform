import React from 'react'
import './Comments.css'
import comment_image from '../../assets/random/comment.png'

const Comments = () => {
  return (
    <div className='comments'>


<div className="comments-right">
            <img src={comment_image} alt="" />
        </div>

        
        <div className="comments-left">
            <p>"If having a soul means being able to feel love and loyalty
               and gratitude, then animals are better off than a lot of humans.
                You've nothing to lose, and you have a life to gain. You have
                 a friend who will teach you kindness and forgiveness, 
                 patience and hope. Animals come into our lives to remind
                  us that, even with all our troubles, there is a simple
                   joy in simply being alive."
            </p>
            <h5>- James Herriot</h5>
            {/* <button>Adopt Now</button> */}
        </div>
        
    </div>
  )
}

export default Comments