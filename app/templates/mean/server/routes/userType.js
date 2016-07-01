var express = require("express");
var router = express.Router();
var UserType     = require("../models/userType");
var path = "";

router.route(path).get(function(req, res) {
    UserType.find(function(err, items) {
        if (err) {
        return res.send(err);
        }
        res.json(items);
    });
});

router.route(path).post(function(req, res) {
    
    var userType = new UserType(req.body);

    userType.save(function(err) {
        if (err) {
            return res.send(err);
        }
        res.send({ message: 'OK' });
    });
});

router.route(path+"/:id").put(function(req, res) {
    var userTypeToUpdate = req.body;
    console.log("PUT "+req.params.id+" "+JSON.stringify(req.body));
    UserType.update({ _id: req.params.id }, userTypeToUpdate, function(err, result) {
        res.send((result === 1) ? { msg: "" } : { message: "error: " + err });
    });
});

router.route(path+"/:id").get(function(req, res) {
    UserType.findOne({ _id: req.params.id}, function (err, item) {
        res.json(item);
    });
});

router.route(path+"/:id").delete(function(req, res) {
    var userTypeToDelete = req.params.id;
    UserType.remove({_id:userTypeToDelete}, function(err, result) {
        res.send((result === 1) ? { msg: "" } : { message: "error: " + err });
    });
});

module.exports = router;