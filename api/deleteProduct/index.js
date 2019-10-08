const mongoose = require('mongoose');
const ProductModel = require('../../models/products');
const Joi = require("@hapi/joi");
const emptyValidator = Joi.string().empty();
const fs = require('fs');
const filesFolder = `./public/files`;

function handleProductId(product) {
  const { id } = product;
  if (!Object.prototype.hasOwnProperty.call(product, "id")) {
    return {
      error: { status: 404, msg: "Id is mandatory" }
    };
  }

  if (
    emptyValidator.validate(id).error !== null
  ) {
    return {
      error: {
        status: 400,
        msg: "Id should not be empty"
      }
    };
  }

  return id;
}

async function deleteProduct(product) {
  const id = handleProductId(product);
  try {
    const product = await ProductModel
    .findOneAndDelete({_id: mongoose.Types.ObjectId(id)});
    if (product !== null) {
      fs.unlink(`${filesFolder}/${product.image}`, function(err) {
        console.log('err', err);
      });

      return {
        status: 200,
        msg: 'Product has been deleted'
      };
    }
    else {
      return {
        status: 204,
      };
    }
  }
  catch(err) {
    return {
      error: {
        status: 500,
        msg: err.toString()
      }
    };
  }
}

module.exports = deleteProduct;
