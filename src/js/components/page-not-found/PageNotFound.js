import React from "react";

export default class PageNotFound extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="text-center jumbotron">
          <h1>404 page not found </h1>
        </div>
        <div className="mt-5 text-center">
          <h3>
            The requested url {this.props.history.location.pathname} was not
            found on the server
          </h3>
        </div>
      </React.Fragment>
    );
  }
}
