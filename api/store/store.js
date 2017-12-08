/**
 * Created by jzelayeta on 11/2/17.
 */
var { StoreValidator } = require('../controllers/validations/storeValidations');

exports.Store = class {
  constructor() {
    this.storeValidator = new StoreValidator();
    this.keyValueStore = new Map();
    this.actualSize = 0;
  }

  nodeSize() {
    return this.keyValueStore.size
  };

  get(key) {
    var that = this;
    return new Promise(function(resolve, reject){
      resolve(that.keyValueStore.get(key))
    });
  };

  add(key, value) {
    var that = this;
    return new Promise(function (resolve, reject) {
      if(that.storeValidator.valueLengthValidation(value) || that.storeValidator.keyLengthValidator(key) || !that.storeValidator.hasEnoughSpace(key, value, that.keyValueStore.size)){
        reject("Data could not be inserted");
      } else {
        let result = that.keyValueStore.set(key, value);
        that.actualSize += (key.length + value.length);
        resolve(Array.from(that.keyValueStore.entries()))
      }
    });
  };

  remove(key) {
    var that = this;
    return new Promise(function (resolve, reject) {
      if(that.keyValueStore.has(key)){
        let value = that.keyValueStore.get(key);
        that.actualSize -= (key.length + value.length);
      }
      resolve(that.keyValueStore.delete(key) ? "Element with " + key +" was successfully remove" : "No such key was found");
    })
  };

  getValuesGreaterThan(value) {
    var that = this;
    return new Promise(function(resolve, reject){
      var greaterValues = Array.from(that.keyValueStore.values()).filter(v => v > value);
      resolve(greaterValues);
    });
  };

  getValuesLowerThan(value) {
    var that = this;
    return new Promise(function(resolve, reject){
      resolve(Array.from(that.keyValueStore.values()).filter(v => v < value));
    });
  };
}
