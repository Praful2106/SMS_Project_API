const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
courseName:{
    type:String,
    require:true
},
description:{
    type:String,
    require:true
}
})
module.exports=mongoose.model("courses",courseSchema)