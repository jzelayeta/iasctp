'use strict';
module.exports = function(app) {
    var { Controller } = require('../controllers/controller');
    var controller = new Controller();

    app.route('/store/:key')
        .get(function(req, res) { controller.get(req, res) })
        .delete(function(req, res) { controller.remove(req, res) });

    app.route('/store/greater/:value')
        .get(function(req, res) { controller.getValuesGreaterThan(req, res) });

    app.route('/store/lower/:value')
        .get(function(req, res) { controller.getValuesLowerThan(req, res) });

    app.route('/store/')
        .post(function(req, res) { controller.add(req, res) });
};
