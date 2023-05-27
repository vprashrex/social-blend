import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "../../context/SignUpContext";
import defaultimg from "../../assets/imgs/input-img.png";
import ErrorCon from "../ErrorCon";
import SignUpIndicator from "./SignUpIndicator";
import Loading from "../Loading";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";

export default function SelectImg() {
  const {
    setCurrentLevel,
    currentLevel,
    profileImg,
    setProfileImg,
    coverImg,
    setCoverImg,
    contentImg1,
    setContentImg1,
    contentImg2,
    setContentImg2,
    contentImg3,
    setContentImg3,
    data,
  } = useSignUp();
  const { currentUser } = useAuth();
  const { error, loading, execute, setError } = usePostReq("auth/add-imgs");
  const navigate = useNavigate();

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

    data.coverImg = coverImg;
    data.profileImg = profileImg;
    data.contentImg1 = contentImg1;
    data.contentImg2 = contentImg2;
    data.contentImg3 = contentImg3;

    try {
      const formData = new FormData();
      formData.append("profileImg", data.profileImg);
      formData.append("coverImg", data.coverImg);
      formData.append("contentImg1", data.contentImg1);
      formData.append("contentImg2", data.contentImg2);
      formData.append("contentImg3", data.contentImg3);
      await execute({ formData });
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

  function checkForImg(file) {
    return typeof file === "object"
      ? URL.createObjectURL(file)
      : typeof file === "string" && file !== ""
      ? `${process.env.REACT_APP_API_HOST_NAME}public/uploads/${file}`
      : defaultimg;
  }

  return (
    <>
      <ErrorCon error={error} />
      <form
        encType="multipart/form-data"
        className="width-100-form"
        onSubmit={handleSubmit}
      >
        <SignUpIndicator />
        <div>
          <h3 className="fw-bold">
            Add up to 5 images of you and your content
          </h3>
        </div>
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
                      onClick={() => setContentImg1()}
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
                      onClick={() => setContentImg2()}
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
                    onClick={() => setContentImg3()}
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
