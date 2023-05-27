import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";
import DeleteModal from "./DeleteModal";

export default function AccountSetting() {
  const { error, loading, setError, execute } = usePostReq("auth/logout");
  const { authStateChange } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await execute();
      await authStateChange();
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
      return setTimeout(() => setError(""), 2000);
    }
  }

  return (
    <>
      <ErrorCon error={error} />
      <div className="mt-5">
        <div className="d-flex flex-column gap-2 mb-4">
          <label className="form-label fw-bold" htmlFor="logout">
            Log Out
          </label>
          <button
            onClick={handleLogout}
            type="button"
            className="btn fw-bold btn-dark py-2 width-60-form"
            id="logout"
          >
            {loading ? <Loading /> : "Sign Out"}
          </button>
        </div>
        <button
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          type="button"
          className="btn fw-bold text-danger p-0"
        >
          Delete Account
        </button>
      </div>
      <DeleteModal />
    </>
  );
}
