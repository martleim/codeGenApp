var express = require("express");
var router = express.Router();
var User     = require("../models/user");
var path = "";

router.route(path).get(/*isLoggedIn,*/function(req, res) {
    User.find(function(err, items) {
        if (err) {
        return res.send(err);
        }
        res.json(items);
    });
});

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.status(403);
    res.send("");
    //res.redirect('/');
}

router.route(path).post(function(req, res) {
    
    var user = new User(req.body);

    user.save(function(err) {
        if (err) {
            return res.send(err);
        }
        res.send({ message: 'OK' });
    });
});

router.route(path+"/:id").put(function(req, res) {
    var userToUpdate = req.body;
    console.log("PUT "+req.params.id+" "+JSON.stringify(req.body));
    User.update({ _id: req.params.id }, userToUpdate, function(err, result) {
        res.send((result === 1) ? { msg: "" } : { message: "error: " + err });
    });
});

router.route(path+"/:id").get(function(req, res) {
    User.findOne({ _id: req.params.id}, function (err, item) {
        res.json(item);
    });
});

router.route(path+"/:id").delete(function(req, res) {
    var userToDelete = req.params.id;
    User.remove({_id:userToDelete}, function(err, result) {
        res.send((result === 1) ? { msg: "" } : { message: "error: " + err });
    });
});


module.exports = router;