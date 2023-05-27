import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "../../context/SignUpContext";
import Package from "./Package";
import SignUpIndicator from "./SignUpIndicator";
import ErrorCon from "../ErrorCon";
import { useAddData } from "../../hooks/useAddData";
import Loading from "../Loading";
import { useAuth } from "../../context/AuthContext";

export default function AddPackages() {
  const [submit, setSubmit] = useState();
  const { setCurrentLevel, currentLevel, packages, setPackages, data } =
    useSignUp();
  const [packagesLimit, setPackagesLimit] = useState(1);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { loading, error, addData, setError } = useAddData(
    currentUser.type.toLowerCase()
  );

  useEffect(() => {
    navigate(`/create-page/${currentLevel.toString()}`);
  }, [currentLevel, navigate]);

  return (
    <>
      <ErrorCon error={error} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmit(Math.floor(Math.random() * 999999999));
        }}
        className="width-100-form"
      >
        <SignUpIndicator />
        <div>
          <h3 className="fw-bold">Add your packages</h3>
          <p>
            These are services brands can purchase from you. This can be
            anything from a shoutout on your social media to original content
            creation.
          </p>
          <div className="add-packages">
            {packages.length > 0 &&
              packages.map((package1, i) => {
                return (
                  <Package
                    submit={submit}
                    setPackagesLimit={setPackagesLimit}
                    isFromSecond={i !== 0 ? true : false}
                    num={(i + 1).toString()}
                    key={package1.id}
                    package1={package1}
                    addData={addData}
                    setCurrentLevel={setCurrentLevel}
                    isLast={i + 1 === packages.length + packagesLimit}
                    setError={setError}
                    currentUser={currentUser}
                    setPackages={setPackages}
                    data={data}
                    handles={data.handles}
                  />
                );
              })}
            {Array(packagesLimit)
              .fill("")
              .map((pg, i) => {
                return (
                  <Package
                    submit={submit}
                    key={i}
                    setPackagesLimit={setPackagesLimit}
                    isFromSecond={packages.length + i !== 0 ? true : false}
                    num={
                      packages
                        ? (packages.length + (i + 1)).toString()
                        : (i + 1).toString()
                    }
                    addData={addData}
                    setCurrentLevel={setCurrentLevel}
                    isLast={i + 1 === packagesLimit}
                    setError={setError}
                    currentUser={currentUser}
                    setPackages={setPackages}
                    data={data}
                    handles={data.handles}
                  />
                );
              })}
          </div>
          {packagesLimit < 10 && (
            <div className="text-end my-2 w-100 ">
              <button
                type="button"
                onClick={() => setPackagesLimit((prev) => prev + 1)}
                className="btn"
              >
                <i className="bi bi-plus" /> Add Package
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-dark w-100 py-2"
          >
            {loading ? <Loading /> : "Continue"}
          </button>
        </div>
      </form>
    </>
  );
}
