import React from "react";
import { Component } from "react";
import axios from "axios";

const REGEX = {
  defaultFormat: /^[a-zA-Z0-9.-\/@\s]+$/,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
};
const ERROR_MESSAGE = {
  defaultFormat:
    "Oups, something was wrong. Try to use only characters such: letters and numbers",
  dateOfBirth: "Oups, it looks like the format does not match: DD/MM/YEAR",
  email: "The email provided does not match the standart format",
  emailConfirmed: "Oups, it seems you have not retype your email correctly.",
  password:
    "Your password must be at least 8 characters with: one capital letter, one number and no specifics symboles",
  passwordConfirmed:
    "Oups, it seems you have not retype your password correctly"
};

// Logic: We store the details into the state area only if the test regex pass. Then, when the user click to the button "login", we check if are filled. That means they are ready to be sent to the server.

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      quote: "",
      isEmailValid: true,
      isPasswordValid: true,
      errMessage: "",
      status: false
    };
  }
  checkEntry = event => {
    var typeEntry = event.target.getAttribute("name");
    let entry = event.target.value;
    if (entry.length > 0) {
      switch (typeEntry) {
        case "email":
          var isValid = REGEX.email.test(entry);
          if (isValid) {
            this.setState({
              email: entry,
              isEmailValid: true
            });
          } else {
            this.setState({
              isEmailValid: false,
              quote: ""
            });
          }
          break;
        case "password":
          var isValid = REGEX.password.test(entry);
          if (isValid) {
            this.setState({
              password: entry,
              isPasswordValid: true
            });
          } else {
            this.setState({
              isPasswordValid: false,
              quote: ""
            });
          }
          break;
      }
    }
  };
  deleteErrorMessage = event => {
    var typeEntry = event.target.getAttribute("name");
    let entry = event.target.value;
    if (entry.length > 0)
      switch (typeEntry) {
        case "email":
          var isValid = REGEX.email.test(entry);
          this.setState({
            isEmailValid: true
          });
          break;
        case "password":
          this.setState({
            isPasswordValid: true
          });
          break;
      }
  };
  matchAccount = async event => {
    const account = {
      email: this.state.email,
      password: this.state.password
    };
    //Note: when get we use req.query that we need to parse. when Post we can use body.
    //Here I mixed .then with async which doesn't seem to respect the syntax that async provides. Consider login.route.js /add as a better version.
    try {
      if (account.email.length > 0 && account.password.length > 0) {
        this.props.handleOnPending();
        const sendDatas = axios
          .get("/.netlify/functions/server/login/find", {
            params: {
              account
            }
          })
          .then(response => {
            this.props.handleOnPending();
            if (response.data.success) {
              this.setState({
                status: true,
                quote: response.data.quote
              });
            } else {
              this.setState({
                status: false,
                quote: "Your details are not correct"
              });
            }
          });
      } else {
        this.setState({
          status: false,
          quote: "Some fields are missing."
        });
      }
    } catch (error) {
      this.setState({
        quote: "We are facing an issue, please contact us through our email"
      });
      console.log(error);
    }
  };
  render() {
    return (
      <div className="login">
        <div className="form_group">
          <label for="email">Email</label>
          <input
            onBlur={this.checkEntry}
            onFocus={this.deleteErrorMessage}
            type="email"
            className="form_control"
            name="email"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <div className="form_group">
            <label for="password">Password</label>
            <input
              onBlur={this.checkEntry}
              onFocus={this.deleteErrorMessage}
              type="password"
              className="form_control"
              name="password"
              on
              placeholder="Enter your Passowrd"
            />
          </div>
        </div>
        <p
          style={{
            display: !this.state.errMessage && "none",
            position: "absolute"
          }}
        >
          {" "}
        </p>
        <p
          style={{
            display: !this.state.quote && "none"
          }}
          className="quote"
        >
          <h4
            style={{
              display: !this.state.status && "none"
            }}
          >
            {" "}
            Your quote
          </h4>

          {this.state.quote}
        </p>
        <button onClick={this.matchAccount} className="button_login">
          Login
        </button>
      </div>
    );
  }
}

export default Login;
