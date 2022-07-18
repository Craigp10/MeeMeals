import axios from "axios";

axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: "http://localhost:3000/api", //   "/api" on aws
});

export const getAllMeals = () => api.get("/meals/getAll");
export const getUserMeals = (payload:any) => api.post(`/user/meals`, payload);
export const getDateMeals = (payload:any) =>
  api.post("/calendar/getDateMeals", payload);
export const saveCalendarChanges = (payload:any) =>
  api.post("/calendar/changes", payload);
export const pullCalendarWeek = (payload:any) =>
  api.post("/calendar/schedule", payload);
export const createNewMeal = (payload:any) => api.post("/user/newMeal", payload);
export const deleteMeal = (payload:any) => api.post("/user/deleteMeal", payload);
export const editMeal = (payload:any) => api.post("/user/editMeal", payload);
export const signupNewUser = (payload:any) => api.post("/auth/signup", payload);
export const signinUser = (payload:any) => api.post("/auth/signin", payload);
export const demoLogin = () => api.get("/auth/demoSignup");
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
  signupNewUser,
  signinUser
};

export default apis;
