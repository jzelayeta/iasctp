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
		
		store.add(key, value)
			.then((map) => {
				res.json(map);
			})
			.catch((err) => {
				var data = {
					'key': key,
					'value': value
				};
				
				execute(process, 'FORK', data).then(response => {
					res.json(response);
				}).catch(err => {
					res.json("Data could not be inserted");
				});
			})
	});
	
	process.on('message', message => {
		switch(message.type) {
			case 'GET':
				var response = store.get(message.data);
				process.send(response ? response : "");
				break;
			case 'INSERT':
				store.add(message.data.key, message.data.value)
					.then((map) => {
						process.send(map);
					})
					.catch((err) => {
						process.send(err);
					})
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
			if(response != "")
				resolve(response);
			else
				reject(response);
		});
		
		worker.send(message);
	});
};