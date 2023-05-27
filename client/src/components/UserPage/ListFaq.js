import React from "react";

export default function ListFaq({ faq }) {
  return (
    <div className="py-3 border-bottom">
      <button
        className="w-100 btn text-start p-0 fw-bold"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={`#${
          typeof +faq.id[0] === "number"
            ? faq.id.replace(faq.id[0], "rfvbnjuytf")
            : faq.id
        }`}
        aria-expanded="false"
        aria-controls={`${
          typeof +faq.id[0] === "number"
            ? faq.id.replace(faq.id[0], "rfvbnjuytf")
            : faq.id
        }`}
      >
        {faq.question[faq.question.length - 1] === "?"
          ? faq.question
          : `${faq.question} ?`}
      </button>
      <br />
      <div
        className="collapse"
        id={`${
          typeof +faq.id[0] === "number"
            ? faq.id.replace(faq.id[0], "rfvbnjuytf")
            : faq.id
        }`}
      >
        <p className="mt-3 mb-0">{faq.answer}</p>
      </div>
    </div>
  );
}
