import axios from 'axios'

export const axiosClient = axios.create({
    baseURL: "http://localhost:8000/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

export const axiosClientWithoutAuth = axios.create({
    baseURL: "http://localhost:8000/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

// Add response interceptor to handle 401 errors
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear any auth state if needed
            // The auth context will handle this
        }
        return Promise.reject(error)
    }
)

