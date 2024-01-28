const express = require("express");
require('dotenv').config();
const router = express.Router();
const { google } = require("googleapis");
const url = require("url");
const querystring = require("querystring");

router.post("/", function main(req, res) {
  const parsedUrl = url.parse(req.url);
  const queryParameters = querystring.parse(parsedUrl.query);

  function authorize() {
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;

    // Create an OAuth2 client with the client ID and client secret
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    getAccessToken(oAuth2Client)
      .then((token) => {
        oAuth2Client.setCredentials(token);
        res.send(oAuth2Client);
      })
      .catch((err) => {
        console.error("Error retrieving access token", err);
        res.status(500).send("Error retrieving access token");
      });
  }

  function getAccessToken(oAuth2Client) {
    const code = queryParameters.code;

    if (!code) {
      console.log("Code is not present in request");
      return Promise.reject(new Error("Code is not present in request"));
    }

    return new Promise((resolve, reject) => {
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  }

  authorize();
});

module.exports = router;
