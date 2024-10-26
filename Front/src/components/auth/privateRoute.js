import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkSession } from './DBrequests';

//handle all the private routing in the app 
const PrivateRoute = ({ children , route = null}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const location = useLocation(); // Get the current location to handle redirection

  useEffect(() => { //doing one time in thr start
    checkSession().then(sessionData => 
    {
      //check if the user is auth
      setIsAuthenticated(sessionData.isLoggedIn);
      setIsAdmin(sessionData.user?.admin || false);
      setIsSessionChecked(true);
    });
  }, []);

  if (!isSessionChecked) //if the session is not checked yet
  {
    console.log('session is not checked');
    return null; 
  }

  if (!isAuthenticated) //if the user is not connected
  {
    console.log('user is not authenticated');
    return <Navigate to="/login" />;
  }

  if (isAuthenticated)
  {
    if (isAdmin && location.pathname !== '/admin') 
    {
      console.log('user is admin');
      if(route)
      {
        return <Navigate to={route} />;
      }
      else
      {
        return <Navigate to="/admin" />; 
      }
    }

    if (!isAdmin && location.pathname !== '/home') 
    {
      console.log('user not admin');
      return <Navigate to="/home" />;
    }
  }

  console.log('no redirection');
  return children;
};

export default PrivateRoute;
