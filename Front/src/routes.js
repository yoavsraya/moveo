import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/header/header';
import LoginPage from './components/auth/login';
import SignUpPage from './components/auth/sign-up';
import HomePage from './components/home/home';
import AdminPage from './components/admin/admin';
import PrivateRoute from './components/auth/privateRoute';
import SongDisplay from './components/admin/songDisplay';
import { connectWebSocket, closeWebSocket } from './socket';


//control of all the routes
import { useState, useEffect, useRef} from 'react';

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const Navigate = useNavigate();
  const socketRef = useRef(null); //to avoid multi connection to the websocket

  useEffect(() => {  // Check authentication state
    const authState = localStorage.getItem('isAuthenticated');
    if (authState === 'true')
    {
      setIsAuthenticated(true);
    }
  }, []); 

  useEffect(() => {
    // This function will handle WebSocket messages
    const handleWebSocketMessage = (message) => { //socket skip private routing
      if (message.action === 'redirect' && message.url)
      {
        if(message.url == '/')
        {
          console.log('end of live')
          localStorage.removeItem('songData');
        }
        console.log('Redirecting to:', message.url);
        Navigate(message.url);
      }
    };

    if (isAuthenticated && !socketRef.current) {
      socketRef.current = connectWebSocket(handleWebSocketMessage);  // Connect WebSocket and use callback
      console.log('WebSocket connection established for authenticated user.');
    }

  }, [isAuthenticated, Navigate]);

  const handleLoginSuccess = () => 
  {
    console.log('handleLoginSuccess');
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    Navigate('/');
  };

  const handleLogOutSuccess = () => {
    setIsAuthenticated(false);
    localStorage.clear(); // Clear all local storage
    Navigate('/login');
    if (socketRef.current) {
      closeWebSocket(); 
      console.log('WebSocket connection closed.');
      socketRef.current = null;
    }
  };
  
  return (
    <>
      <Header isAuthenticated={isAuthenticated} onLogOutSuccess={handleLogOutSuccess}/> {/* Header controls logout */}
      <Routes>
        
        <Route
        path="/sign-up"
        element={<SignUpPage />}
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <></>
          }
        />

        <Route 
          path="/" //not a really page, just a placeholder
          element={
            <PrivateRoute>
              <HomePage /> 
            </PrivateRoute>
          } 
        />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/live" 
          element={
              <SongDisplay /> 
          } 
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
