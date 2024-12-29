
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { delete_app_user } from "../services/apiAppUsers";
import { ban_app_user, ban_super_user, unban_app_user, unban_super_user } from "../services/apiBanSystem";
import useQueryParams from "../hooks/useQueryParams";
import { UserCardValues } from "../lib/interfaces";
import { handleMutationError } from "../lib/healpers";

import UpdateSuperUserProfileForm from "../features/Dashboard-users/UpdateSuperUserProfileForm";

import EditIcon from "../icons/EditIcon";
import InactiveIcon from "../icons/InactiveIcon";
import TrashIcon from "../icons/TrashIcon";

import DataTable from "./DataTable";
import TableRow from "./TableRow";
import Column from "./Column";
import Row from "./Row";

import Modal from "./Modal";
import Profile from "./Profile";
import ProfileActions from "./ProfileActions";
import BanForm from "../features/Ban-system/BanForm";
import DeleteAlert from "./DeleteAlert";
import { useLocation } from "react-router-dom";

const modalInitialState = {
    showModal: false,
    showEditForm: false,
    showBanForm: false,
    showDeleteAlert: false
}

export default function UserCard({
    profileImage,
    name,
    firstName,
    lastName,
    email,
    phone,
    type,
    userType,
    userSubtype,
    createdAt,
    city,
    id,
    lastSeenDate,
    isBanned,
}: UserCardValues): JSX.Element {
    const [modalState, setModalState] = useState(() => modalInitialState);

    const ModalContent = modalState.showEditForm ? UpdateSuperUserProfileForm : Profile;
    const banFn = type !== undefined ? ban_super_user : ban_app_user;
    const unbanFn = type !== undefined ? unban_super_user : unban_app_user;

    const createdAtDate = new Date(createdAt).toLocaleDateString();
    const lastSeen = new Date(lastSeenDate).toLocaleDateString();

    const { isPending: isPendingDeleting, mutate: deleteUser } = useMutation({ mutationFn: (id: string) => delete_app_user(id) });
    const { isPending: isPendingUnban, mutate: unbanUser } = useMutation({ mutationFn: (id: string) => unbanFn(id) });

    const { pathname } = useLocation();
    const params = useQueryParams();
    const queryClient = useQueryClient();

    const handleDeleteUser = () => {
        deleteUser(id as string, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['app-users', params] });
            },
            onError: (error) => {
                const fallback = "Failed to delete user";
                handleMutationError(error, fallback);
            }
        });
    }

    const handleOpenModal = () => {
        setModalState({ showModal: true, showEditForm: false, showBanForm: false, showDeleteAlert: false });
    }

    const handleCloseModdal = () => {
        setModalState(modalInitialState);
    };

    const handleDirectEdit = () => {
        setModalState({ showModal: true, showEditForm: true, showBanForm: false, showDeleteAlert: false })
    }

    const handleBanUser = () => {
        setModalState({ showModal: true, showBanForm: true, showEditForm: false, showDeleteAlert: false });
    }

    const handleShowDeleteAlert = () => {
        setModalState({ showModal: true, showDeleteAlert: true, showEditForm: false, showBanForm: false });
    }

    const handleUnbanUser = () => {
        unbanUser(id, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    queryKey: [pathname.slice(1), params]
                });
            },
            onError: (error) => {
                const fallback = "Failed to unban user";
                handleMutationError(error, fallback);
            }
        })
    }

    const profileActions = [
        {
            icon: <EditIcon />,
            onClick: handleDirectEdit,
        },
        {
            icon: <InactiveIcon />,
            onClick: isBanned ? handleUnbanUser : handleBanUser,
        }
    ]

    if (userSubtype) profileActions.splice(1, 0,
        {
            icon: <TrashIcon />,
            onClick: handleShowDeleteAlert,
        },);


    return (
        <Column
            as={'li'}
            className={`bg-grey-1 rounded-xl ${isBanned && 'opacity-40'}`}
        >
            <Row className="p-4 justify-between gap-2">
                <Row className="justify-between gap-3">
                    <img
                        src={profileImage || "/default.png"}
                        alt="user profile picture"
                        className="w-14 h-14 rounded-full object-cover cursor-pointer"
                        onClick={() => handleOpenModal()}
                    />

                    <Column className="text-xs">
                        <p className="text-primary capitalize">
                            {name || firstName + " " + lastName}
                        </p>
                        <p className="capitalize">{type || (userType + " " + userSubtype)?.toLocaleLowerCase()}</p>
                        <p className="text-grey-3 text-xs">last seen: {lastSeen}</p>
                    </Column>
                </Row>

                <Column className="justify-self-end gap-2 ">
                    <ProfileActions actions={profileActions} loading={isPendingDeleting || isPendingUnban} />
                </Column>
            </Row>

            <DataTable className="px-4" label="Super user details">
                <TableRow
                    label="email"
                    value={email}
                    labelStyle="pt-2 pb-1"
                    valueStyle="underline pt-2 pb-1 text-secondary"
                    className="grid-cols-[5rem_1fr]"
                />
                <TableRow
                    label="phone"
                    value={phone}
                    labelStyle="py-1"
                    valueStyle="py-1  text-secondary"
                    className="grid-cols-[5rem_1fr]"
                />
                <TableRow
                    label="city"
                    value={city}
                    labelStyle="py-1"
                    valueStyle="py-1  text-secondary"
                    className="grid-cols-[5rem_1fr]"
                />
                <TableRow
                    label="date joined"
                    value={createdAtDate}
                    labelStyle="pt-1 pb-2"
                    valueStyle="pt-1 pb-2  text-secondary"
                    className="grid-cols-[5rem_1fr]"
                />
            </DataTable>

            {modalState.showModal ? (
                <Modal outsideClickHandler={handleCloseModdal}>
                    {!modalState.showBanForm && !modalState.showDeleteAlert && <ModalContent
                        id={id}
                        name={name || firstName + " " + lastName}
                        email={email}
                        phone={phone}
                        city={city}
                        type={type || (userType + " " + userSubtype)?.toLocaleLowerCase()}
                        profileImage={profileImage}
                        createdAt={createdAt}
                        self={false}
                    >
                        <ProfileActions actions={profileActions} loading={isPendingDeleting || isPendingUnban} />
                    </ModalContent>}

                    {modalState.showBanForm && <BanForm userId={id} banFn={banFn} onSuccess={handleCloseModdal} />}
                    {modalState.showDeleteAlert && <DeleteAlert disabled={isPendingDeleting} onConfirm={handleDeleteUser} onCancel={handleCloseModdal} />}
                </Modal>
            ) : null}
        </Column>
    );
}
