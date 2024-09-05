import axios from '../common/axios';

export const getMyTransaction = async () => {
    const response = await axios.get('/transaction/my');
    return response;
}

export const createTransaction = async (data) => {
    const response = await axios.post('/transaction', data);
    return response;
}

export const getTransaction = async (query) => {
    const response = await axios.get('/transaction', { params: query });
    return response;
}

export const updateTransaction = async (id, data) => {
    const response = await axios.put(`/transaction/${id}`, data);
    return response;
}

export const deleteTransaction = async (id) => {
    const response = await axios.delete(`/transaction/${id}`);
    return response;
}