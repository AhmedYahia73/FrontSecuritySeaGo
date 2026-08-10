import { useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

export function usePost({ url }) {
  const [response, setResponse] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (body, successMessage) => {
    setLoadingPost(true);
    try {
      const res = await api.post(url, body);
      setResponse(res);
      if (successMessage) {
        toast.success(successMessage);
      }
      return res;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoadingPost(false);
    }
  };

  return { postData, loadingPost, response, error };
}
