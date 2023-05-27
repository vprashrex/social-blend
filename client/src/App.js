import React from "react";
import { Route, Routes, useMatch, useResolvedPath } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import DesktopNav from "./components/Navbar/DesktopNav";
import MobileNav from "./components/Navbar/MobileNav";
import Home from "./pages/Home";
import Creator from "./pages/Creator";
import CreatorSignUp from "./pages/CreatorSignUp";
import SignUpContext from "./context/SignUpContext";
import CreatePage from "./pages/CreatePage";
import Brand from "./pages/Brand";
import BrandSignUp from "./components/Brand/BrandSignUp";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoutes/PrivateRoute";
import Account from "./pages/Account";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./components/ForgetPassword/ResetPassword";
import CompleteProfile from "./components/Brand/CompleteProfile";
import UserPage from "./pages/UserPage";
import EditBrand from "./pages/EditBrand";
import EditInfluencer from "./pages/EditInfluencer";
import SearchPage from "./pages/SearchPage";
import InfluencersList from "./pages/InfluencersList";
import ListPage from "./pages/ListPage";
import Checkout from "./pages/Checkout";
import Earnings from "./pages/Earnings";
import Orders from "./pages/Orders";
import InfluencerRoutes from "./components/PrivateRoutes/InfluencerRoutes";
import BrandRoutes from "./components/PrivateRoutes/BrandRoutes";

function App() {
  const resolvedPath = useResolvedPath("/create-page");
  const isCreatePage = useMatch({ path: resolvedPath.pathname, end: false });

  const resolvedPath1 = useResolvedPath("/login");
  const isLoginPage = useMatch({ path: resolvedPath1.pathname, end: false });

  const resolvedPath2 = useResolvedPath("/orders");
  const isOrderPage = useMatch({ path: resolvedPath2.pathname, end: false });

  const resolvedPath3 = useResolvedPath("/chat");
  const isChatPage = useMatch({ path: resolvedPath3.pathname, end: false });

  const resolvedPath4 = useResolvedPath("/earnings");
  const isEarningsPage = useMatch({ path: resolvedPath4.pathname, end: true });
  return (
    <>
      {isChatPage ? (
        ""
      ) : (
        <>
          <DesktopNav />
          <MobileNav />
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/creator"
          element={
            <SignUpContext>
              <Creator />
            </SignUpContext>
          }
        />
        <Route
          path="/creator-signup/:username"
          element={
            <SignUpContext>
              <CreatorSignUp />
            </SignUpContext>
          }
        />
        <Route
          path="/create-page/:level"
          element={
            <InfluencerRoutes
              component={
                <SignUpContext>
                  <CreatePage />
                </SignUpContext>
              }
            />
          }
        />
        <Route
          path="/complete-profile/:level"
          element={
            <BrandRoutes
              component={
                <SignUpContext>
                  <CompleteProfile />
                </SignUpContext>
              }
            />
          }
        />
        <Route path="/brand" element={<Brand />} />
        <Route
          path="/account"
          element={<PrivateRoute component={<Account />} />}
        />
        <Route
          path="/brand-signup"
          element={
            <SignUpContext>
              <BrandSignUp />
            </SignUpContext>
          }
        />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/:username" element={<UserPage />} />
        <Route
          path="/edit-profile"
          element={<BrandRoutes component={<EditBrand />} />}
        />
        <Route
          path="/edit-page"
          element={<InfluencerRoutes component={<EditInfluencer />} />}
        />
        <Route path="/influencers/:platform/:niches" element={<SearchPage />} />
        <Route
          path="/lists"
          element={<BrandRoutes component={<InfluencersList />} />}
        />
        <Route
          path="/list/:id"
          element={<BrandRoutes component={<ListPage />} />}
        />
        <Route
          path="/checkout/:userid/:packageid"
          element={<BrandRoutes component={<Checkout />} />}
        />
        <Route
          path="/orders"
          element={<PrivateRoute component={<Orders />} />}
        />
        {/* <Route
          path="/chat/:id"
          element={<PrivateRoute component={<Chat />} />}
        /> */}
        <Route
          path="/earnings"
          element={<InfluencerRoutes component={<Earnings />} />}
        />
      </Routes>
      {isCreatePage ||
      isLoginPage ||
      isOrderPage ||
      isChatPage ||
      isEarningsPage ? (
        ""
      ) : (
        <Footer />
      )}
    </>
  );
}

export default App;
