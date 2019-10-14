import React from "react";

export default class ShopListing extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row product">
          <div className="col-sm-3">
            <div className="card">
              <img src="" className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Title 1</h4>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="card">
              <img src="" className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Title 2</h4>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="card">
              <img src="" className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Title 3</h4>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="card">
              <img src="" className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title">Title 4</h4>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
