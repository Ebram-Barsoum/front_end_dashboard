export default function FormError({ message }: { message: string | undefined }): JSX.Element {
    return (
        <p role="alert" className="text-primary text-[10px] text-end">{message}</p>
    )
}
