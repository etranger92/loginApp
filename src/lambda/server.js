const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer');

//for netlify
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const router = express.Router();
const app = express();
const port = process.env.PORT || 5000;
app.use("/.netlify/functions/server", router);
app.use(cors());
app.use(express.json());

require("dotenv").config();
var uri = process.env.ATLAS_URI;

mongoose.connect(`${uri}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("mongoDB database connection established successfully");
});

const loginRouter = require("./routes/login.route");
app.use("/.netlify/functions/server/login", loginRouter);

//app.use('/users', usersRouter);
app.listen(port, () => {
    console.log("server is running on port" + port);
});

module.exports = app;
//for netlify
module.exports.handler = serverless(app);