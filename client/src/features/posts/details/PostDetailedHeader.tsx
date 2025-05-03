import { observer } from 'mobx-react-lite';
import { Button, Header, Item, Segment } from 'semantic-ui-react'
import { Post } from "../../../app/models/post";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Props {
    post: Post
}

export default observer(function PostDetailedHeader({ post }: Props) {
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Segment basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={post.body}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(post.createdOn!, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                <Button color='teal'>Join Post</Button>
                <Button>Cancel attendance</Button>
                <Button as={Link} to={`/manage/${post.id}`} color='orange' floated='right'>
                    Manage Event
                </Button>
            </Segment>
        </Segment.Group>
    )
})