import React from 'react'
import './Footer.css'
import footer_logo from '../../assets/logo/logo.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className='footer-logo'>
            <img src={footer_logo} alt="" />
            <p>PET HAVEN</p>
        </div>
        <ul className="footer-links">
            <li>Company</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                </a>
            </div>
            <div className="footer-icons-container">
                <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-pinterest"></i>
                </a>
            </div>
            <div className="footer-icons-container">
                <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-whatsapp"></i>
                </a>
            </div>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ 2024 - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer
