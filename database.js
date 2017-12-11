var express = require('express'),
	cluster = require('cluster'),
    app = express(),
    port = process.env.PORT || 3000,
	portWorkers = port+1;
    bodyParser = require('body-parser'),
	store = require('./api/store/store');
	
if (cluster.isMaster) {
	cluster.schedulingPolicy = cluster.SCHED_RR;
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.listen(port);
	
	cluster.fork();
	
	app.route('/store/:key')
        .get(function(req, res) {	
			var sended = false;
			var count = 0;
			
			for(const id in cluster.workers) {		
				count++;
				execute(cluster.workers[id], 'GET', req.params.key).then((response) => {
					count--;
					if(!sended) {
						sended = true;
						res.json(response);
					}
				}).catch((err) => {
					count--;
					if(!sended && count == 0) {
						sended = true;
						res.json("");
					}
				});
			}
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
	
	cluster.on('message', (sender, message) => {
		switch(message.type) {
			case 'FORK':
				var worker = cluster.fork();
				execute(worker, 'INSERT', message.data).then(response => {
					sender.send(response);
				}).catch(err => {
					sender.send(err);
				});
				break;
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