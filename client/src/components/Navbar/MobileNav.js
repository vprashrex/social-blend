import React, { useState } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  return (
    <div className="mobile-nav-links fixed-bottom py-1">
      {currentUser ? (
        <>
          {isOpen ? (
            <>
              {currentUser.type === "Brand" && (
                <>
                  <CustomLink text="List" icon="bi bi-heart fs-4" to="/lists" />
                  <CustomLink
                    text="Billing"
                    icon="bi bi-currency-rupee fs-4"
                    to="/billing"
                  />
                </>
              )}
              {currentUser.type === "Influencer" && (
                <>
                  <CustomLink
                    text="Orders"
                    icon="bi bi-chat-square fs-4"
                    to="/orders"
                  />
                </>
              )}
              <CustomLink text="Account" icon="bi bi-gear fs-4" to="/account" />
            </>
          ) : (
            <>
              {currentUser.type === "Brand" && (
                <>
                  <CustomLink
                    text="Explore"
                    icon="bi bi-search fs-4"
                    to="/influencers/any/all"
                  />
                  <CustomLink
                    text="Orders"
                    icon="bi bi-chat-square fs-4"
                    to="/orders"
                  />
                </>
              )}
              {currentUser.type === "Influencer" && (
                <CustomLink
                  text="Earnings"
                  icon="bi bi-currency-dollar fs-4"
                  to="/earnings"
                />
              )}
              <CustomLink
                text="Profile"
                icon="bi bi-person-circle fs-4"
                to={
                  (currentUser.type === "Influencer" &&
                    currentUser.currentLevel === 11) ||
                  (currentUser.type === "Brand" &&
                    currentUser.currentLevel === 6)
                    ? `/${currentUser.username}`
                    : `/create-page/${currentUser.currentLevel}`
                }
              />
            </>
          )}
          <CustomLink
            text={isOpen ? "Hide" : "More"}
            icon={`${isOpen ? "bi bi-x-lg" : "bi bi-list"} fs-4`}
            to={() => setIsOpen((prev) => !prev)}
          />
        </>
      ) : (
        <>
          <CustomLink
            text="Explore"
            icon="bi bi-search fs-4"
            to="/influencers/explore"
          />
          <CustomLink text="Brand" icon="bi bi-briefcase fs-4" to="/brand" />
          <CustomLink
            text="Influencer"
            icon="bi bi-person-up fs-4"
            to="/creator"
          />
          <CustomLink
            text="Login"
            icon="bi bi-person-circle fs-4"
            to="/login"
          />
        </>
      )}
    </div>
  );
}

const CustomLink = ({ to, text, icon }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return typeof to === "function" ? (
    <Link onClick={to} className="d-flex flex-column gap-1 align-items-center">
      <i className={icon} />
      <span>{text}</span>
    </Link>
  ) : (
    <Link
      to={to}
      className={`d-flex flex-column gap-1 align-items-center ${
        isActive ? "active-link" : ""
      }`}
    >
      <i className={icon} />
      <span>{text}</span>
    </Link>
  );
};
