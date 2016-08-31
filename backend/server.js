var mongoose = require('mongoose'),
    express = require('express'),
    morgan  = require('morgan'),
    cors = require('cors'),
    config = require('./config/database')
    routes = require('./routes/routes'),
    passport = require('passport'),
    bodyParser = require('body-parser');

var port = 3333;


// connect to mongo
  mongoose.connect(config.database);
  mongoose.connection.on('open', function () {

    console.error('mongo is open');
    var app = express();

    app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(routes);
    app.use(passport.initialize());

    require('./config/passport')(passport);

    app.listen(port, function (err) {
      console.log('Server is running on port ' + 3333);
    });

  });