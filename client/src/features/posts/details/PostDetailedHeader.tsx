import { observer } from 'mobx-react-lite';
import { Button, Header, Image, Item, Segment } from 'semantic-ui-react'
import { Post } from "../../../app/models/post";
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../../app/stores/store';

interface Props {
    post: Post
}

export default observer(function PostDetailedHeader({ post }: Props) {
    const { postStore: { deletePost }, userStore: { user, logout }} = useStore();
    const navigate = useNavigate();

    function handleDelete() {
        deletePost(post.id)
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
                            color='blue'
                            floated='left'
                            content='Back'
                        />
                        <Button
                            color='yellow'
                            as={Link} to={`/manage/${post.id}`}
                            floated='right'
                            style={user?.id !== post.user.id ? {display:'none'} : {}}
                            content='Manage post'
                        />
                        <Button
                            color='red'
                            onClick={handleDelete}
                            floated='right'
                            style={user?.id !== post.user.id ? {display:'none'} : {}}
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
                        <Item.Content>
                            <p>
                                by <strong>{post.user.displayName}</strong>
                            </p>
                        </Item.Content>
                        <Button as={Link} to={`/like/${post.id}`} color='teal'>
                            Like
                        </Button>
                    </Item>
                    <Item>
                    </Item>
                </Item.Group>
            </Segment>
        </>
    )
})