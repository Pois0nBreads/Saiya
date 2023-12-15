const { exec, spawn } = require('child_process');
const iconv = require('iconv-lite');

class Service {
	
	stdout = [];
	child = null;
	CMD = null;
	description = null;
	args = null;
	stdFmt = null;
	stdSize = 200;
	
	constructor(config) {
		this.CMD = config.cmd;
		this.description = config.des;
		this.args = config.args;
		this.stdFmt = config.format || 'utf-8';
		this.stdSize = config.log_max_size || 200;
	}
	
	start() {
		if (this.child)
			return;
		this.clearOut();
		this.child = spawn(this.CMD, this.args);
		
		this.child.stdout.on('data', (data) => {
			this.appendOut(data);
		});
		this.child.stderr.on('data', (data) => {
			this.appendOut(data);
		});
		this.child.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
			this.appendText(`运行结束 退出码: ${code}`);
			this._clear();
		});
	}
	
	_clear() {
		this.child.stdout.on('data', (data) => {});
		this.child.stderr.on('data', (data) => {});
		this.child.on('close', (code) => {});
		this.child = null;
	}
	
	stop() {
		if (this.child == null)
			return;
		this.child.kill('SIGTERM');
	}
	
	isRun() {
		if (this.child)
			return true;
		else
			return false;
	}
	
	getOut() {
		let out = '';
		for (let item of this.stdout)
			out += item;
		return out;
	}
	
	clearOut() {
		this.stdout = [];
	}
	
	appendOut(data) {
		if (this.stdFmt.length >= this.stdSize)
			this.stdFmt.splice(0, 1);
		let str = iconv.decode(data, this.stdFmt);
		this.stdout.push(str);
	}
	
	appendText(str) {
		if (this.stdFmt.length >= this.stdSize)
			this.stdFmt.splice(0, 1);;
		this.stdout.push(str);
	}
}

function createServiceOfConfigs(config) {
	let services = [];
	for (let c of config) 
		services.push(new Service(c));
	return services;
}

module.exports = {
	Service: Service,
	createServiceOfConfigs: createServiceOfConfigs
};