var express = require('express'),
	cluster = require('cluster'),
    app = express(),
    port = process.env.PORT || 3000,
	portWorkers = port+1;
    bodyParser = require('body-parser'),
	store = require('./api/store/store');

if (cluster.isMaster) {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.listen(port);
	
	for (var i = 0, len = 1; i < len; i++) {
		cluster.fork();
	}
	
	app.route('/store/:key')
        .get(function(req, res) {
			var message = {
				'type': 'GET',
				'data': req.params.key
			};
			
			for(const id in cluster.workers) {
				cluster.workers[id].send(message, function(response) {
					console.log(response);
				});
			}
			
			//res.json('no se encontro');
		})
        .delete(function(req, res) {
			/*var message = {
				'type': 'DELETE',
				'body': req.body
			};
			
			for(const worker in cluster.workers) {
				worker.send(message);
			}*/
		});
	
	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
		cluster.fork();
	});
	
	cluster.on('message', (worker, message, handle) => {
		if (message.type == 'GET') {
			handle.json(message.data);
		}
	});
}
else {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.listen(portWorkers);
	
	console.log('todo list RESTful API server started on: ' + portWorkers);

	module.exports = app;
	console.log(`Worker ${process.pid} started`);
	
	app.route('/store/').post(function(req, res){
		let key = req.body.key;
		let value = req.body.value;
		store.add(key, value)
			.then((map) => {
				res.json(map)
			})
			.catch((err) => {
				res.json(err)
			})
	});
	
	process.on('message', (message, callback) => {
		switch(message.type) {
			case 'GET':
				store.get(message.data)
					.then((value) => {
						var response = {
							'type': 'GET',
							'ok': true,
							'data': value
						};
						
						process.send(response);
					})
					.catch((err) => {
						var response = {
							'type': 'GET',
							'ok': false,
							'data': err
						};
						
						process.send(response);
					})
				break;
		}
	});
}