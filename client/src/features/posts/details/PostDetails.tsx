import { useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import PostDetailedHeader from "./PostDetailedHeader";
import PostDetailedInfo from "./PostDetailedInfo";
import PostDetailedChat from "./PostDetailedChat";
import PostDetailedSidebar from "./PostDetailedSidebar";


export default observer(function PostDashboard() {
    const { postStore } = useStore();
    const { selectedPost: post, loadPost, loadingInitial } = postStore;
    const { id } = useParams();

    useEffect(() => {
        if (id)
            loadPost(id);
    }, [id, loadPost])

    if (loadingInitial || !post)
        return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <PostDetailedHeader post={post} />
                <PostDetailedInfo post={post} />
                <PostDetailedChat />
            </Grid.Column>
            <GridColumn width={6}>
                <PostDetailedSidebar />
            </GridColumn>
        </Grid>
    )
})