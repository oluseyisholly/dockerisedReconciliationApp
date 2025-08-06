import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

const apiCall = (isFormData = false) => {

    console.log(baseURL)
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  });

  return api;
};

export default apiCall;
