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
	
	for (var i = 0, len = 2; i < len; i++) {
		cluster.fork();
	}
	
	app.route('/store/:key')
        .get(function(req, res) {	
			var sended = false;
			var count = 0;
			
			for(const id in cluster.workers) {		
				count++;
				execute(cluster.workers[id], 'GET', req.params.key).then((response) => {
					count--;
					if(!sended) {
						res.json(response);
					}
				}).catch((err) => {
					count--;
					if(!sended && count == 0)
						res.json(err);
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
	
	process.on('message', message => {
		switch(message.type) {
			case 'GET':
				var response = store.get(message.data);
				process.send(response ? response : "");
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