import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Login,
  ResetPassword,
  Dashboard,
  Products,
  Profile,
  Customers,
  ChangePassword,
  Settings,
  Orders,
  Account,
  Markets,
  Vendors,
  MarketDetail,
  Finances,
  Users,
  ProductTypes,
  VendorDetail,
} from "./routes/admin/index";
import NotFound from "./routes/NotFound";
import { SuperAdminLayout, AdminLayout, VendorLayout } from "./components";
import { useAuthState } from "./components/providers/AuthProvider";

function Routes1() {
  const { user, userRole, isLoggedIn } = useAuthState();

  return (
    <>
      {user ? (
        userRole == "super_admin" ? (
          <SuperAdminLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product-types" element={<ProductTypes />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users" element={<Users />} />
              <Route path="/markets" element={<Markets />} />
              <Route path={`/market/:marketId`} element={<MarketDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path={`/vendor/:vendorId`} element={<VendorDetail />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/settings" element={<Settings />} />

              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </SuperAdminLayout>
        ) : userRole == "admin" ? (
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product-types" element={<ProductTypes />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/markets" element={<Markets />} />
              <Route path={`/market/:marketId`} element={<MarketDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path={`/vendor/:vendorId`} element={<VendorDetail />} />
              <Route path="/settings" element={<Settings />} />

              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </AdminLayout>
        ) : userRole == "vendor" ? (
          <VendorLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />

              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </VendorLayout>
        ) : (
          ""
        )
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default Routes1;
