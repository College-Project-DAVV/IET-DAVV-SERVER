const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
router.post("/", async function main(req, res) {
  async function FetchGroups(auth) {
    const admin = google.admin("directory_v1");
    console.log("Fetching Groups..............");
    const groups = [];
    try {
      const groupsResponse = await admin.groups.list({
        auth: auth,
        customer: "C02bprasl",
      });
      for (const group of groupsResponse.data.groups) {
        groups.push({
          groupEmail: group.email,
          groupName: group.name,
          groupDescription: group.description,
          groupMembersCount: group.directMembersCount,
        });
      }
      return groups;
    } catch (err) {
      console.log("Unable to fetch groups");
      console.log(err);
      return [];
    }
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
  const { token } = req.body;
  const parsedToken = JSON.parse(token);
  const oAuth2ClientInstance = convertToOAuth2Client(parsedToken);
  FetchGroups(oAuth2ClientInstance)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching groupWiseData");
    });
});
module.exports = router;
