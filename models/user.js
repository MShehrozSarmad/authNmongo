const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number
});

mongoose.connect('mongodb://127.0.0.1:27017/authMongo');

module.exports = mongoose.model('user', userSchema);