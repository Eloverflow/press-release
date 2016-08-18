'use strict';
var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
    title : { type: String, required: true },
    content : { type: String, required: true },
    user_id :  { type: ObjectId, ref: 'UserSchema' },
    view_count: { type: Number, required: false, default: 0,
    tags: {type: Array, required: false}}
});

module.exports = mongoose.model('Article', ArticleSchema);

