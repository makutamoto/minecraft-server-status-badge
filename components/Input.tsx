import { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';

export interface InputProps {
    title: string,
    type: string,
    placeholder: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
}
export default function(props: InputProps) {
    return (
        <div className="my-2">
            <Form.Label>{props.title}</Form.Label>
            <Form.Control type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
        </div>
    );
}
