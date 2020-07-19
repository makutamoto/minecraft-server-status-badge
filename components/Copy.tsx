import CopyField from './CopyField';

export interface CopyProps {
    title: string,
    value: string,
}
export default function(props: CopyProps) {
    return (
        <div className="my-2">
            <h2>{props.title}</h2>
            <CopyField value={props.value} />
        </div>
    );
}
