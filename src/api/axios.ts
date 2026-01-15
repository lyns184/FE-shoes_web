import axios from "axios";

const BASE_URL = 'http://localhost:6869'
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Cho phép gửi cookies
    headers: {
        'Content-Type': 'application/json',
    }
}) 

export default api 