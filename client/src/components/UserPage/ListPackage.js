import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ListPackage({
  userPackage,
  setSelectedPackage,
  selectedPackage,
}) {
  return (
    <div>
      <input
        type="radio"
        id={userPackage.id}
        value={JSON.stringify(userPackage)}
        name="userPackages"
        hidden={true}
        className="select-packages"
        onChange={(e) => setSelectedPackage(JSON.parse(e.target.value))}
        checked={selectedPackage.id === userPackage.id}
      />
      <label
        className="d-flex align-items-center w-100"
        htmlFor={userPackage.id}
      >
        <div className="w-100 d-flex flex-column gap-1">
          <small style={{ color: "#9ca9c9" }}>
            {userPackage.platform.replaceAll("-", " ")}
          </small>
          <strong>{userPackage.heading}</strong>
          <p>{userPackage.description}</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <strong>{formatCurrency(userPackage.price)}</strong>
          <small
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              border: "1px solid pink",
            }}
            className="radio-btn"
          ></small>
        </div>
      </label>
    </div>
  );
}
