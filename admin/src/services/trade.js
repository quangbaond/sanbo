import axios from '../common/axios';

export const getTradeData = async (query) => {
    const response = await axios.get('/trade', { params: query });
    return response;
}

export const getTradeListData = async (query) => {
    const response = await axios.get('/trade/list', { params: query });
    return response;
}