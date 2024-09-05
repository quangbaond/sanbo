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

export const updateBank = async (data) => {
    const response = await axios.post('/auth/update-bank', data);
    return response;
};

export const logout = async () => {
    const response = await axios.post('/auth/logout');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    return response;
};

export const updateProfile = async (data) => {
    const response = await axios.post('/auth/update-profile', data);
    return response;
};

export const updateAvatar = async (data) => {
    const response = await axios.post('/auth/update-avatar', data);
    return response;
};

export const updatePassword = async (data) => {
    const response = await axios.post('/auth/update-password', data);
    return response;
};

