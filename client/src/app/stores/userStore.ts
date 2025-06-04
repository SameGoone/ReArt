import { makeAutoObservable, runInAction } from "mobx";
import { UserDetails, UserIdentity, UserFormValues } from "../models/user";
import { ImageDto,  } from "../models/image";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    authorizedUser: UserIdentity | null = null;
    selectedUser: UserDetails | undefined = undefined;
    userLoadingInitial = false;
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.authorizedUser;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Users.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.authorizedUser = user);
            router.navigate('/posts');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Users.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.authorizedUser = user);
            router.navigate('/posts');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }
    
    logout = () => {
        store.commonStore.setToken(null);
        this.authorizedUser = null;
        router.navigate('/');
    }
    
    getCurrentUser = async () => {
        try {
            const user = await agent.Users.current();
            runInAction(() => this.authorizedUser = user)
        } catch (error) {
            console.log(error);
        }
    }

    loadUser = async (id: string) => {
        this.userLoadingInitial = true;

        try {
            const user = await agent.Users.details(id);
            runInAction(() => {
                this.selectedUser = user;
                this.userLoadingInitial = false;
            });
            return user;
        } catch (error) {
            console.error(error);
            runInAction(() => {
                this.userLoadingInitial = false;
            });
        }
    }

    updateImage = async (id: string, image: ImageDto) => {
        this.loading = true;
        try {
            await agent.Users.updateImage(id, image);
            runInAction(() => {
                if(this.selectedUser && this.selectedUser.id === id) {
                    this.selectedUser.image = image;
                }
                if(this.authorizedUser?.id === id) {
                    this.authorizedUser.image = image;
                }
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }
}