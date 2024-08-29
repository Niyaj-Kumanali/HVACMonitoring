import axios, {AxiosInstance} from "axios";

export const mongoAPI: AxiosInstance = axios.create({
    baseURL: "http://3.111.205.170:2000",
    headers: {
        'Content-Type': 'application/json'
    }
})