// To use express instead of http
const express = require('express');

// Start the upp using express
const app = express();

// We use EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

const path = require('path');

// So the app can access everything in public
app.use(express.static(path.join(__dirname, 'public')));

// To manipulate easily the data 
const bodyParser = require('body-parser');

// Configure bodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));

// To be able to upload files
const multer = require('multer');
const upload = multer(); 

app.use(upload.single('image')); 

const compression = require("compression");

app.use(compression());

app.use(bodyParser.json());

// To use the main route
const rutasImage = require('./routes/image.routes');
app.use('/', rutasImage);

// For the error 404
app.use((request, response, next) => {
    response.status(404);
    response.render('404');
});

// So the server can be active
app.listen(2000);