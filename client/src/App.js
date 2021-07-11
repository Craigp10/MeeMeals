import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./App.css";

const App = (props) => (
  <Router>
    <div className="app">
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute
          // <Route
          path="/"
          component={Dashboard}
          isAuthenticated={true} //props.authenticated
          // redirectTo={"dashboard"}
        />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);
export default App;
