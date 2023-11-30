import axios from "axios";
const serverUrl = "http://localhost:8001";

export const postApiHandler = async (endpoint, payload) => {
  try {
    const res = await axios.post(serverUrl + endpoint, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authorization")}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};
export const getApiHandler = async (endpoint) => {
  try {
    const res = await axios.get(serverUrl + endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authorization")}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};
