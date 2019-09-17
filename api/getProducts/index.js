const mongoose = require('mongoose');
const database = require("../../database");
const Joi = require("@hapi/joi");
const emptyValidator = Joi.string().empty();
const filesFolder = `./public/files`;

async function getProducts(product) {
  let mongoStatus = [];
  let productsId = [];
  const db = await database.connection();

  if (product !== undefined && Object.prototype.hasOwnProperty.call(product, "id")) {
    if (product.id.length === 0) {
      return {
        error: {
          status: 400,
          msg: "Id should not be empty"
        }
      };
    }
    else {
      // To handle Single id.
      if (typeof product.id === 'string') {
        productsId.push(product.id);
      }
      // To handle array of ids.
      else if (typeof product.id === 'object') {
        productsId = product.id;
      }
    }
  }

  let data = [];

  if (productsId.length !== 0) {
    const items = productsId.map(function(itm) {
      try {
        return mongoose.Types.ObjectId(itm);
      }
      catch(err) {
        console.log(err);
      };
    });

    data = await db.collection('products').find({_id: {$in: items }}).toArray();
  }
  else {
    data = await db.collection('products').find({}).toArray();
  }

  // Adding Required Details of weight and cost
  if (data.name !== "MongoError" && data.length !== 0) {
    const product = await db.collection('estimate').aggregate([
      { $group : { _id : "$pid",
          details: {
            $push: {
              weigth: "$weight",
              cost: "$cost"
            }
          }
        }
      }
    ]).toArray();

    function getDetails(id) {
      const item = product.filter((itm) => String(itm._id) === String(id));
      if (item.length !== 0) {
        return item[0].details;
      }
    }

    mongoStatus = data.map((item) => {
      return ({
        id: item._id,
        title: item.title,
        description: item.description ? item.description : '',
        image: item.image ? `/files/${item.image}.${item.extension}` : '',
        details: getDetails(item._id)
      })
    })
  }
  else {
    return { status: 204, msg: '' };
  }

  if (
    mongoStatus !== undefined &&
    Object.prototype.hasOwnProperty.call(mongoStatus, "name") &&
    mongoStatus.name === "MongoError"
  ) {
    return { status: 500, msg: mongoStatus.errmsg };
  }

  if (mongoStatus.length === 0) {
    return { status: 204 };
  }
  else {
    return { status: 200, msg: mongoStatus };
  }
}

module.exports = getProducts;
