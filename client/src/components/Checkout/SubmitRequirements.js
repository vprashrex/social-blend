import React, { useState } from "react";
import { usePostReq } from "../../hooks/usePostReq";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";

export default function SubmitRequirements({ userData, selectedPackage }) {
  const [description, setDescription] = useState("");
  const [require, setRequire] = useState("");
  const [application, setApplication] = useState({
    contentApproval: false,
    physicalProduct: false,
    productPrice: 1,
  });
  const [needs, setNeeds] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const { error, loading, execute, setLoading, setError } = usePostReq(
    "orders/save-requirements"
  );

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const requirements = {
      description,
      require,
      application,
      needs,
      additionalInfo,
    };

    try {
      await execute({
        requirements,
        order: {
          brandUid: currentUser.uid,
          influencerUid: userData.uid,
          packageId: selectedPackage.id,
        },
      });
      return navigate("/orders");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
      setTimeout(() => setError(""), 4000);
    }
    setLoading(false);
  }

  return (
    <>
      <ErrorCon error={error} />
      <div>
        <h3 className="fw-bold">Submit Requirements</h3>
        <span>
          Provide the requirements for {userData.name} to get started on your
          collab.
        </span>
        <form className="d-flex flex-column gap-5 my-4 ">
          <div className="d-flex flex-column gap-3">
            <label className="fw-bold" htmlFor="description">
              Describe the product/service you are promoting
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              className="form-control bg-light w-100"
              placeholder="E.g. We just launched our summer dress collection and want you to promote our sundresses that are 100% handmade"
              rows="4"
              required
            />
          </div>
          <div className="d-flex flex-column gap-3">
            <label className="fw-bold" htmlFor="requirements">
              What are the content requirements?
            </label>
            <textarea
              value={require}
              onChange={(e) => setRequire(e.target.value)}
              id="requirements"
              className="form-control bg-light w-100"
              placeholder="E.g. We would like you to style the dress with different accessories and make the content vibrant and colorful"
              rows="4"
              required
            />
          </div>
          <div className="d-flex flex-column gap-3">
            <label className="fw-bold">Select all that apply</label>
            <div className="d-flex flex-column gap-2">
              <label
                className="border rounded p-3 w-100 d-flex align-items-center gap-3"
                htmlFor="content-approval"
              >
                <input
                  checked={application.contentApproval}
                  onChange={(e) =>
                    setApplication({
                      contentApproval: e.target.checked,
                      physicalProduct: application.physicalProduct,
                      productPrice: application.productPrice,
                    })
                  }
                  type="checkbox"
                  id="content-approval"
                />
                <span>Content approval required before posting?</span>
              </label>
              <label
                className="border rounded p-3 w-100 d-flex align-items-center gap-3"
                htmlFor="physical-product"
              >
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setApplication({
                      contentApproval: application.contentApproval,
                      physicalProduct: e.target.checked,
                      productPrice: application.productPrice,
                    })
                  }
                  checked={application.physicalProduct}
                  id="physical-product"
                />
                <span>Are you shipping a physical product?</span>
              </label>
              {application.physicalProduct && (
                <input
                  value={application.productPrice}
                  onChange={(e) =>
                    setApplication({
                      contentApproval: application.contentApproval,
                      physicalProduct: application.physicalProduct,
                      productPrice: +e.target.value,
                    })
                  }
                  type="number"
                  min={1}
                  placeholder="What is your cost on the product?"
                  className="form-control bg-light py-2"
                />
              )}
            </div>
          </div>
          <div className="d-flex flex-column gap-3">
            <label className="fw-bold" htmlFor="need">
              What do you need from {userData.name} to get started?
            </label>
            <textarea
              id="need"
              className="form-control bg-light w-100"
              placeholder="E.g. Please send us your dress size and color preference"
              rows="4"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              required
            />
          </div>
          <div className="d-flex flex-column gap-3">
            <label className="fw-bold" htmlFor="additional-info">
              Any additional info?
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              id="additional-info"
              className="form-control bg-light w-100"
              placeholder="E.g. All of our clothing is handmade in the United States and comes with a 1-year quality guarantee"
              rows="4"
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-100 btn btn-dark px-5 py-2"
            disabled={loading}
          >
            {loading ? <Loading /> : "Continue"}
          </button>
        </form>
      </div>
    </>
  );
}
