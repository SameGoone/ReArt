import { useField } from "formik";
import { ChangeEventHandler } from "react";
import { Form, Label } from "semantic-ui-react";

interface Props {
    name: string;
    onChange: ChangeEventHandler;
    label?: string;
}

export default function MyTextInput(props: Props) {
    const [field, meta] = useField(props.name);

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <input type="file" accept="image/png, image/jpeg" {...field} {...props} />
            {meta.touched && !!meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
}