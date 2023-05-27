import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSignUp } from "../../context/SignUpContext";
import { useAddData } from "../../hooks/useAddData";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";
import SignUpIndicator from "./SignUpIndicator";
import SocialButton from "./SocialButton";

export default function SocialChannels() {
  const { currentLevel, setCurrentLevel, setHandles, data, handles } =
    useSignUp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const instaRef = useRef();
  const youtubeRef = useRef();
  const twitchRef = useRef();
  const twitterRef = useRef();
  const websiteRef = useRef();
  const { loading, error, addData, setError } = useAddData(
    currentUser.type.toLowerCase()
  );

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setHandles([
        {
          name: "Instagram",
          username: instaRef.current ? instaRef.current.value : "",
        },
        {
          name: "Youtube",
          username: youtubeRef.current ? youtubeRef.current.value : "",
        },
        {
          name: "Twitch",
          username: twitchRef.current ? twitchRef.current.value : "",
        },
        {
          name: "Twitter",
          username: twitterRef.current ? twitterRef.current.value : "",
        },
        {
          name: "Website",
          username: websiteRef.current ? websiteRef.current.value : "",
        },
      ]);
      data.handles = [
        {
          name: "Instagram",
          username: instaRef.current ? instaRef.current.value : "",
        },
        {
          name: "Youtube",
          username: youtubeRef.current ? youtubeRef.current.value : "",
        },
        {
          name: "Twitch",
          username: twitchRef.current ? twitchRef.current.value : "",
        },
        {
          name: "Twitter",
          username: twitterRef.current ? twitterRef.current.value : "",
        },
        {
          name: "Website",
          username: websiteRef.current ? websiteRef.current.value : "",
        },
      ];
      await addData(data);

      setCurrentLevel((prev) => prev + 1);
    } catch {
      return setTimeout(() => setError(""), 2000);
    }
  }

  useEffect(() => {
    navigate(
      `${
        currentUser.type === "Influencer" ? "/create-page" : "/complete-profile"
      }/${currentLevel.toString()}`
    );
  }, [currentLevel, navigate]);

  return (
    <>
      <ErrorCon error={error} />
      <form onSubmit={handleSubmit} className="width-60-form">
        <SignUpIndicator />
        <h3 className="fw-bold my-3">Add your social channels</h3>
        <div className="d-flex flex-column gap-3">
          <SocialButton
            icon="instagram"
            handles={handles}
            reference={instaRef}
          />
          <SocialButton
            icon="youtube"
            handles={handles}
            reference={youtubeRef}
          />
          <SocialButton
            icon="twitter"
            handles={handles}
            reference={twitchRef}
          />
          <SocialButton
            icon="twitch"
            handles={handles}
            reference={twitterRef}
          />
          <SocialButton
            icon="website"
            handles={handles}
            reference={websiteRef}
          />
          <button
            disabled={loading}
            type="submit"
            className="btn btn-dark my-3"
          >
            {loading ? <Loading /> : "Continue"}
          </button>
        </div>
      </form>
    </>
  );
}
