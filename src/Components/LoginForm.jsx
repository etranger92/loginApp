import React from "react";
import { Component } from "react";
import Form from "./Form";
import Login from "./Login";
import LoadingSpinner from "./LoadingSpinner";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onPending: false
    };
  }
  handleOnPending = () => {
    this.setState({
      onPending: !this.state.onPending
    });
  };
  render() {
    return (
      <>
        <h1 style={{ color: "white" }}> Simple form. </h1>
        <p style={{ color: "white", width: "80vw" }}>
          {" "}
          Firstly, create a profile. Once it has been done, you will be notified
          that you have joined us. You can then enter your details to the login
          form. If your details are correct, your favourite quote will come up.{" "}
        </p>
        {this.state.onPending && <LoadingSpinner />}
        <div
          className={
            "content_form" + " " + (this.state.onPending && "on_pending")
          }
        >
          <Form handleOnPending={this.handleOnPending} />
          <Login handleOnPending={this.handleOnPending} />
        </div>
      </>
    );
  }
}

export default LoginForm;
