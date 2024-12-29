import Button from "./Button";
import Column from './Column';
import DataTable from "./DataTable";
import TableRow from "./TableRow";
import ProfileHeader from "./ProfileHeader";

import Row from "./Row";
import { ReactNode, useMemo } from "react";
import ProfileImage from "./ProfileImage";


export interface ProfileProps {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    createdAt: string | Date;
    type: string;
    profileImage: string;
    onClickEdit?: () => void;
    self: boolean
    children: ReactNode
}

export default function Profile({ name, email, phone, city, createdAt, type, profileImage, onClickEdit, self, children }: Partial<ProfileProps>): JSX.Element {
    const details = useMemo(() => {
        return [
            { label: "Email", value: email },
            { label: "Phone", value: phone },
            { label: "City", value: city },
            { label: "Joined Date", value: createdAt ? new Date(createdAt).toLocaleDateString() : "N/A" },
        ];
    }, [email, phone, city, createdAt]);

    return (
        <Column className="mx-auto gap-6 py-[49px] px-[37px] w-[90%] rounded-lg bg-white sm:w-[491px]">
            <Column className="gap-2 text-center">
                <ProfileImage src={profileImage || ''} />
                <ProfileHeader name={name} type={type} />

                {!self && <Row className="justify-center gap-2 ">
                    {children}
                </Row>}
            </Column>

            <Column className="w-full flex flex-col gap-4 ">
                <DataTable className="border border-stroke rounded-xl py-3 px-4 bg-card">
                    {details.map((ele) => <TableRow
                        label={ele.label}
                        value={ele.value}
                        key={ele.label}
                        labelStyle="py-3 pr-[10px] border-r-stroke"
                        valueStyle="py-3 text-black"
                        className="border-b border-stroke last:border-b-0 grid-cols-[5rem_1fr]"
                    />)}
                </DataTable>

                {self && <Button
                    type="button"
                    onClick={onClickEdit}
                    className="bg-primary text-white text-base font-bold w-full p-4 rounded-lg"
                >
                    Edit
                </Button>}
            </Column>
        </Column>
    );
}
