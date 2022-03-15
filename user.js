const express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    axios = require("axios");
require("dotenv").config();
const cors = require('cors');
app.use(cors());


var User = require("./model");
app.use(bodyParser.json());
const db = "mongodb+srv://" + process.env.USER + ":" + process.env.PASS + "@user.tapei.mongodb.net/" + process.env.DB + "?retryWrites=true&w=majority";

//Connection to database 
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection to Database Established');
}).catch((err) => {
    console.log('Cannot connect to the Database');
    console.log(err);
});

app.get('/fetchUsers', (req, res) => {
    User.find({}, function (err, dataFound) {
        if (err){ 
            console.log("Error in Fetching Users");
            console.log(err);
        }
        else return res.status(200).json(dataFound);
    })
});

app.get('/user/:id', (req, res) => {
    User.findById(req.params.id).then((user) => {
        if (user) 
        res.json(user);
        else res.sendStatus(404);
    }).catch(err => {
            console.log("Error in Fetching User");
            console.log(err);
    })
});


app.post('/addUser', (req, res) => {

    var dataPulled = req.body;
    var dataSave = new User(dataPulled);
    dataSave.save().then((response) => {
        var userID = response._id;
        axios.get("https://pratilipi-microservices.herokuapp.com/contentService/allSeries").then((response) => {
            var obj = {
                _id: userID,
                content: []
            }
            var cont = response.data;
            for (var i = 0; i < cont.length; i++) {
                var conObj = {
                    _id: cont[i]._id,
                    NumChapUn: 4
                }
                obj.content.push(conObj);
            }

            axios.post("https://pratilipi-microservices.herokuapp.com/dailypassService/userAdd", obj).then(()=>{
             res.json("User has been added to the database");
            });
        })

    }).catch((err) => {
        if (err) {
            console.log("Error in Saving User");
            console.log(err); 
        }
    })
    
});


app.listen(process.env.PORT|| 8000, () => {
    console.log("Started");
})
