import axios from "axios";

axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: "http://localhost:8080/api", //   "/api" on aws
});

// Called when the server says the session is gone (e.g. the session cookie
// expired). App registers a handler that logs the user out.
let unauthorizedHandler: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

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
