var express = require('express'),
	cluster = require('cluster'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');

cluster.setupMaster({
  exec: './database_worker.js',
  args: ['--use', 'https']
});
	
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