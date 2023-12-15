const querystring = require('querystring');
const url = require('url');
const fs = require('fs');
const mime = require('mime')

var services;
const EXPORT = {
	setService: function(ss) {
		services = ss;
	},
	handle: function(req, res) {
		let urlData = url.parse(req.url);
		let path = urlData.pathname;
		let query = querystring.parse(urlData.query);
		
		let result = {code:0,msg:''};
		if (path == '/listServices') {
			let r = listServices();
			result.msg = r.msg;
			result.data = r.data;
		} else if (path == '/getService') {
			let r = getService(query.id);
			result.msg = r.msg;
			result.data = r.data;
		} else if (path == '/stopService') {
			let r = stopService(query.id);
			result.msg = r.msg;
			result.data = r.data;
		} else if (path == '/startService') {
			let r = startService(query.id);
			result.msg = r.msg;
			result.data = r.data;
		} else if (path == '/getServiceOut') {
			let r = getServiceOut(query.id);
			result.msg = r.msg;
			result.data = r.data;
			result.isrun = r.isrun;
		} else {
			result.code = -1;
			result.msg = '';
		}
		res.writeHead(200,{"Content-Type":"application/json"});
		res.end(JSON.stringify(result));
	}
};

function getService(id) {
	let res = {};
	let service = services[id];	
	try {
		service.isRun();
		res.msg = '获取成功';
		res.data = {
			id: id,
			description: service.description,
			cmd: service.CMD,
			args: service.args,
			isrun: service.isRun()
		};
	} catch(e) {
		res.msg = '获取失败' + e;
	}
	return res;
}

function listServices() {
	let res = {};
	res.msg = '获取成功';
	res.data = [];
	for (let i=0;i<services.length;i++) {
		let service = services[i];
		let item = {
			id: i,
			description: service.description,
			cmd: service.CMD,
			args: service.args,
			isrun: service.isRun()
		};
		res.data.push(item);
	}
	return res;
}

function startService(id) {
	let res = {};
	let service = services[id];
	try {
		if (service.isRun()) {
			res.data = 1;
			res.msg = '服务已在运行';
		} else {
			res.data = service.start();
			res.data = 0;
			res.msg = '服务启动成功';
		}
	} catch(e) {
		res.msg = '服务启动失败' + e;
	}
	return res;
}

function stopService(id) {
	let res = {};
	let service = services[id];
	try {
		if (!service.isRun()) {
			res.data = 1;
			res.msg = '服务不在运行';
		} else {
			res.data = service.stop();
			res.data = 0;
			res.msg = '服务停止成功';
		}
	} catch(e) {
		res.msg = '服务停止失败' + e;
	}
	return res;
}

function getServiceOut(id) {
	let res = {};
	try {
		res.data = services[id].getOut();
		res.isrun = services[id].isRun();
		res.msg = '获取成功';
	} catch(e) {
		res.msg = '获取失败' + e;
	}
	return res;
}

module.exports = EXPORT;