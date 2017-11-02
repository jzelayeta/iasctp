'use strict';
module.exports = function(app) {
    var dummyController = require('../controllers/dummyController');

    app.route('/store/:key')
        .get(dummyController.get)
        .delete(dummyController.remove);

    app.route('/store/')
        .post(dummyController.add);
};