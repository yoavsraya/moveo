import React, { useState, useEffect } from 'react';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { checkSession, logoutSession } from '../auth/DBrequests'; 

const Header = ({onLogOutSuccess, isAuthenticated}) => {
    console.log('Header isAuthenticated:', isAuthenticated);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check session to see if user is logged in
    useEffect(() => {
            setIsLoggedIn(isAuthenticated);
    }, [isAuthenticated]);

    // Handle navigation
    const handleNavigation = (path) => { //when is live, no redirection allowed
        const currentLocation = window.location.href;
        if (currentLocation.startsWith('http://184.73.72.205:5000/live')) { 
            return; 
        }
        navigate(path);
    };

    // Handle logout
    const handleLogout = () => {
        const currentLocation = window.location.href;
        if (currentLocation.startsWith('http://184.73.72.205:5000/live')) { //when live button off
            return;
        }
        logoutSession() 
            .then(() => {
                console.log("Logout successful");
                setIsLoggedIn(false); 
                onLogOutSuccess();
                navigate('/login'); 
            })
            .catch(err => console.error("Logout failed", err));
    };

    return (
        <header className="header">
            <div className="left-section">
                <button className="home-btn" onClick={() => handleNavigation('/')}>Home</button>
            </div>
            <div className="right-section">
                {isLoggedIn ? (
                    
                    <button className="logout-btn" onClick={handleLogout}> Logout </button> //if login show logout 
                ) : (
                    // Show login and sign-up buttons if user is not logged in
                    <>
                        <button className="login-btn" onClick={() => handleNavigation('/login')}>Login</button>
                        <button className="signup-btn" onClick={() => handleNavigation('/sign-up')}>Sign Up</button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
