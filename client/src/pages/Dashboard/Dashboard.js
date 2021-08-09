import React, { useState, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import TopBar from "../../components/TopBar/TopBar";
import Home from "../Homepage/Homepage";
import Meals from "../Meals/Meals";
import Calendar from "../Calendar/Calendar";
import NotFound from "../NotFound/NotFound";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import "./Dashboard.css";
import apis from "../../api/index";

const Dashboard = (props) => {
  const [user, setUser] = useState({});
  const history = useHistory();

  useEffect(() => {
    //When props change setUser from props
    if (props?.user) {
      setUser(props.user);
    }
  }, [props]);

  const logout = () => {
    //Logs user out
    apis.logout().then((resp) => {
      console.log(resp);
      props.setAuthenticated(false);
      history.push("/");
    });
  };

  return (
    <div className="dashboard-wrapper">
      {Object.keys(user).length ? (
        <Router>
          <div className="dashboard__content">
            <div className="dashboard__content-topbar">
              <TopBar logout={logout} />
            </div>
            <div className="dashboard__content-navigationbar">
              <NavigationBar />
            </div>
            <div className="dashboard__content-inner">
              <Switch>
                <Route exact path="/" render={() => <Home user={user} />} />
                <Route
                  exact
                  path="/meals"
                  render={() => <Meals user={user} />}
                />
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
      ) : // Could add loading component
      null}
    </div>
  );
};

export default Dashboard;
