import { observer } from 'mobx-react-lite';
import { Segment, Grid, Icon, Item, Button } from 'semantic-ui-react'
import { format } from 'date-fns';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../app/stores/store';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { UserDetails } from '../../app/models/user';
import ImageInput from '../../app/common/form/ImageInput';

export default observer(function UserDetails() {
    const { userStore } = useStore();
    const { selectedUser, authorizedUser, loadUser, userLoadingInitial: loadingInitial, updateImage, loading } = userStore;
    const { id } = useParams();
    const navigate = useNavigate();
    const [isReadingFile, setIsReadingFile] = useState(false);

    useEffect(() => {
        if (id)
            loadUser(id);
    }, [id, loadUser]);

    function handleFormSubmit(values: UserDetails) {
        if (values.image && selectedUser) {
            updateImage(selectedUser.id, values.image);
        }
    }

    if (loadingInitial || !selectedUser)
        return <LoadingComponent />;

    const isEditable = authorizedUser?.id === selectedUser.id;

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
            <Formik
                initialValues={selectedUser}
                onSubmit={handleFormSubmit}
                enableReinitialize
            >
                {({ handleSubmit, isSubmitting, setFieldValue, dirty, values }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <Segment>
                            <Item.Group>
                                <Item>
                                    <Item.Content>
                                        <strong>{selectedUser.displayName}</strong>
                                    </Item.Content>
                                </Item>
                                <Item>
                                    <Item.Content>
                                        <ImageInput
                                            name='image'
                                            label={isEditable ? 'Update Profile Picture' : 'Profile Picture'}
                                            onChange={(imageData) => setFieldValue('image', imageData)}
                                            setIsReading={setIsReadingFile}
                                            initialImageUrl={values.image ? `data:image/${values.image.format};base64,${values.image.base64Data}` : undefined}
                                            readOnly={!isEditable}
                                        />
                                    </Item.Content>
                                </Item>
                                {isEditable && (
                                    <Item>
                                        <Button
                                            disabled={isSubmitting || isReadingFile || !dirty}
                                            loading={loading}
                                            positive
                                            type='submit'
                                            content='Update Image'
                                            floated='right'
                                        />
                                    </Item>
                                )}
                            </Item.Group>
                        </Segment>
                        <Segment attached>
                            <Grid>
                                <Grid.Column width={1}>
                                    <Icon name='mail' size='large' color='teal' />
                                </Grid.Column>
                                <Grid.Column width={15}>
                                    <p>{selectedUser.email}</p>
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
                                        Joined on {selectedUser.createdAt && format(selectedUser.createdAt, 'dd MMM yyyy h:mm aa')}
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
                                        {selectedUser.bio}
                                    </span>
                                </Grid.Column>
                            </Grid>
                        </Segment>
                    </Form>
                )}
            </Formik>
        </Segment.Group>
    )
})