import { useState } from 'react';
import './CSS/LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';
import { usePetContext } from '../Context/PetContext';

function LoginSignup() {
    const [isActive, setIsActive] = useState(false);
    const [loginData, setLoginData] = useState({ userEmail: '', password: '' });
    const [registerData, setRegisterData] = useState({ username: '', userEmail: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const { setIsLoggedIn, setUser } = usePetContext();
    const navigate = useNavigate();

    const toggleForm = () => setIsActive(!isActive);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (isActive) {
            setRegisterData({ ...registerData, [name]: value });
        } else {
            setLoginData({ ...loginData, [name]: value });
        }
        setError('');
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axiosInstance.post('/user/login', loginData);
            if (res.data.usertoken) {
                localStorage.setItem('token', res.data.usertoken);
                localStorage.setItem('role', res.data.role);
                setIsLoggedIn(true);
                setUser({ ...res.data.user, role: res.data.role });
                alert('Login successful!');
                navigate(res.data.role === 'admin' ? '/admin/dashboard' : '/');
            } else {
                setError('Invalid Credentials');
            }
        } catch (err) {
            console.error('Login error:', err.response || err.message || err);
            setError('Invalid Credentials');
        }
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axiosInstance.post('/user/register', registerData);
            alert(res.data.message);
            setIsActive(false);
        } catch (err) {
            const backendMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(backendMessage);
            console.error('Registration error:', err);
        }
    };

    return (
        <div className={`container ${isActive ? 'active' : ''}`} id="container">
            {/* Sign-up form */}
            <div className="form-container sign-up">
                <form onSubmit={handleRegisterSubmit}>
                    <h1>Create Account</h1>
                    <input type="text" placeholder="Name" name="username" value={registerData.username} onChange={handleChange} />
                    <input type="email" placeholder="Email" name="userEmail" value={registerData.userEmail} onChange={handleChange} />
                    <input type="password" placeholder="Password" name="password" value={registerData.password} onChange={handleChange} />
                    <input type="text" placeholder="Phone" name="phone" value={registerData.phone} onChange={handleChange} />
                    <button type="submit">Sign Up</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>

            {/* Sign-in form */}
            <div className="form-container sign-in">
                <form onSubmit={handleLoginSubmit}>
                    <h1>Sign In</h1>
                    <input type="email" name="userEmail" placeholder="Email" value={loginData.userEmail} onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleChange} />
                    
                    <button type="submit">Sign In</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>

            {/* Toggle panels */}
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use all site features</p>
                        <button className="hidden" id="login" onClick={toggleForm}>Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all site features</p>
                        <button className="hidden" id="register" onClick={toggleForm}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginSignup;
