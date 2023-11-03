const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

router.post("/", async function main(req, res) {
  // Function to list all users
  async function FetchGroups(auth) {
    const admin = google.admin("directory_v1");
    console.log("Fetching Groupwise Details ..............");
    const groupWiseData = [];

    try {
      const groupsResponse = await admin.groups.list({
        auth: auth,
        customer: "C031kwoqw",
      });

      for (const group of groupsResponse.data.groups) {
        const membersResponse = await admin.members.list({
          auth: auth,
          groupKey: group.id,
        });

        const groupObject = {
          groupName: group,
          members: [],
        };

        for (const member of membersResponse.data.members) {
          const memberDetail = await admin.users.get({
            auth: auth,
            userKey: member.id,
          });

          let userImage = null;
          try {
            const image = await admin.users.photos.get({
              auth: auth,
              userKey: memberDetail.data.id,
            });
                      
            userImage = image.data.photoData;
            
          } catch (err) {
            // Handle the case when the user's photo is not set
          }

          groupObject.members.push({
            email: memberDetail.data.primaryEmail,
            userImage: userImage,
          });
        }

        groupWiseData.push(groupObject);
      }
      return groupWiseData;
    } catch (err) {
      console.log("Unable to fetch groups");
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

  // Destructuring to token from client
  const { token } = req.body;
  // Parsing the string into JSON
  const parsedToken = JSON.parse(token);
  // Converting into OAuth2Client token
  const oAuth2ClientInstance = convertToOAuth2Client(parsedToken);

  // Function to fetch all users of Google Workspace
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
