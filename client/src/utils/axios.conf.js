import axios from 'axios';

const myAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export default myAxios