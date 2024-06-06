const express = require('express');

const router = express.Router();

// Import the controller functions from the file
const imagesController = require('../controllers/images.controller');

// If the user posts an image, access the function of the controller
router.post('/processImage', imagesController.processImage);

// If the user accesses the home page, access the function of the controller
router.get('/', imagesController.getHomePage);

module.exports = router;