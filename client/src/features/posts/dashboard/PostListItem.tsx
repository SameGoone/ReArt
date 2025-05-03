import { Link } from 'react-router-dom';
import { Button, Icon, Item, ItemImage, Segment } from 'semantic-ui-react';
import { Post } from '../../../app/models/post';
import { format } from 'date-fns';

interface Props {
    post: Post
}

export default function PostListItem({ post }: Props) {
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <ItemImage size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/posts/${post.id}`}>
                                {post.body}
                            </Item.Header>
                            <Item.Description>Hosted by Bob</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(post.createdOn!, 'dd MMM yyyy H:mm aa')}
                </span>
            </Segment>
            <Segment secondary>
                Attendees go here
            </Segment>
            <Segment clearing>
                <span>{post.body}</span>
                <Button
                    as={Link}
                    to={`/posts/${post.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
    );
}