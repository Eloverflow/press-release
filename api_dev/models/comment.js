'use strict';
var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    user_id :  { type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema' },
    post_id : { type: mongoose.Schema.Types.ObjectId, ref: 'PostSchema' },
    content : { type: String, required: true },
    sub_comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCommentSchema' }],
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VoteSchema' }]
},
{
    timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);

