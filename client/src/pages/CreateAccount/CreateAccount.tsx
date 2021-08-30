import React, { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import "./CreateAccount.css";
import { Link, useHistory, withRouter } from "react-router-dom";
import apis from "../../api/index";

type validationError = {
  errorType: number;
  errorMessage: string;
};

const badPasswords: (string | null)[] = ["", null];
const badUsernames: (string | null)[] = ["", "demo", null];
const badEmails: (string | null)[] = ["", "demo@gmail.com", null];

const CreateAccount = (props: any) => {
  const history = useHistory();
  const [createSuccess, setCreateSuccess] = useState<boolean | null>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrorArray, setValidationErrorArray] = useState<
    validationError[]
  >([
    { errorType: 0, errorMessage: "" },
    { errorType: 0, errorMessage: "" },
    { errorType: 0, errorMessage: "" },
  ]);
  const [validationError, setValidationError] = useState<boolean>(false);
  let usernameRef = useRef<HTMLInputElement>(null);
  let emailRef = useRef<HTMLInputElement>(null);
  let passwordRef = useRef<HTMLInputElement>(null);

  const createAccountLogin = async () => {
    console.log("Create account clicked", passwordRef);
    if (validateCreateAccount()) {
      console.log("Validated!");
      //make api request
      await apis
        .signupNewUser({
          password: passwordRef.current.value,
          username: usernameRef.current.value,
          email: emailRef.current.value,
        })
        .then(async (resp) => {
          if (resp.status == 200) {
            await apis
              .signinUser({
                username: usernameRef.current.value,
                password: passwordRef.current.value,
              })
              .then((resp) => {
                if (resp.status == 200) {
                  console.log("Successful Login!");
                  setTimeout(() => {
                    //Setting timeout to give backend time to set up the demo user workflow
                    props.setAuthenticated(true);
                    props.setUser(resp.data);
                    history.replace({ pathname: "/" });
                  }, 500);
                } else {
                  //Unable to log in
                  console.log("Unsuccessful Login!");
                }
              });
          } else {
            console.log("Error creating user", resp);
          }
        })
        .catch((err) => console.log(err));

      setCreateSuccess(false);
    } else {
      setValidationError(false);
    }
  };

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const validateCreateAccount = () => {
    return badPasswords.includes(passwordRef.current.value) ||
      badUsernames.includes(usernameRef.current.value) ||
      badEmails.includes(emailRef.current.value)
      ? false
      : true;
  };

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
              <Button
                type="submit"
                name="createBtn"
                onClick={!isLoading ? createAccountLogin : null}
                disabled={isLoading}
              >
                Create Account!
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
              // style={{ textDecoration: "none", pointerEvents: "none" }}
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
