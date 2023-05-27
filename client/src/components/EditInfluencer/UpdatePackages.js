import React, { useState } from "react";
import ErrorCon from "../ErrorCon";
import { useAddData } from "../../hooks/useAddData";
import { useAuth } from "../../context/AuthContext";
import Package from "../CreatePage/Package";
import Loading from "../Loading";
import SuccessCon from "../SuccessCon";

export default function UpdatePackages() {
  const { currentUser } = useAuth();

  const [packages, setPackages] = useState(currentUser.packages);
  const [packagesLimit, setPackagesLimit] = useState(1);
  const [submit, setSubmit] = useState();
  const [success, setSuccess] = useState("");

  const data = {
    handles: currentUser.handles,
    uid: currentUser.uid,
    currentLevel: currentUser.currentLevel,
    about: currentUser.about,
    location: currentUser.location,
    heading: currentUser.heading,
    gender: currentUser.gender,
    niches: currentUser.niches,
    packages,
    faqs: currentUser.faqs,
    username: currentUser.username,
    email: currentUser.email,
    fullName: currentUser.fullName,
  };

  const { loading, error, addData, setError } = useAddData(
    currentUser.type.toLowerCase()
  );
  return (
    <>
      <ErrorCon error={error} />
      <SuccessCon success={success} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmit(Math.floor(Math.random() * 999999999));
          setTimeout(() => setSuccess(""), 2000);
        }}
        className="mt-5"
      >
        <div>
          <div className="add-packages">
            {packages &&
              packages.length > 0 &&
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
                    isLast={i + 1 === packages.length + packagesLimit}
                    setError={setError}
                    currentUser={currentUser}
                    setPackages={setPackages}
                    data={data}
                    handles={currentUser.handles}
                    setSuccess={setSuccess}
                  />
                );
              })}
            {packages &&
              Array(packagesLimit)
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
                      isLast={i + 1 === packagesLimit}
                      setError={setError}
                      currentUser={currentUser}
                      setPackages={setPackages}
                      data={data}
                      handles={currentUser.handles}
                      setSuccess={setSuccess}
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
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-dark px-5 py-2"
            >
              {loading ? <Loading /> : "Save"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
