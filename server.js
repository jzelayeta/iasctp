var express = require('express'),
	cluster = require('cluster'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');

if (cluster.isMaster && process.env.NODE_ENV !== 'test') {
	console.log(`Master ${process.pid} started`);
	cluster.fork();

	cluster.on('exit', (worker, code, signal) => {
		console.log(`Worker ${worker.process.pid} died`);
		cluster.fork();
	});
}
else {
	module.exports = app;
	console.log(`Worker ${process.pid} started`);

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	var routes = require('./api/routes/routes');
	routes(app);

	app.listen(port);

	console.log('orchestrator RESTful API server started on: ' + port);
}
