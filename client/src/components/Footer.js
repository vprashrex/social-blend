import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className=" border-top py-4">
      <div className="container footer-con">
        <div className="footer-one">
          <div className="d-flex flex-column gap-3">
            <h5>Discover</h5>
            <button
              className=" -dark"
              onClick={() => window.location.replace("/#search-influencers")}
            >
              Find Influencers
            </button>
            <button
              className=" -dark"
              onClick={() => window.location.replace("/#search-influencers")}
            >
              Hire Influencers
            </button>
            <button
              className=" -dark"
              onClick={() => window.location.replace("/#search-influencers")}
            >
              Search Influencers
            </button>
            <button
              className=" -dark"
              onClick={() => window.location.replace("/#search-influencers")}
            >
              Buy Content
            </button>
            <button
              className=" -dark"
              onClick={() => window.location.replace("/#search-influencers")}
            >
              Buy Shoutouts
            </button>
            <button
              className=" -dark"
              onClick={() => window.location.replace("/#search-influencers")}
            >
              Top Influencers
            </button>
          </div>
          <div className="d-flex flex-column gap-3">
            <h5>Support</h5>
            <Link className="-dark" to="/contact-us">
              Contact Us
            </Link>
            <button
              onClick={() => window.location.replace("/#search-influencers")}
              className=" -dark"
            >
              How it Works
            </button>
            <Link to="/faq">Frequently Asked Questions</Link>
          </div>
        </div>
        <div className="footer-two pt-5">
          <div className="d-flex gap-3">
            <span>&#169; Company Inc.</span>
            <Link to="/privacy" className="-dark">
              Privacy
            </Link>
            <Link to="/terms" className="-dark">
              Terms
            </Link>
          </div>
          <div className="d-flex gap-3">
            <a
              rel="noreferrer"
              className="fs-6"
              target="_blank"
              href="https://www.instagram.com/"
            >
              <i className="bi bi-instagram text-dark" />
            </a>
            <a
              rel="noreferrer"
              className="fs-6"
              target="_blank"
              href="https://www.youtube.com/"
            >
              <i className="bi bi-youtube text-dark" />
            </a>
            <a
              rel="noreferrer"
              className="fs-6"
              target="_blank"
              href="https://www.twitter.com/"
            >
              <i className="bi bi-twitter text-dark" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
