'use strict';
var { Store } = require('../store/store');

exports.Controller = class {
  constructor() {
    this.stores = [new Store()];
  }

  get(req, res) {
    this.stores.forEach(function(store){
      store.get(req.params.key)
        .then((value) => {
          res.json(value);
        })
        .catch((err) => {
          res.json(err);
        })
    })
  };

  add(req, res){
    var store = this.stores[0];
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

  remove(req, res){
    var store = this.stores[0];
    store.remove(req.params.key)
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.json(err);
      })
  };

  getValuesGreaterThan(req, res){
    var store = this.stores[0];
    store.getValuesGreaterThan(req.params.value)
      .then((response) =>{
        res.json(response);
      })
      .catch((err) => {
        res.json(err);
      })
  };

  getValuesLowerThan(req, res){
    var store = this.stores[0];
    store.getValuesLowerThan(req.params.value)
      .then((response) =>{
        res.json(response);
      })
      .catch((err) => {
        res.json(err);
      })
  };
}
