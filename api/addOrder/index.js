const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const emptyValidator = Joi.empty();
const OrdersSchema = require("../../models/orders");

/**
 * Check for password, email and username properties in user object.
 *
 * @param {object} productInfo
 *
 * @returns error if exist else null.
 */
function handleExistenceFields(productInfo) {
  if (
    !Object.prototype.hasOwnProperty.call(productInfo, "pid") ||
    !Object.prototype.hasOwnProperty.call(productInfo, "wid")
  ) {
    return {
      error: {
        status: 400,
        msg: "ProductId and WeightId are mandatory"
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
  const { pid, wid } = productInfo;

  if (
    emptyValidator.validate(pid).error !== null ||
    emptyValidator.validate(wid).error !== null
  ) {
    return {
      error: {
        status: 400,
        msg: "ProductId and WeightId should not be empty"
      }
    };
  }

  return null;
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

  return null;
}

async function addProduct(productInfo, user) {
  const product = {
    pid: mongoose.Types.ObjectId(productInfo.pid),
    wid: mongoose.Types.ObjectId(productInfo.wid),
    quantity: productInfo.quantity ? productInfo.quantity : 1
  };

  try {
    const data = await OrdersSchema.findOneAndUpdate(
      { uid: user.uid._id },
      { $addToSet: { items: product }, status: 0 },
      { upsert: true }
    );

    if (data !== null) {
      return {
        error: {
          status: 201,
          msg: 'Product has been added'
        }
      }; 
    }
  }
  catch (err) {
    return {
      error: {
        status: 500,
        msg: err.toString()
      }
    };
  }
}

async function addOrder(info, user) {
  let result = await validation(info);

  if (result === null) {
    result = await addProduct(info, user);
  }

  return result;
}

module.exports = addOrder;
