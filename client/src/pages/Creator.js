import React from "react";
import Hero from "../components/Creator/Hero";
import FooterHero from "../components/Home/FooterHero";
import HowItWorks from "../components/Home/HowItWorks";

export default function Creator() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FooterHero
        head="Get More Brand Deals"
        text="Join 100,000+ Creators using Collabstr to Get More Brand Deals"
        btnName="Create Page"
        location="#create-influencers"
      />
    </>
  );
}
