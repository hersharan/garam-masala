const mongoose = require('mongoose');
const Joi = require("@hapi/joi");
const emptyValidator = Joi.empty();
const isBase64 = require("is-base64");
const fs = require('fs');
const ProductModel = require('../../models/products');
const EstimateModel = require('../../models/estimate');
const filesFolder = `./public/files`;
let extension;
let imageFile;

/**
 * Check for password, email and username properties in user object.
 *
 * @param {object} productInfo
 *
 * @returns error if exist else null.
 */
function handleExistenceFields(productInfo) {
  if (
    !Object.prototype.hasOwnProperty.call(productInfo, "title") ||
    !Object.prototype.hasOwnProperty.call(productInfo, "details")
  ) {
    return {
      error: {
        status: 400,
        msg: "Title and details are mandatory"
      }
    };
  }

  return null;
}

/**
 * Check for password, email and username emptiness.
 *
 * @param {object} productInfo
 *
 * @returns error if exist else null.
 */
function handleEmptyFields(productInfo) {
  const { title, description, details } = productInfo;

  if (
    emptyValidator.validate(title).error !== null ||
    emptyValidator.validate(description).error !== null ||
    details.length === 0 ||
    !Array.isArray(details)
  ) {
    return {
      error: {
        status: 400,
        msg: "Title and details should not be empty"
      }
    };
  }

  return null;
}

/**
 * Check for Image field existence and emptiness.
 *
 * @param {object} productInfo
 *
 * @returns error if exist else null.
 */
function handleImageFields(productInfo) {
  if (Object.prototype.hasOwnProperty.call(productInfo, "image")) {
    if (!isBase64(productInfo.image, { mimeRequired: true })) {
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
  }

  return null;
}

/**
 * Add Image.
 *
 * @param {object} productInfo
 *
 * @returns error if exist else null.
 */
async function addImage(productInfo) {
  const { image, fileName } = productInfo;

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
    await fs.writeFile(`${filesFolder}/${imageFile}_${fileName}`, imageData, 'base64', function(err) {
      return {
        error: {
          status: 400,
          msg: err
        }
      }
    });

    return {
      path: `${imageFile}_${fileName}`,
      extension: extension
    }
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

/**
 * Check all validations.
 *
 * @param {object} info
 *
 * @returns error if exist else null.
 */
function validation(info) {
  if (handleExistenceFields(info) !== null) {
    return handleExistenceFields(info);
  }

  if (handleEmptyFields(info) !== null) {
    return handleEmptyFields(info);
  }

  if (handleImageFields(info) !== null) {
    return handleImageFields(info);
  }

  return null;
}

async function handleDetails(details, id) {
  details.forEach(async (item) => {
    if (
      Object.prototype.hasOwnProperty.call(item, 'weight') &&
      Object.prototype.hasOwnProperty.call(item, 'cost')
    ) {
      const variety = new EstimateModel({
        weight: item.weight,
        cost: item.cost,
        pid: id
      });
      try {
        await variety.save();
      }
      catch(err) {
        return {
          error: {
            status: 500,
            msg: err.toString()
          }
        }
      }
    }
  })
}

async function addProduct(productInfo) {
  const { title, description, details } = productInfo;
  const imageFile = await addImage(productInfo);

  if (Object.prototype.hasOwnProperty.call(imageFile, 'error')) {
    return imageFile;
  }

  try {
    const product = new ProductModel({
      title,
      description,
      image: imageFile.path,
      extension: imageFile.extension,
    });

    const productStatus = await product.save();

    if (productStatus !== null) {
      await handleDetails(details, productStatus._id);
    }

    return {
      error: {
        status: 200,
        msg: 'Product has been created'
      }
    }
  }
  catch(err) {
    return {
      error: {
        status: 500,
        msg: err.toString()
      }
    }
  }
}

async function product(info) {
  let result = await validation(info);

  if (result === null) {
    result = await addProduct(info);
  }

  return result;
}

module.exports = product;
