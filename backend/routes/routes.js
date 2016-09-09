var express = require('express'),
    actions = require('../actions/methods');

var router = express.Router();

router.post('/authenticate', actions.authenticate);
router.post('/adduser', actions.addNew);
router.get('/getinfo', actions.getinfo);
router.get('/statements', actions.getStatements);

module.exports=router;