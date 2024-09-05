import axios from '../common/axios'

// export const getKlines = async (symbol, interval, limit) => {
//     const response = await axios.get(`/api/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
//     return response;
// };

export const getListSymbol = async () => {
    const response = await axios.get('/symbols');
    return response;
};

export const getSymbolActive = async () => {
    const response = await axios.get('/symbols/active');
    return response;
};

export const getListBinance = async (symbol, interval, limit) => {
    const response = await axios.get('/binance', { params: { symbol } })
    return response;
};

export const updateBinance = async (id, data) => {
    const response = await axios.put(`/binance/${id}`, data)
    return response;
};
