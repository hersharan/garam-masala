const mongoose = require('mongoose');
const database = require("../../database");
const Joi = require("@hapi/joi");
const emptyValidator = Joi.string().empty();
const fs = require('fs');
const filesFolder = `./public/files`;

async function deleteProduct(product) {
  const db = await database.connection();
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

  const mongoStatus = await db.collection('products').findOneAndDelete({_id: mongoose.Types.ObjectId(id)}).catch(err => err);

  if (mongoStatus.value === null) {
    return { status: 204, msg: '' };
  }
  else {
    fs.unlink(`${filesFolder}/${mongoStatus.value.image}.${mongoStatus.value.extension}`, function(err) {
      console.log('err', err);
    });
  }

  if (
    mongoStatus !== undefined &&
    Object.prototype.hasOwnProperty.call(mongoStatus, "name") &&
    mongoStatus.name === "MongoError"
  ) {
    return { status: 500, msg: mongoStatus.errmsg };
  }

  return { status: 200, msg: `Product with ${id} has been deleted` };
}

module.exports = deleteProduct;
