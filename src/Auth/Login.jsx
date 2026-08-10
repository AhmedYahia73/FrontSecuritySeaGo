import api from "../utils/api";

export const loginAuth = async (emailOrUsername, password) => {
  const response = await api.post("/api/security/login", {
    email: emailOrUsername,
    password,
  });
  return response.data;
};
