const express = require("express");
const fetchusers = require("./controllers/fetchusers");
const fetchgroups = require("./controllers/fetchgroups")
const groupmembers = require("./controllers/fetchgroupmembers");
const memberdetails = require("./controllers/fetchmemberdetail");
const facultydetails = require("./controllers/fetchfacultydetails");
const authorization = require("./controllers/authorization");
const coursestudents = require("./controllers/fetchclassroomStudents");
const courses = require("./controllers/fetchcourses");
const courseDetail = require('./controllers/fetchCourseDetails');
const googleauthback = require("./controllers/authorizationBackend");
const photo = require('./controllers/fetchUserPhoto')
const bodyParser = require("body-parser");
const cors = require("cors"); 
const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json()); // To parse JSON data in the request body
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use("/",(req,res)=>{
//   res.send("Hello");
// })
app.use('/fetchuser',fetchusers);
app.use("/authorization", authorization);
app.use("/groups",fetchgroups);
app.use("/courses",courses);
app.use("/groupmembers",groupmembers);
app.use("/memberdetail",memberdetails);
app.use("/facultydetails",facultydetails);
app.use("/coursestudents",coursestudents);
app.use("/coursedetails",courseDetail);
app.use("/userphoto",photo);
app.use("/googleauth",googleauthback);
app.listen(3001, () => {
  console.log("App running");
});
