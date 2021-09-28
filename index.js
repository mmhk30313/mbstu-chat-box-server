const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const port = 4000;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;
// console.log(DB_NAME);
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.hqygs.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("Joti da shuntese shob");  
  res.send(`<style>
    *, 
    *:before, 
    *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
      adding: 0;
    }
    
    body {
    background: #435363;
    -webkit-animation: bg 5s infinite alternate;
    -moz-animation: bg 5s infinite alternate;
    -o-animation: bg 5s infinite alternate;
    animation: bg 5s infinite alternate;
    }
    
    @-webkit-keyframes bg {
    0%   { background: #984D6F; }
    100% { background: #435363; }
    }
    @-moz-keyframes bg {
    0%   { background: #984D6F; }
    100% { background: #435363; }
    }
    @-o-keyframes bg {
    0%   { background: #984D6F; }
    100% { background: #435363; }
    }
    @keyframes bg {
    0%   { background: #984D6F; }
    100% { background: #435363; }
    }
    
    h1 {
    padding-top: 380px;
    font-family: 'Joti One', cursive;
    font-size: 3.5em;
    text-align: center;
    color: #FFF;
    text-shadow: rgba(0,0,0,0.6) 1px 0, rgba(0,0,0,0.6) 1px 0, rgba(0,0,0,0.6) 0 1px, rgba(0,0,0,0.6) 0 1px;
    }
</style>
  <h1 
    style="padding-top: 380px;
    align-items: center;
    height: 90%;
    overflow-y: hidden;
    text-transform: uppercase;
    font-weight: 600;
    font-family: monospace;
    font-size: 30pt;">
   <p>WELCOME TO MBSTU CHATBOX</p>
   <p>To see server api, search by "url/api"</p>
  </h1>`);
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {//   client.close();
    const usersCollection = client.db(process.env.DB_NAME).collection("users");
    console.log("Mongo Connected");

    // Inserting user
    app.post("/add/user", (req, res) => {
      const body = req.body;
      console.log({body});
      usersCollection.insertOne(body)
      .then( data => {
        console.log({data});
        const {acknowledged} = data;
        acknowledged ? getAllUsers(req, res) : res.send("Not inserted")
      })
      .catch(err => res.send(err));
    });

    // Delete user -> /delete/user/:id
    app.post("/delete/user", (req, res) => {
      const id = req.query._id;
      console.log({id});
      usersCollection.deleteOne({_id: ObjectId(id)})
      .then(document => {
        console.log({document});
        if(document.deletedCount > 0){
          getAllUsers(req, res);
        }
        // res.send(document?.deletedCount)
      })
    });

    // Get all users -> .toArray((err, documents) => res.send(documents))
    const getAllUsers = (userReq, userRes) => {
      usersCollection.find({})
      .toArray((err, documents) => {
        // console.log({documents})
        userRes.send(documents);
      })
    }
    app.get("/find/users", (req, res) => getAllUsers(req, res))
});


app.listen(process.env.PORT || port)