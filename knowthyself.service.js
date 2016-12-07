let fs = require('fs');
let http = require('http');
let url = require('url');

const NOT_FOUND = 'unknown';

function extractHeaderInfo(request) {
	let json = {};
	json["ipaddress"] = request.socket.address().address;
	if (request.headers && request.headers['accept-language']) {
		json["language"] = request.headers['accept-language'].split(',', 1)[0];
	} else {
		json["language"] = NOT_FOUND;
	}
	if (request.headers && request.headers['user-agent']) {
		let min = request.headers['user-agent'].indexOf('(');
		let max = request.headers['user-agent'].indexOf(')');
		if (min !== -1 && max !== -1 && min < max) {
			json["software"] = request.headers['user-agent'].substring(min+1,max);
		} else {
			json["language"] = NOT_FOUND;
		}
	} else {
		json["language"] = NOT_FOUND;
	}
	return json;
}

// launch the knowThyself service
function launchServer(port) {
	let server = http.createServer(
		function callback (request, response) {
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.write(JSON.stringify(extractHeaderInfo(request)));
			response.end();
		}
	);
	server.listen(port);

	return server;
}

// handle imports
exports.launchServer = launchServer;

// handle direct calls
if (require.main === module && process.argv.length > 2) {
	launchServer(process.argv[2]);
}
