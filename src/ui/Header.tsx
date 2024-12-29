import Avatar from "./Avatar";

import HeaderDate from "./HeaderDate";
import NotificationTab from "./NotificationTab";
import Row from "./Row";
import Search from "./Search";

export default function Header(): JSX.Element {
    return (
        <Row as={'header'} className="p-3 border-b-[1px] border-b-black justify-between gap-4 lg:py-8 lg:px-[38px]">
            <Search placeholder="Search" className="h-[44px] w-full  sm:w-fit lg:w-[24rem]" param="" />

            <Row className=" gap-3 lg:gap-6">
                <HeaderDate />
                <NotificationTab />
                <Avatar />
            </Row>
        </Row>
    )
}
