var express = require("express");
var router = express.Router();
var Credential     = require("../models/credential");
var path = "";

router.route(path).get(function(req, res) {
    Credential.find(function(err, items) {
        if (err) {
        return res.send(err);
        }
        res.json(items);
    });
});

router.route(path).post(function(req, res) {
    
    var credential = new Credential(req.body);

    credential.save(function(err) {
        if (err) {
            return res.send(err);
        }
        res.send({ message: 'OK' });
    });
});

router.route(path+"/:id").put(function(req, res) {
    var credentialToUpdate = req.body;
    console.log("PUT "+req.params.id+" "+JSON.stringify(req.body));
    Credential.update({ _id: req.params.id }, credentialToUpdate, function(err, result) {
        res.send((result === 1) ? { msg: "" } : { message: "error: " + err });
    });
});

router.route(path+"/:id").get(function(req, res) {
    Credential.findOne({ _id: req.params.id}, function (err, item) {
        res.json(item);
    });
});

router.route(path+"/:id").delete(function(req, res) {
    var credentialToDelete = req.params.id;
    Credential.remove({_id:credentialToDelete}, function(err, result) {
        res.send((result === 1) ? { msg: "" } : { message: "error: " + err });
    });
});

module.exports = router;