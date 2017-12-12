var express = require('express'),
	cluster = require('cluster'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');

cluster.setupMaster({
  exec: './database_worker.js',
  args: ['--use', 'https']
});

var keys = [];
	
if (cluster.isMaster) {
	cluster.schedulingPolicy = cluster.SCHED_RR;
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.listen(port);
	
	cluster.fork();
	
	app.route('/store/:key')
        .get(function(req, res) {	
			resendToChildren('GET', req, res);
		})
        .delete(function(req, res) {
			resendToChildren('DELETE', req, res, function() {
				delete keys[req.params.key];
			});
		});
		
	app.route('/store/greater/:value')
		.get(function(req, res) {
			getAll('GREATER', req, res);
		});
		
	app.route('/store/lower/:value')
		.get(function(req, res) {
			getAll('LOWER', req, res);
		});
	
	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
		deleteKeys(worker.process.pid);
		cluster.fork();
	});
	
	cluster.on('message', (sender, message) => {
		switch(message.type) {
			case 'FORK':
				var worker = cluster.fork();
				execute(worker, 'INSERT', message.data).then(response => {
					sender.send({
						'ok': true,
						'data': response
					});
				}).catch(err => {
					sender.send({
						'ok': false,
						'data': err
					});
				});
				break;
			case 'ADD_KEY':	
				keys[message.data] = sender.process.pid;
				sender.send({
					'ok': true,
					'data': ''
				});
				break;
			case 'KEY_EXISTS':
				if(!keys[message.data])
					sender.send({
						'ok': true,
						'data': ''
					});
				else
					sender.send({
						'ok': false,
						'data': 'Key already exists'
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

function deleteKeys(pid) {
	for(var id in keys) {
		if(keys[id] == pid)
			delete keys[id];
	}
};

function resendToChildren(type, req, res, success) {
	var sended = false;
	var count = 0;
	
	for(const id in cluster.workers) {		
		count++;
		execute(cluster.workers[id], type, req.params.key).then((response) => {
			count--;
			if(!sended) {				
				if(success)
					success();
				
				sended = true;
				res.json(response);
			}
		}).catch((err) => {
			count--;
			if(!sended && count == 0) {
				sended = true;
				res.json(err);
			}
		});
	}
};

function getAll(type, req, res) {
	var count = 0;
	var results = [];
	for(const id in cluster.workers) {		
		count++;
		execute(cluster.workers[id], type, req.params.key).then((response) => {
			count--;
			
			for(var result in response) {
				results.push(result);
			}
					
			if(count == 0) {				
				sended = true;
				res.json(results);
			}
		}).catch((err) => {
			count--;
			
			for(var result in response) {
				results.push(result);
			}
			
			if(count == 0) {
				sended = true;
				res.json(results);
			}
		});
	}
};