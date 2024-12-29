import { NavLink } from "react-router-dom";

import { Link } from "../lib/constants";
import { useAuth } from "../contexts/AuthContext";

import DashboardUsersIcon from "../icons/DashboardUsersIcon";
import VerifyOwnersIcon from "../icons/VerifyOwnersIcon";
import TruckIcon from "../icons/TruckIcon";
import PackageIcon from "../icons/PackageIcon";
import CompletedOrdersIcon from "../icons/CompletedOrdersIcon";
import IncompletedOrdersIcon from "../icons/IncompletedOrdersIcon";
import AppUsersIcon from "../icons/AppUsersIcon";
import OffersIcon from "../icons/OffersIcon";
import TicketsIcon from "../icons/TicketsIcon";
import ReportsIcon from "../icons/ReportsIcon";
import SettingIcon from "../icons/SettingIcon";


const adminViews: Link[] = [
    {
        text: "Dashboard Users",
        href: "/dashboard-users",
        icon: <DashboardUsersIcon />,
    },
    {
        text: "App Users",
        href: "/app-users",
        icon: <AppUsersIcon />,
    },
    {
        text: "Verify Owners",
        href: "/verify-owners",
        icon: <VerifyOwnersIcon />,
    },
    {
        text: "Add Truck",
        href: "/add-truck",
        icon: <TruckIcon />,
    },
    {
        text: "Add Package",
        href: "/add-package",
        icon: <PackageIcon />,
    },
    {
        text: "Completed Orders",
        href: "/completed-orders",
        icon: <CompletedOrdersIcon />,
    },
    {
        text: "Incompleted Orders",
        href: "/incompleted-orders",
        icon: <IncompletedOrdersIcon />,
    },
    {
        text: "Offers",
        href: "/offers",
        icon: <OffersIcon />,
    },
    {
        text: "Tickets",
        href: "/tickets",
        icon: <TicketsIcon />,
    },
    {
        text: "Reports",
        href: "/reports",
        icon: <ReportsIcon />,
    },
    {
        text: "App Setting",
        href: "/app-setting",
        icon: <SettingIcon />,
    },
];

const ManagerViews: Link[] = [
    {
        text: "Dashboard Users",
        href: "/dashboard-users",
        icon: <DashboardUsersIcon />,
    },
    {
        text: "App Users",
        href: "/app-users",
        icon: <AppUsersIcon />,
    },
    {
        text: "Verify Owners",
        href: "/verify-owners",
        icon: <VerifyOwnersIcon />,
    },
    {
        text: "Add Truck",
        href: "/add-truck",
        icon: <TruckIcon />,
    },
    {
        text: "Add Package",
        href: "/add-package",
        icon: <PackageIcon />,
    },
    {
        text: "Completed Orders",
        href: "/completed-orders",
        icon: <CompletedOrdersIcon />,
    },
    {
        text: "Incompleted Orders",
        href: "/incompleted-orders",
        icon: <IncompletedOrdersIcon />,
    },
    {
        text: "Offers",
        href: "/offers",
        icon: <OffersIcon />,
    },
    {
        text: "Tickets",
        href: "/tickets",
        icon: <TicketsIcon />,
    },
    {
        text: "Reports",
        href: "/reports",
        icon: <ReportsIcon />,
    }
];

const customerSupprtViews: Link[] = [
    {
        text: "App Users",
        href: "/app-users",
        icon: <AppUsersIcon />,
    },
    {
        text: "Add Truck",
        href: "/add-truck",
        icon: <TruckIcon />,
    },
    {
        text: "Add Package",
        href: "/add-package",
        icon: <PackageIcon />,
    },
    {
        text: "Completed Orders",
        href: "/completed-orders",
        icon: <CompletedOrdersIcon />,
    },
    {
        text: "Incompleted Orders",
        href: "/incompleted-orders",
        icon: <IncompletedOrdersIcon />,
    },
    {
        text: "Tickets",
        href: "/tickets",
        icon: <TicketsIcon />,
    },
];

export default function Navigation(): JSX.Element {
    const { auth } = useAuth();
    const role = auth?.superUser.type;

    const links: Link[] =
        role === "Admin"
            ? adminViews
            : role === "Manager"
                ? ManagerViews
                : customerSupprtViews;

    return (
        <ul className="flex flex-1 flex-col gap-2 justify-start pt-16 lg:pt-0">
            {links.map((link) => (
                <li key={link.href}>
                    <NavLink
                        className=" w-fit flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-grey-3 lg:justify-start"
                        to={link.href}
                    >
                        {link.icon}
                        <span className="hidden lg:flex ">{link.text}</span>
                    </NavLink>
                </li>
            ))}
        </ul>
    );
}
