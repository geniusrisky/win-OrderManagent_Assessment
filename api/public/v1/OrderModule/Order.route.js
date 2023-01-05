import  Router  from "express";
import orderController from "./Order.controller.js";


const router = Router();

router.post('/createOrder', orderController.createOrder)
router.get('/getOrder/:id', orderController.getOrderById)
router.get('/getAllOrders', orderController.getAllOrders)

router.put('/updateOrder/:id', orderController.updateOrder)

router.delete('/deleteOrder/:id', orderController.deleteOrder)

export default router; 