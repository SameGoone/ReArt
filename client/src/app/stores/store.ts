import { createContext, useContext } from "react";
import PostStore from "./postStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";

interface Store {
    postStore: PostStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
}

export const store: Store = {
    postStore: new PostStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}