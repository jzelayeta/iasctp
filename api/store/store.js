/**
 * Created by jzelayeta on 11/2/17.
 */
var storeValidator = require('../controllers/validations/storeValidations');
let keyValueStore = new Map();
let actualSize = 0;

nodeSize = () => {
  return keyValueStore.size
};

exports.get = (key) => {
	return keyValueStore.get(key);
    /*return new Promise(function(resolve, reject){

    });*/
};

exports.add = (key, value) => {
    return new Promise(function (resolve, reject) {
        if(storeValidator.valueLengthValidation(value) || storeValidator.keyLengthValidator(key) || !storeValidator.hasEnoughSpace(key, value, keyValueStore.size)){
            reject("Data could not be inserted");
        } else {
            let result = keyValueStore.set(key, value);
            actualSize += (key.length + value.length);
            resolve(Array.from(keyValueStore.entries()))
        }
    });
};

exports.remove = (key) => {
    return new Promise(function (resolve, reject) {
        if(keyValueStore.has(key)){
            let value = keyValueStore.get(key);
            actualSize -= (key.length + value.length);
        }
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