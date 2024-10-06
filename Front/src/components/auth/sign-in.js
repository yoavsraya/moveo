import React, { useState } from 'react';
import './sign-in.css'; 
import { useNavigate , useLocation } from 'react-router-dom';
import { newSignIn} from './DBrequests';

const SignInPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [instrument, setInstrument] = useState('');

    const navigate = useNavigate(); 
    const location = useLocation();
    let isAdmin = false;
    const queryParams = new URLSearchParams(location.search);
    isAdmin = queryParams.get('admin') == '1234';

    const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) 
    {
        alert('Passwords do not match!');
        return;
    }


    try 
    {
        const result = await newSignIn(username, password, instrument, isAdmin)
        if (result.error)
        {
            alert(result.message);
        }
        else 
        {
            navigate('/login'); 
        }
    }
    catch (error) 
    {
        console.error('Error during sign in:', error);
        alert('Something went wrong. Please try again later.');
    }
    };

return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {isAdmin && <p style={{ color: 'red', fontWeight: 'bold' }}>Admin</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="instrument">Instrument</label>
          <input
            type="text"
            id="instrument"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signin-btn">Sign In</button>
      </form>
    </div>
  );
};

export default SignInPage;
