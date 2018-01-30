#!/usr/bin/env node

var current_os = process.platform;
var hosts_file="";

console.log("the current os is: " + current_os);
standard_location = "/etc/hosts";
switch(current_os){
	case "win32":
		hosts_file = "/Windows/System32/drivers/etc/hosts";
		console.log("case: win32");
		break;
	case "linux":
		hosts_file = standard_location;
		console.log("case: linux");
		break;
	case "darwin":
		hosts_file = standard_location;
		console.log("case: darwin");
		break;
	case "freebsd":
		hosts_file = standard_location;
		console.log("case: freebsd");
		break;
	case "sunos":
		hosts_file = standard_location;
		console.log("case: sunos");
		break;
	default:
		hosts_file = standard_location;
		console.log("case: unknown");
		break;
}
if (hosts_file != ""){
	process.argv.slice(2).forEach(function (val, index, array) {
		var fs = require('fs');
		fs.appendFileSync(hosts_file, '127.0.0.1' + "\t" + val + "\n");
		fs.appendFileSync(hosts_file, '127.0.0.1' + "\t" + 'www.' + val + "\n");
		console.log("adding the following to: " + hosts_file);
		process.stdout.write('127.0.0.1' + "\t" + val + "\n");
		process.stdout.write('127.0.0.1' + "\t" + 'www.' + val + "\n");
	});
} else {
	console.log("Nothing written because we can't tell what os this is.");
}
