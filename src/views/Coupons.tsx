import AddCouponForm from "../features/Coupon/AddCouponForm";
import CouponList from "../features/Coupon/CouponList";
import View from "../ui/View";

export default function Coupons(): JSX.Element {
    return (
        <View className="grid md:grid-cols-2 gap-6 xl:w-[85%]">
            <AddCouponForm />
            <CouponList />
        </View>
    )
}
