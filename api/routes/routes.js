'use strict';
module.exports = function(app) {
    var dummyController = require('../controllers/dummyController');

    app.route('/store/:key')
        .get(dummyController.get)
        .delete(dummyController.remove);

    app.route('/store/greater/:value')
        .get(dummyController.getValuesGreaterThan);

    app.route('/store/lower/:value')
        .get(dummyController.getValuesLowerThan);


    app.route('/store/')
        .post(dummyController.add);
};