const database = require("../../database");
const Joi = require("@hapi/joi");
const emptyValidator = Joi.empty();
const isBase64 = require("is-base64");
const fs = require('fs');
const ProductSchema = require('./schema');
const filesFolder = './public/files';

async function addProduct(productInfo) {
  const db = await database.connection();
  const { title, description, image, fileName } = productInfo;
  if (!Object.prototype.hasOwnProperty.call(productInfo, "title")) {
    return {
      error: { status: 404, msg: "Title is mandatory" }
    };
  }

  if (
    emptyValidator.validate(title).error !== null ||
    emptyValidator.validate(description).error !== null
  ) {
    return {
      error: {
        status: 400,
        msg: "Title and should not be empty"
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
    const extension = imageExt.split(',')[0].substring(
      imageExt.split(',')[0].lastIndexOf("/") + 1,
      imageExt.split(',')[0].lastIndexOf(";")
    );

    if (extension === 'jpeg' || extension === 'png' || extension === 'jpg') {
      await fs.writeFile(`${filesFolder}/${fileName}`, imageData, 'base64', function(err) {
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

  const product = new ProductSchema({
    title,
    description,
    image: fileName
  })

  const mongoStatus = await product.save().catch(err => err);

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
