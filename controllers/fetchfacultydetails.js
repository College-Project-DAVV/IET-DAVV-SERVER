const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
router.post("/", async function main(req, res) {
  // Function to list all group members
  async function FetchGroups(auth, memberid, groupid) {
    const admin = google.admin("directory_v1");
    console.log("Fetching Member Details ..............");
    const member = [];
    const studentCourses = [];
    try {
      const memberDetails = await admin.users.get({
        auth: auth,
        userKey: memberid,
        projection: "full",
      });
      if (memberDetails) {
        member.push({
          name: memberDetails.data.name.fullName,
          email: memberDetails.data.primaryEmail,
          phone: memberDetails.data.recoveryPhone,
          personalEmail: memberDetails.data.recoveryEmail,
          gender: memberDetails.data.gender
            ? memberDetails.data.gender.type
            : "Not Set",
        });

        try {
          const classroom = google.classroom({ version: "v1", auth });
          const courses = await classroom.courses.list({ teacherId: memberid });
          if (courses && courses.data && courses.data.courses) {
            for (const course of courses.data.courses) {
              studentCourses.push({
                courseName: course.name,
                section: course.section,
                courseDescription: course.description,
                courseStatus: course.status,
                courseId : course.id
              });
            }
          } else {
            console.log("No courses found for the user." + courses);
          }
        } catch (err) {
          console.log("failed to fetch classroom details" + err);
        }
      } else {
        console.log("No member found for this email.");
      }
    } catch (error) {
      console.error("Error fetching member details" + error);
    }
    return { memberDetails: member, classRoomDetails: studentCourses };
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

  // Destructuring to token from client
  const { token, memberid, groupid } = req.body;
  // Parsing the string into JSON
  //   const parsedToken = JSON.parse(token);
  const parsedToken = token;
  // Converting into OAuth2Client token
  const oAuth2ClientInstance = convertToOAuth2Client(parsedToken);

  // Function to fetch all users of Google Workspace
  FetchGroups(oAuth2ClientInstance, memberid, groupid)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching groupWiseData");
    });
});
module.exports = router;
