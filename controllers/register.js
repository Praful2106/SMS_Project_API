const regiModel = require("../models/register");
const courseModel = require("../models/courses")
const jwt = require("jsonwebtoken");
const mailer = require("../sms/email")
const crypto = require('crypto');


exports.registered = async (req, res) => {
    try {
        let registerEmp = req.body;

        // Input validation
        if (!registerEmp.fullName) return res.status(400).send({ message: "Please provide full name!" });
        if (!registerEmp.email) return res.status(400).send({ message: "Please provide email!" });

        // Check if employee already exists
        let isEmpExist = await regiModel.find({ $or: [{ email: registerEmp.email }, { fullName: registerEmp.fullName }] });
        if (isEmpExist.length > 0) return res.status(400).send({ message: "Employee full name or email already exist!" });

        // Generate random password
        const passwordLength = 10;
        const randomPassword = generatePassword(passwordLength);
        registerEmp.password = randomPassword; // Assign the generated password to the employee

        // Save the employee to the database
        let createdEmp = await regiModel.create(registerEmp);
        if (!createdEmp) return res.status(400).send({ message: "Something went wrong!" });

        // Send email with the generated password
        let mailSend = mailer.sendEmail(
            registerEmp.email,
            "Welcome to Gets! Your Password",
            `Dear ${registerEmp.fullName},\n\nYour account has been created successfully.\nYour login password is: ${randomPassword}\n\nPlease login and change your password for security reasons.\n\nThank you, Gets Team`
        );
        console.log("Mail sent:", registerEmp.email);

        return res.status(201).send({ message: "Employee created successfully and mail sent.", createdEmp });
    }
    catch (error) {
        console.error("Error in register API:", error);
        return res.status(500).send({ message: "Internal server error!" });
    }
}
exports.loginEmp = async (req, res) => {
    try {
        let { email, password } = req.body;
        console.log(email, password)
        if (!email) return res.status(400).send({ message: "email id required!" })
        if (!password) return res.status(400).send({ message: "password is required!" })
        let isEmailExist = await regiModel.findOne({ email: email });

        if (!isEmailExist) return res.status(400).send({ message: "User with this email does not exist!" })
        if (isEmailExist.password !== password) return res.status(400).send({ message: "Invalid Password!" })
        console.log(email, password, isEmailExist.password !== password)

        const token = jwt.sign({ id: isEmailExist._id, fullName: isEmailExist.fullName, email: isEmailExist.email }, "myjwtsecret", { expiresIn: "5hr" })

        return res.status(200).send({ message: "login success.", token })
    }
    catch (error) {
        return res.status(500).send({ message: "Internal server error!" })
    }
}

exports.getStudents = async (req, res) => {
    try {
        let students = await regiModel.find();
        if (!students) {
            return res.status(400).send({ message: "Unable to load data!" })
        }
        let courseName = await courseModel.find();
        console.log('course',courseName);
        console.log('student',students);
        const updatedStudents = updateCourseNames(students, courseName);
        if (students.length === 0) {
            return res.status(200).send({ message: "No data found!", students })
        }
        return res.status(200).send(updatedStudents)
    }
    catch (error) {
        console.error("Error fetching students:", error);
        return res.status(500).send({ message: "Internal server error!" })
    }
}

const updateCourseNames = (students, courses) => {
    return students.map(student => {
      if (student.courses.length > 0) {
        let last = student.courses.map(course => {
          const courseDetails = courses.find(c => console.log('course',c._id,course.courseName));
          if (courseDetails) {
            return {
              ...course,
              courseName: courseDetails.courseName // Update the courseName with actual name
            };
          }
          return course;
        });
      }
      return student;
    });
  };
exports.studentById = async (req, res) => {
    try {
        const { studId } = req.params;
        const studentOne = await regiModel.findById(studId);
        if (!studentOne) return res.status(400).send({ message: "No data found" })
        return res.status(200).send(studentOne)
    }
    catch (error) {
        console.error("Error fetching oneStudents:", error);

        return res.status(500).send({ message: "Internal server error!" })
    }
}



function generatePassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const password = Array(length)
        .fill('')
        .map(() => charset[crypto.randomInt(0, charset.length)])
        .join('');
    return password;
}