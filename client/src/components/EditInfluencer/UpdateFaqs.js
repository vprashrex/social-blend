import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAddData } from "../../hooks/useAddData";
import ErrorCon from "../ErrorCon";
import Faq from "../CreatePage/Faq";
import Loading from "../Loading";
import SuccessCon from "../SuccessCon";

export default function UpdateFaqs() {
  const { currentUser } = useAuth();
  const { error, loading, addData, setError } = useAddData(
    currentUser.type.toLowerCase()
  );

  const [faqs, setFaqs] = useState(currentUser.faqs);
  const [faqsLimit, setFaqsLimit] = useState(1);
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
    packages: currentUser.packages,
    faqs,
    username: currentUser.username,
    email: currentUser.email,
    fullName: currentUser.fullName,
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmit(Math.floor(Math.random() * 999999999));
    } catch {
      return setTimeout(() => setError(""), 2000);
    }
  }

  return (
    <>
      <ErrorCon error={error} />
      <SuccessCon success={success} />
      <form onSubmit={handleSubmit} className="mt-5">
        <div>
          <div className="add-packages">
            {faqs &&
              faqs.length > 0 &&
              faqs.map((faq, i) => {
                return (
                  <Faq
                    isLast={i + 1 === faqs.length + faqsLimit}
                    submit={submit}
                    addData={addData}
                    faq={faq}
                    setFaqsLimit={setFaqsLimit}
                    setError={setError}
                    key={faq.id}
                    setFaqs={setFaqs}
                    setSuccess={setSuccess}
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
                  setError={setError}
                  setFaqs={setFaqs}
                  data={data}
                  setSuccess={setSuccess}
                />
              );
            })}
          </div>

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
