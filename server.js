var express = require('express'),
	cluster = require('cluster'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');

if (cluster.isMaster) {
	cluster.fork();
	
	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
		cluster.fork();
	});
}
else {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());


	var routes = require('./api/routes/routes');
	routes(app);


	app.listen(port);


	console.log('todo list RESTful API server started on: ' + port);

	module.exports = app;
	console.log(`Worker ${process.pid} started`);
}