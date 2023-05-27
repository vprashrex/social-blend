import React, { useEffect, useState } from "react";
/* import { useAuth } from "../../context/AuthContext";
import { useSignUp } from "../../context/SignUpContext"; */
import { nanoid } from "nanoid";

export default function Package({
  num,
  isFromSecond,
  setPackagesLimit,
  package1,
  submit,
  addData,
  setCurrentLevel,
  isLast,
  setError,
  currentUser,
  data,
  handles,
  setPackages,
  setSuccess,
}) {
  /* const { currentUser } = useAuth(); */

  const [focus, setFocus] = useState(false);
  const [platform, setPlatform] = useState(
    package1 ? package1.platform : "user-generated-content"
  );
  const [heading, setHeading] = useState(package1 ? package1.heading : "");
  const [description, setDescription] = useState(
    package1 ? package1.description : ""
  );
  const [price, setPrice] = useState(package1 ? package1.price : 0);
  const [userPackage, setUserPackage] = useState({});

  /* const { setPackages, data, handles } = useSignUp(); */

  useEffect(() => {
    setUserPackage({
      id: nanoid(),
      platform,
      heading,
      description,
      price,
      uid: currentUser ? currentUser.uid : "",
    });
  }, [platform, heading, description, price, currentUser]);

  useEffect(() => {
    if (submit && Object.keys(userPackage).length > 0) {
      package1 &&
        setPackages((prev) =>
          prev.filter((package12) => package12.id !== package1.id)
        );
      package1 &&
        (data.packages = data.packages.filter(
          (package12) => package12.id !== package1.id
        ));
      setPackages((prev) => [...prev, userPackage]);
      data.packages = [...data.packages, userPackage];
      try {
        isLast &&
          addData(data).then(() =>
            setCurrentLevel
              ? setCurrentLevel(9)
              : setSuccess("Profile updated refresh to reflect changes!")
          );
      } catch (err) {
        setTimeout(() => setError(""), 2000);
      }
    }
  }, [submit]);

  return (
    <div
      className="d-flex flex-column gap-2"
      style={{
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "10px",
        borderLeft: `10px solid ${focus ? "lightblue" : "pink"}`,
      }}
    >
      <div className="d-flex justify-content-between ">
        <strong>Package {num}</strong>
        {isFromSecond && (
          <button
            onClick={() => {
              return package1
                ? setPackages((prevPackage) =>
                    prevPackage.filter((prev) => prev.id !== package1.id)
                  )
                : setPackagesLimit((prev) => prev - 1);
            }}
            type="button"
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "inherit",
            }}
          >
            <i className="bi bi-x-lg text-dark" />
          </button>
        )}
      </div>
      <select
        defaultValue={platform}
        onChange={(e) => setPlatform(e.target.value)}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        className="form-select"
      >
        {handles &&
          handles.map((handle) => {
            return (
              handle.username !== "" && (
                <option value={handle.name} key={handle.name}>
                  {handle.name}
                </option>
              )
            );
          })}
        <option value="user-generated-content">User Generated Content</option>
      </select>
      <input
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
        onBlur={() => setFocus(false)}
        required
        onFocus={() => setFocus(true)}
        type="text"
        className="form-control"
        placeholder="What is this package offering"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => setFocus(false)}
        required
        onFocus={() => setFocus(true)}
        placeholder="What is included in this pacakge? How many posts or photots? What will the buyer be getting?"
        className="form-control"
        rows="5"
      />
      <input
        value={price}
        onChange={(e) => setPrice(+e.target.value)}
        onBlur={() => setFocus(false)}
        required
        type="number"
        onFocus={() => setFocus(true)}
        placeholder="price"
        className="form-control"
      />
      <small
        style={{
          fontSize: "0.8rem",
        }}
        className="ms-auto"
      >
        Our Company takes a 9% fee
      </small>
    </div>
  );
}
