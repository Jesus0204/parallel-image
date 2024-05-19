// To use the parallel library
const parallel = require('paralleljs');

exports.processImage = (request, response, next) => {
    if (request.body.type = 'blur'){
        console.log('blur');
    } else if (request.body.type = 'grayscale') {
        console.log('grayscale');
    } else if (request.body.type = 'sepia') {
        console.log('sepia');
    } else if (request.body.type = 'invert') {
        console.log('invert');
    }
    // For the time being so the website doesn't load forever
    response.render('homePage', {
        csrfToken: request.csrfToken(),
    });
};

exports.getHomePage = (request, response, next) => {
    response.render('homePage', {
        csrfToken: request.csrfToken(),
    });
};