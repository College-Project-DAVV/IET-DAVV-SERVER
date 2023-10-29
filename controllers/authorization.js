const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const url = require("url");
const querystring = require("querystring");
router.post("/", async function main(req, res) {
  const parsedUrl = url.parse(req.url);
  const queryParameters = querystring.parse(parsedUrl.query);
  async function authorize() {
    const CLIENT_ID =
      "891307349200-9khqe8cua5pvifevggim1mg6eg6a1cct.apps.googleusercontent.com";
    const CLIENT_SECRET = "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";
    const REDIRECT_URI = "http://localhost:3000";
    // Create an OAuth2 client with the client ID and client secret
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    getAccessToken(oAuth2Client);
    function getAccessToken(oAuth2Client) {
      const code = queryParameters.code;
      if (!code) console.log("Code is not present in request");
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token"+err);
        // Store the token for future use
        oAuth2Client.setCredentials(token);
        res.send(oAuth2Client);
      });
    }
  }
  authorize();  
});
module.exports = router;