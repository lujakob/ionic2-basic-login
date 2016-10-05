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
        var limit = 50,
            offset = 0,
            defaultSortby = 'title',
            nextOffset,
            total;

        var params = req.query;
        var clientId = parseInt(params.clientId);
        var sortby = params.sortby && params.sortby.length > 0 ? params.sortby : defaultSortby;
        var data = require('../../www/data/statementsData.json');

        // clientId filter
        if (clientId > 0) {
            data = _.filter(data, function(item) {
                return item.clientId == clientId
            });
        }

        total = data.length;

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

        nextOffset = data.length > limit + offset ? limit + offset : -1;


        if(limit > 0) {
            data = data.slice(offset, (data.length > (offset + limit) ? offset + limit : data.length));
        }

        // simulate network delay
        setTimeout(function() {
          res.json({data: data, nextOffset: nextOffset, total: total});
        }, 500);
    },

    getClients: function(req, res) {
        var count = 100,
            start = 0,
            defaultSortby = 'path',
            sortDirection = 'asc',
            nextOffset,
            total,
            reqBody;

        var params = req.query;

        reqBody = req.body;

        // var clientId = parseInt(params.clientId);
        var sortColumn = params.sortColumn && params.sortColumn.length > 0 ? params.sortColumn : defaultSortby;
        var sortDirection = params.isAsc && params.isAsc.length > 0 ? (params.isAsc === 'false' ? 'desc' : 'asc') : sortDirection;
        var payee = params.payee && params.payee.length > 0 ? parseInt(params.payee) : null;

        var data = require('../../www/data/clientsData.json');

        // flatMap to _source
        data = _.flatMap(data, function(item) { return item._source});

        if(payee) {
            data = data.filter(function(item) {
                return item.payeeId === payee
            });
        }

        if(reqBody && reqBody.clientIds && reqBody.clientIds.length > 0) {
            data = data.filter(function(item) { return reqBody.clientIds.indexOf(item.id) >= 0 });
        }

        // take a few for testing
        // data = _.take(data, 3);

        // pick needed properties
        data = _.map(data, function(item) {
            return _.pick(item, ['id', 'clientName', 'currencyId', 'payeeId', 'payee', 'depth', 'path'])
        });


        // sorting by title/id
        data = _.orderBy(data, [sortColumn], [sortDirection]);

        if(data.length >= 300) {
            // data = _.take(data, 300);
        }
        total = data.length;

        // start
        if (params.start && parseInt(params.start) > 0) {
            start = parseInt(params.start);
        }

        // count
        if (params.count && parseInt(params.count) > 0) {
            count = parseInt(params.count);
        }

        nextOffset = data.length > count + start ? count + start : -1;


        if(count > 0) {
            data = data.slice(start, (data.length > (start + count) ? start + count : data.length));
        }

        // for (var i = 0, len = data.length; i < len; i++) {
        //     data[i].class = (i % 3) === 0 ? 'big-item' : '';
        // }

        // simulate network delay
        setTimeout(function() {
            res.json({data: data, nextOffset: nextOffset, total: total});
        }, 500);
    }

};
module.exports = functions;
