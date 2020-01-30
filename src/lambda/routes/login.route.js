//router is here to create a stream to be able to get post update and delete your datas from mongosDb.
const router = require('express').Router();
let LoginModel = require('../models/login.model');
//Email
require("dotenv").config();
const nodemailer = require('nodemailer');
let moduleEmail = require('../sendMail');

require("dotenv").config();
router.route('/').get((req, res) => {
    //find is a moongose method that get the list from all shoes of mangos DB it return a promises.
    LoginModel.find()
        .then(LoginModel => res.json(LoginModel))
        .catch(err => res.status(400).json(err));
});
//Promise 
router.route('/find').get((req, res) => {
    const {
        email,
        password,
    } = JSON.parse(req.query.account);
    LoginModel.findOne({
            email: email,
            password: password,
        }).then(login => {
            if (login) {
                res.send({
                    success: true,
                    quote: login.quote
                })
            } else {
                res.send({
                    success: false
                })
            }
        })
        .catch(err => res.status(400).json(err));
});
//Async version which is a promise but has a better syntax.
router.route('/add').post(async (req, res) => {
    const {
        name,
        email,
        password,
        quote
    } = req.body.account;
    const sendingMailedSelected = req.body.isMailSelected;
    try {
        const isAlreadyRegistred = await LoginModel.findOne({
            $or: [{
                name: name
            }, {
                email: email
            }, ]
        });
        if (isAlreadyRegistred) {
            res.send({
                success: false,
            })
        } else {
            const newLogin = new LoginModel({
                name,
                email,
                password,
                quote
            });
            const saveNewUser = await newLogin.save((err, doc) => {
                    if (err) {
                        console.log(err)
                        res.send({
                            isItSaved: false,
                        })
                    }
                    res.send({
                        isItSaved: true
                    })
                }

            );
        }
    } catch (err) {
        err
    }
})
router.route('/sendmail').post(async (req, res) => {
    const transporter = moduleEmail.smtpTransport;
    const detailUser = moduleEmail.detailUser;
    const {
        email,
        name,
        password,
    } = req.body.account;

    try {
        await transporter.sendMail(detailUser(email, name, password), function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info)
            }
        })
    } catch (err) {
        console.log(err)
    }


});

module.exports = router


/*
      
// Reminders: 

res.write("string"),
res.write( JSON.stringify({myObject}))
res.end()
Diff between res.send, res.end, res.write
res.write does not close the request. It works like a pipe to send back some text/data. You have to res.end().
res.send() you can return string, data, it automatically write the header for you and close the request.

  Difference between get and post:
   Get => take some datas.
  GET requests can be cached
  GET requests remain in the browser history
  GET requests can be bookmarked
  GET requests should never be used when dealing with sensitive data
  GET requests have length restrictions
  GET requests are only used to request data(not modify)

     Client side:
         get(/yourendpoint, { 
             params: {
                 account,
                 (object)
                 isMailSelected: this.state.mailSelected
             }
         })
     Server side:
         const {
             email,
             name,
             password,
         } = JSON.parse(req.query.account);
     Parse otherwise it will be format stringify {
         "key": "value"
     }
    
  Post => post some datas.
  POST requests are never cached
  POST requests do not remain in the browser history
  POST requests cannot be bookmarked
  POST requests have no restrictions on data length
 
Client side
post(/name, {
    nameOfVar: "hello"
})
Server side
req.body.nameOfVar. 

Note: When using post consider using body,  when "get" use params (req.query).
req.body does not work with "get".

 
   
 Some otherway: 
           GET /search?q=foo+bar  
          req.query.q
           => "foo bar" 

          GET /phone?order=desc&phone[color]=black&shoe[type]=apple  
          req.query.order
           => "desc"  

          req.query.phone.color
            => "black"  
          req.params

           GET /user/william  
          req.params.name
           => "william" 


          req.body(
              for form data)
           POST /login
          req.body.username
           => "william"
          req.body.password
           => "xxxxxx"

*/