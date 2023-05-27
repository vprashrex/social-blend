import { nanoid } from "nanoid";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Faq({
  setFaqsLimit,
  submit,
  faq,
  isLast,
  addData,
  setError,
  setCurrentLevel,
  setFaqs,
  data,
  setSuccess,
}) {
  const [focus, setFocus] = useState(false);
  const [userFaq, setUserFaq] = useState({});
  const [question, setQuestion] = useState(faq ? faq.question : "");
  const [answer, setAnswer] = useState(faq ? faq.answer : "");

  const { currentUser, authStateChange } = useAuth();

  useEffect(() => {
    setUserFaq({ question, answer, uid: currentUser.uid, id: nanoid() });
  }, [answer, question, currentUser.uid]);

  useEffect(() => {
    if (submit && Object.keys(userFaq).length > 0) {
      faq && setFaqs((prev) => prev.filter((faq1) => faq1.id !== faq.id));
      faq && (data.faqs = data.faqs.filter((faq1) => faq1.id !== faq.id));
      setFaqs((prev) => [...prev, userFaq]);
      data.faqs = [...data.faqs, userFaq];
      try {
        if (isLast) {
          addData(data).then(() => {
            if (setCurrentLevel) {
              setCurrentLevel((prev) => prev + 1);
              authStateChange();
            } else {
              setSuccess("Profile updated refresh to reflect changes!");
              setTimeout(() => setSuccess(""), 2000);
            }
          });
        }
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
        <h3 className="fw-bold">FAQ</h3>
        <button
          type="button"
          style={{
            border: "none",
            outline: "none",
            backgroundColor: "inherit",
          }}
          onClick={() =>
            faq
              ? setFaqs((prevFaqs) =>
                  prevFaqs.filter((prev) => prev.id !== faq.id)
                )
              : setFaqsLimit((prev) => prev - 1)
          }
        >
          <i className="bi bi-x-lg text-dark" />
        </button>
      </div>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        type="text"
        className="form-control"
        required
        placeholder="E.g. What brands have you worked with?"
      />
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        className="form-control"
        placeholder="I have worked with FashionNova, HiSmile and more."
        rows="5"
        required
      />
    </div>
  );
}
