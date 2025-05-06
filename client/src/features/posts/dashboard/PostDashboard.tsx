import { useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import PostList from "./PostList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import PostFilters from "./PostFilters";


export default observer (function PostDashboard() {
    const {postStore} = useStore();
    const {loadPosts, postRegistry} = postStore;

    useEffect(() => {
       if (postRegistry.size <= 1)
            postStore.loadPosts();
    }, [loadPosts, postRegistry.size])
  
    if (postStore.loadingInitial) return <LoadingComponent content='Loading posts...' />

    return (
        <Grid>
            <Grid.Column width='16'>
                <PostList />
            </Grid.Column>
            {/* <GridColumn width='3'>
                <PostFilters />
            </GridColumn> */}
        </Grid>
    )
})