import axios from '../common/axios'

export const getSessionBefore = async (data) => {
    const res = await axios.get('/session/before', { params: data });
    return res.data;
}