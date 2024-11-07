import React, { useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import pet_logo from '../../assets/logo/pet_logo.svg';
import profile_icon from '../../assets/logo/profile_icon.png';
import logout from '../../assets/logo/logout.png';

const Navbar = () => {
    const [menu, setMenu] = useState("Home");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');  // Redirect to login page after logout
        window.location.reload();  // Refresh the page to update Navbar state
    };

    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={pet_logo} alt="logo" width={80} height={40} />
                <p>PET HAVEN</p>
            </div>
            <ul className='nav-menu'>
                <li onClick={() => setMenu("Home")}><Link to='/' style={{color: 'white'}}>Home</Link>{menu === "Home" ? <hr /> : <></>}</li>
                <li onClick={() => setMenu("dog")}><Link to='/dog' style={{color: 'white'}}>Dogs</Link>{menu === "dog" ? <hr /> : <></>}</li>
                <li onClick={() => setMenu("cat")}><Link to='/cat' style={{color: 'white'}}>Cats</Link>{menu === "cat" ? <hr /> : <></>}</li>
                <li onClick={() => setMenu("others")}><Link to='/others' style={{color: 'white'}}>Others</Link>{menu === "others" ? <hr /> : <></>}</li>
            </ul>

            <div className='nav-login-cart'>
                {isLoggedIn ? (
                    <div className='profile-dropdown'>
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            Profile &#9662; {/* Down chevron */}
                        </button>
                        {isDropdownOpen && (
                            <div className='dropdown-menu'>
                                <Link 
                                    to='/profile' 
                                    onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                                    style={{ color: 'black', fontSize: 18 }}>
                                    <img src={profile_icon} alt="" width={18} style={{ marginBottom: -2.5, marginRight: 10 }} />
                                    Your Profile
                                </Link>
                                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62E2E' }}>
                                    <img src={logout} alt="" width={20} style={{ marginBottom: -4 }} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to='/login'><button>Login</button></Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
