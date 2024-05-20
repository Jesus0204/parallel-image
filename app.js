// To use express instead of http
const express = require('express');

// Start the upp using express
const app = express();

// We use EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

const path = require('path');

const session = require('express-session');

app.use(session({
    secret: 's&xYnn9oVRuo3*0@sBA&SedkdMGoM!&e%kASzFfZ6537MqWruvYe27X=7hQUdktRRxYQHDjWtW7veznF',
    resave: false, 
    saveUninitialized: false, 
}));

// La aplicacion va a tener acceso a todo lo que esta en public
app.use(express.static(path.join(__dirname, 'public')));

// To manipulate easily the data 
const bodyParser = require('body-parser');

// Configure bodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));

const multer = require('multer');
const upload = multer(); 

app.use(upload.single('imagen')); 

// To protect from Cross-Site Request Forgery
const csrf = require('csurf');
const csrfProtection = csrf();

app.use(csrfProtection);

const compression = require("compression");

app.use(compression());

app.use(bodyParser.json());

const rutasImage = require('./routes/image.routes');
app.use('/', rutasImage);

// For the error 404
app.use((request, response, next) => {
    response.status(404);
    response.render('404');
});

// So the server can be active
app.listen(2000);