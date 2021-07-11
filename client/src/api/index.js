import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const getAllMeals = () => api.get(`/meals`);

// export const getDatemeals = () => api.post(`/user/calendar/`);

const apis = {
  getAllMeals,
  // getDateMeals,
};

export default apis;
