'use strict';

var store = require('../store/store');

exports.get = function(req, res) {
    res.json(store.get(req.params.key))
};

exports.add = function(req, res){
    var key = req.body.key;
    var value = req.body.value;
    res.json(store.add(key, value))
};
