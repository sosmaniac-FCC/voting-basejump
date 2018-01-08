const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    twitterId: {
        type: Number
    },
    twitterToken: {
        type: String
    },
    twitterUsername: {
        type: String
    },
    twitterDisplayName: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.updatePassword = (user, password, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            
            user.password = hash;
            user.save(callback);
        });
    });
};

module.exports.getUserByUsername = (username, callback) => {
    User.findOne({username: username}, callback);
};

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        
        callback(null, isMatch);
    });
};