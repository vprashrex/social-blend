import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";
import Loading from "../Loading";
import { Link, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import ErrorCon from "../ErrorCon";

export default function SignupModal() {
  const [name, setName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [about, setAbout] = useState("default");

  const navigate = useNavigate();
  const { authStateChange, currentUser } = useAuth();
  const { error, loading, setError, execute } = usePostReq("auth/signup");
  async function handleSubmit(e) {
    e.preventDefault();

    const username =
      brandName.toLowerCase().replaceAll(" ", "-") + "-" + nanoid(5);

    try {
      await execute({
        fullName: name,
        email,
        password: pass,
        username,
        about,
        currentLevel: 0,
        type: "Brand",
        brandName,
      });

      await authStateChange();
    } catch (err) {
      setError(err.response.data.message);
      return setTimeout(() => setError(""), 2000);
    }
    navigate(`/complete-profile/${0}`);
  }

  return (
    <>
      <ErrorCon error={error} />
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title ms-auto" id="exampleModalLabel">
                Brand Signup
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="w-100 d-flex flex-column gap-4">
                <div className="w-100 d-flex flex-column align-items-center gap-3 justify-content-center ">
                  <button className="btn btn-dark d-flex gap-2 align-items-center w-100 justify-content-center">
                    <i className="bi bi-google" />
                    Continue with Google
                  </button>
                </div>
                <div className="w-100 separator">
                  <span>or</span>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="d-flex flex-column gap-3"
                >
                  <input
                    required
                    type="text"
                    className="form-control w-100"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder="Brand Name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                  <input
                    required
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    required
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                  <select
                    required
                    defaultValue={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="form-select"
                  >
                    <option value="default" disabled hidden>
                      How did you hear about us
                    </option>
                    <option value="Facebook">Facebook</option>
                    <option value="Friend/Colleague">Friend/Colleague</option>
                    <option value="Google">Google</option>
                    <option value="Youtube">Youtube</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                  <div className="modal-footer d-flex flex-column">
                    <button
                      disabled={loading}
                      type="submit"
                      className="btn btn-dark fw-bold py-2 w-100"
                      data-bs-dismiss={"modal"}
                      aria-label="Close"
                    >
                      {loading ? <Loading /> : "Sign Up"}
                    </button>
                    <p
                      style={{
                        fontSize: "0.7rem",
                      }}
                    >
                      By signing up, you agree to our{" "}
                      <Link to="/terms" children="Terms" /> and{" "}
                      <Link to="/privacy" children="Privacy Policy" />.
                    </p>
                    <p>
                      Already have an account?{" "}
                      <Link to="/login" children="Login." />
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
