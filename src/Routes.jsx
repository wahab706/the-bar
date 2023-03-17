import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Login,
  SignUp,
  ResetPassword,
  StoreConnect,
  Dashboard,
  Products,
  Profile,
  Customers,
  Customization,
  Discounts,
  DiscountDetail,
  DiscountCreate,
  Integrations,
  PaymentMethods,
  Scripts,
  ChangePassword,
  Settings,
  Shipping,
  Localization,
  Orders,
  ExtraOffers,
  Account,
  SignUpStatus,
  Markets,
  Vendors,
  MarketDetail,
} from "./routes/admin/index";
import NotFound from "./routes/NotFound";
import { MainLayout } from "./components";
import { useAuthState } from "./components/providers/AuthProvider";

function Routes1() {
  const { user, isLoggedIn } = useAuthState();

  return (
    <>
      {isLoggedIn ? (
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up-status" element={<SignUpStatus />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/admin/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/admin/products"
            element={
              <MainLayout>
                <Products />
              </MainLayout>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <MainLayout>
                <Orders />
              </MainLayout>
            }
          />
          <Route
            path="/admin/markets"
            element={
              <MainLayout>
                <Markets />
              </MainLayout>
            }
          />
          <Route
            path={`/admin/market/:marketId`}
            element={
              <MainLayout>
                <MarketDetail />
              </MainLayout>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <MainLayout>
                <Profile />
              </MainLayout>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <MainLayout>
                <Customers />
              </MainLayout>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <MainLayout>
                <Vendors />
              </MainLayout>
            }
          />
          {/*<Route
            path="/admin/customization"
            element={
              <MainLayout>
                <Customization />
              </MainLayout>
            }
          />
          <Route
            path="/admin/discounts"
            element={
              <MainLayout>
                <Discounts />
              </MainLayout>
            }
          />
          <Route
            path="/admin/discounts/new"
            element={
              <MainLayout>
                <DiscountCreate />
              </MainLayout>
            }
          />
          <Route
            path={`/admin/discounts/:discountId`}
            element={
              <MainLayout>
                <DiscountDetail />
              </MainLayout>
            }
          />
          <Route
            path="/admin/integrations"
            element={
              <MainLayout>
                <Integrations />
              </MainLayout>
            }
          />
          <Route
            path="/admin/scripts"
            element={
              <MainLayout>
                <Scripts />
              </MainLayout>
            }
          />
          <Route
            path="/admin/paymentMethods"
            element={
              <MainLayout>
                <PaymentMethods />
              </MainLayout>
            }
          />
          <Route
            path="/admin/offers"
            element={
              <MainLayout>
                <ExtraOffers />
              </MainLayout>
            }
          /> */}
          <Route
            path="/admin/settings"
            element={
              <MainLayout>
                <Settings />
              </MainLayout>
            }
          />
          {/* <Route
            path="/admin/shipping"
            element={
              <MainLayout>
                <Shipping />
              </MainLayout>
            }
          />
          <Route
            path="/admin/localization"
            element={
              <MainLayout>
                <Localization />
              </MainLayout>
            }
          /> */}

          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up-status" element={<SignUpStatus />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default Routes1;
