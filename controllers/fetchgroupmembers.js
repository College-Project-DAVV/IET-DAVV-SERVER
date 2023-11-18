const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
require('dotenv').config();
router.post("/", async function main(req, res) {
  // Function to list all group members
  const CUSTOMER_ID = process.env.CUSTOMER_ID;
  async function FetchGroups(auth,groupid) {
    const admin = google.admin("directory_v1");
    console.log("Fetching Group Member Details ..............");
    const groupMembers = [];
        try {
            const membersResponse = await admin.members.list({
              auth:auth,
              customer: CUSTOMER_ID,
              groupKey: groupid,
              projection:'full'
            });
            const members = membersResponse.data.members;
            if (members) {
              for (const member of members) {
             groupMembers.push(member);
              }
            } else {
              console.log('No members found in the group.');
            }
          } catch (error) {
            console.error('Error fetching group members:' + error);
          }
      return groupMembers;
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
  const { token,groupid } = req.body;
  // Parsing the string into JSON
  const parsedToken = JSON.parse(token);
//const parsedToken = (token);
  // Converting into OAuth2Client token
  const oAuth2ClientInstance = convertToOAuth2Client(parsedToken);

  // Function to fetch all users of Google Workspace
  FetchGroups(oAuth2ClientInstance,groupid)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching groupWiseData");
    });
});
module.exports = router;
