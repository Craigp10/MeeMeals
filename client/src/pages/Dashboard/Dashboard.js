import React from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import TopBar from "../../components/TopBar/TopBar";
import Home from "../Homepage/Homepage";
import Meals from "../Meals/Meals";
import Calendar from "../Calendar/Calendar";
import NotFound from "../NotFound/NotFound";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from "react-router-dom";

const Dashboard = () => (
  <div>
    <Router>
      <TopBar />
      <NavigationBar />
      <Switch>
        <Route exact path="/dashboard/" component={Home} />
        <Route exact path="/dashboard/meals" component={Meals} />
        <Route exact path="/dashboard/calendar" component={Calendar} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </div>
);

export default Dashboard;
