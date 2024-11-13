const mongoose=require ("mongoose");


const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    duration: {
        type: String, // Or you can use Number if it's in hours, weeks, etc.
        required: true
    },
    level: {
        type: String, // Could also be Number if you store grades as numbers
        required: false // Assuming grade is optional
    }
});

const registeredSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    courses: [courseSchema]
    });

module.exports=mongoose.model("registeredEmp",registeredSchema)