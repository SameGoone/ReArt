import { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { Post } from '../../../app/models/post';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextArea from '../../../app/common/form/MyTextArea';


export default observer(function PostForm() {
    const { postStore } = useStore();
    const { createPost, updatePost,
        loading, loadPost, loadingInitial } = postStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState<Post>({
        id: '',
        body: '',
        createdOn: new Date(),
        user: ''
    });

    const validationSchema = Yup.object({
        body: Yup.string().required('The post body is required'),
    });

    useEffect(() => {
        if (id)
            loadPost(id).then(post => setPost(post!))
    }, [id, loadPost]);

    function handleFormSubmit(post: Post) {
        if (!post.id) {
            post.id = uuid();
            createPost(post)
                .then(() => { navigate(`/posts/${post.id}`); });
        }
        else {
            updatePost(post)
                .then(() => { navigate(`/posts/${post.id}`); });
        }
    }

    if (loadingInitial)
        return <LoadingComponent content='Loading post...' />

    return (
        <Segment clearing>
            <Header content='Post Details' sub color='teal' />

            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={post}
                onSubmit={values => handleFormSubmit(values)} >
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextArea rows={3} placeholder='Body' name='body' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading} floated='right'
                            positive type='submit' content='Submit' />
                        <Button as={Link} to={'/posts'} floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
})