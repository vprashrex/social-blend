import React from "react";
import img1 from "../../assets/imgs/img1.jpg";
import img2 from "../../assets/imgs/img2.jpg";
import img3 from "../../assets/imgs/img3.jpg";
import Features from "./Features";
import StepWorks from "./StepWorks";

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="container my-5">
      <h3 className="fw-bold">How Collabstr Works</h3>
      <p>Everything you need to run your influencer campaigns, and more.</p>
      <div className="all-steps">
        <StepWorks
          text="Search through thousands of vetted Instagram, TikTok, and YouTube influencers."
          head="Search Influencers"
          step="1"
          img={img1}
        />
        <StepWorks
          text=" Safely purchase through Collabstr. We hold your payment until the  work is completed."
          head="Purchase Securely"
          step="2"
          img={img2}
        />
        <StepWorks
          text="Receive your high quality content from influencers directly through the platform."
          step="3"
          img={img3}
          head="Receive Quality Content"
        />
      </div>
      <div className="my-5 w-100 features-list">
        <Features
          text="Search influencers for free. No subscriptions, contracts."
          icon="currency-dollar"
          head="No Upfront Cost"
        />
        <Features
          text="Every influencer is vetted by us. Always receive high-quality, professional content."
          icon="check-lg"
          head="Vetted Influencers"
        />
        <Features
          text="Instantly chat with influencers and stay in touch throughout the whole transaction."
          icon="chat-fill"
          head="Instant Chat"
        />
        <Features
          text="Your money is held safely until you approve the influencer’s work."
          icon="lock-fill"
          head="Secure Purchases"
        />
      </div>
    </div>
  );
}
