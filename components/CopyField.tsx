import { useCallback, useRef, useState } from 'react';
import { Button, Form, InputGroup, Overlay, Tooltip } from 'react-bootstrap';
import copy from 'copy-text-to-clipboard';

const COPIED_TIMEOUT = 500;

export interface CopyFieldProps {
    value: string,
}
export default function(props: CopyFieldProps) {
    const [show, setShow] = useState(false);
    const onClick = useCallback(() => {
        copy(props.value);
        setShow(true);
        setTimeout(() => setShow(false), COPIED_TIMEOUT);
    }, [props.value]);
    const button = useRef(null);
    return (
        <InputGroup className="my-2">
            <Form.Control type="text" value={props.value} readOnly />
            <InputGroup.Append>
                <Button ref={button} variant="secondary" onClick={onClick}>Copy</Button>
                <Overlay target={button.current} show={show} placement="top">
                    {
                        (props) => (
                            <Tooltip id="copied" {...props}>
                                Copied!
                            </Tooltip>
                        )
                    }
                </Overlay>
            </InputGroup.Append>
        </InputGroup>
    );
}
