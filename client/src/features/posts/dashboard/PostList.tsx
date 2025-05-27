import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import PostListItem from "./PostListItem";

export default observer(function PostList() {
    const { postStore } = useStore();
    const { postsByCreatedOn: postsByCreatedOn } = postStore;

    return (
        <>
            {postsByCreatedOn.map(post => (
                <PostListItem key={post.id} post={post} />
            ))}
        </>
    )
})