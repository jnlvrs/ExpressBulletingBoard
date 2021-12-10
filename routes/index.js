var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  models.posts.findAll({ where: { Deleted: false } }).then(results =>{
    res.render('index', { postsInfo: results });
  })
  
});



module.exports = router;