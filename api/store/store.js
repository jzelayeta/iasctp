/**
 * Created by jzelayeta on 11/2/17.
 */

const config = require('../../config');
let keyValueStore = new Map();

exports.get = function get(key){
    return keyValueStore.get(key)
};

exports.add = function put(key, value){
    let result = keyValueStore.set(key, value);
    return Array.from(result);
};

exports.remove = function remove(key){
    return keyValueStore.delete(key) ? "Element with " + key +" was successfully remove" : "No such key was found"
};

exports.getValuesGreaterThan = function getValuesGreaterThan(value){
    return Array.from(keyValueStore.values()).filter(v => v > value);
};

exports.getValuesLowerThan = function getValuesLowerThan(value){
    return Array.from(keyValueStore.values()).filter(v => v < value);
};