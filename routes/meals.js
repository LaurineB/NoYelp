
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = require('mongoose').ObjectId;


router.get('/', function(req, res) {
    mongoose.model('Meal').find({},function (error,items) {
        res.render('meals/list',{ meals : items});
    });
});


router.get('/create/:restaurantId',function (req,res) {
    res.render('meals/create',{restaurantId : req.params.restaurantId});
});

router.post('/create/:restaurantId',function (req,res) {
    mongoose.model('Meal').create(req.body,function (err, item) {
        if(!err)
            res.redirect('/restaurants'); // redirect avec message?
        else
            res.send(err);
    })
});

router.get('/edit/:id', function(req, res) {
    mongoose.model('Meal').findById(req.params.id, function(err, item ){
        res.render('meals/edit', { meal : item });
    })
});
router.post('/edit/:id',function (req,res) {
    mongoose.model('Meal').findByIdAndUpdate(req.params.id, req.body, {upsert: false}, function (err, item) {
        if(!err)
            res.redirect('/meals');
        else
            res.send(err);
    });
});

router.get('/delete/:id', function (req,res) {
    mongoose.model('Meal').findByIdAndRemove(req.params.id, function (err,item) {
        if(!err)
            res.redirect('/meals');
        else
            res.send(err);
    });
});


router.get('/search', function(req, res){
    mongoose.model('Meal').search({
            'dis_max': {
                'queries': [
                    {
                        "function_score": {
                            "query": {
                                'term': {
                                    'name.keyword': req.query.query,
                                }
                            },
                            "boost": 5,
                            "script_score": {
                                "script": "_score * 5"
                            }
                        }
                    },
                    {
                        "function_score": {
                            "query": {
                                'match': {
                                    'title.ngram': {
                                        'query': req.query.query,
                                        'operator': 'and',
                                        "fuzziness": "AUTO"
                                    }
                                }
                            },
                            "script_score": {
                                "script": "_score * 0.7"
                            },
                        },
                    }
                ]
            }
        }, { "from": 0, "size": 30, hydrate : true }
        , function(err, search_result){
            if(!err)
                res.render('films/list', { films : search_result.hits.hits });
            else
                res.send(err);
        });
});

module.exports = router;