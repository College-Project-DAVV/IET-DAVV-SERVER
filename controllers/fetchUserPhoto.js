const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
router.post("/", async function main(req, res) {
  function decodeBase64(base64){
    const replace_ = base64.replace(/_/g, '/');
    const replace = replace_.replace(/-/g,'+'); 
    return replace;
  }
  async function FetchUserPhoto(auth,memberid) {
    const admin = google.admin("directory_v1");
    console.log("Fetching photo ..............");
    const userphoto = {"imageUrl":null};
        try {
            const photo = await admin.users.photos.get({
              auth:auth,
              customer: "C02bprasl",
              userKey: memberid,
            });
           userphoto.imageUrl = decodeBase64(photo.data.photoData);
          } catch (error) {
            console.error('Error fetching image:' + error);
          }
      return userphoto;
  }

  function convertToOAuth2Client(data) {
    const oAuth2Client = new OAuth2Client();
    oAuth2Client.credentials = data.credentials;
    oAuth2Client._clientId = data._clientId;
    oAuth2Client._clientSecret = data._clientSecret;
    oAuth2Client.redirectUri = data.redirectUri;
    return oAuth2Client;
  }
  const { token,memberid } = req.body;
const parsedToken = JSON.parse(token);
  const oAuth2ClientInstance = convertToOAuth2Client(parsedToken);
  FetchUserPhoto(oAuth2ClientInstance,memberid)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching groupWiseData");
    });
});
module.exports = router;
