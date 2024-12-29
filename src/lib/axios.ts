import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const { authToken } = JSON.parse(localStorage.getItem('auth') || '{}');

        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const refreshToken = async () => {
    try {
        const { refreshToken } = JSON.parse(localStorage.getItem('auth') || '{}');
        const { data } = await axiosInstance.post(`http://localhost:3000/api/v1/super-users/refresh?lang=en`, { refreshToken });

        return data;
    }
    catch (error) {
        console.log("Error", error);
    }
}

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await refreshToken();

                // update auth data in local storage
                const auth = JSON.parse(localStorage.getItem('auth') || '{}');
                localStorage.setItem('auth', JSON.stringify({ ...auth, ...response }));
                console.log(JSON.parse(localStorage.getItem('auth') || '{}'));

                //update token in axios instance
                axiosInstance.defaults.headers.common["Authorization"] = `Beare ${response?.authToken}`;
                originalRequest.headers["Authorization"] = `Beare ${response?.authToken}`;

                return axiosInstance(originalRequest);
            }
            catch (error) {
                console.log("Error", error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
