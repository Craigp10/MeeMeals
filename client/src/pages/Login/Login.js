import React, { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "./Login.css";
import { Link, useHistory, withRouter } from "react-router-dom";
import apis from "../../api/index";

const Login = (props) => {
  const history = useHistory();

  useEffect(() => {
    if (props.authenticated) {
      history.replace({ pathname: "/" });
    }
  }, [props]);

  const handleSubmit = async () => {
    await apis.demoLogin().then((resp) => {
      if (resp.status == 200) {
        console.log("Successful Login!");
        props.setAuthenticated(true);
        props.setUser(resp.data);
        history.replace({ pathname: "/" });
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
              handleSubmit();
            }}
          >
            <Form.Group
              className="login__board__content__form-field"
              controlId="formBasicEmail"
            >
              <Form.Label>Email address</Form.Label>
              {/* <Form.Control type="email" placeholder="Enter email" /> */}
              <Form.Control
                type="email"
                placeholder="Use Demo Login"
                disabled
              />
            </Form.Group>
            <Form.Group
              className="login__board__content__form-field"
              controlId="formBasicPassword"
            >
              <Form.Label>Password</Form.Label>
              {/* <Form.Control
                  type="password"
                  placeholder="password"
                  ref={(emailAddress) => (this.emailAddress = emailAddress)}
                /> */}
              <Form.Control
                className="login__board__content__form-field"
                type="password"
                placeholder="Use Demo Login"
                // ref={(emailAddress) => (this.emailAddress = emailAddress)}
                disabled
              />
            </Form.Group>
            <hr />
            <div className="login__board__content__form-buttons">
              <Button type="submit" disabled>
                Log In
              </Button>
              <Button type="submit">Demo Log In</Button>
            </div>
          </form>
          <div className="login__board__content-recover">
            Forgot your password?{" "}
            <Link
              style={{ textDecoration: "none", pointerEvents: "none" }}
              to="/recover-password"
            >
              Click here
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
