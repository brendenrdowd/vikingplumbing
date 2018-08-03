const express = require("express"); //require is node's way of importing(ES6 has another import statement)
const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
const result = dotenv.config()
let app = express(),
    port = 8000,
    bP = require("body-parser"),
    path = require("path"),
    session = require("express-session");

app.use(bP.urlencoded());
app.use(express.static(path.join(__dirname, "./client")));
app.use(session({ secret: process.env.SESSION_PW }));

app.set("views", path.join(__dirname, "./client"));
app.set("view engine", "ejs");


if (result.error) {
    throw result.error
}

//routing
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/home', function (req, res) {
    res.render('index');
});
app.get('/about', function (req, res) {
    res.render('about');
});
app.get('/services', function (req, res) {
    res.render('services');
});
app.get('/projects', function (req, res) {
    res.render('projects');
});
app.get('/contact', function (req, res) {
    res.render('contact');
});
app.get('/appointment', function (req, res) {
    !req.session.error ? req.session.error = [] : null;
    res.render('appointment',({error:req.session.error}));
});

app.post('/appointment', function (req, res) {
    req.session.error = [];
    // if(req.body.email != [A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}){
    //     req.session.error.push("Please enter a valid email");
    // }
    if(req.body.confirm != req.body.email){
        req.session.error.push("Emails do not match");
    }
    if(req.body.problem.length < 10){
        req.session.error.push("Please include more information about your problem");
    }
    if(req.body.first_name.length < 2 || req.body.last_name.length < 2){
        req.session.error.push("Please enter a name");
    }
    if(req.session.error.length > 0){
        res.redirect('appointment#error')
    }else{
        
        let mailOpts, smtpTrans;
        smtpTrans = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.ADMIN_UN,
                pass: process.env.ADMIN_PW
            }
        });
        mailOpts = {
            from: req.body.first_name + ' &lt;' + req.body.email + '&gt;',
            to: 'brenden.dowd@yahoo.com', //business email
            subject: 'New message from contact form at vikingplumbing.com', //domain name
            text: `${req.body.first_name} ${req.body.last_name} at (${req.body.email}) says: ${req.body.problem}`
        };
        smtpTrans.sendMail(mailOpts, function (error, response) {
            if (error) {
                req.session.error.push("Internal Service Error");
                console.log("error:",error);
                res.redirect('/appointment#error');
            }
            else {
                req.session.error = [];
                res.redirect('/#success');
            }
        });
    }
});


app.listen(port, function () {
    console.log("listening")
});