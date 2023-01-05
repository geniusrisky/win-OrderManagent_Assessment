import logger from "../logger/logger.js";
import { Order } from "../Models/Order.entity.js";

import CrudOperations from "../utils/db/mongo.crud.js";
import _ from "lodash";
//import { Types } from "mongoose";

class OrderService {
  /**
   * @method:  Create Order.
   */

  async createOrder(OrderDoc, next) {
    try {
      const similarOrder = await new CrudOperations(Order).getDocument(
        { services: OrderDoc.services, isDeleted: false },
        {}
      );
      if (similarOrder) {
        return next("Order already exists");
      }
      OrderDoc.isDeleted = false;
     
      
      const order = new Order(OrderDoc);
      await new CrudOperations(Order)
        .save(order)
        .then((result) => {
          next(null, result);
        })
        .catch((error) => {
          next(error);
        });
    } catch (err) {
      logger.error("CreateOrders->", err);
      next("Something went wrong");
    }
  }
  
  async updateOrder(id, OrderDoc, next) {
    try {
      const oldOrderDoc = await new CrudOperations(Order).getDocument(
        { _id: id, isDeleted: false  },
        {}
      );

      const updatedOrderDoc = _.extend(oldOrderDoc, OrderDoc);

      await new CrudOperations(Order)
        .save(updatedOrderDoc)
        .then((result) => {
          next(null, result);
        })
        .catch((error) => {
          next(error);
        });
    } catch (err) {
      logger.error("Update Orders->", err);
      next("Something went wrong");
    }
  }

  //   /**
  //    * @method:  Delete Order.
  //    */
  async deleteOrder(id, next) {
    try {
      const order = await new CrudOperations(Order).getDocument(
        { _id: id, isDeleted: false },
        {}
      );
      if (order) {
        order.isDeleted = true;
        const deletedOrder = await new CrudOperations(Order).updateDocument(
          { _id: id },
          order
        );
        next(null, deletedOrder);
      } else {
        next("No Order Found To Delete!");
      }
    } catch (err) {
      logger.error("DeleteOrder->", err);
      next("Something went wrong");
    }
  }

  //   /**
  //    * @method:  Get Order.
  //    */
  async getAllOrders(clauses, projections, options, sort, next) {
    try {
      clauses.isDeleted = false;
      const totalResult = await new CrudOperations(Order).countAllDocuments(
        clauses
      );
      const results = await new CrudOperations(Order).getAllDocuments(
        clauses,
        projections,
        options,
        sort
      );

      const response = { results: results, totalResult: totalResult };
      logger.info(response);
      next(null, response);
    } catch (err) {
      logger.info(err);

      logger.error("GetOrder-> ", err);
      logger.info(err);
      next("Something went wrong");
    }
  }

  async getOrderById(clauses, projections,  next) {
    try {
      clauses.isDeleted = false;
      
      const results = await new CrudOperations(Order).getDocument(
        clauses,
        projections,
       
      );

      const response = { results: results };
      logger.info(response);
      next(null, response);
    } catch (err) {
      logger.info(err);

      logger.error("GetOrder-> ", err);
      logger.info(err);
      next("Something went wrong");
    }
  }
}

export default new OrderService();
