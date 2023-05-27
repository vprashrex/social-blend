import React from "react";
import { usePostReq } from "../../hooks/usePostReq";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../Loading";
import ErrorCon from "../ErrorCon";
import Steps from "./Steps";

export default function PlaceOrder({ userData, selectedPackage, setIsPaid }) {
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const stripe = useStripe();
  const elements = useElements();
  const {
    error: _error,
    loading: _loading,
    execute,
    setError,
    setLoading,
  } = usePostReq("payments/create-intent");
  const { execute: save_execute } = usePostReq("payments/save-intent-id");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (!error) {
        const { clientSecret } = await execute({
          productId: selectedPackage.id,
        });
        const { error: confirmError, paymentIntent } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethod.id,
          });
        if (confirmError) {
          setError(confirmError.message);
          return setTimeout(() => setError(""), 5000);
        }
        await save_execute({
          id: paymentIntent.id,
          clientSecret,
          influencerUid: userData.uid,
          packageId: selectedPackage.id,
        });
        setIsPaid(true);
      } else {
        setError(error.message);
        setIsPaid(false);
        setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      console.log(err);
      setIsPaid(false);
      setError(err.response.data.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ErrorCon error={_error} />
      <h3 className="fw-bold">Place Order</h3>
      <p>
        A hold on your payment method will be placed for 72 hours. You will only
        be charged if {userData.fullName} accepts your request.
      </p>
      <div className="w-100 my-5 checkout-info">
        <form
          onSubmit={handleSubmit}
          className="checkout-form d-flex flex-column gap-2"
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} />
          <small>Secure payments with Stripe</small>
          <div className="d-flex flex-column gap-3 justify-content-center w-100">
            <button
              disabled={_loading}
              className="btn btn-dark w-100 py-2 fw-bold"
            >
              {_loading ? <Loading /> : " Place Order"}
            </button>
            <span className="text-center seprator">or</span>
            <button className="medium-box-shadow btn btn-white w-100 py-2 d-flex justify-content-center gap-2 fw-bold">
              <i className="bi bi-google" />
              <span>Pay</span>
            </button>
          </div>
        </form>
        <div className="checkout-products">
          {selectedPackage && (
            <>
              <div className="d-flex align-items-center gap-2 pb-3">
                <img
                  src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${userData.coverImg}`}
                  alt="coverImg"
                  style={{
                    width: "70px",
                    aspectRatio: "1/1",
                    borderRadius: "10px",
                  }}
                />
                <small className="fw-bold">{selectedPackage.heading}</small>
              </div>
              <div className="border-top py-3 d-flex flex-column gap-2">
                <div className="d-flex justify-content-between gap-2">
                  <small>Subtotal</small>
                  <small>{formatCurrency(selectedPackage.price)}</small>
                </div>
                <div className="d-flex justify-content-between gap-2">
                  <small>Fee</small>
                  <small>
                    {formatCurrency((10 / 100) * selectedPackage.price)}
                  </small>
                </div>
                <div className="d-flex justify-content-between gap-2">
                  <small className="fw-bold">Total</small>
                  <small className="fw-bold">
                    {formatCurrency(
                      selectedPackage.price + (10 / 100) * selectedPackage.price
                    )}
                  </small>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="checkout-steps">
        <Steps
          num="1"
          text="Place Order"
          desc={`Submit the requirements for the collaboration. ${userData.fullName}{" "}
              has 72 hours to accept your request before the hold on your card
              is removed.`}
        />
        <Steps
          num="2"
          text="Chat With Influencer"
          desc={` Chat with ${userData.fullName} and arrange the collaboration. Your
              funds are held securely until they complete the work.`}
        />
        <Steps
          num="3"
          text="Receive Content"
          desc="Receive your content to review and approve. The collaboration is
              complete and payment is released to the influencer."
        />
      </div>
    </>
  );
}
