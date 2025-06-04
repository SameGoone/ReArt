import { useField } from 'formik';
import { ChangeEvent, useState, useEffect } from 'react';
import { Form, Label, Image } from 'semantic-ui-react';

interface Props {
    name: string;
    label: string;
    initialImageUrl?: string | null;
    readOnly?: boolean;
    onChange?: (fileData: { format: string, base64Data: string } | null) => void;
    onClear?: () => void;
    setIsReading?: (isReading: boolean) => void;
}

export default function ImageInput({ name, label, initialImageUrl, readOnly = false, onChange, onClear, setIsReading }: Props) {
    const [, meta] = useField(name);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);

    useEffect(() => {
        setPreviewUrl(initialImageUrl || null);
    }, [initialImageUrl]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (readOnly || !onChange || !setIsReading) return;

        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setIsReading(true);

            const reader = new FileReader();

            reader.onload = (loadEvent) => {
                const result = loadEvent.target?.result as string;
                if (result) {
                    setPreviewUrl(result);
                    try {
                        const base64Marker = ';base64,';
                        const base64StartIndex = result.indexOf(base64Marker);
                        if (base64StartIndex === -1) throw new Error("Invalid Data URL");

                        const base64Data = result.substring(base64StartIndex + base64Marker.length);
                        const mimeType = result.substring(result.indexOf(':') + 1, base64StartIndex);
                        const format = mimeType.split('/')[1];

                        onChange({ format, base64Data });
                    } catch (error) {
                        console.error("Error parsing Data URL:", error);
                        onChange(null);
                    }
                } else {
                    onChange(null);
                }
                setIsReading(false);
            };

            reader.onerror = () => {
                console.error("Error reading file");
                setIsReading(false);
                onChange(null);
            };

            reader.readAsDataURL(file);
        } else {
            onChange(null);
            setPreviewUrl(null);
        }
        event.target.value = '';
    };

    return (
        <Form.Field error={!readOnly && meta.touched && !!meta.error}>
            <label>{label}</label>
            {previewUrl ? (
                <Image
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', margin: '10px 0' }}
                />
            ) : (
                !readOnly && <p>No image selected.</p>
            )}

            {!readOnly && (
                <>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                    />
                    {onClear && previewUrl && (<button onClick={onClear}>Clear</button>)}
                    {meta.touched && meta.error ? (
                        <Label basic color="red">{meta.error}</Label>
                    ) : null}
                </>
            )}
        </Form.Field>
    );
}