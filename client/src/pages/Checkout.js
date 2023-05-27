import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetReq } from "../hooks/useGetReq";
import ErrorCon from "../components/ErrorCon";
import SubmitRequirements from "../components/Checkout/SubmitRequirements";
import PlaceOrder from "../components/Checkout/PlaceOrder";

export default function Checkout() {
  const [selectedPackage, setSelectedPackage] = useState({});
  const [isPaid, setIsPaid] = useState(false);
  const { userid, packageid } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { error, loading, userData } = useGetReq("influencers/get-by-id", {
    uid: userid,
  });

  const { error: alreadyExistsError, userData: response } = useGetReq(
    "orders/already-exists",
    {
      influencerUid: userid,
      brandUid: currentUser.uid,
      packageId: packageid,
    }
  );

  useEffect(() => {
    if (
      userData &&
      userData.packages.some((userPackage) => userPackage.id === packageid)
    ) {
      setSelectedPackage(
        userData.packages.filter(
          (userPackage) => userPackage.id === packageid
        )[0]
      );
    }
    response && setIsPaid(response.alreadyExists);
  }, [userData, currentUser, error, loading, packageid, navigate, response]);

  return !loading &&
    userData &&
    userData.packages.some((userPackage) => userPackage.id === packageid) ? (
    <>
      <ErrorCon error={error} />
      <ErrorCon error={alreadyExistsError} />
      <div className="checkout-page">
        <div className="indicator bg-white d-flex justify-content-around">
          <div
            className="p-3 justify-content-center w-100 d-flex gap-2 align-items-center"
            style={{
              backgroundColor: isPaid ? "#fff" : "#ebeff4",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
          >
            <span
              className="d-flex justify-content-center align-items-center border border-success text-success rounded-circle"
              style={{
                width: "30px",
                aspectRatio: "1/1",
                backgroundColor: isPaid ? "#fff" : "#c5ede3",
              }}
            >
              1
            </span>
            <small>Place Order</small>
          </div>
          <div
            style={{
              backgroundColor: isPaid ? "#ebeff4" : "#fff",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
            className="indicator p-3 w-100 justify-content-center d-flex gap-2 align-items-center"
          >
            <span
              className="d-flex justify-content-center align-items-center border rounded-circle "
              style={{
                width: "30px",
                aspectRatio: "1/1",
                backgroundColor: isPaid ? "#c5ede3" : "#fff",
              }}
            >
              2
            </span>
            <small>Submit Requirements</small>
          </div>
        </div>
        <div className="container my-5">
          {isPaid ? (
            <SubmitRequirements
              selectedPackage={selectedPackage}
              userData={userData}
            />
          ) : (
            <PlaceOrder
              setIsPaid={setIsPaid}
              selectedPackage={selectedPackage}
              userData={userData}
            />
          )}
        </div>
      </div>
    </>
  ) : userData === null ? (
    <Navigate to="/" />
  ) : userData &&
    userData.packages.some((userPackage) => userPackage.id !== packageid) ? (
    <Navigate to="/" />
  ) : (
    ""
  );
}
