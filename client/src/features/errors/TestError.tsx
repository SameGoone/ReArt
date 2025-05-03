import React, { useState } from 'react';
import { Button, Header, Segment } from "semantic-ui-react";
import axios from 'axios';
import ValidationError from './ValidationError';
import agent from '../../app/api/agent';

export default function TestErrors() {
    const [errors, setErrors] = useState(null);

    function handleNotFound() {
        agent.TestError.notFound();
    }

    function handleBadRequest() {
        agent.TestError.badRequest();
    }

    function handleServerError() {
        agent.TestError.serverError();
    }

    function handleUnauthorised() {
        agent.TestError.unauthorised();
    }

    function handleForbidden() {
        agent.TestError.forbidden();
    }

    function handleBadGuid() {
        agent.TestError.notAGuid();
    }

    function handleValidationError() {
        axios.post('/posts', {}).catch(err => setErrors(err));
    }

    return (
        <>
            <Header as='h1' content='Test Error component' />
            <Segment>
                <Button.Group widths='7'>
                    <Button onClick={handleNotFound} content='Not Found' basic primary />
                    <Button onClick={handleBadRequest} content='Bad Request' basic primary />
                    <Button onClick={handleValidationError} content='Validation Error' basic primary />
                    <Button onClick={handleServerError} content='Server Error' basic primary />
                    <Button onClick={handleUnauthorised} content='Unauthorised' basic primary />
                    <Button onClick={handleForbidden} content='Forbidden' basic primary />
                    <Button onClick={handleBadGuid} content='Bad Guid' basic primary />
                </Button.Group>
            </Segment>
            {errors && <ValidationError errors={errors} />}
        </>
    )
}