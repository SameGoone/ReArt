import { Header } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import PostListItem from "./PostListItem";
import { Fragment } from "react/jsx-runtime";

export default observer(function PostList() {
    const { postStore } = useStore();
    const { groupedPosts: groupedPosts } = postStore;

    return (
        <>
            {groupedPosts.map(([group, posts]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {posts.map(post => (
                        <PostListItem key={post.id} post={post} />
                    ))}
                </Fragment>
            ))}
        </>
    )
})