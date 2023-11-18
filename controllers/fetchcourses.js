const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
router.post("/", async function main(req, res) {
  // Function to list all group members
  async function FetchCourses(auth, memberid,designation) {
    const admin = google.admin("directory_v1");
    console.log("Fetching Courses..............");
   const studentCourses = [];

    try {
      const classroom = google.classroom({ version: "v1", auth });
      let payload = {};
      if(designation==="student")payload={"studentId":memberid};
      else payload={"teacherId":memberid};
      const courses = await classroom.courses.list(payload);
      if (courses && courses.data && courses.data.courses) {
        for (const course of courses.data.courses) {
          studentCourses.push({
            courseName: course.name,
            section: course.section,
            courseDescription: course.descriptionHeading,
            courseStatus: course.courseState,
            courseId:course.id
          });
        }
      } else {
        console.log("No courses found for the user");
      }
    } catch (err) {
      console.log("failed to fetch classroom details");
    }
    return studentCourses;
  }
  function convertToOAuth2Client(data) {
    // Function to convert token from client into OAuth2Client token
    const oAuth2Client = new OAuth2Client();
    oAuth2Client.credentials = data.credentials;
    oAuth2Client._clientId = data._clientId;
    oAuth2Client._clientSecret = data._clientSecret;
    oAuth2Client.redirectUri = data.redirectUri;
    return oAuth2Client;
  }
  const {token, memberid,designation} = req.body;
  const parsedToken = JSON.parse(token);
  const oAuth2ClientInstance = convertToOAuth2Client(parsedToken);
  FetchCourses(oAuth2ClientInstance, memberid,designation)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching groupWiseData");
    });
});
module.exports = router;
