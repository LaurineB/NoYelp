
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = require('mongoose').ObjectId;


router.get('/', function(req, res) {
    mongoose.model('Restaurant').find({},function (error,items) {
        console.log(items);
        res.render('restaurants/list',{ restaurants : items});
    });
});

router.get('/create',function (req,res) {
    res.render('restaurants/create');
});

router.post('/create',function (req,res) {
    mongoose.model('Restaurant').create(req.body,function (err, item) {
        if(!err)
            res.redirect('/'); // redirect avec message?
        else
            res.send(err);
    })
});
router.get('/show/:id', function (req,res) {
    mongoose.model('Restaurant').findById(req.params.id, function (err,restaurant) {
        mongoose.model('Meal').find({ 'restaurantId' : req.params.id }, function (err,meals) {
            mongoose.model('Comment').find({ 'restaurantId' : req.params.id }, function (err,comments){
                res.render('restaurants/show',{ restaurant : restaurant, meals : meals, comments : comments });
            });
        });
    });
});

router.get('/edit/:id', function(req, res) {
    mongoose.model('Restaurant').findById(req.params.id, function(err, item ){
        res.render('restaurants/edit', { restaurant : item });
    })
});
router.post('edit/.id',function (req,res) {
    mongoose.model('Restaurant').findByIdAndUpdate(req.params.id, req.body, {upsert: false}, function (err, item) {
        if(!err)
            res.redirect('/restaurants');
        else
            res.send(err);
    });
});

router.get('/delete/:id', function (req,res) {
   mongoose.model('Restaurant').findByIdAndRemove(req.params.id, function (err,item) {
      if(!err)
          res.redirect('/restaurants');
      else
          res.send(err);
   });
});

/**************
 // * search
 *************/
router.get('/search', function(req, res){
    mongoose.model('Restaurant').search({
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
                            }
                        }
                    }
                ]
            }
        }, { "from": 0, "size": 30, hydrate : true }
        , function(err, search_result){
            if(!err)
                res.render('restaurants/list', { restaurants : search_result.hits.hits });
            else
                res.send(err);
        });
});

module.exports = router;