import React from "react";
import { Component } from "react";
import axios from "axios";
import { type } from "os";
import { send } from "q";

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

const SUCCES_SAVE_USER = [
  "Felicitation, you have just joined us !",
  "Felicitation, you have just joined us ! An email will arrive shortly."
];
const ERROR_SAVE_USER = [
  "You have either enter a name or an email that is already registered.",
  "It looks like some fields are missing. Please check for empty field.",
  "The service is actually inoperative. Please, use our web-email to contact us"
];

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileName: "",
      profileEmail: "",
      profileConfirmEmail: "",
      profilePassword: "",
      profileConfirmPassword: "",
      profileQuote: "",
      isNameValid: true,
      isEmailValid: true,
      isConfirmEmailValid: true,
      isPasswordValid: true,
      isConfirmPasswordValid: true,
      isTextValid: true,
      mailSelected: false,
      messGeneral: "",
      isUserAddToDataBase: false,
      isMailSent: false,
      success: true
    };
  }
  isOptionMail = event => {
    this.setState({
      mailSelected: !this.state.mailSelected
    });
  };
  checkEntry = event => {
    var typeEntry = event.target.getAttribute("name");
    let entry = event.target.value;
    if (entry.length > 0) {
      switch (typeEntry) {
        case "name":
          var isValid = REGEX.defaultFormat.test(entry);
          this.setState({
            profileName: entry,
            isNameValid: isValid
          });
          break;
        case "email":
          var isValid = REGEX.email.test(entry);
          this.setState({
            profileEmail: entry,
            isEmailValid: isValid
          });
          break;
        case "confirm_email":
          var isValid = entry == this.state.profileEmail ? true : false;
          this.setState({
            isConfirmEmailValid: isValid
          });
          break;
        case "password":
          var isValid = REGEX.password.test(entry);
          this.setState({
            profilePassword: entry,
            isPasswordValid: isValid
          });
          break;
        case "confirm_password":
          var isValid = entry == this.state.profilePassword ? true : false;
          this.setState({
            isConfirmPasswordValid: isValid
          });
          break;
        case "text":
          var isValid = REGEX.defaultFormat.test(entry);
          this.setState({
            profileQuote: entry,
            isTextValid: isValid
          });
      }
    }
  };
  deleteErrorMessage = event => {
    var typeEntry = event.target.getAttribute("name");
    let entry = event.target.value;
    if (entry.length > 0)
      switch (typeEntry) {
        case "name":
          this.setState({
            isNameValid: true
          });
          break;
        case "email":
          var isValid = REGEX.email.test(entry);
          this.setState({
            isEmailValid: true
          });
          break;
        case "confirm_email":
          this.setState({
            isConfirmEmailValid: true
          });
          break;
        case "password":
          this.setState({
            isPasswordValid: true
          });
          break;
        case "confirm_password":
          this.setState({
            isConfirmPasswordValid: true
          });
        case "text":
          this.setState({
            isTextValid: true
          });
          break;
      }
    this.setState({
      messGeneral: ""
    });
  };
  handleCreateAccount = async event => {
    event.preventDefault();
    const account = {
      name: this.state.profileName,
      email: this.state.profileEmail,
      password: this.state.profilePassword,
      quote: this.state.profileQuote
    };
    try {
      if ((account.name, account.email, account.password, account.quote)) {
        console.log("fired");
        this.props.handleOnPending();
        const sendDatas = await axios.post(
          "http://localhost:5000/.netlify/functions/server/login/add",
          {
            account,
            isMailSelected: this.state.mailSelected
          }
        );
        if (sendDatas.data.isItSaved) {
          this.setState({
            messGeneral: SUCCES_SAVE_USER[0],
            success: true
          });
          this.props.handleOnPending();
          if (this.state.mailSelected) this.sendMailToUser();
        } else if (!sendDatas.data.success) {
          this.setState({
            messGeneral: ERROR_SAVE_USER[0]
          });
          this.props.handleOnPending();
        } else {
          this.setState({
            messGeneral: ERROR_SAVE_USER[2]
          });
          this.props.handleOnPending();
        }
      } else {
        this.setState({
          messGeneral: ERROR_SAVE_USER[1]
        });
      }
    } catch (err) {
      {
        this.setState({
          messGeneral: ERROR_SAVE_USER[2]
        });
        console.log(err);
        this.props.handleOnPending();
      }
    }
  };

  sendMailToUser = async () => {
    const account = {
      name: this.state.profileName,
      email: this.state.profileEmail,
      password: this.state.profilePassword
    };
    try {
      const sendDatas = await axios.post(
        "/.netlify/functions/server/login/sendmail",
        {
          account
        }
      );
      console.log(sendDatas);
      if (sendDatas.data) {
        this.setState({
          isMailSent: true
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <>
        <form className="form" method="post" action="#">
          <div className="content_group">
            <div className="form_group">
              <label for="name">Name</label>
              <input
                type="text"
                className="form_control"
                onBlur={this.checkEntry}
                onFocus={this.deleteErrorMessage}
                name="name"
                placeholder="Enter your Name"
                required
              />
            </div>
            <p
              className={"error_message"}
              style={{
                display: this.state.isNameValid && "none"
              }}
            >
              {" "}
              {ERROR_MESSAGE.defaultFormat}
            </p>
          </div>
          <div className="content_group">
            <div className="form_group">
              <label for="email">Your Email</label>
              <input
                onBlur={this.checkEntry}
                onFocus={this.deleteErrorMessage}
                type="email"
                className="form_control"
                name="email"
                placeholder="Enter your Email"
                required
              />
            </div>
            <p
              style={{
                display: this.state.isEmailValid && "none"
              }}
              className={"error_message"}
            >
              {" "}
              {ERROR_MESSAGE.email}
            </p>
          </div>
          <div className="content_group">
            <div className="form_group">
              <label for="confirm_email">Confirm email</label>
              <input
                onBlur={this.checkEntry}
                onFocus={this.deleteErrorMessage}
                type="email"
                className="form_control"
                name="confirm_email"
                placeholder="confirm email"
                required
              />
            </div>
            <p
              style={{
                display: this.state.isConfirmEmailValid && "none"
              }}
              className={"error_message"}
            >
              {" "}
              {ERROR_MESSAGE.emailConfirmed}
            </p>
          </div>
          <div className="content_group">
            <div className="form_group">
              <label for="password">Password</label>
              <input
                onBlur={this.checkEntry}
                onFocus={this.deleteErrorMessage}
                type="password"
                className="form_control"
                name="password"
                placeholder="Enter your Password"
                required
              />
            </div>
            <p
              style={{
                display: this.state.isPasswordValid && "none"
              }}
              className={"error_message"}
            >
              {" "}
              {ERROR_MESSAGE.password}
            </p>
          </div>
          <div className="content_group">
            <div className="form_group">
              <label for="confirm">Confirm Password</label>
              <input
                onBlur={this.checkEntry}
                onFocus={this.deleteErrorMessage}
                type="password"
                className="form_control"
                name="confirm_password"
                placeholder="Confirm your Password"
                required
              />
            </div>
            <p
              style={{
                display: this.state.isConfirmPasswordValid && "none"
              }}
              className={"error_message"}
            >
              {" "}
              {ERROR_MESSAGE.passwordConfirmed}
            </p>
          </div>
          <div className="content_group">
            <div className="form_group">
              <label for="text">Write your favorite quote</label>
              <input
                onBlur={this.checkEntry}
                onFocus={this.deleteErrorMessage}
                type="text"
                className="form_control"
                name="text"
                placeholder="Enter your quote"
                style={{ width: "100%", marginRight: "20px" }}
                required
              />
            </div>
            <p
              style={{
                display: this.state.isTextValid && "none"
              }}
              className={"error_message"}
            >
              {" "}
              {ERROR_MESSAGE.defaultFormat}
            </p>
          </div>
          <div className="form_group">
            <label for="optionMail">
              Can we send your profil to your mail box? (Working only localy, as
              facing issues with lambda)
            </label>
            <input
              type="checkbox"
              className="form_control"
              onClick={this.isOptionMail}
            />
          </div>
          <div className="content_group">
            <input type="submit" onClick={this.handleCreateAccount} />
          </div>
          <p> {this.state.messGeneral} </p>
        </form>
      </>
    );
  }
}
export default Form;
