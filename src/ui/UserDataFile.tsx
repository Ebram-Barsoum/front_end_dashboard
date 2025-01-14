interface UserDataFileProps {
    src: string;
    alt?: string;
}

export default function UserDataFile({
    src,
    alt,
}: UserDataFileProps): JSX.Element {
    if (src.endsWith(".pdf")) {
        return (
            <object
                data={src}
                datatype="application/pdf"
                width="100%"
                height="130px"
                style={{
                    borderRadius: "8px",
                    border: "1px dashed #EDEDED ",
                    overflow: "hidden",
                }}
            />
        );
    }
    return (
        <img
            src={src}
            alt={alt}
            className="object-fill h-[130px] w-full rounded-lg border border-stroke border-dashed"
        />
    );
}
