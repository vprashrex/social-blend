import React from "react";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatCurrency";
import { useGetReq } from "../hooks/useGetReq";
import ErrorCon from "../components/ErrorCon";
import Loading from "../components/Loading";
import RowOrder from "../components/Earnings/RowOrder";

export default function Earnings() {
  const { currentUser } = useAuth();

  const {
    error,
    loading,
    userData: orders,
  } = useGetReq("orders", {
    uid: currentUser.uid,
  });

  const {
    error: walletErr,
    loading: walletLoading,
    userData: walletInfo,
  } = useGetReq("wallets/", {});

  return walletLoading ? (
    <Loading />
  ) : (
    <>
      <ErrorCon error={walletErr} />
      <ErrorCon error={error} />
      <div className="container w-100 mt-5">
        <h1 className="fw-bold">Earnings</h1>
        <div className="d-flex align-items-center w-100 my-5">
          <div className="d-flex flex-column gap-1 p-3 w-100 border-end">
            <small>Total Earned</small>
            <h3 className="fs-2">
              {walletInfo && formatCurrency(walletInfo.totalBalance)}
            </h3>
            {walletInfo && walletInfo.availableBalance > 0 && (
              <small>
                Available Balance:{" "}
                <span className="fw-bold">
                  {formatCurrency(walletInfo.availableBalance)}
                </span>
              </small>
            )}
          </div>
          <div className="d-flex flex-column gap-1 p-3 w-100 border-end">
            <small>Total Pending</small>
            <h3 className="fs-2">
              {walletInfo && formatCurrency(walletInfo.pendingBalance)}
            </h3>
          </div>
        </div>
        <div>
          <div className="d-flex gap-2 align-items-center">
            <select
              style={{
                outline: "none",
                borderRadius: "10px",
                padding: ".3rem",
                background: "inherit",
                border: "1px solid rgba(195,150,218,.6)",
                cursor: "pointer",
              }}
            >
              <option>All Earnings</option>
            </select>
            <select
              style={{
                outline: "none",
                borderRadius: "10px",
                padding: ".3rem",
                background: "inherit",
                border: "1px solid rgba(195,150,218,.6)",
                cursor: "pointer",
              }}
            >
              <option>2023</option>
            </select>
            <select
              style={{
                outline: "none",
                borderRadius: "10px",
                padding: ".3rem",
                background: "inherit",
                border: "1px solid rgba(195,150,218,.6)",
                cursor: "pointer",
              }}
            >
              <option>September</option>
            </select>
          </div>
          <div className="table-responsive">
            {loading ? (
              <Loading />
            ) : (
              <table className="table my-5">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Details</th>
                    <th scope="col">Status</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {orders &&
                    orders.map((order) => {
                      return <RowOrder key={order.id} order={order} />;
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
