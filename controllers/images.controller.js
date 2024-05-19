exports.processImage = (request, response, next) => {

};

exports.getHomePage = (request, response, next) => {
    response.render('homePage', {
        csrfToken: request.csrfToken(),
    });
};