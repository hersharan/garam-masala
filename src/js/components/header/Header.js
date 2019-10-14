import React from "react";
import { Link } from "react-router-dom";

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      show: true
    };
  }

  handleLogout = () => {
    localStorage.removeItem("token");
  };

  render() {
    return (
      <div className=".cst-nav">
        <nav className="navbar navbar-expand-lg navbar-light ">
          <a className="navbar-brand" href="/profile">
            Username
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ">
              {this.props.links.map((element, index) => {
                return (
                  <li className="nav-item" key={index}>
                    <Link className="nav-link" to={element.route}>
                      {element.navName}
                    </Link>
                  </li>
                );
              })}
              <li className="nav-item ">
                <Link className="nav-link" onClick={this.handleLogout} to="/">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
