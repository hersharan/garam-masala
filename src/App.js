import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./css/index.css";

const login = lazy(() =>
  import(/*webpackChunkName: "Login"*/ "./js/components/login/Login")
);

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="spinner-border spinner" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            }
          >
            <Switch>
              <Route exact path="/" component={login} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}
