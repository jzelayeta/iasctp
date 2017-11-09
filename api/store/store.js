/**
 * Created by jzelayeta on 11/2/17.
 */
var storeValidator = require('../controllers/validations/storeValidations');
let keyValueStore = new Map();


exports.get = (key) => {
    return keyValueStore.get(key)
};

exports.add = (key, value) => {
    return new Promise(function (resolve, reject) {
        if(storeValidator.valueLengthValidation(key) || storeValidator.keyLengthValidator(key)){
            reject(new Error("Data could not be inserted"), null);
        } else {
            let result = keyValueStore.set(key, value);
            resolve(Array.from(result))
        }
    });
};

exports.remove = (key) => {
    return keyValueStore.delete(key) ? "Element with " + key +" was successfully remove" : "No such key was found"
};

exports.getValuesGreaterThan = (value) => {
    return Array.from(keyValueStore.values()).filter(v => v > value);
};

exports.getValuesLowerThan = (value) => {
    return Array.from(keyValueStore.values()).filter(v => v < value);
};