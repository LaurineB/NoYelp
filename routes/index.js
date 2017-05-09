var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = require('mongoose').ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
  mongoose.model('Comment').find({},function (err,commented) {
      res.render('index', { commented : commented});
  });

});

module.exports = router;