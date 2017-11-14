/**
 * Created by jzelayeta on 11/2/17.
 */
var storeValidator = require('../controllers/validations/storeValidations');
let keyValueStore = new Map();

nodeSize = () => {
  return keyValueStore.size
};

exports.get = (key) => {
    return new Promise(function(resolve, reject){
        resolve(keyValueStore.get(key))
    });
};

exports.add = (key, value) => {
    return new Promise(function (resolve, reject) {
        if(storeValidator.valueLengthValidation(key) || storeValidator.keyLengthValidator(key) || !storeValidator.hasEnoughSpace(keyValueStore.size)){
            reject("Data could not be inserted");
        } else {
            let result = keyValueStore.set(key, value);
            resolve(Array.from(result))
        }
    });
};

exports.remove = (key) => {
    return new Promise(function (resolve, reject) {
        resolve(keyValueStore.delete(key) ? "Element with " + key +" was successfully remove" : "No such key was found");
    })
};

exports.getValuesGreaterThan = (value) => {
    return new Promise(function(resolve, reject){
        resolve(Array.from(keyValueStore.values()).filter(v => v > value));
    });
};

exports.getValuesLowerThan = (value) => {
    return new Promise(function(resolve, reject){
       resolve(Array.from(keyValueStore.values()).filter(v => v < value));
    });
};