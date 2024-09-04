interface InputProps {
    id: string;
    type: 'text' | 'password' | 'email';
    label: string
    placeholder: string;
    description?: string;
    width?: string;
}

export default function Input(props: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={props.id} className="font-medium">{props.label}</label>
            <input 
                id={props.id} 
                name={props.id} 
                type={props.type} 
                placeholder={props.placeholder}
                style={{boxShadow: '1px 1px 10px 0 #F4F4F4', width: props.width}}
                className="px-4 py-2 border border-zinc-200 rounded-xl outline-none"
            />
            {props.description && <p dangerouslySetInnerHTML={{__html: props.description}} className="text-sm text-gray-400" />}
        </div>
    )
}