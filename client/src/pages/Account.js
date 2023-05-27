import React from "react";
import AccountSetting from "../components/Account/AccountSetting";
import AccountDetails from "../components/Account/AccountDetails";

export default function Account() {
  return (
    <div className="container my-5">
      <h1>Account</h1>
      <ul className="nav nav-pills mt-5 mb-4" id="pills-tab" role="tablist">
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
            Setting
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
          <AccountDetails />
        </div>
        <div
          className="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <AccountSetting />
        </div>
      </div>
    </div>
  );
}
