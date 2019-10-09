const OrdersSchema = require("../../models/orders");

async function getOrder(user) {
  try {
    const data = await OrdersSchema.findOne(
      { uid: user.uid._id },
      {_id: 0, items: 1}
    );

    if (data !== null) {
      return {
        error: {
          status: 200,
          msg: data
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
