const express = require('express');

const router = express.Router();

const imagesController = require('../controllers/images.controller');

router.post('/processImage', imagesController.processImage);
router.get('/', imagesController.getHomePage);

module.exports = router;