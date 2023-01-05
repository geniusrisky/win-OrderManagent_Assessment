import mongoose from "mongoose";



const TeamSchema = new mongoose.Schema({
    
    name:{type:String },
    isDeleted:{type:Boolean, default:false}
 }
);

TeamSchema.set("timestamps", true);

TeamSchema.statics.build = (attrs) => {
    return new Team(attrs);
};

const Team = mongoose.model(
    "Team",
    TeamSchema
);

export { Team };