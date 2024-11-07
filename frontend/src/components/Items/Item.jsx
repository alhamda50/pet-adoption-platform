import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom';

const Item = (props) => {
    return (
      <div className='item'>

  
          <Link to={`/product/${props.id}`}><img src={props.image[0]} alt="images" /></Link>
          <p>{props.name}</p>
          <div className="item_data">
            <p>{props.breed}</p>
            <p>{props.gender}</p>
          </div>
          
          {/* <div className="item-prices">
              <div className="item-price-new">
                  <p>${props.new_price}</p>
              </div>
              <div className="item-price-old">
                  <p>${props.old_price}</p>
                  
              </div>
              
  
          </div> */}
      </div>
    )
  }
  
  export default Item