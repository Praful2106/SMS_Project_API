const courseModel = require("../models/courses")
const mongoose = require('mongoose');

exports.createCourse = async (req, res) => {
    try {
        let courseData = req.body;
        if (!courseData.courseName) return res.status(400).send({ message: "Course name required!" })
        if (!courseData.description) return res.status(400).send({ message: "Description name required!" })
        let isCourse = await courseModel.findOne({ courseName: courseData.courseName });
        console.log("isCourse", courseData.courseName, isCourse)
        if (isCourse) return res.status(400).send({ message: "Course name already exist!" })
        let courseAdd = await courseModel.create(courseData);
        if (!courseAdd) return res.status(400).send({ message: "Something went wrong!" })
        return res.status(201).send({ message: "Course created successfuly.", courseAdd })
    }
    catch (error) {
        console.log("create courses error:", error);
        return res.status(500).send({ message: "Internal server error!" })
    }
}

exports.getCourse = async (req, res) => {
    try {
        let getCourse = await courseModel.find();
        if (getCourse.length == 0) return res.status(200).send({ message: "No data found!", getCourse })
        return res.status(200).send(getCourse)
    }
    catch (error) {
        console.log("get courses error:", error);
        return res.status(500).send({ message: "Internal server error!" })
    }
}

exports.updateCourse = async (req, res) => {
    try {
        let { courseId } = req.params;
        let bodyData = req.body;
        if (!courseId) return res.status(400).send({ message: "Course id is required!" });
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).send({ message: "Invalid course id format!" });
        }
        let isCourseId = await courseModel.findById(courseId);
        if (!isCourseId) return res.status(400).send({ message: "Invalid course id!" });

        let isCourse = await courseModel.findOne({ courseName: bodyData.courseName });
        if (isCourse) {
            return res.status(400).send({ message: "Course name already exists!" });
        }
        let updatedCourse = await courseModel.findByIdAndUpdate(courseId, { ...bodyData }, { new: true });
        if (updatedCourse) {
            return res.status(200).send({ message: "Course updated successfully.", updatedCourse });
        } else {
            return res.status(400).send({ message: "Course update failed." });
        }
    }
    catch (error) {
        console.log("update courses error:", error);
        return res.status(500).send({ message: "Internal server error!" });
    }
};
exports.deleteCourse = async (req, res) => {
    try {
        let { courseId } = req.params;

        // Check if courseId is provided
        if (!courseId) return res.status(400).send({ message: "Course id is required!" });

        // Check if courseId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).send({ message: "Invalid course id format!" });
        }

        // Check if the course exists with this courseId
        let isCourseId = await courseModel.findById(courseId);
        if (!isCourseId) return res.status(400).send({ message: "Invalid course id!" });

        // Delete the course by its _id
        let deletedCourse = await courseModel.findByIdAndDelete(courseId);
        if (deletedCourse) {
            return res.status(200).send({ message: "Course deleted successfully", deletedCourse });
        } else {
            return res.status(400).send({ message: "Course deletion failed." });
        }
    }
    catch (error) {
        console.log("delete courses error:", error);
        return res.status(500).send({ message: "Internal server error!" });
    }
};