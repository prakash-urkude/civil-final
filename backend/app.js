const express = require("express");
const jwt = require('jsonwebtoken');
const app = express()

const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')
const fileupload = require("express-fileupload")
const cors = require("cors")
const path = require("path");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
 

if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({path:"backend/config/config.env"});
}
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileupload())
app.use(cors()) 


// Global middleware function
const updateLastSeenTimestamp = async (req, res, next) => {
    const { token } = req.cookies;
    // console.log('token:27', token);

    // Check if token is present
    if (token) {
        try {
            const decodedData = jwt.verify(token, process.env.JWT_SECRET);

            // Update last seen timestamp for the user
          const updatedUserData =  await userModel.findByIdAndUpdate(decodedData.id, { LastSeen: Date.now() }, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });

            // console.log("updatedUserData_41:" ,updatedUserData)
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    }
    // Pass control to the next middleware or route handler
    next();
}; 

// Apply global middleware to all routes
app.use(updateLastSeenTimestamp);

const user = require("./route/userRoute");
const userModel = require("./model/userModel");
app.use('/api/v1' , user)

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

module.exports = app