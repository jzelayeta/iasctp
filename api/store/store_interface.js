const https = require('http');
const options = {
	hostname: 'localhost',
	port: 0,
	path: '',
	method: '',
	headers: {
		'Content-Type': 'application/json'
	}
};

exports.get = (key) => {
    return new Promise(function(resolve, reject){
		options.port = 4000;
		options.path = '/store/'+key;
		options.method = 'GET';
				
		const req = https.request(options, (res) => {
			res.on('data', (d) => {
				resolve(JSON.parse(d));
			});
		});

		req.on('error', (e) => {
			reject("Connection lost");
		});
		
		req.end();
    });
};

exports.add = (data) => {
    return new Promise(function (resolve, reject) {
		options.port = 4001;
		options.path = '/store';
		options.method = 'POST';
		
		const req = https.request(options, (res) => {
			res.on('data', (d) => {
				resolve(JSON.parse(d));
			});
		});

		req.on('error', (e) => {
			reject("Connection lost");
		});
		
		req.write(JSON.stringify(data));
		req.end();
    });
};

exports.remove = (key) => {
    return new Promise(function (resolve, reject) {
		options.port = 4000;
		options.path = '/store/'+key;
		options.method = 'DELETE';
				
		const req = https.request(options, (res) => {
			res.on('data', (d) => {
				resolve(JSON.parse(d));
			});
		});

		req.on('error', (e) => {
			reject("Connection lost");
		});
		
		req.end();
    });
};

exports.getValuesGreaterThan = (value) => {
    return new Promise(function(resolve, reject){
		options.port = 4000;
		options.path = '/store/greater/'+value;
		options.method = 'GET';
				
		const req = https.request(options, (res) => {
			res.on('data', (d) => {
				resolve(JSON.parse(d));
			});
		});

		req.on('error', (e) => {
			reject("Connection lost");
		});
		
		req.end();
    });
};

exports.getValuesLowerThan = (value) => {
    return new Promise(function(resolve, reject){
		options.port = 4000;
		options.path = '/store/lower/'+value;
		options.method = 'GET';
				
		const req = https.request(options, (res) => {
			res.on('data', (d) => {
				resolve(JSON.parse(d));
			});
		});

		req.on('error', (e) => {
			reject("Connection lost");
		});
		
		req.end();
    });
};