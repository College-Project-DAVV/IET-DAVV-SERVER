const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
router.post("/", async function main(req, res) {
  async function FetchCourseDetails(auth, courseId) {
    const classroom = google.classroom({ version: "v1", auth });
    console.log("Fetching Course Details ..............");
    const courseDetails = { members: [], attendance: [], marks: [],faculty:[]};
    try {
      const courseWorkMaterialsResponse =
        await classroom.courses.courseWorkMaterials.list({
          auth,
          courseId: courseId,
        });
        if(courseWorkMaterialsResponse && courseWorkMaterialsResponse.data && courseWorkMaterialsResponse.data.courseWorkMaterial){
      for (const material of courseWorkMaterialsResponse.data
        .courseWorkMaterial) {
        if (material.title.includes("Attendance")) {
          courseDetails.attendance.push({
            title:
              material.materials[0].driveFile &&
              material.materials[0].driveFile.driveFile.title,
            url:
              material.materials[0].driveFile &&
              material.materials[0].driveFile.driveFile.alternateLink,
          });
        } else if (material.title.includes("Marks")) {
          courseDetails.marks.push({
            title:
              material.materials[0].driveFile &&
              material.materials[0].driveFile.driveFile.title,
            url:
              material.materials[0].driveFile &&
              material.materials[0].driveFile.driveFile.alternateLink,
          });
        }
      }
    }
      const studentsResponse = await classroom.courses.students.list({
        courseId: courseId,
      });
      if(studentsResponse &&studentsResponse.data && studentsResponse.data.students){
        for (const student of studentsResponse.data.students) {
          courseDetails.members.push({ email: student.profile.emailAddress });
        }
      }
      const teacher = await classroom.courses.teachers.list({ courseId: courseId});
      if(teacher && teacher.data){
        courseDetails.faculty.push({"facultyName":teacher.data.teachers[0].profile.name.fullName,"facultyPhoto":teacher.data.teachers[0].profile.photoUrl})
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
    return courseDetails;
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
  const { token, courseId } = req.body;
  const parsedToken = JSON.parse(token);
  const oAuth2ClientInstance = convertToOAuth2Client(parsedToken);
  FetchCourseDetails(oAuth2ClientInstance, courseId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching groupWiseData");
    });
});
module.exports = router;
