/**
 * Created by jzelayeta on 11/2/17.
 */

var keyValueStore = new Map([["1","JULIAN"]]);

exports.get = function get(key){
    return keyValueStore.get(key)
};

exports.add = function put(key, value){
    keyValueStore.set(key, value);
    return "Element with key: " + key + " and value: " + value + " was added";
};

exports.remove = function remove(key){
    return keyValueStore.delete(key) ? "Element with " + key +" was successfully remove" : "No such key was found"
};