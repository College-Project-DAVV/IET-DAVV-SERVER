const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const DataFetch = require("./dataRecognization");
router.post("/", async function main(req, res) {
  // Function to list all users
  async function listUsers(auth) {
    const studentDetails = [];
    const admin = google.admin("directory_v1");
    console.log("Fetching Users ..............");
    const response = await admin.users.list(
      {
        auth: auth,
        customer: "C031kwoqw",
      });

        const users = response.data.users;
        console.log("All users fetched successfully");
        if (users.length === 0) {
          console.log("No users found.");
        } else {
          users.forEach((user) => {
            studentDetails.push(user);
          });
        }
        const informedData = DataFetch(studentDetails);
        res.send(informedData);
  }
  function convertToOAuth2Client(data) {
    //Function to convert token from client into OAuth2Client token
    const oAuth2Client = new OAuth2Client();
    oAuth2Client.credentials = data.credentials;
    oAuth2Client._clientId = data._clientId;
    oAuth2Client._clientSecret = data._clientSecret;
    oAuth2Client.redirectUri = data.redirectUri;
    return oAuth2Client;
  }
  //Destructuring to token from client
  const { token } = req.body;
  //Parsing the string into JSON
  const parsedToken = JSON.parse(token);
  //Converting into OAuth2Client token
  const oAuth2ClientInstance = convertToOAuth2Client(parsedToken);
  //Function to fetch all users of google workspace
  listUsers(oAuth2ClientInstance);
});
module.exports = router;
