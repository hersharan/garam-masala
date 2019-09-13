import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";

// eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      formVal: {
        email: "",
        pass: ""
      }
    };
  }
  render() {
    const { email, pass } = this.state.formVal;
    return (
      <React.Fragment>
        <div className="wrapper">
          <div id="formContent">
            <Formik
              initialValues={{ email: email, pass: pass }}
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

                if (!values.pass) {
                  errors.pass = "Required";
                }
                return errors;
              }}
              onSubmit={values => {
                this.setState({
                  formVal: values
                });
              }}
            >
              <Form className="mt-4">
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
                  name="pass"
                  placeholder="PASSWORD"
                />
                <ErrorMessage
                  component="div"
                  name="pass"
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
              <Link to="#" className="underlineHover">
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
