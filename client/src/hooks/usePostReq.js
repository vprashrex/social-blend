import axios from "axios";
import { useState } from "react";

export function usePostReq(url) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function execute(payload = {}) {
    setLoading(true);
    return await axios
      .post(
        process.env.REACT_APP_API_HOST_NAME + url,
        JSON.stringify(payload).includes("formData")
          ? payload.formData
          : payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": JSON.stringify(payload).includes("formData")
              ? "multipart/form-data"
              : "application/json",
          },
        }
      )
      .then((res) => res.data)
      .finally(() => setLoading(false));
  }

  return { execute, error, loading, setError, setLoading };
}
