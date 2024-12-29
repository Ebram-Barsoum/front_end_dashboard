import { ReactNode } from "react"
import Column from "./Column"

interface ViewProps {
    children: ReactNode
}

export default function View({ children }: ViewProps): JSX.Element {
    return <Column as={'section'} className=" p-4 md:px-[38px] md:py-[32px]">{children}</Column>
}