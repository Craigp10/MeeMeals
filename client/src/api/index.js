import axios from "axios";

axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getAllMeals = () => api.get("/meals/getAll");
export const getUserMeals = (payload) => api.post(`/user/meals`, payload);
export const getDateMeals = (payload) =>
  api.post("/calendar/getDateMeals", payload);
export const saveCalendarChanges = (payload) =>
  api.post("/calendar/changes", payload);
export const pullCalendarWeek = (payload) =>
  api.post("/calendar/schedule", payload);
export const createNewMeal = (payload) => api.post("/user/newMeal", payload);
export const deleteMeal = (payload) => api.post("/user/deleteMeal", payload);
export const editMeal = (payload) => api.post("/user/editMeal", payload);
export const demoLogin = () => api.post("/auth/demoSignup");
export const checkSession = () => api.get("/auth/checkSession");
export const logout = () => api.get("/auth/logout");

const apis = {
  getAllMeals,
  getUserMeals,
  getDateMeals,
  saveCalendarChanges,
  pullCalendarWeek,
  createNewMeal,
  deleteMeal,
  editMeal,
  demoLogin,
  checkSession,
  logout,
};

export default apis;
