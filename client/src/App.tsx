import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import CreateAccount from "./pages/CreateAccount/CreateAccount";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./App.scss";
import apis from "./api/index";

function getWindowDimensions(): windowSize {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions(): windowSize {
  const [windowDimensions, setWindowDimensions] = useState<windowSize>(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize(): void {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface windowSize {
  width: number;
  height: number;
}
export const userContext = createContext<User>({
  id: "",
  username: "",
  email: "",
});
export const windowSizeContext = createContext<windowSize>({
  width: 0,
  height: 0,
});

const App = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    id: "",
    username: "",
    email: "",
  });
  const { height, width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCurrentSession = async () =>
      await apis.checkSession().then((resp) => {
        // console.log(resp.data.user);
        if (resp.data.isAuth) {
          setAuthenticated(true);
          setUser(resp.data.user);
        }
        setIsLoading(false);
      });

    checkCurrentSession();
  }, []);
  console.log("user", user);
  return (
    <Router>
      <div
        className="app"
        // onKeyDown={(e) => {
        //   console.log("keydown", e);
        //   console.log(e.which, e.keyCode, e);
        //   let code = e.which || e.keyCode; //Get key code
        //   if ((e.ctrlKey || e.metaKey) && code == 83) {
        //     e.preventDefault();
        //     return;
        //   }
        // }}
      >
        {!isLoading ? (
          <userContext.Provider value={user}>
            <windowSizeContext.Provider value={{ width, height }}>
              <Switch>
                <PublicRoute
                  path="/login"
                  component={Login}
                  setAuthenticated={setAuthenticated}
                  setUser={setUser}
                  authenticated={authenticated}
                />
                <PublicRoute
                  path="/create-account"
                  component={CreateAccount}
                  setAuthenticated={setAuthenticated}
                  setUser={setUser}
                  authenticated={authenticated}
                />
                <PrivateRoute
                  path="/"
                  component={Dashboard}
                  isAuthenticated={authenticated}
                  setAuthenticated={setAuthenticated}
                />
                <Route component={NotFound} />
              </Switch>
            </windowSizeContext.Provider>
          </userContext.Provider>
        ) : null}
      </div>
    </Router>
  );
};

export default App;
