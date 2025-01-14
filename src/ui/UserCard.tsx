import { lazy, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { delete_app_user } from "../services/apiAppUsers";
import {
    ban_app_user,
    ban_super_user,
    unban_app_user,
    unban_super_user,
} from "../services/apiBanSystem";
import useQueryParams from "../hooks/useQueryParams";
import { UserCardValues } from "../lib/interfaces";
import { handleMutationError } from "../lib/healpers";

const UpdateSuperUserProfileForm = lazy(() => import("../features/Dashboard-users/UpdateSuperUserProfileForm"));

const Profile = lazy(() => import("./Profile"));
const CustomerSupportProfile = lazy(() => import("../features/Dashboard-users/CustomerSupportProfile"));
const OwnerIndividualProfile = lazy(() => import("../features/App-users/OwnerIndividualProfile"));
const CustomerIndividualProfile = lazy(() => import("../features/App-users/CustomerIndividualProfile"));
const OwnerCompanyProfile = lazy(() => import("../features/App-users/OwnerCompanyProfile"));
const ProfileActions = lazy(() => import("./ProfileActions"));
const CustomerCompanyProfile = lazy(() => import("../features/App-users/CustomerCompanyProfile"));
const BanForm = lazy(() => import("../features/Ban-system/BanForm"));
const DeleteAlert = lazy(() => import("./DeleteAlert"));

import EditIcon from "../icons/EditIcon";
import InactiveIcon from "../icons/InactiveIcon";
import TrashIcon from "../icons/TrashIcon";

import Modal from "./Modal";
import DataTable from "./DataTable";
import TableRow from "./TableRow";
import Column from "./Column";
import Row from "./Row";
import PendingIcon from "../icons/PendingIcon";

const modalInitialState = {
    showModal: false,
    showProfile: false,
    showBanForm: false,
    showDeleteAlert: false,
};

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
    breakTimeEnd,
    breakTimeStart,
    primaryBreakDay,
    secondaryBreakDay,
    isBanned,
    approvalStatus,
    driverLicense,
    taxCard,
    commercialRegister,
}: Partial<UserCardValues>): JSX.Element {
    const [modalState, setModalState] = useState(() => modalInitialState);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const banFn = type !== undefined ? ban_super_user : ban_app_user;
    const unbanFn = type !== undefined ? unban_super_user : unban_app_user;

    const createdAtDate = new Date(createdAt as Date).toLocaleDateString();
    const lastSeen = new Date(lastSeenDate as Date).toLocaleDateString();
    const user = {
        id,
        type,
        profileImage,
        firstName,
        lastName,
        email,
        phone,
        name,
        city,
        createdAt: createdAtDate,
        lastSeenDate: lastSeen,
        isBanned,
        breakTimeEnd,
        breakTimeStart,
        primaryBreakDay,
        secondaryBreakDay,
        approvalStatus,
        userType,
        userSubtype,
        driverLicense,
        taxCard,
        commercialRegister,
    };

    const { isPending: isPendingDeleting, mutate: deleteUser } = useMutation({
        mutationFn: (id: string) => delete_app_user(id),
    });
    const { isPending: isPendingUnban, mutate: unbanUser } = useMutation({
        mutationFn: (id: string) => unbanFn(id),
    });

    const { pathname } = useLocation();
    const params = useQueryParams();
    const queryClient = useQueryClient();

    const handleDeleteUser = () => {
        deleteUser(id as string, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["app-users", params] });
            },
            onError: (error) => {
                const fallback = "Failed to delete user";
                handleMutationError(error, fallback);
            },
        });
    };

    const handleOpenModal = () => {
        setModalState({
            showModal: true,
            showProfile: true,
            showBanForm: false,
            showDeleteAlert: false,
        });
    };

    const handleCloseModdal = () => {
        setModalState(modalInitialState);
        setIsEditing(false);
    };

    const handleDirectEdit = () => {
        setModalState({
            showModal: true,
            showProfile: true,
            showBanForm: false,
            showDeleteAlert: false,
        });
        setIsEditing((state) => !state);
    };

    const handleBanUser = () => {
        setModalState({
            showModal: true,
            showBanForm: true,
            showProfile: false,
            showDeleteAlert: false,
        });
        setIsEditing(false);
    };

    const handleShowDeleteAlert = () => {
        setModalState({
            showModal: true,
            showDeleteAlert: true,
            showProfile: false,
            showBanForm: false,
        });
    };

    const handleUnbanUser = () => {
        unbanUser(id as string, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    queryKey: [pathname.slice(1), params],
                });
            },
            onError: (error) => {
                const fallback = "Failed to unban user";
                handleMutationError(error, fallback);
            },
        });
    };

    const profileActions = [
        approvalStatus === "Approved" || type
            ? {
                icon: <EditIcon />,
                onClick: handleDirectEdit,
            }
            : {
                icon: <PendingIcon />,
            },
        {
            icon: <InactiveIcon />,
            onClick: isBanned ? handleUnbanUser : handleBanUser,
        },
    ];

    if (userSubtype)
        profileActions.splice(1, 0, {
            icon: <TrashIcon />,
            onClick: handleShowDeleteAlert,
        });

    return (
        <Column
            as={"li"}
            className={`bg-grey-1 rounded-xl ${isBanned && "opacity-40"}`}
        >
            <Row className="p-4 justify-between gap-2">
                <Row className="justify-between gap-3">
                    <img
                        src={(profileImage as string) || "/default.png"}
                        alt="user profile picture"
                        className="w-14 h-14 rounded-full object-cover cursor-pointer"
                        loading="lazy"
                        onClick={() => handleOpenModal()}
                    />

                    <Column className="text-xs">
                        <p className="text-primary capitalize">
                            {name || firstName + " " + lastName}
                        </p>
                        <p className="capitalize">
                            {type || (userType + " " + userSubtype)?.toLocaleLowerCase()}
                        </p>
                        {!userType && (
                            <p className="text-grey-3 text-xs">last seen: {lastSeen}</p>
                        )}
                    </Column>
                </Row>

                <Column className="justify-self-end gap-2 ">
                    <ProfileActions
                        actions={profileActions}
                        loading={isPendingDeleting || isPendingUnban}
                    />
                </Column>
            </Row>

            <DataTable className="px-4" label="user details">
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
                {!userType && (
                    <TableRow
                        label="city"
                        value={city}
                        labelStyle="py-1"
                        valueStyle="py-1  text-secondary"
                        className="grid-cols-[5rem_1fr]"
                    />
                )}
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
                    {type === "Customer Support" && modalState.showProfile && (
                        <CustomerSupportProfile
                            customerSupport={user}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                        >
                            <ProfileActions
                                actions={profileActions}
                                loading={isPendingDeleting || isPendingUnban}
                            />
                        </CustomerSupportProfile>
                    )}

                    {(type === "Manager" || type === "Admin") &&
                        !modalState.showBanForm &&
                        !modalState.showDeleteAlert && (
                            <>
                                {isEditing ? (
                                    <UpdateSuperUserProfileForm
                                        id={id as string}
                                        name={firstName + " " + lastName}
                                        email={email as string}
                                        phone={phone as string}
                                        city={city as string}
                                        type={type}
                                        profileImage={profileImage as string}
                                        onSuccess={() => setIsEditing(false)}
                                    />
                                ) : (
                                    <Profile
                                        name={firstName + " " + lastName}
                                        email={email}
                                        phone={phone}
                                        city={city}
                                        profileImage={profileImage as string}
                                        createdAt={createdAt}
                                        type={type}
                                        onClickEdit={() => setIsEditing(true)}
                                    >
                                        <ProfileActions actions={profileActions} />
                                    </Profile>
                                )}
                            </>
                        )}

                    {userType === "OWNER" &&
                        userSubtype === "INDIVIDUAL" &&
                        !modalState.showBanForm &&
                        !modalState.showDeleteAlert && (
                            <OwnerIndividualProfile
                                user={user}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                            >
                                <ProfileActions
                                    actions={profileActions}
                                    loading={isPendingDeleting || isPendingUnban}
                                />
                            </OwnerIndividualProfile>
                        )}

                    {userType === "CUSTOMER" &&
                        userSubtype === "INDIVIDUAL" &&
                        !modalState.showBanForm &&
                        !modalState.showDeleteAlert && (
                            <CustomerIndividualProfile
                                user={user}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                            >
                                <ProfileActions
                                    actions={profileActions}
                                    loading={isPendingDeleting || isPendingUnban}
                                />
                            </CustomerIndividualProfile>
                        )}

                    {userType === "OWNER" &&
                        userSubtype === "CORPORATION" &&
                        !modalState.showBanForm &&
                        !modalState.showDeleteAlert && (
                            <OwnerCompanyProfile
                                user={user}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                            >
                                <ProfileActions
                                    actions={profileActions}
                                    loading={isPendingDeleting || isPendingUnban}
                                />
                            </OwnerCompanyProfile>
                        )}

                    {userType === "CUSTOMER" &&
                        userSubtype === "CORPORATION" &&
                        !modalState.showBanForm &&
                        !modalState.showDeleteAlert && (
                            <CustomerCompanyProfile
                                user={user}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                            >
                                <ProfileActions
                                    actions={profileActions}
                                    loading={isPendingDeleting || isPendingUnban}
                                />
                            </CustomerCompanyProfile>
                        )}

                    {modalState.showBanForm && (
                        <BanForm
                            userId={id as string}
                            banFn={banFn}
                            onSuccess={handleCloseModdal}
                        />
                    )}

                    {modalState.showDeleteAlert && (
                        <DeleteAlert
                            disabled={isPendingDeleting}
                            onConfirm={handleDeleteUser}
                            onCancel={handleCloseModdal}
                        />
                    )}
                </Modal>
            ) : null}
        </Column>
    );
}
