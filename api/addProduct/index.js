const mongoose = require('mongoose');
const database = require("../../database");
const Joi = require("@hapi/joi");
const emptyValidator = Joi.empty();
const isBase64 = require("is-base64");
const fs = require('fs');
const {Schema} = require('./schema');
const filesFolder = `./public/files`;
let extension;
let imageFile;

async function addProduct(productInfo) {
  const db = await database.connection();
  const { title, description, image, fileName, details } = productInfo;
  if (!Object.prototype.hasOwnProperty.call(productInfo, "title") ||
    !Object.prototype.hasOwnProperty.call(productInfo, "details")) {
    return {
      error: { status: 400, msg: "Title and details are mandatory" }
    };
  }

  if (
    emptyValidator.validate(title).error !== null ||
    emptyValidator.validate(description).error !== null ||
    details.length === 0
  ) {
    return {
      error: {
        status: 400,
        msg: "Title and details should not be empty"
      }
    };
  }

  // Image Validation
  if (Object.prototype.hasOwnProperty.call(productInfo, "image")) {
    if (!isBase64(image, { mimeRequired: true })) {
      return {
        error: {
          status: 400,
          msg: "Image should be in base64 format and should contain MIME"
        }
      }
    }

    if (!Object.prototype.hasOwnProperty.call(productInfo, "fileName")) {
      return {
        error: {
          status: 400,
          msg: "Requires image file name while uploading image file"
        }
      }
    }

    // Create Direction if not exist
    if (!fs.existsSync(filesFolder)) {
      fs.mkdirSync(filesFolder);
    }

    // Saving Image
    const imageData = image.split(',')[1];
    const imageExt = image.split(',')[0];
    extension = imageExt.split(',')[0].substring(
      imageExt.split(',')[0].lastIndexOf("/") + 1,
      imageExt.split(',')[0].lastIndexOf(";")
    );

    if (extension === 'jpeg' || extension === 'png' || extension === 'jpg') {
      imageFile = mongoose.Types.ObjectId();
      await fs.writeFile(`${filesFolder}/${imageFile}_${fileName}.${extension}`, imageData, 'base64', function(err) {
        return {
          error: {
            status: 400,
            msg: err
          }
        }
      });
    }
    else {
      return {
        error: {
          status: 400,
          msg: 'Image should be of type jpeg/jpg and png only'
        }
      }
    }
  }

  const product = new Schema.Products({
    title,
    description,
    image: `${imageFile}_${fileName}`,
    extension
  });

  const productStatus = await product.save().catch(err => err);
  let mongoStatus;
  if ( productStatus.name !== "MongoError" && details !== undefined && details.length) {
    details.forEach((item) => {
      try {
        const estimate = new Schema.Estimate({
          weight: item.weight,
          cost: item.cost,
          pid: productStatus._id
        });

        mongoStatus = estimate.save().catch(err => err);
      }
      catch(err) {
        console.log(err);
      }
    });
  }
  else {
    return { status: 400, msg: 'details should not be empty' };
  }

  if (
    mongoStatus !== undefined &&
    Object.prototype.hasOwnProperty.call(mongoStatus, "name") &&
    mongoStatus.name === "MongoError"
  ) {
    return { status: 500, msg: mongoStatus.errmsg };
  }

  return { status: 200, msg: "Product has been added" };
}

module.exports = addProduct;
