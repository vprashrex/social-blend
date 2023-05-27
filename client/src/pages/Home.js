import React from "react";
import FeaturedInf from "../components/Home/FeaturedInf";
import Hero from "../components/Home/Hero";
import HowItWorks from "../components/Home/HowItWorks";
import PlatformInf from "../components/Home/PlatformInf";
import CategoryiseInf from "../components/Home/CategoryiseInf";
import FooterHero from "../components/Home/FooterHero";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedInf />
      <PlatformInf platform="Instagram" />
      <PlatformInf platform="Youtube" />
      <CategoryiseInf />
      <HowItWorks />
      <FooterHero
        text="Search Instagram, TikTok, and YouTube influencers"
        head="Find and Hire Influencers"
        btnName="Search Influencers"
        location="#search-influencers"
      />
    </>
  );
}
