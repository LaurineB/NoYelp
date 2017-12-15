
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = require('mongoose').ObjectId;

/* GET home page. */
router.get('/', function(req, res) {
    mongoose.model('Comment').find({},function (error,items) {
        res.render('comments/list',{ comments : items});
    });
});

router.get('/create/:restaurantId',function (req,res) {
    res.render('comments/create',{restaurantId : req.params.restaurantId});
});

router.post('/create/:restaurantId',function (req,res) {
    mongoose.model('Comment').create(req.body,function (err, item) {
        if(!err)
            res.redirect('/restaurants'); // redirect avec message?
        else
            res.send(err);
    })
});

router.get('/edit/:id', function(req, res) {
    mongoose.model('Comment').findById(req.params.id, function(err, item ){
        res.render('comments/edit', { comment : item });
    })
});
router.post('/edit/:id',function (req,res) {
    mongoose.model('Comment').findByIdAndUpdate(req.params.id, req.body, {upsert: false}, function (err, item) {
        if(!err)
            res.redirect('/comments');
        else
            res.send(err);
    });
});

router.get('/delete/:id', function (req,res) {
    mongoose.model('Comment').findByIdAndRemove(req.params.id, function (err,item) {
        if(!err)
            res.redirect('/comments');
        else
            res.send(err);
    });
});

module.exports = router;