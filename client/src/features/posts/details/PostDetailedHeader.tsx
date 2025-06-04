import { observer } from 'mobx-react-lite';
import { Button, Image, Item, Segment } from 'semantic-ui-react'
import { Post } from "../../../app/models/post";
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';
import LikeButton from '../../likes/LikeButton';

interface Props {
    post: Post
}

export default observer(function PostDetailedHeader({ post }: Props) {
    const { postStore, userStore: { authorizedUser: user }} = useStore();
    const navigate = useNavigate();

    function handleDelete() {
        postStore.deletePost(post.id)
            .then(() => { navigate(`/posts`); });
    }

    return (
        <>
            <Segment  >
                <Item.Group>
                    <Item>
                        <Button
                            as={Link}
                            to={`/posts`}
                            content='Back' 
                            icon='arrow left'
                            labelPosition='left'
                        />
                        <Button
                            color='yellow'
                            as={Link} to={`/manage/${post.id}`}
                            floated='right'
                            style={user?.id !== post.user?.id ? {display:'none'} : {}}
                            content='Manage post'
                        />
                        <Button
                            color='red'
                            onClick={handleDelete}
                            floated='right'
                            style={user?.id !== post.user?.id ? {display:'none'} : {}}
                            content='Delete post'
                        />
                    </Item>
                    <Item>
                        <Item.Content>
                            {!!post.image && <Image fluid
                                src={`data:image/${post.image.format};base64,${post.image.base64Data}`} />}
                        </Item.Content>
                    </Item>
                    <Item>
                        <Item.Content as={Link} to={`/users/${post.user?.id}`}>
                            <p>
                                by <strong>{post.user?.displayName}</strong>
                            </p>
                        </Item.Content>
                    </Item>
                    <Item>
                        <LikeButton
                            likesInfo={post.likesInfo}
                            size={24}
                            postId={post.id}
                        />
                    </Item>
                </Item.Group>
            </Segment>
        </>
    )
})