/**
 * Created by jzelayeta on 11/3/17.
 */

const config = require('../../../config.json');

exports.keyLengthValidator = (key) => {
    let maxKeyLength = config.maxKeySize;
    return key.length > maxKeyLength
};

exports.valueLengthValidation = (value) => {
    let maxValueLength = config.maxValueSize;
    return value.length > maxValueLength;
};

exports.hasEnoughSpace = (key, value, actualNodeSize) => {
    let nodeSize = config.nodeSize;
    return nodeSize >= actualNodeSize + key.length + value.length;
};