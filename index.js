const express = require("express");
const fetchusers = require("./controllers/fetchusers");
const fetchgroups = require("./controllers/fetchgroups")
const groupmembers = require("./controllers/fetchgroupmembers");
const memberdetails = require("./controllers/fetchmemberdetail");
const facultydetails = require("./controllers/fetchfacultydetails");
const authorization = require("./controllers/authorization");
const coursestudents = require("./controllers/fetchclassroomStudents");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON data in the request body
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/fetchuser',fetchusers);
app.use("/authorization", authorization);
app.use("/groups",fetchgroups);
app.use("/groupmembers",groupmembers);
app.use("/memberdetail",memberdetails);
app.use("/facultydetails",facultydetails);
app.use("/coursestudents",coursestudents);
app.listen(3001, () => {
  console.log("App running");
});
