import React from "react";
import { useGetReq } from "../../hooks/useGetReq";
import Loading from "../Loading";
import ErrorCon from "../ErrorCon";
import { formatCurrency } from "../../utils/formatCurrency";

export default function RowOrder({ order }) {
  const { error, loading, userData } = useGetReq("influencers/get-by-id", {
    uid: order.influencerUid,
  });

  const price =
    userData &&
    userData.packages.filter((userPackage) => {
      return userPackage.id === order.order.packageId;
    })[0].price;

  return loading ? (
    <tr>
      <td>
        <Loading />
      </td>
    </tr>
  ) : (
    <>
      <ErrorCon error={error} />
      <tr>
        <th>{order.createdAt.slice(0, order.createdAt.indexOf("T"))}</th>
        <td>{order.order.packageId}</td>
        <td>
          {order.isPaymentRelease
            ? "Payment Release"
            : order.isDeclined
            ? "Declined"
            : order.isCanceled
            ? "Canceled"
            : order.isAccepted
            ? "Accepted"
            : "Not Accepted"}
        </td>
        <td>{formatCurrency(price)}</td>
      </tr>
    </>
  );
}
