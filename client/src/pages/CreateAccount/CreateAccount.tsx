import React, { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import "./CreateAccount.css";
import { Link, useHistory, withRouter } from "react-router-dom";
import apis from "../../api/index";

type PersonalInfo = {
  email: string;
  password: string;
};

const badPasswords: (string | null)[] = ["", null];
const badUsernames: (string | null)[] = ["", "demo", null];

const CreateAccount = (props: any) => {
  const history = useHistory();
  const [createSuccess, setcreateSuccess] = useState<Boolean | null>(null);
  let usernameRef = useRef<HTMLInputElement>(null);
  let emailRef = useRef<HTMLInputElement>(null);
  let passwordRef = useRef<HTMLInputElement>(null);

  const createAccountLogin = () => {
    console.log("Create account clicked", passwordRef);
    if (validateCreateAccount()) {
      console.log("Validated!");
      //make api request
    }
  };

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const validateCreateAccount = () => {
    return badPasswords.includes(passwordRef.current.value) ||
      badUsernames.includes(usernameRef.current.value)
      ? false
      : true;
  };

  console.log("ref", usernameRef.current?.value);
  return (
    <div className="create-account-wrapper">
      <div className="create-account__board">
        <div className="create-account__board__content">
          <h3>Create Account</h3>
          <form
            className="create-account__board__content__form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Form.Group
              className="create-account__board__content__form-field"
              controlId="formBasicUsername"
            >
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a username"
                ref={usernameRef}
                autoComplete={"false"}
              />
            </Form.Group>
            <Form.Group
              className="create-account__board__content__form-field"
              controlId="formBasicEmail"
            >
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                ref={emailRef}
              />
            </Form.Group>
            <Form.Group
              className="create-account__board__content__form-field"
              controlId="formBasicPassword"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter A Password"
                ref={passwordRef}
              />
            </Form.Group>
            <hr />
            <div className="create-account__board__content__form-buttons">
              <Button type="submit" id="user-login" name="user" disabled>
                Log In
              </Button>
              <Button
                type="submit"
                id="demo-login"
                name="demo"
                onClick={createAccountLogin}
              >
                Demo Log In
              </Button>
            </div>
          </form>
          <span
            className={
              createSuccess
                ? "create-account__board__content-failed inActive"
                : "create-account__board__content-failed"
            }
          >
            Failed to create account.
          </span>
          <div className="create-account__board__content-recover">
            Already have an account?{" "}
            <Link
              style={{ textDecoration: "none", pointerEvents: "none" }}
              to="/Login"
            >
              Sign in
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(CreateAccount);
