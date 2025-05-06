import { ChangeEvent, useEffect, useState } from 'react';
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
import MyFileInput from '../../../app/common/form/MyFileInput';


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
        user: {
            id: '',
            displayName: ''
        },
        image: null
    });
    const [isReadingFile, setIsReadingFile] = useState(false);

    const validationSchema = Yup.object({
        body: Yup.string().required('The post body is required'),
    });

    useEffect(() => {
        if (id)
            loadPost(id).then(post => setPost(post!))
    }, [id, loadPost]);

    function handleFormSubmit(post: Post) {
        // here need set post.image
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

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setIsReadingFile(true); // Start loading state

            const reader = new FileReader();

            // This event fires when the file is successfully read
            reader.onload = (loadEvent) => {
                const result = loadEvent.target?.result;
                if (typeof result === 'string') {
                    // result is the Data URL: "data:image/jpeg;base64,..."
                    try {
                        // Simple split to get the parts
                        // 1. Find the start of base64 data
                        const base64Marker = ';base64,';
                        const base64StartIndex = result.indexOf(base64Marker);
                        if (base64StartIndex === -1) throw new Error("Invalid Data URL: base64 marker not found");

                        // 2. Extract base64 data
                        const base64Data = result.substring(base64StartIndex + base64Marker.length);

                        // 3. Extract MIME type (e.g., "image/png")
                        const mimeType = result.substring(result.indexOf(':') + 1, base64StartIndex);
                        // Often you just want the format like 'png' or 'jpeg'
                        const format = mimeType.split('/')[1]; // Extracts 'png' from 'image/png'

                        // Update the post state with the image data
                        setPost(prevPost => ({
                            ...prevPost,
                            image: {
                                format: format, // or mimeType if you prefer 'image/png'
                                base64Data: base64Data
                            }
                        }));
                        console.log("File processed:", { format, size: base64Data.length });

                    } catch (error) {
                        console.error("Error parsing Data URL:", error);
                        // Optionally clear the image state or show an error message
                        setPost(prevPost => ({ ...prevPost, image: null }));
                    }

                } else {
                    console.error("FileReader did not return a string result.");
                    setPost(prevPost => ({ ...prevPost, image: null }));
                }
                setIsReadingFile(false); // End loading state
            };

            // This event fires if there's an error reading the file
            reader.onerror = (errorEvent) => {
                console.error("Error reading file:", reader.error);
                setIsReadingFile(false); // End loading state
                setPost(prevPost => ({ ...prevPost, image: null })); // Clear image on error
            };

            // Start reading the file as a Data URL (Base64 encoded string with MIME type)
            reader.readAsDataURL(file);

        } else {
            // No file selected, or selection cancelled - clear image state
            setPost(prevPost => ({ ...prevPost, image: null }));
        }
        // Clear the input value so selecting the same file again triggers onChange
        event.target.value = '';
    };

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
                        {post.image && (
                            <div>
                                <p>Image Preview:</p>
                                <img
                                    src={`data:image/${post.image.format};base64,${post.image.base64Data}`}
                                    alt="Preview"
                                    style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', marginTop: '10px' }}
                                />
                            </div>
                        )}
                        <MyFileInput name='formImage' label="Choose post's image" onChange={handleFileChange}></MyFileInput>
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