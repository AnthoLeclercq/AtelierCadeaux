const Order = require("../models/order.model.js");

/************ Create new Order ***********************/
exports.createOrder = (req, res) => {
  const newOrder = {
    user_id: req.params.user_id,
    artisan_id: req.body.artisan_id,
    total_cost: req.body.total_cost
  };

  const items = req.body.items;

  Order.create(newOrder, items, (err, response) => {
    if (err) {
      return res.status(err.status).json({ message: err.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg, status: response.status });
  });
};


/************ Get all Orders ***********************/
exports.getAllOrders = (req, res) => {
  Order.getAllOrders((err, response) => {
    if (err) {
      return res.status(err.status).json({ message: err.msg, status: response.status });
    }
    res.status(response.status).json({ data: response.data, status: response.status });
  });
};

/************ Get Order by ID ***********************/
exports.getOrderById = (req, res) => {
  const order_id = req.params.order_id;
  Order.getOrderById(order_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: err });
    }
    res.status(response.status).json(response.data);
  });
};

/************ Obtenir toutes les commandes par User ID order by artisan ID ***********************/
exports.getAllOrdersByUserIdOrderByArtisanId = (req, res) => {
  const user_id = req.params.user_id;
  const artisan_id = req.body.artisan_id;

  Order.getAllOrdersByUserIdOrderByArtisanId(user_id, artisan_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Obtenir la commande par User ID et artisan ID ***********************/
exports.getOrdersByUserIdAndArtisanId = (req, res) => {
  const user_id = req.params.user_id;
  const artisan_id = req.params.artisan_id;

  Order.getOrdersByUserIdAndArtisanId(user_id, artisan_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Get Order Details by ID ***********************/
exports.getOrderDetailsById = (req, res) => {
  const order_id = req.params.order_id;

  Order.getOrderDetailsById(order_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: err });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Update Order by ID ***********************/
exports.updateOrder = (req, res) => {
  const order_id = req.params.order_id;
  const updatedData = req.body;

  Order.updateOrder(order_id, updatedData, (err, response) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    res.status(response.status).json({ message: response.msg });
  });
};

/************ Delete Order by ID ***********************/
exports.deleteOrder = (req, res) => {
  const order_id = req.params.order_id;

  Order.deleteOrder(order_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: err });
    }
    res.status(response.status).json({ message: response.msg });
  });
};
