'use strict';
var { Store } = require('../store/store');

var store = new Store();

exports.get = function(req, res) {
    store.get(req.params.key)
        .then((value) => {
            res.json(value);
        })
        .catch((err) => {
            res.json(err);
        })
};

exports.add = function(req, res){
    let key = req.body.key;
    let value = req.body.value;
    store.add(key, value)
        .then((map) => {
            res.json(map)
        })
        .catch((err) => {
            res.json(err)
        })
};

exports.remove = function(req, res){
    store.remove(req.params.key)
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.json(err);
        })
};

exports.getValuesGreaterThan = function(req, res){
    store.getValuesGreaterThan(req.params.value)
        .then((response) =>{
          res.json(response);
        })
        .catch((err) => {
            res.json(err);
        })
};
exports.getValuesLowerThan = function(req, res){
    store.getValuesLowerThan(req.params.value)
        .then((response) =>{
          res.json(response);
        })
        .catch((err) => {
            res.json(err);
        })
};
