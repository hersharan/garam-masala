import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      links: [
        {
          route: "/add-product",
          navName: "Add Products"
        }
      ]
    };
  }
  render() {
    return (
      <React.Fragment>
        <Header links={this.state.links} />
        <Footer />
      </React.Fragment>
    );
  }
}
