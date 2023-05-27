import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";
import ErrorCon from "../ErrorCon";

export default function DesktopNav() {
  const { currentUser, authStateChange } = useAuth();
  const { execute, error, loading, setError } = usePostReq("auth/logout");
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
      <nav className="desktop-nav py-4 container d-flex align-items-center justify-content-between">
        <Link to="/" className="fs-4">
          Logo
        </Link>
        {currentUser ? (
          <>
            <div className="btn-group links-list d-flex gap-5">
              <Link
                className="d-flex justify-content-center align-items-center"
                to="/orders"
              >
                Orders
              </Link>
              {currentUser.type === "Brand" && (
                <div className="links-list d-flex justify-content-center gap-5 align-items-center">
                  <Link to="/influencers/any/all">Explore</Link>
                  <Link to="/lists">List</Link>
                </div>
              )}
              <button
                type="button"
                className="btn px-2 py-1 d-flex align-items-center justify-content-center gap-3 border"
                style={{
                  borderRadius: "1.5rem",
                }}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-list fs-5" />
                {currentUser.profileImg ? (
                  <img
                    src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${currentUser.profileImg}`}
                    width="40px"
                    style={{
                      aspectRatio: "1/1",
                      borderRadius: "50%",
                    }}
                    alt="Profile"
                  />
                ) : (
                  <i className="bi bi-person-circle fs-4" />
                )}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item"
                    to={
                      (currentUser.type === "Influencer" &&
                        currentUser.currentLevel === 11) ||
                      (currentUser.type === "Brand" &&
                        currentUser.currentLevel === 6)
                        ? `/${currentUser.username}`
                        : `/create-page/${currentUser.currentLevel}`
                    }
                  >
                    Profile
                  </Link>
                </li>
                <li className="mt-2">
                  <Link className="dropdown-item" to="/account">
                    Account
                  </Link>
                </li>
                {currentUser.type === "Brand" ? (
                  <li className="mt-2">
                    <Link className="dropdown-item" to="/billing">
                      Billing
                    </Link>
                  </li>
                ) : (
                  <li className="mt-2">
                    <Link className="dropdown-item" to="/earnings">
                      Earnings
                    </Link>
                  </li>
                )}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    disabled={loading}
                    className="dropdown-item text-danger btn"
                    onClick={handleLogout}
                  >
                    {loading ? "loading..." : "Sign Out"}
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="links-list d-flex align-items-center gap-5">
            <Link to={"/influencers/any/all"}>Explore</Link>
            <button
              className="btn "
              onClick={() => window.location.replace("#how-it-works")}
            >
              <strong>How It Works</strong>
            </button>
            <Link to="/login">Login</Link>
            <Link to="/brand">Join as Brand</Link>
            <Link to="/creator">Join as Influencer</Link>
          </div>
        )}
      </nav>
    </>
  );
}
