import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Location from "../components/CreatePage/Location";
import VerifyEmail from "../components/CreatePage/VerifyEmail";
import Summarize from "../components/CreatePage/Summarize";
import Description from "../components/CreatePage/Description";
import Gender from "../components/CreatePage/Gender";
import SocialChannels from "../components/CreatePage/SocialChannels";
import SelectNiches from "../components/CreatePage/SelectNiches";
import SelectImg from "../components/CreatePage/SelectImg";
import AddPackages from "../components/CreatePage/AddPackages";
import AddFaqs from "../components/CreatePage/AddFaqs";
import WelcomePage from "../components/CreatePage/WelcomePage";
import { useAuth } from "../context/AuthContext";

export default function CreatePage() {
  const { level } = useParams();

  const { currentUser } = useAuth();

  return (
    <div className="container get-info-container">
      {currentUser?.currentLevel === 10 ? (
        <Navigate to={"/" + currentUser.username} />
      ) : !currentUser ? (
        <Navigate to="/" />
      ) : +level === 0 ? (
        <VerifyEmail />
      ) : +level === 1 ? (
        <Location />
      ) : +level === 2 ? (
        <Summarize />
      ) : +level === 3 ? (
        <Description />
      ) : +level === 4 ? (
        <Gender />
      ) : +level === 5 ? (
        <SocialChannels />
      ) : +level === 6 ? (
        <SelectNiches />
      ) : +level === 7 ? (
        <SelectImg />
      ) : +level === 8 ? (
        <AddPackages />
      ) : +level === 9 ? (
        <AddFaqs />
      ) : +level === 10 ? (
        <WelcomePage />
      ) : (
        "Page Not Found"
      )}
    </div>
  );
}
