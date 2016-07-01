var express = require("express");
var router = express.Router();
var Profile     = require("../models/profile");
var path = "";

router.route(path).get(function(req, res) {
    Profile.find(function(err, items) {
        if (err) {
        return res.send(err);
        }
        res.json(items);
    });
});

router.route(path).post(function(req, res) {
    
    var profile = new Profile(req.body);

    profile.save(function(err) {
        if (err) {
            return res.send(err);
        }
        res.send({ message: 'OK' });
    });
});

router.route(path+"/:id").put(function(req, res) {
    var profileToUpdate = req.body;
    console.log("PUT "+req.params.id+" "+JSON.stringify(req.body));
    Profile.update({ _id: req.params.id }, profileToUpdate, function(err, result) {
        res.send((result === 1) ? { msg: "" } : { message: "error: " + err });
    });
});

router.route(path+"/:id").get(function(req, res) {
    Profile.findOne({ _id: req.params.id}, function (err, item) {
        res.json(item);
    });
});

router.route(path+"/:id").delete(function(req, res) {
    var profileToDelete = req.params.id;
    Profile.remove({_id:profileToDelete}, function(err, result) {
        res.send((result === 1) ? { msg: "" } : { message: "error: " + err });
    });
});

module.exports = router;