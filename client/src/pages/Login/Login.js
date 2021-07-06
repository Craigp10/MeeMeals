import React from "react";
import { Form, Button } from "react-bootstrap";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.emailAddress = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    const component = this;
  }

  validate = () => {};

  handleSubmit = () => {
    console.log("submitting");
    this.setState({});
  };

  //handle login form change

  //handle login form submit

  //error handling

  //Possible callback when successfully logged in called
  render() {
    console.log("emailAddress", this.emailAddress);
    console.log("Login App");
    return (
      <div className="login-wrapper">
        <h2> This is the login pages </h2>
        <div className="login-wrapper-inner">
          <h4>Log In</h4>
          <form
            ref={(form) => (this.form = form)}
            className="login-form"
            onSubmit={this.handleSubmit}
          >
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="password"
                ref={(emailAddress) => (this.emailAddress = emailAddress)}
              />
            </Form.Group>
            {/* <input
              type="email"
              name="emailAddress"
              className="form-control"
              placeholder="example@uoduckstore.com"
            />
            </FormGroup>
            <input
              type="password"
              name="password"
              placeholder="password"
              ref={(password) => (this.password = password)}
              className="form-control"
            />
            */}
            <hr />
            {/* <p>
              Forgot your password?{" "}
              <Link to="/recover-password">Click here</Link>.
            </p> */}
            <Button type="submit">Log In</Button>
          </form>
        </div>
      </div>
    );
  }
}
