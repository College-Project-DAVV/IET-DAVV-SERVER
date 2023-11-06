const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

router.post("/", async function main(req, res) {
  // Function to list all group members
  async function FetchGroups(auth, courseId) {
    const classroom = google.classroom({ version: "v1", auth });
    console.log("Fetching Member Details ..............");
    const Students = [];
      try {
        // const studentsResponse = await classroom.courses.courseWorkMaterials.list({
        //   auth,
        //   courseId: courseId,
        // });
        // console.log(studentsResponse.data);
        // for(const material of studentsResponse.data.courseWorkMaterial){
        //   if(material.title.includes("Attendance")){
        //   for(const m of material.materials){
        //     console.log(m);
        //   }
        // }
        // }
        // const studentsResponse = await classroom.courses.courseWork.list({
        //   auth,
        //   courseId: courseId,
        // });
        const studentsResponse = await classroom.courses.students.list({
          courseId: courseId,
        });
        console.log(studentsResponse.data.students);
        // console.log(studentsResponse.data.courseWork);
        // const students = studentsResponse.data.courseWork;
        

        // if (students && students.length > 0) {
        //   students.forEach((student) => {
        //     if(student.materials[0].driveFile)
        //     console.log(student.materials[0]["driveFile"]["driveFile"]);
        //   });
        // } else {
        //   console.log("No students found in the course.");
        // }
      } catch (error) {
        console.error("Error fetching member details:", error);
        nextPageToken = null; // Stop pagination on error
      }
    return Students;
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
  const { token, courseId } = req.body;
  // Parsing the string into JSON
  //   const parsedToken = JSON.parse(token);
  const parsedToken = token;
  // Converting into OAuth2Client token
  const oAuth2ClientInstance = convertToOAuth2Client(parsedToken);

  // Function to fetch all users of Google Workspace
  FetchGroups(oAuth2ClientInstance, courseId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching groupWiseData");
    });
});

module.exports = router;
