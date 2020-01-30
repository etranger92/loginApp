require("dotenv").config();
const {
    URL
} = process.env.WEB_LINK
// URL === your site URL

const functionOne = `${URL}//.netlify/functions/server/login/sendingmail`
exports.handler = function (event, context, callback) {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'Gmail',
        secure: false,
        auth: {
            user: 'etranger926@gmail.com',
            pass: process.env.PASS_MAIL
        }
    });

    let detailsUser = {
        from: 'etranger926@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Your authantification', // Subject line
        html: `<div> 
<span> (Here is my message that I can design like an html page.)</span>
        <h1> Thank you for having joined us</h1>
        <h2> Please, find bellow you details </h2>
         <ul>
         <li>  your name is: ${name} </li>
        <li> your password is: ${
            password} </li>
        </ul>
        <p> N.S </p> 
        </div>` // plain text body
    }

    transporter.sendMail(detailUser, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    })
}