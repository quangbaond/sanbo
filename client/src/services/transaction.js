import axios from '../common/axios';

export const getMyTransaction = async (query) => {
    const response = await axios.get('/transaction/my', { params: query });
    return response;
}

export const createTransaction = async (data) => {
    const response = await axios.post('/transaction', data);
    return response;
}