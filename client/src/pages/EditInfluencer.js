import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UpdateDetails from "../components/EditInfluencer/UpdateDetails";
import UpdateSocialMedia from "../components/EditInfluencer/UpdateSocialMedia";
import UpdateImages from "../components/EditInfluencer/UpdateImages";
import UpdatePackages from "../components/EditInfluencer/UpdatePackages";
import UpdateFaqs from "../components/EditInfluencer/UpdateFaqs";

export default function EditInfluencer() {
  const { currentUser } = useAuth();

  return (
    <div className="container my-5">
      <Link
        to={`/${currentUser.username}`}
        style={{ backgroundColor: "#f2f3f4" }}
        className="btn text-dark rounded-pill my-3"
      >
        <i className="bi bi-arrow-left text-dark" />
        <span className="ms-2">Back to profile</span>
      </Link>
      <h2 className="fw-bold">Edit Your Page</h2>
      <ul className="nav nav-pills mt-5 mb-4 " id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            Details
          </button>
        </li>
        <li className="nav-item ms-5" role="presentation">
          <button
            className="nav-link"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            Social Media
          </button>
        </li>
        <li className="nav-item ms-5" role="presentation">
          <button
            className="nav-link"
            id="pills-images-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-images"
            type="button"
            role="tab"
            aria-controls="pills-images"
            aria-selected="false"
          >
            Images
          </button>
        </li>
        <li className="nav-item ms-5" role="presentation">
          <button
            className="nav-link"
            id="pills-packages-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-packages"
            type="button"
            role="tab"
            aria-controls="pills-packages"
            aria-selected="false"
          >
            Packages
          </button>
        </li>
        <li className="nav-item ms-5" role="presentation">
          <button
            className="nav-link"
            id="pills-faqs-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-faqs"
            type="button"
            role="tab"
            aria-controls="pills-faqs"
            aria-selected="false"
          >
            Faqs
          </button>
        </li>
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <UpdateDetails />
        </div>
        <div
          className="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <UpdateSocialMedia />
        </div>
        <div
          className="tab-pane fade"
          id="pills-images"
          role="tabpanel"
          aria-labelledby="pills-images-tab"
        >
          <UpdateImages />
        </div>
        <div
          className="tab-pane fade"
          id="pills-packages"
          role="tabpanel"
          aria-labelledby="pills-packages-tab"
        >
          <UpdatePackages />
        </div>
        <div
          className="tab-pane fade"
          id="pills-faqs"
          role="tabpanel"
          aria-labelledby="pills-faqs-tab"
        >
          <UpdateFaqs />
        </div>
      </div>
    </div>
  );
}
