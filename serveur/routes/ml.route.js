const express = require('express');
const router = express.Router();
const { callFlask } = require('../controllers/ml.controller');

router.post('/call-flask', callFlask);

module.exports = router;
