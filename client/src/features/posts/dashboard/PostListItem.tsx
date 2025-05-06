import { Link } from 'react-router-dom';
import { Button, Icon, Image, Item, ItemImage, Segment } from 'semantic-ui-react';
import { Post } from '../../../app/models/post';
import { format } from 'date-fns';

interface Props {
    post: Post
}

export default function PostListItem({ post }: Props) {
    return (
        <Segment style={{ width: '22.5em', marginRight: '1.5em', padding: '0', borderRadius: '1.5em', display: 'inline-block' }}>
            <Item.Group as={Link} to={`/posts/${post.id}`}>
                <Item style={{marginBottom: '0.3em'}}>
                    <Item.Content>
                        <Item.Header>
                            {!!post.image && <Image fluid style={{ borderTopLeftRadius: '1.5em', borderTopRightRadius: '1.5em' }}
                                src={`data:image/${post.image.format};base64,${post.image.base64Data}`} />}
                        </Item.Header>
                        <Item.Description className='padding-left'>
                            by {post.user.displayName}
                        </Item.Description>
                    </Item.Content>
                </Item>
                <Item style={{marginTop: '0', marginBottom: '0.5em'}}>
                    <Item.Content>
                        <span className='padding-left'>{format(post.createdOn!, 'dd MMM yyyy H:mm')}</span>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
    );
}