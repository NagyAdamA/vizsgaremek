import axios from 'axios'

export const axiosClient = axios.create({
    baseURL: "http://localhost:8000/",
    headers: {
        "Content-Type": "application/json",
    }
})

export const axiosClientWithoutAuth = axios.create({
    baseURL: "http://localhost:8000/",
    headers: {
        "Content-Type": "application/json",
    }
})

