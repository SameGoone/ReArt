import { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { PostCreateDto } from '../../../app/models/post';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextArea from '../../../app/common/form/MyTextArea';
import ImageInput from '../../../app/common/form/ImageInput';

export default observer(function PostForm() {
    const { postStore } = useStore();
    const { createPost, updatePost,
        loading, loadPost, loadingInitial } = postStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState<PostCreateDto>({
        body: '',
        image: null
    });
    const [isReadingFile, setIsReadingFile] = useState(false);

    const validationSchema = Yup.object({
        body: Yup.string().required('The post body is required'),
        image: Yup.object().required('The post image is required'),
    });

    useEffect(() => {
        if (id)
            loadPost(id).then(post => setPost(post!))
    }, [id, loadPost]);

    function handleFormSubmit(post: PostCreateDto) {
        if (!post.id) {
            createPost(post)
                .then((postId) => { navigate(`/posts/${postId}`); });
        }
        else {
            updatePost(post)
                .then((postId) => { navigate(`/posts/${postId}`); });
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
                {({ handleSubmit, isValid, isSubmitting, dirty, setFieldValue, values }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <ImageInput
                            name='image'
                            label="Choose post's image"
                            onChange={(imageData) => setFieldValue('image', imageData)}
                            onClear={() => setFieldValue('image', null)}
                            setIsReading={setIsReadingFile}
                            initialImageUrl={values.image ? `data:image/${values.image.format};base64,${values.image.base64Data}` : undefined}
                            readOnly={false}
                        />
                        <MyTextArea rows={3} placeholder='Body' name='body' />
                        <Button
                            disabled={isSubmitting || isReadingFile || !dirty || !isValid}
                            loading={loading} floated='right'
                            positive type='submit' content='Submit' />
                        <Button as={Link} to={'/posts'} floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
})