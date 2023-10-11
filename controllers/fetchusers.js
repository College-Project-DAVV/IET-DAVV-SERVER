const express=require('express')
const router=express.Router();
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
router.get('/',async function main(req,res) {
    const SCOPES = ['https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
    ,'https://www.googleapis.com/auth/cloud-platform',
  'https://www.googleapis.com/auth/classroom.courses.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'client.json');
async function loadSavedCredentialsIfExist() {
  try{
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
function determineFieldOfStudy(inputString) {
  const lowercaseInput = inputString.toLowerCase();
  const fieldOfStudyMap = {
    "bcs": "Computer Engineering",
    "bit": "Information Technology",
    "bmc": "Mechenical Engineering",
    "bcb": "Civil Engineering",
    "etc": "Electronics & Telecommunication Engineering",
    "bei": "Electronics & Instrumentation Engineering",
  };
  const branch = lowercaseInput.substring(2,5);
  const year = lowercaseInput.substring(0,2);
  const rollNumber = lowercaseInput.substring(5,8);
  let section = 'A';
  if(rollNumber[0]=='1')section='B';
  // Check if the lowercaseInput is a key in the hashmap
  if (fieldOfStudyMap[branch]) {
    return fieldOfStudyMap[branch] + " Year : "+year+" Roll Number : " +rollNumber.substring(1)+" Section : "+section;
  }
  // Return a default message if neither of branch is found in the input
  return "Field of study not recognized";
}
async function listUsers(auth) {
  const admin = google.admin({version: 'directory_v1', auth});
  //------------>>Fetcing All the users of workspace <<-----------
  const res = await admin.users.list({
    customer: 'C031kwoqw',
  });
  const classroom = google.classroom({ version: 'v1', auth:auth });
  for(x in res.data.users){
    // const  email  = res.data.users[x].primaryEmail
    // const name = res.data.users[x].name.fullName;
    //---------->> user personal & organizational details fetching <<---------
    const userDetails = await admin.users.get({
      auth,
      userKey:res.data.users[x].primaryEmail,
    });
    const { primaryEmail, name, phones, organizations } = userDetails.data;
    for(y in organizations){
      console.log(organizations[y])
    }
    //---------> Classroom details fetching code <<----------------//
    // classroom.courses.list(
    //   {
    //     studentId: res.data.users[x].primaryEmail, 
    //   },
    //   (err, res) => {
    //     if (err) {
    //       console.error('Error listing courses:', err);
    //       return;
    //     }
    //     console.log("Email :" + email + " Name :" +name + " Branch :" + determineFieldOfStudy(email));
    //     const courses = res.data.courses;
    //     if (courses && courses.length > 0) {
    //      console.log('List of courses:');
    //       courses.forEach(course => {
    //       console.log(course.name);
    //       });
    //     } else {
    //     console.log('No courses found.');
    //     }
    //   }
    // );
  }
}
authorize().then((auth)=>{
  listUsers(auth);
}).catch(console.error);
  })
module.exports=router;
//externalIds
//organizations
//https://developers.google.com/admin-sdk/directory/reference/rest/v1/users#User