import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Axios from "axios";

export default class AddProduct extends React.Component {
  constructor() {
    super();
    this.state = {
      imagePreviewUrl: "",
      file: "",
      formVal: {
        title: "",
        description: "",
        image: "",
        fileName: "",
        extension: ""
      }
    };
  }
  handleRegisterSubmit = values => {
    Axios.post("/api/v1/add-product", values, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(Response => {
        console.log(Response);
      })
      .catch(error => {
        console.log(error);
      });
  };
  handleImage = e => {
    let state = this.state.formVal;
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      state["fileName"] = file.name;
      state["extension"] = file.type;
      state["image"] = reader.result;
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
        formVal: state
      });
    };
    reader.readAsDataURL(file);
  };
  render() {
    const { title, description } = this.state;
    return (
      <React.Fragment>
        <h1 className="display1 text-center mt-4">ADD PRODUCT</h1>
        <div className="wrapper mt-4">
          <div id="formContent" className="w-100">
            <Formik
              initialValues={{ title, description }}
              validate={values => {
                let errors = {};
                if (!values.title) {
                  errors.title = "Required";
                }
                if (!values.description) {
                  errors.description = "Required";
                }
                return errors;
              }}
              onSubmit={values => {
                let state = this.state.formVal;
                state["title"] = values.title;
                state["description"] = values.description;
                this.setState({ formVal: state }, () => {
                  this.handleRegisterSubmit(this.state.formVal);
                  console.log(this.state.formVal);
                  document.getElementById("addProductForm").reset();
                  this.setState({
                    imagePreviewUrl: "",
                    file: "",
                    formVal: {
                      title: "",
                      description: "",
                      image: "",
                      fileName: "",
                      extension: ""
                    }
                  });
                });
              }}
            >
              <Form className="mt-4 mb-4" id="addProductForm">
                <Field
                  type="text"
                  className="mt-3 cst-input"
                  name="title"
                  placeholder="Title"
                />
                <ErrorMessage
                  component="div"
                  name="title"
                  className="error-msg"
                />
                <Field
                  type="text"
                  className="mt-3 cst-input"
                  name="description"
                  placeholder="Description"
                />
                <ErrorMessage
                  component="div"
                  name="description"
                  className="error-msg"
                />
                <input
                  onChange={e => this.handleImage(e)}
                  type="file"
                  className="mt-3 cst-input"
                  name="image"
                  placeholder="image"
                />
                {/* <div className="error-msg">Required</div> */}
                {this.state.imagePreviewUrl === "" ? (
                  <h6 className="mt-3">NO IMAGE UPLOADED</h6>
                ) : (
                  <img
                    className="preview_image_container mt-3"
                    alt="NO PREVIEW AVAILABLE"
                    src={this.state.imagePreviewUrl}
                  />
                )}
                <input
                  type="submit"
                  className="mt-3 cst-button"
                  value="ADD PRODUCT"
                />
              </Form>
            </Formik>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
