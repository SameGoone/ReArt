import { observer } from 'mobx-react-lite'
import { Segment, Header, Comment, Button, Loader } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';

interface Props {
    postId: string;
}

export default observer(function PostDetailedChat({postId}: Props) {
    const {commentStore} = useStore();
    useEffect(() => {
        if (postId) {
            commentStore.createHubConnection(postId);
        }
        return () => {
            commentStore.clearComments();
        }
    }, [commentStore, postId]);

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>What they think</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    {commentStore.comments.map(comment => (
                        <Comment key={comment.id}>
                            {/* <Comment.Avatar src='/assets/user.png' /> */}
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.author.id}`}>{comment.author.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{comment.createdAt}</div>
                                </Comment.Metadata>
                                <Comment.Text style={{whiteSpace: 'pre-wrap'}}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}

                    <Formik
                        onSubmit={(values, { resetForm }) =>
                            commentStore.addComment(values).then(() => resetForm())}
                        initialValues={{ body: '' }}
                        validationSchema={Yup.object({
                            body: Yup.string().required()
                        })}
                    >
                        {({ isSubmitting, isValid, handleSubmit }) => (
                            <Form className='ui form'>
                                <Field name='body'>
                                    {(props: FieldProps) => (
                                        <div style={{position: 'relative'}}>
                                            <Loader active={isSubmitting} />
                                            <textarea 
                                                placeholder='Write your comment (Enter to submit, SHIFT+Enter for new line'
                                                rows={2}
                                                {...props.field}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && e.shiftKey) {
                                                        return; // default behavior
                                                    }
                                                    else if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        isValid && handleSubmit();
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>

                </Comment.Group>
            </Segment>
        </>
    )
})