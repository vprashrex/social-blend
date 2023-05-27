import React, { useContext, useState } from "react";
import { useGetReq } from "../hooks/useGetReq";

const AppProvider = React.createContext();

export function useAppContext() {
  return useContext(AppProvider);
}

export default function AppContext({ children }) {
  const [makeReq, setMakeReq] = useState(0);
  const { error, loading, userData } = useGetReq("lists/get-by-id", {
    makeReq,
  });
  const influencersCategory = [
    {
      id: "1",
      name: "Fashion",
      url: "https://d5ik1gor6xydq.cloudfront.net/websiteImages/creatorMarketplace/categories/fashion.png",
    },
    {
      id: "2",
      name: "Music & dance",
      url: "https://d5ik1gor6xydq.cloudfront.net/websiteImages/creatorMarketplace/categories/music%20&%20dance.png",
    },
    {
      id: "3",
      name: "Beauty",
      url: "https://d5ik1gor6xydq.cloudfront.net/websiteImages/creatorMarketplace/categories/beauty.png",
    },
    {
      id: "4",
      name: "Travel",
      url: "https://d5ik1gor6xydq.cloudfront.net/websiteImages/creatorMarketplace/categories/travel.png",
    },
    {
      id: "5",
      name: "Lifestyle",
      url: "",
    },
    {
      id: "6",
      name: "Health & Fitness",
      url: "",
    },
    {
      id: "7",
      name: "Food & Drink",
      url: "",
    },
    {
      id: "8",
      name: "Model",
      url: "",
    },
    {
      id: "9",
      name: "Comedy & Entertainment",
      url: "",
    },
    {
      id: "10",
      name: "Art & Photography",
      url: "",
    },
    {
      id: "11",
      name: "Enterpreneur & Business",
      url: "",
    },
    {
      id: "12",
      name: "Family & Children",
      url: "",
    },
    {
      id: "13",
      name: "Animals & Pets",
      url: "",
    },
    {
      id: "14",
      name: "Athlete & Sports",
      url: "",
    },
    {
      id: "15",
      name: "Adventure & Outdoors",
      url: "",
    },
    {
      id: "16",
      name: "Education",
      url: "",
    },
    {
      id: "17",
      name: "Celebrity & Public Figure",
      url: "",
    },
    {
      id: "18",
      name: "Actor",
      url: "",
    },
    {
      id: "19",
      name: "Gaming",
      url: "",
    },
  ];

  const influencersPlatform = [
    {
      id: "1",
      name: "any",
    },
    {
      id: "2",
      name: "instagram",
    },
    {
      id: "3",
      name: "user generated content",
    },
    {
      id: "4",
      name: "youtube",
    },
    {
      id: "5",
      name: "twitch",
    },
    {
      id: "6",
      name: "twitter",
    },
  ];

  const value = {
    influencersCategory,
    influencersPlatform,
    error,
    loading,
    userData,
    makeReq,
    setMakeReq,
  };

  return <AppProvider.Provider value={value}>{children}</AppProvider.Provider>;
}
