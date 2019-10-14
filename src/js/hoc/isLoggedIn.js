import React from "react";
import { Redirect } from "react-router-dom";

export default function isLoggedIn(Component) {
  return class extends React.Component {
    constructor() {
      super();
      this.state = {
        redirect: false
      };
    }
    componentDidMount() {
      if (!localStorage.getItem("token")) {
        this.setState({
          redirect: true
        });
      } else {

        this.setState({
          redirect: false
        });
      }
    }

    render() {
      return this.state.redirect ? (
        <Redirect to="/" />
      ) : (
        <Component {...this.props} />
      );
    }
  };
}
