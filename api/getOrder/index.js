const mongoose = require('mongoose');
const OrdersSchema = require("../../models/orders");
const ProductModel = require("../../models/products");
const EstimateModel = require("../../models/estimate");
const filesFolder = `/files`;

async function getOrder(user) {
  try {
    const data = await OrdersSchema.findOne(
      { uid: user.uid._id, status: 0 },
      {_id: 0, items: 1}
    );

    if (data !== null) {
      const products = data.items.map(async (item) => {
        const product =  await ProductModel.findOne({_id: mongoose.Types.ObjectId(item.pid)}, {_id: 0, title: 1, description: 1, image: 1});

        const details = await EstimateModel.findOne({_id: mongoose.Types.ObjectId(item.wid)}, {_id: 0, cost: 1, weight: 1});

        return {
          title: product.title,
          description: product.description,
          image: `${filesFolder}/${product.image}`,
          details: {
            weight: details.weight,
            cost: details.cost,
            quantity: item.quantity,
          }
        };;
      })

      const all = await Promise.all(products);

      return {
        error: {
          status: 200,
          msg: all
        }
      };
    }
    else {
      return {
        error: {
          status: 204
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

async function order(user) {
  const result = await getOrder(user);

  return result;
}

module.exports = order;
