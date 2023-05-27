import React, { useState } from "react";

export default function SocialButton({ icon, reference, handles }) {
  const [isOpen, setIsOpen] = useState(
    handles.some((handle) => {
      return handle.name.toLowerCase() === icon && handle.username;
    })
  );

  const thisHandle = handles.filter(
    (handle) => handle.name.toLowerCase() === icon
  );

  return isOpen ? (
    <div className="d-flex justify-content-between align-items-center gap-3">
      <input
        ref={reference}
        type="text"
        className="form-control w-100"
        placeholder={`${icon} Username`}
        defaultValue={thisHandle.length > 0 ? thisHandle[0].username : ""}
      />
      <select defaultValue="default" className="form-select">
        <option value="default" disabled hidden>
          {icon} Followers
        </option>
        <option value="0-1k">0-1k</option>
        <option value="1k-10k">1k-10k</option>
        <option value="10k-50k">10k-50k</option>
        <option value="50k-100k">50k-100k</option>
        <option value="100k-500k">100k-500k</option>
        <option value="500k-1m">500k-1m</option>
        <option value="1m-5m">1m-5m</option>
        <option value="5m-10m">5m-10m</option>
        <option value="10m+">10m+</option>
      </select>
    </div>
  ) : (
    <button
      onClick={() => setIsOpen(true)}
      type="button"
      className="border w-100 d-flex gap-2 align-items-center py-3 px-4 btn text-dark"
    >
      <i className={`bi bi-${icon} fs-5 text-dark`} />
      <strong>Add {icon}</strong>
    </button>
  );
}
