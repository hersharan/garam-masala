import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./css/index.css";

const Login = lazy(() =>
  import(/*webpackChunkName: "Login"*/ "./js/components/login/Login")
);

const Register = lazy(() =>
  import(/*webpackChunkName: "Register"*/ "./js/components/register/Register")
);

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="spinner d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            }
          >
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/register" component={Register} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}
