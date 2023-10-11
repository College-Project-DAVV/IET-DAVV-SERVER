const express = require('express');
const fetchusers=require('./controllers/fetchusers');
const app = express();
app.use('/',fetchusers);
app.listen(3000,()=>{
    console.log("App running");

})