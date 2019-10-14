import React from "react";
import { Redirect } from "react-router-dom";

export default function LoggedIn(Component) {
  return class extends React.Component {
    constructor() {
      super();
      this.state = {
        LoggedIn: false
      };
    }

    componentDidMount() {
      if (localStorage.getItem("token")) {
        this.setState({
          LoggedIn: true
        });
      }
    }

    render() {
      return this.state.LoggedIn ? (
        <Redirect to="/dashboard" />
      ) : (
        <Component {...this.props} />
      );
    }
  };
}
