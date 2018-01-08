const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('../models/user.js');
const config = require('./config.js');

passport.serializeUser((user, done) => {
    done(null, user.id);
});
    
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user); 
    });
});

// Conventional authentication
exports.local = passport.use(new LocalStrategy((username, password, done) => {
        User.getUserByUsername(username, (err, user) => {
            if (err) throw err;
            if (!user) return done(null, false, {message: "Unknown User"});
            
            User.comparePassword(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) 
                    return done(null, user);
                else    
                    return done(null, false, {message: "Invalid Password"});
            });
        });
    }));

// Social media integration
exports.twitter = passport.use(new TwitterStrategy({
        consumerKey: config.twitterAuth.consumerKey,
        consumerSecret: config.twitterAuth.consumerSecret,
        callbackURL: config.twitterAuth.callbackURL
    },
    (token, tokenSecret, profile, done) => {
        process.nextTick(() => {
            User.findOne({twitterId: profile.id}, (err, user) => {
                if (err) return done(err);
                
                if (user) return done(null, user);
                else { 
                    let newUser = new User();
                    newUser.username = profile.username;
                    newUser.email = 'https://twitter.com/' + profile.username;
                    newUser.twitterId = profile.id;
                    newUser.twitterToken = token;
                    newUser.twitterUsername = profile.username;
                    newUser.twitterDisplayName = profile.displayName;
                    
                    newUser.save((err) => {
                        if (err) throw err;
                        
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    
exports.verifyUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash('error_msg', 'You are not logged in');
        
        res.redirect('/login');
    }
};