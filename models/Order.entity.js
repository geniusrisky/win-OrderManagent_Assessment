import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    dateTime:{type:Date },
    totalFee:{type:Number},
    services:{type:[mongoose.Schema.Types.ObjectId], ref:"Team"},
    isDeleted:{type:Boolean, default:false}
    
}, 


);



OrderSchema.set("timestamps", true);

OrderSchema.statics.build = (attrs) => {
    return new Order(attrs);
};

const Order = mongoose.model(
    "Order",
    OrderSchema
);

export { Order, OrderSchema};
