import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Faq from "./Faq";
import { useSignUp } from "../../context/SignUpContext";
import SignUpIndicator from "./SignUpIndicator";
import { useAddData } from "../../hooks/useAddData";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";
import { useAuth } from "../../context/AuthContext";

export default function AddFaqs() {
  const { currentLevel, setCurrentLevel, faqs, data, setFaqs } = useSignUp();
  const navigate = useNavigate();

  const [faqsLimit, setFaqsLimit] = useState(1);
  const [submit, setSubmit] = useState("");

  const { currentUser, authStateChange } = useAuth();
  const { addData, loading, error, setError } = useAddData(
    currentUser.type.toLowerCase()
  );

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmit(Math.floor(Math.random() * 999999999));
    } catch {
      return setTimeout(() => setError(""), 2000);
    }

    setCurrentLevel((prev) => prev + 1);
  }

  useEffect(() => {
    if (submit && data.faqs.length === 0) {
      addData(data).then(() => setCurrentLevel((prev) => prev + 1));
      authStateChange();
    }
  }, [submit]);

  useEffect(() => {
    navigate(`/create-page/${currentLevel.toString()}`);
  }, [currentLevel, navigate]);

  return (
    <>
      <ErrorCon error={error} />
      <form onSubmit={handleSubmit} className="width-60-form">
        <SignUpIndicator />
        <div>
          <h3 className="fw-bold">
            Add FAQ's to answer questions about you and your services
          </h3>
          <div
            className="d-flex flex-column gap-3 mt-4"
            style={{ maxHeight: "400px", overflowY: "scroll" }}
          >
            {faqs.length > 0 &&
              faqs.map((faq, i) => {
                return (
                  <Faq
                    isLast={i + 1 === faqs.length + faqsLimit}
                    submit={submit}
                    addData={addData}
                    faq={faq}
                    setFaqsLimit={setFaqsLimit}
                    setError={setError}
                    setCurrentLevel={setCurrentLevel}
                    key={faq.id}
                    setFaqs={setFaqs}
                    data={data}
                  />
                );
              })}
            {new Array(faqsLimit).fill("").map((pg, i) => {
              return (
                <Faq
                  isLast={i + 1 === faqsLimit}
                  key={i}
                  submit={submit}
                  setFaqsLimit={setFaqsLimit}
                  addData={addData}
                  setCurrentLevel={setCurrentLevel}
                  setError={setError}
                  data={data}
                  setFaqs={setFaqs}
                />
              );
            })}
            {faqsLimit < 10 && (
              <div className="text-end my-2 w-100 ">
                <button
                  type="button"
                  onClick={() => setFaqsLimit((prev) => prev + 1)}
                  className="btn"
                >
                  <i className="bi bi-plus" /> Add FAQ
                </button>
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-dark mt-4 py-2 w-100">
            {loading ? <Loading /> : "Continue"}
          </button>
        </div>
        <button type="submit" className="btn text-dark my-2 w-100">
          Skip for now
        </button>
      </form>
    </>
  );
}
