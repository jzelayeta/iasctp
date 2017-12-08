/**
 * Created by jzelayeta on 11/3/17.
 */

exports.StoreValidator = class {
  constructor() {
    this.config = require('../../../config.json');
  }

  keyLengthValidator(key) {
    let maxKeyLength = this.config.maxKeySize;
    return key.length > maxKeyLength
  };

  valueLengthValidation(value) {
    let maxValueLength = this.config.maxValueSize;
    return value.length > maxValueLength;
  };

  hasEnoughSpace(key, value, actualNodeSize) {
    let nodeSize = this.config.nodeSize;
    return nodeSize >= actualNodeSize + key.length + value.length;
  };
}
