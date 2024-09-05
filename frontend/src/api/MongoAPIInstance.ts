import axios, {AxiosInstance} from "axios";

export const mongoAPI: AxiosInstance = axios.create({
    baseURL: "http://localhost:2000",
    headers: {
        'Content-Type': 'application/json'
    }
})

// 3.111.205.170