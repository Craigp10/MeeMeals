import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./App.css";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  console.log("User Authenticated", authenticated);
  return (
    <Router>
      <div className="app">
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
      </div>
    </Router>
  );
};
export default App;
