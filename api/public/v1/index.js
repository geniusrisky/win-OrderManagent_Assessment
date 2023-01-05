import { Router } from "express";
import teamRoutes from "./TeamModule/Team.route.js"
import orderRoutes from "./OrderModule/Order.route.js"

const router = Router();
router.use("/team",teamRoutes);
router.use('/order', orderRoutes)

export default router;

