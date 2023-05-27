import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function usePlatform(platform) {
  const [value, setValue] = useState([]);
  const { allInfluencers } = useAppContext();

  useEffect(() => {
    setValue(
      allInfluencers.filter((user) => {
        return user.packages.some((pack) =>
          pack.handle.toLowerCase().includes(platform.toLowerCase())
        );
      })
    );
  }, [allInfluencers, platform]);

  return value;
}
