const express = require("express");
require('dotenv').config();
const router = express.Router();
const { google } = require("googleapis");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI_FACULTY;
router.get("/",(req,res)=>{
console.log("reqqqqq");
const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/admin.directory.group.readonly https://www.googleapis.com/auth/admin.directory.group.member https://www.googleapis.com/auth/admin.directory.group.member.readonly https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/classroom.courseworkmaterials https://www.googleapis.com/auth/classroom.topics.readonly https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.courses&access_type=offline&redirect_uri=${REDIRECT_URI}&response_type=code&client_id=${CLIENT_ID}`;
res.redirect(authorizationUrl);
})
router.get('/redirect', async (req, res) => {
    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      );
      getAccessToken(oAuth2Client);
    function getAccessToken(oAuth2Client) {
        const code = req.query.code;
        if (!code) console.log("Code is not present in request");
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error("Error retrieving access token"+err);
          oAuth2Client.setCredentials(token);

          res.cookie('FetchUserToken',JSON.stringify(oAuth2Client),{
            secure: true,
            httpOnly: true,
            path:"/dashboard",
            maxAge:100000
          });
          res.redirect(process.env.REDIRECT_CLIENT);
        });
      }
    });
module.exports = router;