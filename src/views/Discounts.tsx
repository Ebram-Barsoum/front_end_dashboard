import { lazy } from "react";

const AddDiscountForm = lazy(() => import("../features/Discount/AddDiscountForm"));
const DiscountsList = lazy(() => import("../features/Discount/DiscountsList"));

import View from "../ui/View";

export default function Discounts(): JSX.Element {
    return (
        <View className="grid gap-8 md:grid-cols-2 xl:w-[85%]">
            <AddDiscountForm />
            <DiscountsList />
        </View>
    )
}
