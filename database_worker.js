var express = require('express'),
	cluster = require('cluster'),
    app = express(),
	portWorkers = (process.env.PORT || 3000) + 1;
    bodyParser = require('body-parser'),
	store = require('./api/store/store');

if (cluster.isWorker) {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.listen(portWorkers);
	
	console.log('todo list RESTful API server started on: ' + portWorkers);

	module.exports = app;
	console.log(`Worker ${process.pid} started`);
	
	app.route('/store/').post(function(req, res){
		let key = req.body.key;
		let value = req.body.value;
		
		execute(process, 'KEY_EXISTS', key).then(response => {		
			store.add(key, value)
				.then((map) => {
					execute(process, 'ADD_KEY', key).then(key_exists => {
						res.json(map);
					}).catch(err => {
						res.json(map);
					});
				})
				.catch((err) => {
					var data = {
						'key': key,
						'value': value
					};
					
					execute(process, 'FORK', data).then(response => {												
						execute(process, 'ADD_KEY', key).then(key_exists => {
							res.json(response);
						}).catch(err => {
							res.json(response);
						});
						
					}).catch(err => {
						res.json(err);
					});
				})			
		}).catch(err => {
			res.json(err);
		});	
	});
	
	process.on('message', message => {
		switch(message.type) {
			case 'GET':
				store.get(message.data)
					.then((response) => {
						process.send({
							'ok': true,
							'data': response
						});
					})
					.catch((err) => {
						process.send({
							'ok': false,
							'data': err
						})
					});
				break;
			case 'INSERT':
				store.add(message.data.key, message.data.value)
					.then((map) => {
						process.send({
							'ok': true,
							'data': map
						});
					})
					.catch((err) => {
						process.send({
							'ok': false,
							'data': err
						});
					})
				break;
			case 'DELETE':
				store.remove(message.data)
					.then((response) => {
						process.send({
							'ok': true,
							'data': response
						});;		
					})
					.catch((err) => {
						process.send({
							'ok': false,
							'data': err
						});
					});
				break;
			case 'GREATER':
				store.getValuesGreaterThan(message.data)
					.then((response) => {
						process.send({
							'ok': true,
							'data': response
						});
					})
					.catch((err) => {
						process.send({
							'ok': false,
							'data': []
						});
					});
				break;
			case 'LOWER':
				store.getValuesLowerThan(message.data)
					.then((response) => {
						process.send({
							'ok': true,
							'data': response
						});
					})
					.catch((err) => {
						process.send({
							'ok': false,
							'data': []
						});
					});
				break;
		}
	});
}

function execute(worker, type, data) {	
	var message = {
		'type': type,
		'data': data
	};

	return new Promise(function (resolve, reject) {	
		worker.once('message', response => {
			if(response.ok)
				resolve(response.data);
			else
				reject(response.data);
		});
		
		worker.send(message);
	});
};