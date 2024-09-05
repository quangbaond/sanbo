import axios from '@/common/axios'

export const getBanks = async () => {
    const response = await axios.get('bank');
    return response;
}

export const getListBank = async () => {
    const response = await axios.get('bank/active');
    return response;
}

export const addBank = async (bank) => {
    const response = await axios.post('bank', bank);
    return response;
}

export const updateBank = async (id, bank) => {
    const response = await axios.put(`bank/${id}`, bank);
    return response;
}

export const deleteBank = async (id) => {
    const response = await axios.delete(`bank/${id}`);
    return response;
}