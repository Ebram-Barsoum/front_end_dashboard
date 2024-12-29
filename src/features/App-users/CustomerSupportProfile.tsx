/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { SuperUser } from "../../lib/interfaces"
import Column from "../../ui/Column";
import FormInput from "../../ui/FormInput";
import ProfileHeader from "../../ui/ProfileHeader";
import ProfileImage from "../../ui/ProfileImage";
import { EMAIL_REGEX, PHONE_REGEX } from "../../lib/constants";

interface CustomerSupportProfileProps {
    customerSupport: SuperUser
}

export default function CustomerSupportProfile({ customerSupport }: CustomerSupportProfileProps): JSX.Element {
    const { id, firstName, lastName, email, phone, city, type, profileImage, createdAt, } = customerSupport;
    const [status, setStatus] = useState(false);
    const labelImage = <ProfileImage src={profileImage} alt={`${firstName} ${lastName}'s profile picture`} />

    const inputs = [
        {
            id: "email",
            type: "email",
            label: "email",
            disabled: status,
            defaultValue: email,
            validatation: {
                required: "Email is required",
                pattern: {
                    value: EMAIL_REGEX,
                    message: "Invalid email address"
                }
            }
        },
        {
            id: "phone",
            type: "tel",
            label: "phone",
            disabled: status,
            defaultValue: phone,
            validatation: {
                required: "Phone is required",
                pattern: {
                    value: PHONE_REGEX,
                    message: "Invalid phone number"
                }
            }
        },
        {
            id: "city",
            type: "text",
            label: "city",
            disabled: status,
            defaultValue: city,
            validatation: {
                required: "City is required",
                validate: (value: string) => value.trim() !== "" || "City is required",
            }
        }
    ]
    return (
        <form>
            <Column>
                <FormInput
                    id="profileImage"
                    type="file"
                    label={labelImage}
                    hidden={true}
                />
                <ProfileHeader name={firstName + ' ' + lastName} type={type} />
            </Column>

        </form>
    )
}
