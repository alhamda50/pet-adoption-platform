import React from 'react'
import './Hero.css'
import arrow from '../../assets/random/arrow.png'
import hero_image from '../../assets/random/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <div className='hero-left-text'>
            <h1>RE-HOME AND ADOPT A PET</h1>
            <p>Every pet deserves a good home</p>
            </div>
            
            <div className="hero-latest-btn">
                <div>ADOPT A PET</div>
                <img src={arrow} alt="arrow" />
            </div>
        </div>
        <div className="hero-right">
        <img src={hero_image} alt="heroImage" /></div>
    </div>
  )
}

export default Hero