import  logger from "../../../../logger/logger.js";
import { HttpException, HttpResponse } from "../../../../utils/index.js";
import OrderService from "../../../../services/Order.service.js";
import mongoose from "mongoose";
class OrderController {
    createOrder(request, response, next) {
        try {
            const Order = request.body;
             Order.members = [request?.currentUser?.id] ;
            OrderService.createOrder(Order, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse("CreateOrder", result, "Order Created", null, null, null));
                }
            });
        } catch (err) {
            logger.error("CreateOrderController->", err);
            next(new HttpException(400, "Something went wrong"));
        }
    }

    updateOrder(request, response, next) {
        try {
            const Order = request.body;
            
            const id = request.params.id;
            OrderService.updateOrder(id, Order, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse("UpdateOrder", result, "Order Updated", null, null, null));
                }
            });
        } catch (err) {
            logger.error("UpdateOrderController->", err);
            next(new HttpException(400, "Something went wrong"));
        }
    }
    

    

    
    

    deleteOrder(request, response, next) {
        try {
            const id = request.params.id;
            
            OrderService.deleteOrder(id,(err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse("DeleteOrder", result, "Order Delted", null, null, null));
                }
            });
        } catch (err) {
            logger.error("DeleteOrderController->", err);
            next(new HttpException(400, "Something went wrong"));
        }
    }

    async getAllOrders(request, response, next) {
        try {
           
            
            const query = request.query;
            if(request.params.id){
             query.organization = mongoose.Types.ObjectId(request.params.id);
            }
            const sort = {};
            const projections = {};
            let options = {
                limit: 0,
                pageNo: 0
            };
            // eslint-disable-next-line prefer-const
            let { limit, pageNo, sortBy, orderBy, ...clauses } = query;
            if (query.limit, query.pageNo) {
                options = { limit: parseInt(limit ), pageNo: parseInt(pageNo ) };
                delete clauses.limit; delete clauses.pageNo;
            }
            if (sortBy && orderBy) {
                sort[sortBy ] = orderBy === "desc" ? -1 : 1;
            }
            if (clauses.searchTerm && clauses.searchValue) {
                const searchTerm = {};
                searchTerm[clauses.searchTerm ] = new RegExp(`^${clauses.searchValue}`, "i");
                clauses = { ...clauses, ...searchTerm };
                delete clauses.searchTerm, delete clauses.searchValue;
            }
            
            OrderService.getAllOrders(clauses, projections, options, sort, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse("GetOrder", result.results, "Orders Returned", null, result.totalResult, null));
                }
            });
        } catch (err) {
            logger.error("GetOrdersController->", err);
            next(new HttpException(400, "Something went wrong"));
        }
    }

    


    async getOrderById(request, response, next) {
        try {
           
            
            const query = request.query;
            query._id =mongoose.Types.ObjectId(request.params.id)
            
            const projections = {};
           
            // eslint-disable-next-line prefer-const
            let { limit, pageNo, ...clauses } = query;
           
            if (clauses.searchTerm && clauses.searchValue) {
                const searchTerm = {};
                searchTerm[clauses.searchTerm ] = new RegExp(`^${clauses.searchValue}`, "i");
                clauses = { ...clauses, ...searchTerm };
                delete clauses.searchTerm, delete clauses.searchValue;
            }
            
            OrderService.getOrderById(clauses, projections, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse("GetOrder", result.results, "Order Returned", null, result.totalResult, null));
                }
            });
        } catch (err) {
            logger.error("GetOrdersController->", err);
            next(new HttpException(400, "Something went wrong"));
        }
    }
}

export default new OrderController();