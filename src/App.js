import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./css/index.css";
import isLoggedIn from "./js/hoc/isLoggedIn";
import LoggedIn from "./js/hoc/LoggedIn";

//Api address : 192.168.2.148:3000

const Login = lazy(() =>
  import(/*webpackChunkName: "Login"*/ "./js/components/login/Login")
);

const Register = lazy(() =>
  import(/*webpackChunkName: "Register"*/ "./js/components/register/Register")
);

const AddProduct = lazy(() =>
  import(
    /*webpackChunkName: "AddProduct"*/ "./js/components/add-product/AddProduct"
  )
);

const Dashboard = lazy(() =>
  import(
    /*webpackChunkName: "AddProduct"*/ "./js/components/dashboard/Dashboard"
  )
);

const ShopListing = lazy(() =>
  import(
    /*webpackChunkName: "ShopListing"*/ "./js/components/shop-listing/ShopListing"
  )
);

const PageNotFound = lazy(() =>
  import(
    /*webpackChunkName: "PageNotFound"*/ "./js/components/page-not-found/PageNotFound"
  )
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
              <Route exact path="/" component={LoggedIn(Login)} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/add-product" component={AddProduct} />
              <Route
                exact
                path="/dashboard"
                component={isLoggedIn(Dashboard)}
              />
              <Route exact path="/shop-listing" component={ShopListing} />
              <Route component={PageNotFound} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}
