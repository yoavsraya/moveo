import axios from 'axios';
//dor sending all the req to the server
export const newSignUp = async (i_username, i_password, i_instrument, i_admin) =>
{
    console.log('Signing up with:', { i_username, i_password, i_instrument, i_admin });
    try
    {
        const response = await axios.post('http://184.73.72.205:3000/sign-up',
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
            console.log('sign up as error', error.response.data.message);
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
        const response = await axios.post('http://184.73.72.205:3000/login',
        {
            userName: i_username,
            password: i_password
        },
        { withCredentials: true }
    )
        localStorage.setItem('isAdmin', response.data.user.admin);
        localStorage.setItem('instrument',response.data.user.instrument);
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
        const response = await axios.get('http://184.73.72.205:3000/check-auth', { withCredentials: true });
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
        const response = await axios.get('http://184.73.72.205:3000/admin-check', { withCredentials: true });
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
        const response = await axios.post('http://184.73.72.205:3000/logout', {}, { withCredentials: true });
        console.log('logout as response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};