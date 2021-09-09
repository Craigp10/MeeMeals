import React, { FC, useState, useEffect, useContext } from "react";
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
import "./scss/compiled.scss";
import apis from "../../api/index";
import { userContext } from "../../App";
import { windowSizeContext } from "../../App";
interface User {
  id: string;
  username: string;
  email: string;
}

interface Props {
  user: User;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

const Dashboard = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const history = useHistory();
  const user = useContext(userContext);
  const windowSize = useContext(windowSizeContext);

  const logout = () => {
    //Logs user out
    apis.logout().then((resp) => {
      if (resp.status == 200) {
        props.setAuthenticated(false);
        history.push("/");
      } else {
        console.log("Unable to logout");
      }
    });
  };
  console.log(show);
  return (
    <div className="dashboard-wrapper">
      {user.id != "" ? (
        <Router>
          <div className="dashboard__content">
            <div className="dashboard__content-topbar">
              <TopBar logout={logout} user={user} setShow={setShow} />
            </div>
            <div className="dashboard__content-navigationbar">
              <NavigationBar show={show} setShow={setShow} />
            </div>
            <div className="dashboard__content-inner">
              <Switch>
                <Route
                  exact
                  path="/"
                  // render={() => <Home />}
                  component={Home}
                />
                <Route
                  exact
                  path="/meals"
                  // render={() => <Meals />}
                  component={Meals}
                />
                <Route
                  exact
                  path="/calendar"
                  // render={() => <Calendar />}
                  component={Calendar}
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
