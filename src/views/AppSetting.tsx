import AddCouponForm from "../features/Coupon/AddCouponForm";
import CouponList from "../features/Coupon/CouponList";
import SettingForm from "../features/Settings/SettingForm";
import UpdatePaymentMethods from "../features/Settings/UpdatePaymentMethods";


import Column from "../ui/Column";
import View from "../ui/View";

export default function AppSetting(): JSX.Element {
    return (
        <View className="grid gap-8 md:grid-cols-2 xl:w-[85%]">
            <Column className="gap-4">
                <AddCouponForm />
                <CouponList />
            </Column>

            <Column className="gap-4">
                <SettingForm />
                <UpdatePaymentMethods />
            </Column>
        </View>
    )
}
