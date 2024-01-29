const express = require("express")
const { registerUser ,loginUser, getAll, getUserDetails, updateUser, deleteUser, updateUserStatus } = require("../controller/userController");
const { isAuthenticatedUser  ,authorizeRoles} = require("../middleware/auth");
const { getAllNotPurchasedUser, sendMailAllNotPurchasedUser, sendMailNotActiveUser } = require("../controller/adminController");
const userModel = require("../model/userModel");
const { createCourse, getAllCourse, getCourse } = require("../controller/courseController");
const { getNotification } = require("../controller/notificationController");
const route = express.Router()


//user
route.route('/register').post(registerUser);
route.route('/login').post(loginUser)
route.route('/getAll').get(getAll)
route.route('/getUserDetails').get(isAuthenticatedUser,getUserDetails)
route.route('/update/:id').put(isAuthenticatedUser ,updateUser)
route.route('/delete').delete(isAuthenticatedUser ,deleteUser)
route.route('/updateUserStatus').put(isAuthenticatedUser , updateUserStatus)

//admin 
route.route("/admin/sendMailAllNotPurchasedUser").post(isAuthenticatedUser, authorizeRoles("admin"),sendMailAllNotPurchasedUser)
route.route("/admin/sendMailNotActiveUser").post(isAuthenticatedUser, authorizeRoles("admin"),sendMailNotActiveUser)

//course
route.route("/admin/createCourse").post(isAuthenticatedUser,authorizeRoles("admin"),createCourse)
route.route("/getAllCourse").get(getAllCourse)
route.route("/getCourse").get(isAuthenticatedUser,getCourse)

//
// Notification
route.route("/getNotification").get(isAuthenticatedUser,getNotification)


module.exports = route