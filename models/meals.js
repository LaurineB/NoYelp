
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var MealsSchema = new Schema({

    name : {
        type : String,
        required : true,
        es_indexed: true,
        es_fields : {
            'ngram' : { type : 'string', analyzer : 'nGram_analyzer', search_analyzer : 'nGram_analyzer', index : 'analyzed'},
            'keyword' : { type : 'string', analyzer : 'keyword_analyzer', index : 'analyzed'}
        }
    },
    allergies : {
        type : [String]
    },
    ingredients : {
        type : [String]
    },
    vegan : {
        type : Boolean
    },
    halal : {
        type : Boolean
    },
    kosher : {
        type : Boolean
    },
    restaurantId : {
        type : String
    }
});
MealsSchema.plugin(mongoosastic);

var Meal = mongoose.model('Meal',MealsSchema);

Meal.createMapping({
    "number_of_shards": 1,
    "analysis" : {
        "filter" : {
            "nGram_filter" : {
                "type" : "nGram",
                "min_gram" : 2,
                "max_gram" : 20,
                "token_chars" : [
                    "letter",
                    "digit",
                    "punctuation",
                    "symbol"
                ]
            }
        },
        "analyzer" : {
            "nGram_analyzer" : {
                "type" : "custom",
                "tokenizer" : "whitespace",
                "stopwords" : ["and", "the","'s"],
                "filter" : [
                    "lowercase",
                    "asciifolding",
                    "nGram_filter"
                ]
            },
            "keyword_analyzer": {
                "tokenizer": "keyword",
                "filter": [
                    "lowercase",
                    "asciifolding"
                ]
            }
        }
    }
},function(err, mapping){
    // do neat things here
    if(err) {
        console.log(err);
    }
    console.log(mapping);
});

var stream = Meal.synchronize();
var count = 0;

stream.on('data', function (err,doc) {
    count++;
});
stream.on('close', function () {
    console.log('indexed ' + count + ' documents!');
})
stream.on('error', function (err) {
    console.log(err);
});


module.exports = Meal;