require("dotenv").config();
const nodemailer = require("nodemailer");
module.exports.smtpTransport =
    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: process.env.SENDER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: process.env.ACCESS_TOKEN
        },
    });

module.exports.detailUser = (userAddress, name, password) => {
    let details = {
        from: process.env.SENDER,
        to: userAddress,
        subject: "Your authantification",
        html: `<div> 
<span> (Here is my message that I can design like an html page.)</span>
        <h1> Thank you for having joined us</h1>
        <h2> Please, find bellow you details </h2>
         <ul>
         <li>  your name is: ${name} </li>
        <li> your password is: ${password} </li>
        </ul>
        <p> N.S </p> 
        </div>`
    };

    return details;
};