import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { useGetReq } from "../hooks/useGetReq";
import ImgModal from "../components/UserPage/ImgModal";
import { formatCurrency } from "../utils/formatCurrency";
import ListPackage from "../components/UserPage/ListPackage";
import ListFaq from "../components/UserPage/ListFaq";
import SignupModal from "../components/UserPage/SignupModal";

export default function UserPage() {
  const [img, setImg] = useState("");
  const [selectedPackage, setSelectedPackage] = useState({
    id: "",
    platform: "",
    heading: "",
    description: "",
    price: 0,
    uid: "",
  });
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const { username } = useParams();
  const { currentUser } = useAuth();
  const { userData, loading, error } = useGetReq(
    `influencers/get-by-username`,
    { username }
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !loading && !error && currentUser.uid === userData.uid) {
      setIsCurrentUser(true);
    }
    if (userData) {
      userData.packages && setSelectedPackage(userData.packages[0]);
      if (
        (userData.type === "Influencer" && userData.currentLevel === 11) ||
        (userData.type === "Brand" &&
          userData.currentLevel === 6 &&
          userData.type === "Brand" &&
          currentUser.uid === userData.uid)
      ) {
        currentUser &&
          currentUser.uid === userData.uid &&
          navigate(`/${userData.username}`);
      } else {
        navigate("/");
      }
    }
  }, [loading, error, currentUser, navigate, userData, username]);

  async function handleClick(e) {
    navigate(`/checkout/${userData.uid}/${selectedPackage.id}`);
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        error
      ) : (
        <div className="container my-5">
          {isCurrentUser && (
            <div className="d-flex justify-content-end my-3">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/edit-${currentUser.type === "Brand" ? "profile" : "page"}`
                  )
                }
                className="btn d-flex gap-2 fw-bold"
              >
                <i className="bi bi-pencil-fill" />
                <span>Edit</span>
              </button>
            </div>
          )}
          <div className="imgs-container">
            <img
              className="coverImg"
              alt="Img"
              onClick={() => setImg(userData.coverImg)}
              role="button"
              tabIndex="0"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal1"
              src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${userData.coverImg}`}
              style={{ objectFit: "cover" }}
              loading="lazy"
              width={
                !(
                  userData.contentImg1 &&
                  userData.contentImg2 &&
                  userData.contentImg3
                )
                  ? "100%"
                  : "60%"
              }
            />
            {(userData.contentImg1 ||
              userData.contentImg2 ||
              userData.contentImg3) && (
              <div
                className={`contentImgs ${
                  userData.contentImg1 ? "h-50" : "h-100"
                }  ${userData.contentImg2 ? "h-50" : "h-100"}  ${
                  userData.contentImg3 ? "h-50" : "h-100"
                }`}
              >
                <div
                  className="d-flex"
                  style={{ gap: ".5rem", height: "100%" }}
                >
                  {userData.contentImg1 && (
                    <img
                      className="contentImg1"
                      alt="Img"
                      onClick={() => setImg(userData.contentImg1)}
                      role="button"
                      tabIndex="0"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal1"
                      src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${userData.contentImg1}`}
                      style={{ objectFit: "cover" }}
                      loading="lazy"
                      width={
                        /* !(userData.contentImg2 && userData.contentImg3)
                          ? "100%"
                          :  */ "50%"
                      }
                    />
                  )}
                  {userData.contentImg2 && (
                    <img
                      className="contentImg2"
                      alt="Img"
                      onClick={() => setImg(userData.contentImg2)}
                      role="button"
                      tabIndex="0"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal1"
                      src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${userData.contentImg2}`}
                      style={{ objectFit: "cover" }}
                      loading="lazy"
                      width={"50%"}
                    />
                  )}
                </div>
                {userData.contentImg3 && (
                  <img
                    className="contentImg3"
                    alt="Img"
                    onClick={() => setImg(userData.contentImg3)}
                    role="button"
                    tabIndex="0"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal1"
                    src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${userData.contentImg3}`}
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                    width={
                      !(userData.contentImg1 && userData.contentImg2)
                        ? "100%"
                        : "50%"
                    }
                  />
                )}
              </div>
            )}
          </div>
          <div className="user-page-div">
            <div className="w-100 part-one">
              <h3 className="fw-bold">
                {userData.type === "Influencer"
                  ? userData.heading
                  : userData.brandName}
              </h3>
              <p>
                {userData.type === "Influencer"
                  ? userData.about
                  : userData.heading}
              </p>
              <div className="d-flex align-items-center gap-2">
                {userData.packages && (
                  <>
                    <strong>Packages</strong>
                    <select
                      className="form-select w-50"
                      defaultValue={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="user-generated-content">
                        User Generated Content
                      </option>
                      {userData.handles.map((handle) => {
                        return (
                          handle.username && (
                            <option key={handle.name} value={handle.name}>
                              {handle.name}
                            </option>
                          )
                        );
                      })}
                    </select>
                  </>
                )}
              </div>
              <div className="packages-div">
                {selectedPlatform === "all"
                  ? userData.packages &&
                    userData.packages.map((userPackage) => {
                      return (
                        <ListPackage
                          key={userPackage.id}
                          setSelectedPackage={setSelectedPackage}
                          selectedPackage={selectedPackage}
                          userPackage={userPackage}
                        />
                      );
                    })
                  : userData.packages
                      .filter(
                        (userPackage) =>
                          userPackage.platform === selectedPlatform
                      )
                      .map((userPackage) => {
                        return (
                          <ListPackage
                            key={userPackage.id}
                            setSelectedPackage={setSelectedPackage}
                            selectedPackage={selectedPackage}
                            userPackage={userPackage}
                          />
                        );
                      })}
              </div>
              {userData.faqs && (
                <div className="faqs-div mt-4">
                  <h4 className="fw-bold">FAQ</h4>
                  {userData.faqs.map((faq) => {
                    return <ListFaq key={faq.id} faq={faq} />;
                  })}
                </div>
              )}
            </div>
            <div className="part-two">
              <div className="d-flex flex-column gap-2 align-items-center text-center">
                <img
                  src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${userData.profileImg}`}
                  alt="Profile"
                  width="100px"
                  style={{ aspectRatio: "1/1", borderRadius: "50%" }}
                />
                <strong>{userData.fullName}</strong>
                <small style={{ color: "#adb1ce" }}>{userData.location}</small>
                <div className="d-flex gap-2">
                  {userData.handles.map((handle) => {
                    return (
                      handle.username && (
                        <a
                          key={handle.name}
                          href={`https://www.${handle.name.toLowerCase()}.com/${
                            handle.name === "Youtube"
                              ? `@${handle.username}`
                              : handle.username
                          }`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i
                            className={`bi bi-${
                              handle.name === "Website"
                                ? "laptop-fill"
                                : handle.name.toLowerCase()
                            }`}
                          />
                        </a>
                      )
                    );
                  })}
                </div>
              </div>
              {!isCurrentUser &&
              userData.packages &&
              currentUser &&
              currentUser.type === "Brand" ? (
                <div className="bg-white p-3 rounded mt-3 select-package-user">
                  <strong className="fs-5 ">{userData.heading}</strong>
                  <select
                    defaultValue={JSON.stringify(selectedPackage)}
                    onChange={(e) =>
                      setSelectedPackage(JSON.parse(e.target.value))
                    }
                    className="form-select my-2"
                  >
                    <option hidden>{selectedPackage.heading}</option>
                    {userData.packages.map((userPackage) => {
                      return (
                        <option
                          key={userPackage.id}
                          value={JSON.stringify(userPackage)}
                        >
                          {userPackage.heading}
                        </option>
                      );
                    })}
                  </select>
                  <h4 className="my-3">
                    {formatCurrency(selectedPackage.price)}
                  </h4>
                  <small>{selectedPackage.description}</small>
                  <button
                    onClick={handleClick}
                    type="button"
                    className="btn btn-dark fw-bold w-100 mt-3"
                    data-bs-toggle={!currentUser ? "modal" : ""}
                    data-bs-target={!currentUser ? "#exampleModal" : ""}
                  >
                    Continue
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
      <ImgModal img={img} />
      {!currentUser && <SignupModal />}
    </>
  );
}
