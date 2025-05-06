import { makeAutoObservable, runInAction } from "mobx"
import { Post } from "../models/post";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid'
import { format } from "date-fns";

export default class PostStore {
    postRegistry = new Map<string, Post>();
    selectedPost: Post | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get postsByCreatedOn() {
        return Array.from(this.postRegistry.values())
            .sort((a, b) => a.createdOn!.getTime() - b.createdOn!.getTime());
    }

    loadPosts = async () => {
        this.loadingInitial = true;
        try {
            const posts = await agent.Posts.list();
            runInAction(() => {
                this.postRegistry = new Map<string, Post>();
                posts.forEach(post => {
                    this.setPost(post);
                });
                this.loadingInitial = false;
            });
        } catch (error) {
            console.error(error);
            runInAction(() => {
                this.loadingInitial = false;
            });
        }
    }

    loadPost = async (id: string) => {
        let post = this.getPost(id);
        if (post) {
            this.selectedPost = post;
            return post;
        }
        else {
            this.loadingInitial = true;

            try {
                post = await agent.Posts.details(id);
                runInAction(() => {
                    this.setPost(post!);
                    this.selectedPost = post;
                    this.loadingInitial = false;
                });
                return post;
            } catch (error) {
                console.error(error);
                runInAction(() => {
                    this.loadingInitial = false;
                });
            }
        }
    }

    private setPost = (post: Post) => {
        post.createdOn = new Date(post.createdOn!);
        this.postRegistry.set(post.id, post);
    }

    private getPost = (id: string) => {
        return this.postRegistry.get(id);
    }

    createPost = async (post: Post) => {
        this.loading = true;
        post.id = uuid();
        try {
            await agent.Posts.create(post);
            runInAction(() => {
                this.postRegistry.set(post.id, post);
                this.selectedPost = post;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.error(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    updatePost = async (post: Post) => {
        this.loading = true;
        try {
            await agent.Posts.update(post);
            runInAction(() => {
                this.postRegistry.set(post.id, post);
                this.selectedPost = post;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.error(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    deletePost = async (id: string) => {
        this.loading = true;
        try {
            await agent.Posts.delete(id);
            runInAction(() => {
                this.postRegistry.delete(id);
                this.loading = false;
            });
        } catch (error) {
            console.error(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}