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
import "./Dashboard.scss";
import apis from "../../api/index";
import { userContext } from "../../App";

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
  // const [user, setUser] = useState<User>({
  //   id:"",
  //   username:"",
  //   email:"",
  // });
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const user = useContext(userContext);

  // useEffect(() => {
  //   //When props change setUser from props
  //   if (props?.user) {
  //     const newUser: User = user
  //     setUser(newUser);
  //   }
  // }, [props]);

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
  console.log("user", user);
  return (
    <div className="dashboard-wrapper">
      {user.id != "" ? (
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
