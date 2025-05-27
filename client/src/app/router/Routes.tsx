import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "../layout/App";
import PostDashboard from "../../features/posts/dashboard/PostDashboard";
import PostForm from "../../features/posts/form/PostForm";
import PostDetails from "../../features/posts/details/PostDetails";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/LoginForm";
import UserDetails from "../../features/users/UserDetails";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'posts', element: <PostDashboard /> },
            { path: 'posts/:id', element: <PostDetails /> },
            { path: 'createPost', element: <PostForm key='create' /> },
            { path: 'manage/:id', element: <PostForm key='manage' /> },
            { path: 'login', element: <LoginForm/> },
            { path: 'users/:id', element: <UserDetails /> },
            { path: 'errors', element: <TestErrors /> },
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
            { path: '*', element: <Navigate replace to='/not-found' /> },
        ]
    }
]

export const router = createBrowserRouter(routes);