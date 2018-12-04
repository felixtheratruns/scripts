#!/usr/bin/env node
//   �����������������������������������������������������������������������
//   �This program is free software: you can redistribute it and/or modify �
//   �it under the terms of the GNU General Public License as published by �
//   �the Free Software Foundation, either version 3 of the License, or	   �
//   �(at your option) any later version.				                   �
//   �									                                   �
//   �This program is distributed in the hope that it will be useful,      �
//   �but WITHOUT ANY WARRANTY; without even the implied warranty of       �
//   �MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        �
//   �GNU General Public License for more details.			               �
//   �									                                   �
//   �You should have received a copy of the GNU General Public License	   �
//   �along with this program.  If not, see <http://www.gnu.org/licenses/>.�
//   �����������������������������������������������������������������������
//
//   This program was used to compare files of Javascript programs written by students
//   downloaded from schoology to see if they copied off each other. 
//   However there is some work that needs to be done before this program 
//   can be used for more general purposes.
//   Author: Joel Cambon

var myArgs = process.argv.slice(2);

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

const FileSystem = require('fs');
const Path = require('path');

function readDirR(dir) {
    return FileSystem.statSync(dir).isDirectory()
        ? Array.prototype.concat(...FileSystem.readdirSync(dir).map(f => readDirR(Path.join(dir, f))))
        : dir;
}

files = readDirR(myArgs[0]);

var text = ''

var names = {};
for (var i = 0; i < files.length; i++ ){
	if (files[i] == 'compare_files.js'){
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
    console.log("line:" + line);
}

function remove(array, element){
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}


Array.prototype.extend = function (other_array) {
    /* you should include a test to check whether other_array really is an array */
    if (other_array === undefined || other_array.length == 0) {
        // array empty or does not exist
    } else {
        other_array.forEach(function(v) {this.push(v)}, this);    
    }
}

var broken = false;
var new_array = [];

function getAllExtensionsInArr(arr,extension){
    for (var i = 0; i < arr.length; i++){
        if (arr[i].toLowerCase().endsWith(extension)){
            return arr.filter(function(a){return a.toLowerCase().endsWith(extension);});
        }
    }
}

var extensions = ['.java','rtf','.txt'];
for(var key in names){
    new_array2 = [];
    console.log("entered thing"); 
    for(var ex in extensions){
        new_array2.extend(getAllExtensionsInArr(names[key],extensions[ex])); 
    }
    names[key] = new_array2;
    console.log("names: " + names[key]);
}


for(var key in names){
	console.log(key + "1 : " + names[key]);
//	var absolutePath =path.resolve(names[key][0]);
//	fs.readFile(absolutePath, 'utf8', function(err, data) {  
//	    if (err) throw err;
//		var diff = jsdiff.diffLines(data,data);
//		var diff = jsdiff.diffLines(data,"this is crazy");
//		var diff = jsdiff.diffLines("this is crazy2",data);
//	});
}

function hasNewRevision(current_str, array){
    console.log("array: " + array);
    var array_of_strings = [];
    var array_str = [];
    var has_revision = false;
    var revis = "";
    var tmp = [];
    var tmp_s = "";
    var tmp_i = 0;
    var current = -1;

    //current thing  
    tmp = current_str.split("\\");
    tmp = tmp[2];
    tmp = tmp.split(" "); 
    tmp_s = tmp[1]
    tmp_i = parseInt(tmp_s, 10); 
    current = tmp_i;
    for(var arr in array){
        console.log( "arr:" + arr);
        tmp = arr.split("\\");
        console.log( "tmp" + tmp);
        tmp_s = tmp[2];
        console.log( "tmp_s" + tmp_s);
        tmp = tmp_s.split(" "); 
        tmp_s = tmp[1]
        tmp_i = parseInt(tmp_s, 10); 
        console.log(current + " : " + tmp_i);
        if(tmp_i > current ){
            console.log( "tmp_s" + tmp_i);
            return true;
        }
    }
    return false;
}


var sources = Object.keys(names);
var dests = Object.keys(names);
var diff_out = "";
var array_out = [];
const util = require('util');

var sh = require('shelljs');
var exec_var = 'echo "" > output_diffs';
var output = sh.exec(exec_var, {silent:true}).stdout;
var diff_command = "diff --ignore-all-space --ignore-blank-lines";
var copy_groups = [];
for (var i = 0; i < sources.length; i++) {
	for (var j = i+1; j < dests.length; j++) {
        for(var m=0; m < names[sources[i]].length; m++){
            for(var n=0; n < names[dests[j]].length; n++){
                var source_has_revision = false
                var dest_has_revision = false

                console.log("has_rev: " + names[sources[i]]) 
                if (hasNewRevision(names[sources[i]][m],names[sources[i]])){
                    source_has_revision = true                                           
                }
                console.log("has_rev: " + names[dests[j]]) 
                if (hasNewRevision(names[dests[j]][n],names[dests[j]])){
                    dest_has_revision = true                                           
                }
                if ( source_has_revision && dest_has_revision){
                    continue; 
                }
        		exec_var = diff_command + ' "' + names[sources[i]][m] + '" "' + names[dests[j]][n] + '" | wc -l'
        		output = sh.exec(exec_var, {silent:true}).stdout;
        		if (output < 20){
                    if( source_has_revision && dest_has_revision ){
                        console.log("both have revisions");
                    } else if ( source_has_revision ){       
                        console.log("source has revisions");
                    } else if ( dest_has_revision ) {
                        console.log("source has revisions");
                    } else {
                    }
        			exec_var = 'echo. >> output_diffs && echo. >> output_diffs && echo DIFF >> output_diffs && echo ' + names[sources[i]][m] + ' >> output_diffs && echo ' + names[dests[j]][n] + ' >> output_diffs && echo ' + diff_command + ' "' + names[sources[i]][m] + '" "' + names[dests[j]][n] + '" >> output_diffs';
        			output = sh.exec(exec_var, {silent:true}).stdout;
        			exec_var = diff_command + ' "' + names[sources[i]][m] + '" "' + names[dests[j]][n] + '" >> output_diffs';
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
        			if ( source_in_existing && dest_in_existing ){
        				var replace_group = copy_groups[dest_index];
        				Array.prototype.push.apply(copy_groups[source_index],replace_group);
        				copy_groups.splice(dest_index, 1);	
        			} else if ( source_in_existing ){
        				Array.prototype.push.apply(copy_groups[source_index],[dests[j]]);		
        			} else if ( dest_in_existing ){
        				Array.prototype.push.apply(copy_groups[dest_index],[sources[i]]);
        			} else if ( !source_in_existing ){
        				var tmp = [sources[i]];
        				copy_groups.push([sources[i]]);
        				var num = copy_groups.length-1;
        				copy_groups[copy_groups.length-1].push(dests[j]);
        			} else {
        				throw new Error("copy groups not working");
        			}
                }
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
		//console.log("c grop" + copy_groups[i][d]);
		copy_group_string += "[" + copy_groups[i][d] + "], ";
	}
	copy_group_string = copy_group_string + "' >> output_diffs"
	//console.log(copy_group_string);
	output = sh.exec(copy_group_string, {silent:true}).stdout;
	copy_group_string = "";
}