'use strict'

const express = require('express');
const router = express.Router();

const serverExpress = require('./serverExpress')

router.use('/pets', serverExpress)

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('this is the index!')
});

module.exports = router;
