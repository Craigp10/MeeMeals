import React, { useState, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import TopBar from "../../components/TopBar/TopBar";
import Home from "../Homepage/Homepage";
import Meals from "../Meals/Meals";
import Calendar from "../Calendar/Calendar";
import NotFound from "../NotFound/NotFound";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = (props) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    if (props?.user) {
      setUser(props.user);
    }
  }, [props]);

  return (
    <div className="dashboard-wrapper">
      <Router>
        <div className="dashboard-content">
          <div className="dashboard-topbar">
            <TopBar />
          </div>
          <div className="dashboard-navigationbar">
            <NavigationBar />
          </div>
          <div className="dashboard-content-inner">
            <Switch>
              <Route exact path="/" render={() => <Home user={user} />} />
              <Route exact path="/meals" render={() => <Meals user={user} />} />
              <Route
                exact
                path="/calendar"
                render={() => <Calendar user={user} />}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default Dashboard;
