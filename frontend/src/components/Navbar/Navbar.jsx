import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import profile_icon from '../../assets/logo/profile_icon.png';
import logout from '../../assets/logo/logout.png';
import { usePetContext } from '../../Context/PetContext';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
    const [role, setRole] = useState(null); // Track user role
    const navigate = useNavigate();
    const { user } = usePetContext();

    // Update login state and role when user logs in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            // Example logic to determine role (adjust based on your app)
            setRole(user?.role || 'user');
        } else {
            setIsLoggedIn(false);
            setRole(null);
        }
    }, [user]); // Update when user context changes

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false); // Reset state
        setRole(null);
        navigate('/login');
    };

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="logo" width={100} height={80} />
                <p>PET HAVEN</p>
            </div>

            <div className='nav-links-right'>
                {role !== 'admin' && (
                    <>
                        <Link to='/' className='nav-home-link' style={{ color: 'white', fontSize: '20px', fontWeight: '500' }}>
                            Home
                        </Link>
                        <div className='nav-menu'>
                            <button 
                                onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)} 
                                className='menu-dropdown-toggle'
                            >
                                Menu &#9662;
                            </button>
                            {isMenuDropdownOpen && (
                                <ul className='menu-dropdown'>
                                    <li><Link to='/dog' style={{ color: '#2b7a78' }}>Dogs</Link></li>
                                    <li><Link to='/cat' style={{ color: '#2b7a78' }}>Cats</Link></li>
                                    <li><Link to='/others' style={{ color: '#2b7a78' }}>Others</Link></li>
                                </ul>
                            )}
                        </div>
                    </>
                )}

                <div className='nav-login-cart'>
                    {isLoggedIn ? (
                        role === 'admin' ? (
                            <>
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    style={{ background: 'none', border: '1px solid white', cursor: 'pointer', color: 'white', fontSize: '18px', fontWeight: '500', marginRight: '15px' }}
                                >
                                    Dashboard
                                </button>
                                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62E2E' }}>
                                    <img src={logout} alt="" width={20} style={{ marginBottom: -4 }} /> Logout
                                </button>
                            </>
                        ) : (
                            <div className='profile-dropdown'>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    Profile &#9662;
                                </button>
                                {isDropdownOpen && (
                                    <div className='dropdown-menu'>
                                        <Link to='/profile' onClick={() => setIsDropdownOpen(false)} style={{ color: 'black', fontSize: 18 }}>
                                            <img src={profile_icon} alt="" width={18} style={{ marginBottom: -2.5, marginRight: 10 }} />
                                            Your Profile
                                        </Link>
                                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62E2E' }}>
                                            <img src={logout} alt="" width={20} style={{ marginBottom: -4 }} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <Link to='/login'><button>Login</button></Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
