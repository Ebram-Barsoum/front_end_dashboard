import { useState } from "react";

import Modal from "./Modal";
import Profile from "./Profile";
import { useAuth } from "../contexts/AuthContext";
import UpdateSelfProfileForm from "../features/Self-profile/UpdateSelfProfileForm";

export default function Avatar(): JSX.Element {
    const [showProfile, setShowProfile] = useState<boolean>(false);
    const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

    const { auth } = useAuth();
    const { firstName, lastName, email, phone, city, profileImage, createdAt, type } = auth?.superUser || {};


    const handleCloseModal = () => {
        setShowProfile(false);
        setShowEditProfile(false);
    }

    return (
        <>
            <img
                src={profileImage || '/user.jpg'}
                alt={firstName + " " + lastName + "'s profile picture"}
                className="h-12 w-12 object-cover rounded-xl self-end cursor-pointer"
                onClick={() => setShowProfile(true)}
            />

            {showProfile && (
                <Modal outsideClickHandler={handleCloseModal}>
                    {showEditProfile ? (
                        <UpdateSelfProfileForm
                            name={firstName + " " + lastName}
                            email={email}
                            phone={phone}
                            city={city}
                            type={type}
                            profileImage={profileImage}
                            onSuccess={() => setShowEditProfile(false)}
                        />
                    ) : (
                        <Profile
                            name={firstName + " " + lastName}
                            email={email}
                            phone={phone}
                            city={city}
                            profileImage={profileImage}
                            createdAt={createdAt}
                            type={type}
                            onClickEdit={() => setShowEditProfile(true)}
                            self={true}
                        />
                    )}
                </Modal>
            )}
        </>
    );
}
