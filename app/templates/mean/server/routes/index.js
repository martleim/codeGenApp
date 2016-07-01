/* GET home page. */
/*exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/

var express = require("express");
var router = express.Router();
var path = "/";

router.get(path,function(req, res) {
    res.render('index', { title: 'Express' });
});

module.exports = router;