import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./ui/Layout";
import Loader from "./ui/Loader";
import Login from "./views/Login";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./ui/ProtectedRoute";
import LoginForm from "./features/Authentication/LoginForm";
import VerificationForm from "./features/Authentication/VerificationForm";
import ResetPasswordForm from "./features/Authentication/ResetPasswordForm";
import NotFound from "./views/NotFound";

const CompletedOrderDetails = lazy(() => import("./features/Completed-orders/CompletedOrderDetails"));
const UcompletedOfferDetails = lazy(() => import("./features/Uncompleted-offers/UncompletedOfferDetails"));
//localStorage.removeItem("auth");

const routes = [
  { href: 'dashboard-users', component: lazy(() => import('./views/DashboardUsers')) },
  { href: 'app-users', component: lazy(() => import('./views/AppUsers')) },
  { href: 'verify-owners', component: lazy(() => import('./views/VerifyOwners')) },
  { href: 'add-truck', component: lazy(() => import('./views/AddTruck')) },
  { href: 'add-package', component: lazy(() => import('./views/AddPackage')) },
  { href: 'completed-orders', component: lazy(() => import('./views/CompletedOrders')) },
  { href: 'uncompleted-offers', component: lazy(() => import('./views/UncompletedOffers')) },
  { href: 'offers', component: lazy(() => import('./views/Discounts')) },
  { href: 'tickets', component: lazy(() => import('./views/Tickets')) },
  { href: 'reports', component: lazy(() => import('./views/Reports')) },
  { href: 'app-setting', component: lazy(() => import('./views/AppSetting')) },
  { href: 'shifts', component: lazy(() => import('./views/Shifts')) },
  { href: 'coupons', component: lazy(() => import('./views/Coupons')) },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  }
});

function App(): JSX.Element {

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/auth" element={<Login />}>
                <Route path="login" element={<LoginForm />} />
                <Route path="verification" element={<VerificationForm />} />
                <Route path="reset-password" element={<ResetPasswordForm />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index={true} element={<Navigate to={'dashboard-users'} replace />} />

                {routes.map(({ href, component: Component }) => (
                  <Route key={href} path={href} element={<Suspense fallback={<Loader />}><Component /></Suspense>} />
                ))}

                <Route path="/completed-orders/:orderNumber" element={<Suspense fallback={<Loader />}><CompletedOrderDetails /></Suspense>} />
                <Route path="/uncompleted-offers/:offerId" element={<Suspense fallback={<Loader />}><UcompletedOfferDetails /></Suspense>} />

                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider >
  )
}

export default App
