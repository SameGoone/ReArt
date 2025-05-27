import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { PostComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
    comments: PostComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (postId: string) => {
        if (store.postStore.selectedPost) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5010/comments?postId=' + postId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start()
                .catch(error => console.log('Error establishing the connection: ', error));

            this.hubConnection.on('LoadComments', (comments: PostComment[]) => {
                runInAction(() => {
                    comments.forEach(comment => comment.createdAt += 'Z')
                    this.comments = comments;
                })
            });

            this.hubConnection.on('ReceiveComment', (comment: PostComment) => {
                runInAction(() => this.comments.unshift(comment));
            });
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop()
            .catch(error => console.log('Error stopping the connection: ', error))
    }
    
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.postId = store.postStore.selectedPost?.id;
        try {
            await this.hubConnection?.invoke('SendComment', values);
        }
        catch (error) {
            console.error(error);
        }
    }
}