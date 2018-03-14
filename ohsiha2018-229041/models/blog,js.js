var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
    title        : String,
    author       : String,
    text         : String
});

module.exports = mongoose.model('Blog', blogSchema);