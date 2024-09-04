interface ButtonProps {
    value: string;
    isPending: boolean;
}

export default function Button(props: ButtonProps) {
    return (
        <button
            type="submit"
            aria-disabled={props.isPending}
            style={{boxShadow: '1px 1px 10px 0 #F4F4F4'}}
            className="px-4 py-2 bg-[#151515] text-white border border-black rounded-xl outline-none"
        >
            {props.value}
        </button>
    )
}