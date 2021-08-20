import React, {FC, useState, useEffect } from "react";
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



interface User {
  id: string,
  username: string,
  email: string,
}

interface Props {
  user: User,
  setAuthenticated: (isAuthenticated:boolean) => void,
}

const Dashboard = (props: Props) => {
  const [user, setUser] = useState<User>({
    id:"",
    username:"",
    email:"",
  });
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  
  useEffect(() => {
    //When props change setUser from props
    if (props?.user) {
      const newUser: User = props.user
      setUser(newUser);
    }
  }, [props]);

  const logout = () => {
    //Logs user out
    apis.logout().then((resp) => {
      if (resp.status == 200){
        props.setAuthenticated(false)
        history.push("/")
      } else {
        console.log("Unable to logout");
      } 
    });
  };
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
