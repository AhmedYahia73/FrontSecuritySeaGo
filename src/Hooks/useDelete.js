import { useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

export function useDelete() {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async (url, successMessage) => {
    setLoadingDelete(true);
    setIsDeleting(true);
    try {
      await api.delete(url);
      if (successMessage) {
        toast.success(successMessage);
      }
      return true;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || "Failed to delete");
      return false;
    } finally {
      setLoadingDelete(false);
      setIsDeleting(false);
    }
  };

  return { deleteData, loadingDelete, isDeleting, error };
}
