import axios from '../common/axios'

export const register = async (data) => {
    const response = await axios.post('/auth/register', data);
    return response;
};

export const login = async (data) => {
    const response = await axios.post('/auth/login', data);
    return response;
};

export const getUser = async () => {
    const response = await axios.get('/auth/profile');
    if(response.status === 401) {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        window.location.href = '/login';
        return null;
    }
    return response;
};

export const logout = async () => {
    const response = await axios.post('/auth/logout');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    return response;
};

