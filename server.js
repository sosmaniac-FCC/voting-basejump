require('dotenv').config();

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const expressValidator = require("express-validator");
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const logger = require('morgan');
const bodyParser = require('body-parser');
const flash = require("connect-flash");
const routes = require('./routes/route');
const bcrypt = require('bcryptjs');

const app = express();

app.engine('handlebars', exphbs({
	defaultLayout: 'layout',
	partialsDir: path.join(__dirname, 'public/views'),
	layoutsDir: path.join(__dirname, 'public/views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/public/views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// jsx, js, and css files
app.use('/public/static', express.static(path.join(__dirname, '/public/static')));
// html files
app.use('/public/views', express.static(path.join(__dirname, '/public/views')));

mongoose.connect(process.env.MONGO_URI, {
	useMongoClient: true
});
mongoose.Promise = global.Promise;

app.use(session({
	secret: 'secretVote',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  },
  customValidators: {
    bcryptCompare: (value, hash) => {
      return bcrypt.compareSync(value, hash);
    },
    notNull: (value) => {
      return value != null;
    },
    notIncluded: (value, array) => {
      return !array.includes(value);
    }
  }
}));

app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log('Node.js listening on port ' + port + '...');
});
