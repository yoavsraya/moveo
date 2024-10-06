import axios from 'axios';

export const newSignIn = async (i_username, i_password, i_instrument, i_admin) =>
{
    console.log('Signing in with:', { i_username, i_password, i_instrument, i_admin });
    try
    {
        const response = await axios.post('http://localhost:3000/sign-in',
        {
            userName: i_username,
            password: i_password,
            instrument: i_instrument,
            isAdmin: i_admin
        })
        return { error: false, message: response.data };
    }

    catch(error)
    {
        if (error.response && error.response.status === 400)
        {
            console.log('sign in as error', error.response.data.message);
            return { error: true, message: error.response.data.message };
        }
        else
        {
        console.error(error);
        return { error: true, message: 'An unknown error occurred' };
        }
    };

};

export const newLogin = async (i_username, i_password) =>
{
    console.log('Logging in with:', { i_username, i_password });
    try
    {
        const response = await axios.post('http://localhost:3000/login',
        {
            userName: i_username,
            password: i_password
        },
        { withCredentials: true }
    )
        console.log('3000/login as return');
        return { error: false, message: response.message , user: response.data.user};
    }

    catch(error)
    {
        if (error.response && error.response.status === 400)
        {
            console.log('login error', error.response.data.message);
            return { error: true, message: error.response.data.message };
        }
        else
        {
        console.error(error);
        return { error: true, message: 'An unknown error occurred' };
        }
    };

}

export const checkSession = async () => {
    try 
    {
        const response = await axios.get('http://localhost:3000/check-auth', { withCredentials: true });
        return response.data;
    }
    catch (error)
    {
        console.error('Error checking session:', error);
        return { isLoggedIn: false }; 
    }
  };

  export const checkAdmin = async () => {
    try 
    {
        const response = await axios.get('http://localhost:3000/admin-check', { withCredentials: true });
        return response.data;
    }
    catch (error)
    {
        console.error('Error checking session:', error);
        return { isLoggedIn: false }; 
    }
  };

  export const logoutSession = async () => {
    try {
        const response = await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
        console.log('logout as response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};