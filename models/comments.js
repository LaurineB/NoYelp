/**
 * Created by labai on 15/02/2017.
 */

var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    comment : {
        type : [String]
    },
    pseudo : {
        type : [String]
    },
    rating : {
        type : Number
    },
    restaurantId : {
        type : String
    }
});

module.exports = mongoose.model('Comment', CommentsSchema);