const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user.js');
const Poll = require('../models/poll.js');
const authenticate = require('./authenticate.js');
// const config = require('./config.js');

const router = express.Router();

// 302 = redirects PUT/POST to GET (default)
// 303 = redirects PUT/POST to a different PUT/POST

router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.render("main");
});

router.get('/all', (req, res) => {
    Poll.find({}, (err, polls) => {
        if (err) throw err;
        
        res.send(polls);
    });
});

router.get('/user', (req, res) => {
    Poll.find({creatorId: req.user._id}, (err, polls) => {
        if (err) throw err;
        
        res.send(polls);
    });
});

router.get('/profile', authenticate.verifyUser, (req, res) => {
    res.render("profile");
});

router.get('/change', authenticate.verifyUser, (req, res) => {
    res.render("change");
});

// POST behaving as a PUT... I am sorry W3!
router.post('/change', authenticate.verifyUser, (req, res) => {
    const password = req.body['pass-new'];
    
    req.checkBody('pass-current', 'Incorrect current password').bcryptCompare(req.user.password);
    req.checkBody('pass-new', 'New password is required').notEmpty();
    req.checkBody('pass-confirm', 'New passwords do not match').equals(req.body['pass-new']);
    
    const errors = req.validationErrors();
    
    if (errors) {
        res.render("change", {errors: errors});
    }
    else {
        User.updatePassword(req.user, password, (err, update) => {
            if (err) throw err;
            
            console.log(update);
        });
        
        req.flash('success_msg', 'Password successfully changed');
        
        res.redirect('/profile');
    }
});

router.get('/create', authenticate.verifyUser, (req, res) => {
    res.render("create");
});

router.post('/create', authenticate.verifyUser, (req, res) => {
    const question = req.body.question;
    const options = [];
    
    req.checkBody('question', 'Question field was left empty').notEmpty();
    req.checkBody('input2', 'At least two option fields are needed').exists();
    for (let i = 1; i < Object.keys(req.body).length - 1; i++) {
        options.push(req.body['input' + i] );
        req.checkBody('input' + i, 'Option field ' + i + ' is empty').notEmpty();
    }
    outer: for (let j = 1; j < Object.keys(req.body).length - 1; j++) {
        for (let k = 1; k < Object.keys(req.body).length - 1; k++) {
            if (j != k && req.body['input' + k] == req.body['input' + j]) {
                req.checkBody('input' + j, 'Option fields must be unique from each other').not().equals(req.body['input' + k]);
                break outer;
            }
        }
    }
    
    const errors = req.validationErrors();
    
    if (errors) {
        res.render("create", {errors: errors});
    }
    else {
        Poll.createPoll(question, options, req.user._id, req.user.username, (err, result) => {
            if (err) throw err;
            
            console.log(result);
            
            req.flash('success_msg', 'Poll successfully created. Here it is.');
            
            res.redirect('/poll/' + result._id);
        });
    }
});

router.get('/poll/:id', (req, res) => {
    res.render("poll", {id: req.params.id});
});

router.get('/poll/request/:id', (req, res) => {
    Poll.getPollById(req.params.id, (err, poll) => {
        if (err) throw err;
        
        res.send(poll);
    });
});

router.post('/poll/:id', (req, res) => {
    const ip = req.headers['x-forwarded-for'];
    const newOption = req.body['new-option'];
    
    req.checkBody('new-option', 'New option field is empty').notEmpty();
    Poll.getPollById(req.params.id, (err, poll) => {
        if (err) throw err;
        
        req.checkBody('new-option', 'You cannot add pre-existing voting options').notIncluded(poll.options);
        req.checkHeaders('x-forwarded-for', 'You can only vote once per poll').notIncluded(poll.voters);
        
        const errors = req.validationErrors();
        
        if (errors) {
            res.render("poll", {id: req.params.id, errors: errors});
        }
        else {
            const r = Math.floor(Math.random() * 256), g = Math.floor(Math.random() * 256), b = Math.floor(Math.random() * 256);
            
            poll.options.push(newOption);
            poll.votes.push(1);
            poll.bgColors.push('rgba(' + r + ',' + g + ',' + b + ',0.2)');
            poll.bdColors.push('rgba(' + r + ',' + g + ',' + b + ',1.0)');
            poll.voters.push(ip);
            poll.markModified('options');
            poll.markModified('votes');
            poll.markModified('bgColors');
            poll.markModified('bdColors');
            poll.markModified('voters');
            
            poll.save((err, result) => {
                if (err) throw err;
                
                res.render("poll", {id: req.params.id});
            });
        }
    });
});

router.put('/poll/:id', (req, res) => {
    const ip = req.headers['x-forwarded-for'];
    
    req.checkBody('voteIndex', 'Please select an option before trying to vote').notNull();
    Poll.getPollById(req.params.id, (err, poll) => {
        if (err) throw err;
        
        req.checkHeaders('x-forwarded-for', 'You can only vote once per poll').notIncluded(poll.voters);
        
        const errors = req.validationErrors();
        
        if (errors) {
            res.send({id: req.params.id, errors: errors});
        }
        else {
            poll.votes[req.body.voteIndex] = poll.votes[req.body.voteIndex] + 1;
            poll.voters.push(ip);
            poll.markModified('votes');
            poll.markModified('voters');
            
            poll.save(poll, (err, result) => {
                if (err) throw err;
                console.log('yyyyy', result);
                res.send(result.votes);
            });
        }
    });
});

router.get('/mypolls', authenticate.verifyUser, (req, res) => {
    res.render("mypolls");
});

router.delete('/mypolls/:id', authenticate.verifyUser, (req, res) => {
    const deleteId = req.params.id;
    
    Poll.deletePollById(deleteId, (err, result) => {
        if (err) throw err;
        
        res.send(result);
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    
    req.flash('success_msg', 'You have been logged out');
    
    res.redirect('/');
});

router.get('/login', (req, res) => {
    res.render("login");
});

router.post('/login', passport.authenticate('local', {successRedirect: '/', successFlash: "You have been logged in", failureRedirect: '/login', failureFlash: true}), (req, res) => {
    res.redirect('/');
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect : '/', successFlash: 'You have been logged in', failureRedirect : '/login', failureFlash: true}), (req, res) => {
    res.redirect('/'); 
});

router.get('/register', (req, res) => {
    res.render("register");
});

router.post('/register', (req, res) => {
    const username = req.body['user-register'];
    const email = req.body['email-register'];
    const password = req.body['pass-register'];
    
    req.checkBody('user-register', 'Name is required').notEmpty();
    req.checkBody('email-register', 'Invalid email address').isEmail();
    req.checkBody('pass-register', 'Password is required').notEmpty();
    req.checkBody('pass-confirm', 'Passwords do not match').equals(req.body['pass-register']);
    
    const errors = req.validationErrors();
    
    if (errors) {
        res.render('register', {errors: errors});
    }
    else {
        const newUser = new User({
            username: username,
            email: email,
            password: password
        });
        
        User.createUser(newUser, (err, user) => {
            if (err) throw err;
            
            console.log(user);
        });
        
        req.flash('success_msg', 'You are registered and can now login');
        
        res.redirect('/login');
    }
});

module.exports = router;