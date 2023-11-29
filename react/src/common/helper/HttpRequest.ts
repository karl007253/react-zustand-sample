import axios, { AxiosRequestConfig } from "axios";
import { API_TOKEN } from "../data/Constant";
import { getCookies } from "./Cookies";
import redirectToLogin from "./Redirect";

// generic interface for a http response
interface HttpResponse<T = void> {
    data: T;
    message: string;
    success: boolean;
}

// global axios setting
const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_MAIN_BACKEND_URL,
});

// specific axios setting for java tester
const javaTesterHttpRequest = axios.create({
    baseURL: process.env.REACT_APP_JAVA_TESTER_URL,
});

const storagePath = process.env.REACT_APP_STORAGE_URL;

const tokenAssigner = (config: AxiosRequestConfig) => {
    const token = getCookies(API_TOKEN);

    if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    return config;
};

httpRequest.interceptors.request.use(tokenAssigner);
javaTesterHttpRequest.interceptors.request.use(tokenAssigner);

// global http response interceptor
httpRequest.interceptors.response.use(
    (response) => {
        // return data from a response if the API call is success
        return response.data;
    },
    (error) => {
        // Check if it is unauthorized status code
        if (error.response.status === 401) {
            // Redirect to login page
            redirectToLogin();

            return Promise.reject();
        }

        // return message from a response of API call, or error message from axios, or the error itself in string, if the API call is failed.
        const message =
            error.response?.data?.message || error.message || error.toString();
        return Promise.reject(message);
    }
);

const mockedHttpRequest = httpRequest as jest.Mocked<typeof httpRequest>;
const mockedJavaTesterHttpRequest = javaTesterHttpRequest as jest.Mocked<
    typeof javaTesterHttpRequest
>;

export type { HttpResponse };
export {
    mockedHttpRequest,
    javaTesterHttpRequest,
    mockedJavaTesterHttpRequest,
    storagePath,
};
export default httpRequest;
