import axios from "axios";
const BASE_URL: string = 'http://15.206.16.230:4000/api/v1/android/';
export const Endpoint = axios.create({
    baseURL: BASE_URL
})

