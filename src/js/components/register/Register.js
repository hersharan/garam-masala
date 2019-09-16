import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

// eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      formVal: {
        salutation: "",
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        username: "",
        role: "",
        address: ""
      }
    };
  }
  render() {
    const {
      salutation,
      firstName,
      lastName,
      email,
      dob,
      username,
      role,
      address
    } = this.state.formVal;
    return (
      <React.Fragment>
        <h1 className="display1 text-center mt-4">REGISTERATION</h1>
        <div className="wrapper mt-4">
          <div id="formContent" className="w-100">
            <Formik
              initialValues={{
                salutation: salutation,
                firstName: firstName,
                lastName: lastName,
                email: email,
                dob: dob,
                username: username,
                role: role,
                address: address
              }}
              validate={values => {
                let errors = {};
                if (!values.salutation) {
                  errors.salutation = "Required";
                }
                if (!values.firstName) {
                  errors.firstName = "Required";
                }
                if (!values.lastName) {
                  errors.lastName = "Required";
                }
                if (!values.email) {
                  errors.email = "Required";
                } else if (emailRegex.test(values.email) === false) {
                  errors.email = "Invalid Email";
                }
                if (!values.dob) {
                  errors.dob = "Required";
                }
                if (!values.username) {
                  errors.username = "Required";
                }
                if (!values.role) {
                  errors.role = "Required";
                }
                if (!values.address) {
                  errors.address = "Required";
                }
                return errors;
              }}
              onSubmit={values => {
                this.setState({
                  formVal: values
                });
                alert(JSON.stringify(values));
              }}
            >
              <Form className="mt-4 mb-4">
                <Field
                  type="text"
                  className="mt-3 cst-input"
                  name="firstName"
                  placeholder="First Name"
                />
                <ErrorMessage
                  component="div"
                  name="firstName"
                  className="error-msg"
                />

                <Field
                  type="text"
                  className="mt-3 cst-input"
                  name="lastName"
                  placeholder="Last Name"
                />
                <ErrorMessage
                  component="div"
                  name="lastName"
                  className="error-msg"
                />

                <Field
                  type="text"
                  className="mt-3 cst-input"
                  name="email"
                  placeholder="E-Mail"
                />
                <ErrorMessage
                  component="div"
                  name="email"
                  className="error-msg"
                />

                <Field
                  type="date"
                  className="mt-3 cst-input"
                  name="dob"
                  placeholder="Date Of Birth"
                />
                <ErrorMessage
                  component="div"
                  name="dob"
                  className="error-msg"
                />

                <Field
                  type="text"
                  className="mt-3 cst-input"
                  name="username"
                  placeholder="Username"
                />
                <ErrorMessage
                  component="div"
                  name="username"
                  className="error-msg"
                />

                <Field
                  type="text"
                  className="mt-3 cst-input"
                  name="role"
                  placeholder="Role"
                />
                <ErrorMessage
                  component="div"
                  name="role"
                  className="error-msg"
                />
                <Field
                  type="text"
                  className="mt-3 cst-input"
                  name="address"
                  placeholder="Address"
                />
                <ErrorMessage
                  component="div"
                  name="address"
                  className="error-msg"
                />
                <label className="font-weight-bold mt-4">You are ?</label>

                <div className="checboxWrapper ">
                  <div className="toggle_radio">
                    <Field
                      type="radio"
                      className="toggle_option"
                      id="first_toggle"
                      name="salutation"
                      value="Mr"
                    />
                    <Field
                      type="radio"
                      className="toggle_option"
                      id="second_toggle"
                      name="salutation"
                      value="Mrs"
                    />
                    <Field
                      type="radio"
                      className="toggle_option"
                      id="third_toggle"
                      name="salutation"
                      value="Miss"
                    />
                    <label htmlFor="first_toggle">
                      <p>Mr</p>
                    </label>
                    <label htmlFor="second_toggle">
                      <p>Mrs</p>
                    </label>
                    <label htmlFor="third_toggle">
                      <p>Miss</p>
                    </label>
                    <div className="toggle_option_slider"></div>
                  </div>
                </div>
                <ErrorMessage
                  component="div"
                  name="salutation"
                  className="error-msg"
                />
                <input
                  type="submit"
                  className="mt-4 cst-button"
                  value="Register"
                />
              </Form>
            </Formik>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
