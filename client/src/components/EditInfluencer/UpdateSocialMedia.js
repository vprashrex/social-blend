import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAddData } from "../../hooks/useAddData";
import ErrorCon from "../ErrorCon";
import SocialButton from "../CreatePage/SocialButton";
import Loading from "../Loading";
import SuccessCon from "../SuccessCon";

export default function UpdateSocialMedia() {
  const [success, setSucces] = useState("");

  const { currentUser } = useAuth();
  const { error, loading, addData, setError } = useAddData(currentUser.type);

  const instaRef = useRef();
  const twitterRef = useRef();
  const twitchRef = useRef();
  const websiteRef = useRef();
  const youtubeRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      handles: [
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
      ],
      uid: currentUser.uid,
      currentLevel: currentUser.currentLevel,
      about: currentUser.about,
      location: currentUser.location,
      heading: currentUser.heading,
      gender: currentUser.gender,
      niches: currentUser.niches,
      packages: currentUser.packages,
      faqs: currentUser.faqs,
      username: currentUser.username,
      email: currentUser.email,
      fullName: currentUser.fullName,
    };
    try {
      await addData(data);
      setSucces("Profile updated refresh to reflect changes!");
      setTimeout(() => setSucces(""), 2000);
    } catch (err) {
      setTimeout(() => setError(""), 2000);
    }
  }

  return (
    <>
      <ErrorCon error={error} />
      <SuccessCon success={success} />
      <form
        onSubmit={handleSubmit}
        className="mt-5 edit-page-60 d-flex flex-column gap-3"
      >
        <SocialButton
          icon="instagram"
          handles={currentUser.handles}
          reference={instaRef}
        />
        <SocialButton
          icon="youtube"
          handles={currentUser.handles}
          reference={youtubeRef}
        />
        <SocialButton
          icon="twitter"
          handles={currentUser.handles}
          reference={twitchRef}
        />
        <SocialButton
          icon="twitch"
          handles={currentUser.handles}
          reference={twitterRef}
        />
        <SocialButton
          icon="website"
          handles={currentUser.handles}
          reference={websiteRef}
        />
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-dark px-5 py-2"
          >
            {loading ? <Loading /> : "Save"}
          </button>
        </div>
      </form>
    </>
  );
}
