import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import VerifyEmail from "../CreatePage/VerifyEmail";
import Location from "../CreatePage/Location";
import SocialChannels from "../CreatePage/SocialChannels";
import SelectImg from "../CreatePage/SelectImg";
import SelectNiches from "../CreatePage/SelectNiches";
import WelcomePage from "../CreatePage/WelcomePage";
import { Navigate } from "react-router-dom";
import Summarize from "../CreatePage/Summarize";
import BrandName from "../CreatePage/brandname";

export default function CompleteProfile() {
  const { level } = useParams();
  const { currentUser } = useAuth();
  return (
    <div className="container get-info-container">
      {currentUser?.currentLevel === 7 ? (
        <Navigate to={"/" + currentUser.username} />
      ) : !currentUser ? (
        <Navigate to="/" />
      ) : +level === 0 ? (
        <VerifyEmail />
      ) : +level === 1 ? (
        <Location />
      ) : +level === 2 ? (
        <BrandName />
      ): +level === 3 ? (
        <Summarize />
      ) : +level === 4 ? (
        <SocialChannels />
      ) : +level === 5 ? (
        <SelectNiches />
      ) : +level === 6 ? (
        <SelectImg />
      ) : (
        <WelcomePage />
      )}
    </div>
  );
}
