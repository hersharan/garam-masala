const mongoose = require("mongoose");
const ProductModel = require("../../models/products");
const EstimateModel = require("../../models/estimate");
const filesFolder = `/files`;

function handleProductId(product) {
  let productsId = [];
  if (
    product !== undefined &&
    Object.prototype.hasOwnProperty.call(product, "id")
  ) {
    if (product.id.length === 0) {
      return {
        error: {
          status: 400,
          msg: "Id should not be empty"
        }
      };
    } else {
      // To handle Single id.
      if (typeof product.id === "string") {
        productsId.push(product.id);
      }
      // To handle array of ids.
      else if (typeof product.id === "object") {
        productsId = product.id;
      }

      const ids = productsId.map(itm => mongoose.Types.ObjectId(itm));
      return ids;
    }
  }

  return null;
}


async function getDetails(id) {
  return await EstimateModel.aggregate([
    {
      $match: {pid: mongoose.Types.ObjectId(id)}
    },
    { "$project": {
      id: "$_id",
      "weight": 1,
      "cost": 1,
      "_id": 0
    }}
  ]);
}

async function getProducts(product) {
  let pid;
  let products = [];
  pid = handleProductId(product);

  if (pid !== null && Object.prototype.hasOwnProperty.call(pid, "error")) {
    return pid;
  } else {
    if (pid === null) {
      try {
        products = await ProductModel.find(
          {},
          {
            _id: 1,
            title: 1,
            details: 1,
            description: 1,
            image: 1
          }
        ).populate();
      } catch (err) {
        return {
          error: {
            status: 500,
            msg: err.toString()
          }
        };
      }
    } else {
      try {
        products = await ProductModel.find(
          { _id: { $in: pid } },
          { _id: 1, title: 1, description: 1, image: 1 }
        ).populate('details');
      } catch (err) {
        return {
          error: {
            status: 500,
            msg: err.toString()
          }
        };
      }
    }

    if (products.length !== 0) {
      const temp = products.map(async (item) => {
        item.details = await getDetails(item._id);
        item.image = `${filesFolder}/${item.image}`;
        return item;
      });

      const allProducts = await Promise.all(temp);

      return {
        error: {
          status: 200,
          msg: allProducts
        }
      };
    } else {
      return {
        error: {
          status: 204
        }
      };
    }
  }
}

module.exports = getProducts;
