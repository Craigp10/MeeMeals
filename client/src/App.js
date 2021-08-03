import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./App.css";
import apis from "./api/index";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({
    user_id: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(async () => {
    await apis.checkSession().then((resp) => {
      if (resp.data.isAuth) {
        setAuthenticated(true);
        setUser(resp.data.user);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <Router>
      <div className="app">
        {!isLoading ? (
          <Switch>
            <PublicRoute
              path="/login"
              component={Login}
              setAuthenticated={setAuthenticated}
              setUser={setUser}
              authenticated={authenticated}
            />
            <PrivateRoute
              path="/"
              component={Dashboard}
              isAuthenticated={authenticated}
              setAuthenticated={setAuthenticated}
              user={user}
            />
            <Route component={NotFound} />
          </Switch>
        ) : null}
      </div>
    </Router>
  );
};
export default App;
