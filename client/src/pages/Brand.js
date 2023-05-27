import React from "react";
import Hero from "../components/Brand/Hero";
import FooterHero from "../components/Home/FooterHero";
import HowItWorks from "../components/Home/HowItWorks";

export default function Brand() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FooterHero
        location="/brand-signup"
        btnName="Sign Up"
        text="Find influencers, run campaigns, and get unique content for your brand in seconds"
        head="Get Product Photos, Sponsored Posts & Testimonials for your brand"
      />
    </>
  );
}
