import axios from '../common/axios'

export const getRoomActive = async () => {
    const response = await axios.get('/room/active');
    return response;
}