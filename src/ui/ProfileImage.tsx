interface ProfileImageProps {
    className?: string;
    src: string;
    alt?: string;
}
export default function ProfileImage({ src, className, alt }: ProfileImageProps) {
    return (
        <img
            src={src || '/user.jpg'}
            alt={alt || 'Profile Image'}
            className={`object-cover w-[84px] h-[84px] rounded-full mx-auto mb-2 ${className}`}
            loading="lazy"
        />
    )
}
