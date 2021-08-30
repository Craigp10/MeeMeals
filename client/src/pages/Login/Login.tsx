import React, { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import "./Login.css";
import { Link, useHistory, withRouter } from "react-router-dom";
import apis from "../../api/index";

const Login = (props: any) => {
  const history = useHistory();
  const [loginSuccess, setLoginSuccess] = useState<boolean>(true);

  let usernameRef = useRef<HTMLInputElement>(null);
  let passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    //When props change
    if (props.authenticated) {
      history.replace({ pathname: "/" });
    }
  }, [props]);

  const userSubmit = async () => {
    //Handle user log in submit
    await apis
      .signinUser({
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      })
      .then((resp) => {
        if (resp.status == 200) {
          console.log("Successful Login!");
          setLoginSuccess(true);
          setTimeout(() => {
            //Setting timeout to give backend time to set up the demo user workflow
            props.setAuthenticated(true);
            props.setUser(resp.data);
            history.replace({ pathname: "/" });
          }, 1000);
        } else {
          //Unable to log in
          console.log("Unsuccessful Login!");
          setLoginSuccess(false);
        }
      });
  };
  const demoSubmit = async () => {
    //Handle user log in submit
    await apis.demoLogin().then((resp) => {
      if (resp.status == 200) {
        console.log("Successful Login!");
        setLoginSuccess(true);
        setTimeout(() => {
          //Setting timeout to give backend time to set up the demo user workflow
          props.setAuthenticated(true);
          props.setUser(resp.data);
          history.replace({ pathname: "/" });
        }, 1000);
      } else {
        //Unable to log in
        console.log("Unsuccessful Login!");
        setLoginSuccess(false);
      }
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login__board">
        <div className="login__board__content">
          <h3>Log In</h3>
          <form
            // ref={(form) => (this.form = form)}
            className="login__board__content__form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Form.Group
              className="login__board__content__form-field"
              controlId="formBasicUsername"
            >
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                ref={usernameRef}
              />
            </Form.Group>
            <Form.Group
              className="login__board__content__form-field"
              controlId="formBasicPassword"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="password"
                ref={passwordRef}
              />
            </Form.Group>
            <hr />
            <div className="login__board__content__form-buttons">
              <Button
                type="submit"
                id="user-login"
                name="user"
                onClick={userSubmit}
              >
                Log In
              </Button>
              <Button
                type="submit"
                id="demo-login"
                name="demo"
                onClick={demoSubmit}
              >
                Demo Log In
              </Button>
            </div>
          </form>
          <span
            className={
              loginSuccess
                ? "login__board__content-failed inActive"
                : "login__board__content-failed"
            }
          >
            Failed to login.
          </span>
          <div className="login__board__content-account-options">
            <p style={{ textDecoration: "line-through" }}>
              Forgot your password?{" "}
              <Link style={{ pointerEvents: "none" }} to="/recover-password">
                Click here
              </Link>
              .
            </p>
            <p>
              Don't have an account?{" "}
              <Link to="/create-account">Create an account</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
