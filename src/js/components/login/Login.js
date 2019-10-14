import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import Axios from "axios";

// eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      formVal: {
        email: "",
        password: ""
      },
      apiError: "",
      apiErrorTrigger: false
    };
  }

  handleLogin = values => {
    Axios.post("/api/v1/login", values, null)
      .then(Response => {
        if (Response.status === 400) {
          this.setState({
            apiError: Response.data,
            apiErrorTrigger: true
          });
        } else if (Response.status === 200) {
          localStorage.setItem("token", Response.data.token);
          this.props.history.push("/dashboard");
          this.setState({
            apiError: "",
            apiErrorTrigger: false
          });
        }
        console.log(Response);
        console.log(Response.data.token);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { email, password } = this.state.formVal;
    return (
      <React.Fragment>
        <div className="wrapper">
          <div id="formContent">
            <Formik
              initialValues={{ email: email, password: password }}
              validate={values => {
                let errors = {};

                if (!values.email) {
                  errors.email = "Required";
                }
                if (!values.email) {
                  errors.email = "Required";
                } else if (emailRegex.test(values.email) === false) {
                  errors.email = "Invalid Email";
                }

                if (!values.password) {
                  errors.password = "Required";
                }
                return errors;
              }}
              onSubmit={values => {
                this.setState({
                  formVal: values
                });
                this.handleLogin(values);
              }}
            >
              <Form className="mt-4">
                {this.state.apiErrorTrigger ? (
                  <div className="mt-3 cst-input error-login">
                    {this.state.apiError}
                  </div>
                ) : null}
                <Field
                  type="text"
                  id="email"
                  className="mt-3 cst-input"
                  name="email"
                  placeholder="E-MAIL"
                />
                <ErrorMessage
                  component="div"
                  name="email"
                  className="error-msg"
                />

                <Field
                  type="password"
                  id="password"
                  className="mt-3 cst-input"
                  name="password"
                  placeholder="PASSWORD"
                />
                <ErrorMessage
                  component="div"
                  name="password"
                  className="error-msg"
                />

                <input
                  type="submit"
                  className="mt-3 cst-button"
                  value="Log In"
                />
              </Form>
            </Formik>
            <div id="formFooter">
              <Link to="/register" className="underlineHover">
                Register
              </Link>
              <Link to="#" className="underlineHover">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
