import React, { useState } from 'react';
import './login.css';
import { newLogin} from './DBrequests';

const LoginPage = ({ onLoginSuccess }) => 
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        console.log('Logging in with:', { username, password });
        try 
        {
            const result = await newLogin(username, password);
            console.log('result:', result);
            if (result.error)
            {
                alert(result.message);
            }
            else 
            {
                console.log('Login successful');
                onLoginSuccess();               
            }
        }
        catch (error) 
        {
            console.error('Error during sign in:', error);
            alert('Something went wrong. Please try again later.');
        }
    };

return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

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

        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );

};
export default LoginPage;
