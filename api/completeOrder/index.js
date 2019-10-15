const OrdersSchema = require("../../models/orders");

async function completeOrder(user) {
  try {
    const data = await OrdersSchema.findOneAndUpdate(
      { uid: user.uid._id, status: 0 },
      {status: 1, completedDate: Date.now()}
    );
    if (data !== null) {
      return {
        status: 200,
        msg: data._id
      };
    }
    else {
      return {
        status: 204
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
  const result = await completeOrder(user);

  return result;
}

module.exports = order;
