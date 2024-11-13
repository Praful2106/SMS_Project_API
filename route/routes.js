const register = require("../controllers/register")
const router= require("express").Router()
const mw=require("../middleware/middleware")
const courseController=require("../controllers/courses")
// register & login
router.post("/register",register.registered)
router.post("/login",register.loginEmp)
router.get("/students",mw.isLogin,register.getStudents)
router.get("/student/:studId",mw.isLogin,register.studentById)
// courses
router.post("/createcourse",mw.isLogin,courseController.createCourse);
router.get("/courses",courseController.getCourse);
router.post("/updatecourse/:courseId",mw.isLogin,courseController.updateCourse)
router.delete("/deletecourse/:courseId",mw.isLogin,courseController.deleteCourse)

// mail
// router.post("/mailsend",register.sendMail)
module.exports= router