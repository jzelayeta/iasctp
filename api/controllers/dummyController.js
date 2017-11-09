'use strict';

var store = require('../store/store');

exports.get = function(req, res) {
    res.json(store.get(req.params.key))
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
    res.json(store.remove(req.params.key))
};

exports.getValuesGreaterThan = function(req, res){
    res.json(store.getValuesGreaterThan(req.params.value));
};
exports.getValuesLowerThan = function(req, res){
    res.json(store.getValuesLowerThan(req.params.value));
};
