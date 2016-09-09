var User = require('../models/user');
//var Session = require('../models/session');
var jwt  = require('jwt-simple');
var config = require('../config/database');
var _ = require('lodash');

var functions = {
  authenticate: function(req, res) {
    User.findOne({
      name: req.body.name
    }, function(err, user){
      console.log(user);
      if (err) throw err;
      if(!user){
        return res.status(403).send({success: false, msg: 'Authenticaton failed: user not found.'});
      } else {
        user.comparePassword(req.body.password, function(err, isMatch){
          if(isMatch && !err) {
            var token = jwt.encode({exp:(Date.now() + 86400), user:user}, config.secret);
            res.json({success: true, id_token: token});
          } else {
            return res.status(403).send({success: false, msg: 'Authenticaton failed: wrong password.'});
          }
        })
      }
    })
  },
  addNew: function(req, res){
    console.log(req.body);
    if((!req.body.name) || (!req.body.password)){
      console.log(req.body.name);
      console.log(req.body.password);

      res.json({success: false, msg: 'Enter all values'});
    }
    else {
      console.log(req.body)
      var newUser = User({
        name: req.body.name,
        password: req.body.password
      });

      newUser.save(function(err, newUser){
        if (err){
          console.log(err);
          res.json({success:false, msg:'Failed to save'})
        }

        else {
          var token = jwt.encode(newUser, config.secret);
          res.json({success:true, msg:'Successfully saved', id_token: token});
        }
      })
    }
  },
  getinfo: function(req, res){
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      var token = req.headers.authorization.split(' ')[1];
      var decodedtoken = jwt.decode(token, config.secret);
      console.log(decodedtoken);
      return res.json({success: true, msg: 'hello ' + decodedtoken.user.name, userName: decodedtoken.user.name});
    }
    else {
      return res.json({success:false, msg: 'No header'});
    }
  },
  getStatements: function(req, res) {
    var limit = 0,
        offset = 0;

    var params = req.query;
    var clientId = parseInt(params.clientId);
    var sortby = params.sortby && params.sortby.length > 0 ? params.sortby : 'title';
    var data = require('../../www/data/statementsData.json');

    // clientId filter
    if (clientId > 0) {
      data = _.filter(data, function(item) {
        return item.clientId == clientId
      });
    }

    // sorting by title/id
    switch(sortby) {
      case 'title':
        data = _.sortBy(data, function(o) { return o.title; });
        break;
      case 'id':
        data = _.sortBy(data, function(o) { return o.id; });
        break;
      default:
        data = data;
    }

    // offset / limit
    if (params.offset && parseInt(params.offset) > 0) {
      offset = parseInt(params.offset);
    }

    if(limit > 0) {
      data = data.slice(offset, (data.length > (offset + limit) ? offset + limit : data.length));
    }

    res.json(data);
  }

};
module.exports = functions;
