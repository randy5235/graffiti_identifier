const express = require('express');
const upload = require('./upload');

const router = express.Router();

router.use('/', upload);

module.exports = router;
