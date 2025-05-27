import axios, { AxiosError, AxiosResponse } from "axios";
import { Post } from "../models/post";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { UserDetails, UserFormValues } from "../models/user";
import { LikesInfo } from "../models/likesInfo";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5010/api';

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers)
        config.headers.Authorization = `Bearer ${token}`;
    
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                router.navigate('/not-found');
            }
            if (data.errors) {
                const modalStateError = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateError.push(data.errors[key]);
                    }
                }
                throw modalStateError.flat();
            }
            else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unathorised');
            break;
        case 403:
            toast.error('forbidden');
            break;
        case 404:
            router.navigate("/not-found");
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate("/server-error");
            break;
    }

    return Promise.reject(error);
    
});

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put:<T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string, body: {} | undefined = undefined) => axios.delete<T>(url, body).then(responseBody),
}

const Posts = {
    list: () => requests.get<Post[]>('/posts'),
    details: (id: string) => requests.get<Post>(`/posts/${id}`),
    create: (post: Post) => requests.post<void>('/posts', post),
    update: (post: Post) => requests.put<void>(`/posts/${post.id}`, post),
    delete: (id: string) => requests.delete<void>(`/posts/${id}`),
}

const Likes = {
    create: (postId: string) => requests.post<LikesInfo>('/likes', {postId}),
    delete: (postId: string) => requests.delete<LikesInfo>(`/likes/${postId}`),
}

const Users = {
    current: () => requests.get<UserDetails>('/users'),
    details: (id: string) => requests.get<UserDetails>(`/users/${id}`),
    login: (creds: UserFormValues) => requests.post<UserDetails>('/users/login', creds),
    register: (creds: UserFormValues) => requests.post<UserDetails>('/users/register', creds),
}

const TestError = {
    notFound: () => axios.get('/buggy/not-found').catch(err => console.log(err.response)),
    badRequest: () => axios.get('/buggy/bad-request').catch(err => console.log(err.response)),
    serverError: () => axios.get('/buggy/server-error').catch(err => console.log(err.response)),
    unauthorised: () => axios.get('/buggy/unauthorised').catch(err => console.log(err.response)),
    forbidden: () => axios.get('/buggy/forbidden').catch(err => console.log(err.response)),
    notAGuid: () => axios.get('/posts/notaguid').catch(err => console.log(err.response))
}

const agent = {
    Posts,
    Users,
    TestError,
    Likes,
}

export default agent;