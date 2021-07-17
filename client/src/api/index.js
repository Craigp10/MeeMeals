import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
});

export const getAllMeals = () => api.get("/meals/getAll");
export const getUserMeals = (payload) => api.post(`user/meals`, payload);
export const getDateMeals = (payload) =>
  api.post("/calendar/getDateMeals", payload);
export const saveCalendarChanges = (payload) =>
  api.post("/calendar/changes", payload);
export const createNewMeal = (payload) => api.post("user/newMeal", payload);

const apis = {
  getAllMeals,
  getUserMeals,
  getDateMeals,
  saveCalendarChanges,
  createNewMeal,
};

export default apis;
