const db = require("../helpers/database.js");

// Modèle pour les commandes
const Order = function (order) {
  this.order_id = order.order_id;
  this.user_id = order.user_id;
  this.artisan_id = order.artisan_id;
  this.total_cost = order.total_cost;
};

/************ Create new Order ***********************/
Order.create = (newOrder, items, result) => {
  db.beginTransaction((err) => {
    if (err) {
      return result({ status: 500, msg: "Transaction failed" });
    }

    // Insérer la commande dans la table `orders`
    const insertOrderQuery = `INSERT INTO orders (user_id, artisan_id, total_cost)
      VALUES (?, ?, ?)`;
    const orderValues = [
      newOrder.user_id,
      newOrder.artisan_id,
      newOrder.total_cost
    ];

    db.query(insertOrderQuery, orderValues, (err, orderResult) => {
      if (err) {
        return db.rollback(() => {
          result({ status: 400, msg: err });
        });
      }

      const orderId = orderResult.insertId;

      // Insérer les éléments de commande dans la table `order_details`
      const insertOrderItemsQuery = `INSERT INTO order_details (order_id, product_id, quantity) VALUES ?`;
      const orderItemsValues = items.map(item => [orderId, item.product_id, item.quantity]);

      db.query(insertOrderItemsQuery, [orderItemsValues], (err, orderItemsResult) => {
        if (err) {
          return db.rollback(() => {
            result({ status: 400, msg: err });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              result({ status: 500, msg: "Transaction commit failed" });
            });
          }

          result(null, { status: 201, data: orderItemsResult, msg: "Order added with success!" });
        });
      });
    });
  });
};



/************ Get all Orders ***********************/
Order.getAllOrders = (result) => {
  const selectQuery = `SELECT * FROM orders`;

  db.query(selectQuery, (err, res) => {
    if (err) {
      result({ status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "No orders found!" });
      } else {
        result(null, { status: 200, msg: "Get all orders with success!", data: res });
      }
    }
  });
};

/************ Get Order by ID ***********************/
Order.getOrderById = (order_id, result) => {
  const selectQuery = `SELECT * FROM orders WHERE order_id = ?`;
  const values = [order_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result(err, { status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "Order not found!" });
      } else {
        result(null, { status: 200, msg: "Get order with success!", data: res[0] });
      }
    }
  });
};

/************ Obtenir toutes les commandes par user ID et order by artisan ID ***********************/
Order.getAllOrdersByUserIdOrderByArtisanId = (user_id, artisan_id, result) => {
  const selectQuery = `SELECT * FROM orders WHERE user_id = ? ORDER BY artisan_id = ?`;
  const values = [user_id, artisan_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result(err, { status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "1 No orders found for the given user ID and artisan ID!" });
      } else {
        result(null, { status: 200, msg: "Get orders with success!", data: res });
      }
    }
  });
};

/************ Obtenir la commande par user ID et artisan ID ***********************/
Order.getOrdersByUserIdAndArtisanId = (user_id, artisan_id, result) => {
  const selectQuery = `SELECT * FROM orders WHERE user_id = ? AND artisan_id = ?`;
  const values = [user_id, artisan_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result(err, { status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "2 No orders found for the given user ID and artisan ID!" });
      } else {
        result(null, { status: 200, msg: "Get orders with success!", data: res });
      }
    }
  });
};

/************ Get Order Details by ID ***********************/
Order.getOrderDetailsById = (order_id, result) => {
  const selectQuery = `SELECT * FROM order_details WHERE order_id = ?`;
  const values = [order_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result(err, { status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "Order details not found!" });
      } else {
        result(null, { status: 200, msg: "Get order details with success!", data: res });
      }
    }
  });
};

/************ Update Order ***********************/
Order.updateOrder = (order_id, updatedData, result) => {
  const updateQuery = `UPDATE orders SET ? WHERE order_id = ?`;
  const values = [updatedData, order_id];

  db.query(updateQuery, values, (err, res) => {
    if (err) {
      result({ status: 400, msg: err });
    } else {
      if (res.affectedRows === 0) {
        result(null, { status: 404, msg: `Order with ID ${order_id} not found` });
      } else {
        result(null, { status: 200, msg: `Order with ID ${order_id} updated successfully` });
      }
    }
  });
};

/************ Delete Order ***********************/
Order.deleteOrder = (order_id, result) => {
  const deleteQuery = `DELETE FROM orders WHERE order_id = ?`;
  const values = [order_id];

  db.query(deleteQuery, values, (err, res) => {
    if (err) {
      result({ status: 400, msg: err });
    } else {
      if (res.affectedRows === 0) {
        result(null, { status: 404, msg: `Order with ID ${order_id} not found` });
      } else {
        result(null, { status: 200, msg: `Order with ID ${order_id} deleted successfully` });
      }
    }
  });
};

module.exports = Order;
