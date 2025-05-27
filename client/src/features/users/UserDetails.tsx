import { observer } from 'mobx-react-lite';
import { Segment, Grid, Icon, Item, Image, Button } from 'semantic-ui-react'
import { format } from 'date-fns';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../app/stores/store';
import { useEffect } from 'react';

export default observer(function UserDetails() {
    const { userStore } = useStore();
    const { selectedUser: user, loadUser, userLoadingInitial: loadingInitial } = userStore;
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id)
            loadUser(id);
    }, [id, loadUser])

    if (loadingInitial || !user)
        return <LoadingComponent />;
    
    return (
        <Segment.Group>
            <Segment attached='top'>
                <Button 
                    onClick={() => navigate(-1)}
                    content='Back' 
                    icon='arrow left'
                    labelPosition='left'
                />
            </Segment>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Content>
                            <strong>{user.displayName}</strong>
                        </Item.Content>
                    </Item>
                    {!!user.image && <Item>
                        <Item.Content>
                            {<Image fluid
                                src={`data:image/${user.image.format};base64,${user.image.base64Data}`} />}
                        </Item.Content>
                    </Item>}
                </Item.Group>
            </Segment>
            <Segment attached>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon name='mail' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>{user.email}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <span>
                            Joined on {format(user.createdAt!, 'dd MMM yyyy H:mm aa')}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='smile' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <span>
                            {user.bio}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
})