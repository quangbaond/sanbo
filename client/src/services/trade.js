import axios from '../common/axios';

export const getTradeData = async () => {
    const response = await axios.get('/trade');
    return response;
}