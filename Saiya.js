//sysLib
const http = require('http');
const url = require('url');
const fs = require('fs');
const mime = require('mime');
//MyLib
const { Service, createServiceOfConfigs } = require('./Service.js');
const httpHandler = require('./httpHandler.js');
//config
const config = require('./config.json');
//varable
var services;

function init() {
	services = createServiceOfConfigs(config.services);
	
	if (config.auto)
		for (service of services)
			service.start();

	httpHandler.setService(services);
	startHttpServer();
}

function tryReadFile(path, result) {
	try {
		fs.readFile(path, result);
	} catch(err) {
		result(err, null);
		//console.log(err.toString());
	}
}

function startHttpServer() {
	http.createServer((req, res) => {
		var urlData = url.parse(req.url);
		var path = decodeURI(urlData.pathname);
		
		if (req.method == "GET") {
			if (path == '/') 
				path += 'index.html';
			path = './html' + path;
			tryReadFile(path, function(err,data){
				if(err) {
					res.writeHead(404,{"Content-Type":"text/html"});
					res.end("<h1>404 NOT FOUND</h1>");
					//console.log('WebServer: status 404 Not Found - ' + req.url);
				} else {
					res.writeHead(200,{"Content-Type":mime.getType(path)});
					res.end(data);
					//console.log('WebServer - disk: status 200 OK - ' + req.url);
				}
			});
			return;
		}
		
		if (req.method == "POST") {
			httpHandler.handle(req, res);
			return;
		}
		
		res.writeHead(403,{"Content-Type":"text/html"});
		res.end("<h1>403 No Handler</h1>");
	}).listen(config.port, config.hostname, () => {
		console.log(`Saiya Manager Running at http://${config.hostname}:${config.port}/`);
	});
}

init();