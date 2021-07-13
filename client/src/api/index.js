import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
});

export const getAllMeals = () => api.get(`api/meals`);
export const getUserMeals = (payload) => api.post(`user/meals`, payload);

// export const getDatemeals = () => api.post(`/user/calendar/`);

const apis = {
  getAllMeals,
  getUserMeals,
  // getDateMeals,
};

export default apis;
