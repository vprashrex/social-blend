import React, { useState } from "react";
import defaultimg from "../../assets/imgs/input-img.png";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";
import SuccessCon from "../SuccessCon";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";

export default function UpdateImages() {
  const { currentUser } = useAuth();

  const [profileImg, setProfileImg] = useState(currentUser.profileImg);
  const [coverImg, setCoverImg] = useState(currentUser.coverImg);
  const [contentImg1, setContentImg1] = useState(currentUser.contentImg1);
  const [contentImg2, setContentImg2] = useState(currentUser.contentImg2);
  const [contentImg3, setContentImg3] = useState(currentUser.contentImg3);
  const [success, setSuccess] = useState("");

  function checkForImg(file) {
    return typeof file === "object"
      ? URL.createObjectURL(file)
      : typeof file === "string" && file !== ""
      ? `${process.env.REACT_APP_API_HOST_NAME}public/uploads/${file}`
      : defaultimg;
  }

  const { error, loading, execute, setError } = usePostReq("auth/add-imgs");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!coverImg) {
      setError("Profile and cover photo is required");
      return setTimeout(() => setError(""), 1000);
    }
    if (!profileImg) {
      setError("Profile and cover photo is required");
      return setTimeout(() => setError(""), 1000);
    }

    try {
      const formData = new FormData();
      formData.append("profileImg", profileImg);
      formData.append("coverImg", coverImg);
      formData.append("contentImg1", contentImg1);
      formData.append("contentImg2", contentImg2);
      formData.append("contentImg3", contentImg3);
      await execute({ formData });
      setSuccess("Profile updated refresh to reflect changes!");
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      return setTimeout(() => setError(""), 2000);
    }
  }

  return (
    <>
      <ErrorCon error={error} />
      <SuccessCon success={success} />
      <form
        encType="multipart/form-data"
        className="mt-5"
        onSubmit={handleSubmit}
      >
        <div className="img-container">
          <div className="d-flex justify-content-center align-items-center w-100">
            <label htmlFor="profile-img">
              <img
                width="100px"
                style={{ aspectRatio: "1/1" }}
                className="rounded-circle"
                alt="IMG"
                src={checkForImg(profileImg)}
              />
            </label>
            <input
              accept="image/*"
              onChange={(e) => setProfileImg(e.target.files[0])}
              type="file"
              style={{ display: "none" }}
              id="profile-img"
              name="profileImg"
            />
          </div>
          <div className="img-container-grid">
            <div className="first-part position-relative">
              {coverImg && (
                <strong
                  className="bg-light rounded-pill px-2 py-1 position-absolute"
                  style={{
                    left: ".5rem",
                    top: ".5rem",
                    boxShadow: "rgba(120, 120, 170, 0.2) 0 2px 10px 0",
                  }}
                >
                  Cover Photo
                </strong>
              )}
              <label htmlFor="cover-img" className="h-100 w-100">
                <img
                  width="100%"
                  height="100%"
                  alt="IMG"
                  src={checkForImg(coverImg)}
                />
              </label>
              <input
                onChange={(e) => setCoverImg(e.target.files[0])}
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                id="cover-img"
              />
            </div>
            <div className="second-part">
              <div className="d-flex gap-2 w-100">
                <div className="w-50 position-relative">
                  {contentImg1 && (
                    <button
                      type="button"
                      onClick={() => setContentImg1("")}
                      className="btn bg-light rounded-circle position-absolute"
                      style={{ right: "0.3rem", top: ".3rem" }}
                    >
                      <i className="bi bi-trash text-danger " />
                    </button>
                  )}
                  <label htmlFor="content-img-1" className="h-100 w-100">
                    <img
                      width="100%"
                      height="100%"
                      style={{
                        aspectRatio: "1/1",
                      }}
                      alt="IMG"
                      src={checkForImg(contentImg1)}
                    />
                  </label>
                  <input
                    onChange={(e) => setContentImg1(e.target.files[0])}
                    accept="image/*"
                    type="file"
                    style={{ display: "none" }}
                    id="content-img-1"
                  />
                </div>
                <div className="w-50 position-relative">
                  {contentImg2 && (
                    <button
                      type="button"
                      onClick={() => setContentImg2("")}
                      className="btn bg-light rounded-circle position-absolute"
                      style={{ right: "0.3rem", top: ".3rem" }}
                    >
                      <i className="bi bi-trash text-danger " />
                    </button>
                  )}
                  <label htmlFor="content-img-2" className="h-100 w-100">
                    <img
                      width="100%"
                      height="100%"
                      style={{
                        aspectRatio: "1/1",
                        borderTopRightRadius: "10px",
                      }}
                      alt="IMG"
                      src={checkForImg(contentImg2)}
                    />
                  </label>
                  <input
                    onChange={(e) => setContentImg2(e.target.files[0])}
                    accept="image/*"
                    type="file"
                    style={{ display: "none" }}
                    id="content-img-2"
                  />
                </div>
              </div>
              <div className="w-100 position-relative">
                {contentImg3 && (
                  <button
                    type="button"
                    onClick={() => setContentImg3("")}
                    className="btn bg-light rounded-circle position-absolute"
                    style={{ right: "0.3rem", top: ".3rem" }}
                  >
                    <i className="bi bi-trash text-danger " />
                  </button>
                )}
                <label htmlFor="content-img-3" className="w-100">
                  <img
                    width="100%"
                    height="100%"
                    style={{ aspectRatio: "2/1" }}
                    alt="IMG"
                    src={checkForImg(contentImg3)}
                  />
                </label>
                <input
                  onChange={(e) => setContentImg3(e.target.files[0])}
                  accept="image/*"
                  type="file"
                  style={{ display: "none" }}
                  id="content-img-3"
                />
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-dark w-100 my-5"
        >
          {loading ? <Loading /> : "Continue"}
        </button>
      </form>
    </>
  );
}
