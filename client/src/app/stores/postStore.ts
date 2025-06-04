import { makeAutoObservable, runInAction } from "mobx"
import { PostCreateDto, PostDetailsDto } from "../models/post";
import agent from "../api/agent";

export default class PostStore {
    postRegistry = new Map<string, PostDetailsDto>();
    selectedPost: PostDetailsDto | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get postsByCreatedOn() {
        return Array.from(this.postRegistry.values())
            .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    }

    loadPosts = async () => {
        this.loadingInitial = true;
        try {
            const posts = await agent.Posts.list();
            runInAction(() => {
                this.postRegistry = new Map<string, PostDetailsDto>();
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
                    this.selectPost(post!);
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

    private setPost = (post: PostDetailsDto) => {
        post.createdAt = new Date(post.createdAt);
        this.postRegistry.set(post.id, post);
    }

    private selectPost = (post: PostDetailsDto) => {
        post.createdAt = new Date(post.createdAt);
        this.postRegistry.set(post.id, post);
        this.selectedPost = post;
    }

    private getPost = (id: string) => {
        return this.postRegistry.get(id);
    }

    createPost = async (postInput: PostCreateDto) => {
        this.loading = true;
        try {
            const createdPost = await agent.Posts.create(postInput);
            runInAction(() => {
                this.selectPost(createdPost);
                this.editMode = false;
                this.loading = false;
            });
            return createdPost.id;
        } catch (error) {
            console.error(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    updatePost = async (postInput: PostCreateDto) => {
        this.loading = true;
        try {
            const updatedPost = await agent.Posts.update(postInput);
            runInAction(() => {
                this.selectPost(updatedPost);
                this.editMode = false;
                this.loading = false;
            });
            return updatedPost.id;
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

    updatePostLikes = (postId: string, likesInfo: any) => {
        runInAction(() => {
            if (this.selectedPost && this.selectedPost.id === postId) {
                this.selectedPost.likesInfo = likesInfo;
            }

            const postInRegistry = this.postRegistry.get(postId);
            if (postInRegistry) {
                postInRegistry.likesInfo = likesInfo;
                this.postRegistry.set(postId, postInRegistry);
            }
        });
    }
}