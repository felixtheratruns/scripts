#!/usr/bin/env node
//   �����������������������������������������������������������������������
//   �This program is free software: you can redistribute it and/or modify �
//   �it under the terms of the GNU General Public License as published by �
//   �the Free Software Foundation, either version 3 of the License, or	   �
//   �(at your option) any later version.				   �
//   �									   �
//   �This program is distributed in the hope that it will be useful,      �
//   �but WITHOUT ANY WARRANTY; without even the implied warranty of       �
//   �MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        �
//   �GNU General Public License for more details.			   �
//   �									   �
//   �You should have received a copy of the GNU General Public License	   �
//   �along with this program.  If not, see <http://www.gnu.org/licenses/>.�
//   �����������������������������������������������������������������������
//
//   This program was used to compare files of Javascript programs written by students
//   downloaded from schoology to see if they copied off each other. 
//   However there is some work that needs to be done before this program 
//   can be used for more general purposes.



const fs = require('fs')
const path = require('path')

const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());


module.exports = function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}



//const read = (dir) =>
//  fs.readdirSync(dir)
//    .reduce((files, file) =>
//      fs.statSync(path.join(dir, file)).isDirectory() ?
//        files.concat(read(path.join(dir, file))) :
//        files.concat(path.join(dir, file)),
//      []);
//

const FileSystem = require('fs');
const Path = require('path');

function readDirR(dir) {
    return FileSystem.statSync(dir).isDirectory()
        ? Array.prototype.concat(...FileSystem.readdirSync(dir).map(f => readDirR(Path.join(dir, f))))
        : dir;
}

files = readDirR('cookie_input');

var text = ''

var names = {};
for (var i = 0; i < files.length; i++ ){
	if (files[i] == 'script.js'){
		continue;
	}	
	var line = files[i];
 	var name = line.match(/^[^-]*[^ -]/)[0];
	var name = name.substr(name.lastIndexOf('\\') + 1);
	if(name in names){
		names[name].push(line);
	}else {
		names[name] = [line];
	}
	//console.log(files[i]);		
}

function remove(array, element){
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

var broken = false;
var new_array = [];
for(var key in names){
	new_array = [];
	broken = false;	
	for (var i = 0; i < names[key].length; i++){
		if (names[key][i].includes('Revision 4')){
			new_array = names[key].filter(function(a){return a.includes('Revision 4');});
			names[key] = new_array;
			broken = true;
			break;
		} 
	}
 	if (!broken){
		broken = false;
		new_array = [];
		for (var i = 0; i < names[key].length; i++){
			if (names[key][i].includes('Revision 3')){
				new_array = names[key].filter(function(a){return a.includes('Revision 3');});
				names[key] = new_array;
				broken = true;
				break;
			} 
		}
		if (!broken){
			new_array = [];
			for (var i = 0; i < names[key].length; i++){
				if (names[key][i].includes('Revision 2')){
					new_array = names[key].filter(function(a){return a.includes('Revision 2');});
					names[key] = new_array;
					break;
				}
			}
		}	
	}

	broken = false;
	new_array = [];
	for (var i = 0; i < names[key].length; i++){
		if (names[key][i].endsWith('.js')){
			new_array = names[key].filter(function(a){return a.endsWith('.js');});
			names[key] = new_array;
			broken = true;	
			break;	
		}

	}
	if (!broken){
		new_array = [];
		for (var i = 0; i < names[key].length; i++){
			if (names[key][i].endsWith('.html')){
				new_array = names[key].filter(function(a){return a.endsWith('.html');});
				names[key] = new_array;
				break;	
			}	
		}
	}

}


for(var key in names){
	console.log(key + " : " + names[key]);
//	var absolutePath =path.resolve(names[key][0]);
//	console.log(absolutePath);	
//	fs.readFile(absolutePath, 'utf8', function(err, data) {  
//	    if (err) throw err;
//		var diff = jsdiff.diffLines(data,data);
//	    	console.log(diff);
//		var diff = jsdiff.diffLines(data,"this is crazy");
//	    	console.log(diff);
//		var diff = jsdiff.diffLines("this is crazy2",data);
//	    	console.log(diff);
//	});
}


var sources = Object.keys(names);
var dests = Object.keys(names);
var diff_out = "";
var array_out = [];
const util = require('util');

var sh = require('shelljs');
var exec_var = 'echo "" > output_diffs';
var output = sh.exec(exec_var, {silent:true}).stdout;

var copy_groups = [];
for (var i = 0; i < sources.length; i++) {
	for (var j = i+1; j < dests.length; j++) {
		//console.log(names[sources[i]][0]);
		//console.log(names[dests[j]][0]);
		exec_var = 'diff "' + names[sources[i]][0] + '" "' + names[dests[j]][0] + '" | wc -l'
		output = sh.exec(exec_var, {silent:true}).stdout;
		if (output < 20){

			exec_var = 'echo. >> output_diffs && echo. >> output_diffs && echo DIFF >> output_diffs && echo ' + names[sources[i]][0] + ' >> output_diffs && echo ' + names[dests[j]][0] + ' >> output_diffs && echo diff "' + names[sources[i]][0] + '" "' + names[dests[j]][0] + '" >> output_diffs';
			output = sh.exec(exec_var, {silent:true}).stdout;
		
			exec_var = 'diff "' + names[sources[i]][0] + '" "' + names[dests[j]][0] + '" >> output_diffs';
			output = sh.exec(exec_var, {silent:true}).stdout;
			output = "";	
			
			var source_in_existing = false;		
			var source_index = 0;	
			var dest_in_existing = false;			
			var dest_index = 0;	
			for (var k = 0; k < copy_groups.length; k++){		
				for (var a = 0; a < copy_groups[k].length; a++){
					console.log(a + "copy_group: " + copy_groups[k][a]);		
				}
				if(copy_groups[k].indexOf(sources[i]) > -1){
					console.log(sources[i] + " is in group ");
					source_in_existing = true;	
					source_index = k; 
				} 
					
				if(copy_groups[k].indexOf(dests[j]) > -1 ){
					console.log(dests[j] + " is in group ");
					dest_in_existing = true;
					dest_index = k;	
				}
			}

			if ( dest_index == source_index && source_in_existing && dest_in_existing ){
				continue;
			}
			console.log("in less than: " + sources[i] + " : " + dests[j]);
			if ( source_in_existing && dest_in_existing ){
				var replace_group = copy_groups[dest_index];
				console.log("Array.prototype.push.apply("+copy_groups[source_index] + "," + replace_group +");");
				Array.prototype.push.apply(copy_groups[source_index],replace_group);
				console.log("copy_groups.splice("+dest_index + "," + 1 +");");
				copy_groups.splice(dest_index, 1);	
			} else if ( source_in_existing ){
				console.log("Array.prototype.push.apply("+copy_groups[source_index] + "," + [dests[j]] + ");");
				Array.prototype.push.apply(copy_groups[source_index],[dests[j]]);		
			} else if ( dest_in_existing ){
				console.log("Array.prototype.push.apply("+copy_groups[dest_index] + "," + [sources[i]] + ");");
				Array.prototype.push.apply(copy_groups[dest_index],[sources[i]]);

			} else if ( !source_in_existing && !dest_in_existing ){
				console.log("copy_groups.push(["+sources[i] + "]);");
				var tmp = [sources[i]];
				copy_groups.push([sources[i]]);
				console.log(copy_groups.length-1);
				var num = copy_groups.length-1;
				console.log(">>copy_groups["+(copy_groups.length-1)+">>].push("+dests[j]+");");
				copy_groups[copy_groups.length-1].push(dests[j]);
			} else {
				throw new Error("copy groups not working");
			}

		}				
	}
}


for (var i = 0; i < copy_groups.length; i++){
	console.log("new group: ");
	for(var c = 0; c < copy_groups[i].length; c++){
		process.stdout.write(copy_groups[i][c]);
	}	
}



var copy_group_string = "echo. >> output_diffs && echo 'Group number: followed by people in group' >> output_diffs && ";
for (var i = 0; i < copy_groups.length; i++){
	copy_group_string += "echo '" + i + ": ";
	for(var d = 0; d < copy_groups[i].length; d++){	
		console.log("c grop" + copy_groups[i][d]);
		copy_group_string += "[" + copy_groups[i][d] + "], ";
	}
	copy_group_string = copy_group_string + "' >> output_diffs"
	console.log(copy_group_string);
	output = sh.exec(copy_group_string, {silent:true}).stdout;
	copy_group_string = "";
}

//			exec(exec_var, (err, stdout, stderr) => {
//			if (err) {
//			// node couldn't execute the command
//				return;
//			}
//			var std_out = `${stdout}`;
//			if (std_out < 300){
//				long_enough = true;	
//			}
//			// the *entire* stdout and stderr (buffered)
//			console.log(`stdout: ${stdout}`);
//			console.log(`stderr: ${stderr}`);
//		});
//
//
//for (var i = 0; i < sources.length; i++) {
//	for (var j = i+1; j < dests.length; j++) {
//		exec_var = 'echo. >> output_diffs && echo. >> output_diffs && echo. >> output_diffs && echo "'+' diff of ' + sources[i] + ' and ' + dests[j] + '" >> output_diffs';
//		exec(exec_var, (err, stdout, stderr) => {
//			if (err) {
//			// node couldn't execute the command
//				return;
//			}
//
//			// the *entire* stdout and stderr (buffered)
//			console.log(`stdout: ${stdout}`);
//			console.log(`stderr: ${stderr}`);
//
//			console.log('diff "' + names[sources[i]][0] + '" "' + names[dests[j]][0] + '" >> output_diffs');
//			exec_var = 'diff "' + names[sources[i]][0] + '" "' + names[dests[j]][0] + '" >> output_diffs';
//			exec(exec_var, (err, stdout, stderr) => {
//				if (err) {
//				// node couldn't execute the command
//					return;
//				}
//
//				// the *entire* stdout and stderr (buffered)
//				console.log(`stdout: ${stdout}`);
//				console.log(`stderr: ${stderr}`);
//			});
//		});
//	}
//}
//      
//
//      
//
//		var absolutePath1 =path.resolve(names[sources[i]][0]);
//		fs.readFile(absolutePath1, 'utf8', function(err, data1) {  
//	    		if (err) throw err;
//	    		var absolutePath2 =path.resolve(names[dests[j]][0]);
//			fs.readFile(absolutePath2, 'utf8', function(err, data2) {  
//	    			if (err) throw err;
//
//
//
//			});
//
//		});

//var group_count = 0;	
//			if 
//			for (group in copy_groups){		
//				if(sources[i] in copy_group[group] ){
//					copy_groups[group]			
//				} else {
//					
//				}
//	
//				if(dests[i] in copy_group[group]){
//					copy_groups[group]			
//				} else {
//	
//				}
//			}
//
//
