import { useState } from "react";
import { usePostReq } from "./usePostReq";

export function useAddData(type) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { execute } = usePostReq(`auth/add-data-${type}`);

  async function addData(data) {
    try {
      setLoading(true);
      await execute(data);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return { addData, loading, error, setError };
}
