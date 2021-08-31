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

interface User {
  id: string;
  username: string;
  email: string;
}
export const userContext = createContext<User>({
  id: "",
  username: "",
  email: "",
});

const App = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    id: "",
    username: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCurrentSession = async () =>
      await apis.checkSession().then((resp) => {
        console.log(resp.data.user);
        if (resp.data.isAuth) {
          setAuthenticated(true);
          setUser(resp.data.user);
        }
        setIsLoading(false);
      });

    checkCurrentSession();
  }, []);

  return (
    <Router>
      <div
        className="app"
        onKeyDown={(e) => {
          var code = e.which || e.keyCode; //Get key code
          if ((e.ctrlKey || e.metaKey) && code == 83) {
            e.preventDefault();
            return;
          }
        }}
      >
        {!isLoading ? (
          <userContext.Provider value={user}>
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
          </userContext.Provider>
        ) : null}
      </div>
    </Router>
  );
};
export default App;
