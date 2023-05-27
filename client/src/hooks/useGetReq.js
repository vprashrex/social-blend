import axios from "axios";
import { useEffect, useState } from "react";

export function useGetReq(url, params) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();

  useEffect(() => {
    (async () => {
      await axios
        .get(process.env.REACT_APP_API_HOST_NAME + url, {
          params,
          withCredentials: true,
        })
        .then((res) => setUserData(res.data))
        .catch((err) => setError(err.response.data.message))
        .finally(() => setLoading(false));
    })();
  }, [
    params.username,
    params.platform,
    params.niches,
    params.makeReq,
    params.uid,
    params.influencerUid,
    params.brandUid,
    params.id,
  ]);

  return { userData, error, loading };
}
