#!/usr/bin/env python
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# original code was taken from here http://stackabuse.com/read-a-file-line-by-line-in-python/
import sys  
import os
input_filepath1 = '../hosts/hosts'
input_filepath2 = '../hosts_version_linux/hosts'  
input_filepath3 = '../hosts_version_windows/hosts'  

output_file = 'merged_hosts'
with open(input_filepath1) as fp:  
    line = fp.readline()
    cnt = 1
    while line:
        print("Line {}: {}".format(cnt, line.strip()))
        line = fp.readline()
        cnt += 1


def main():  
    #filepath = sys.argv[1]

    if not os.path.isfile(input_filepath1):
        print("File path {} does not exist. Exiting...".format(input_filepath1))
        sys.exit()

    if not os.path.isfile(input_filepath2):
        print("File path {} does not exist. Exiting...".format(input_filepath2))
        sys.exit()
 
    if not os.path.isfile(input_filepath3):
        print("File path {} does not exist. Exiting...".format(input_filepath2))
        sys.exit()
 

    lines_in_files = {}
    cnt = 0
    with open(input_filepath1) as fp:
        for line in fp:
            line = line.strip()
            if (line.startswith('127.0.0.1')):
                line = line.strip()
                record_line_cnt(line, lines_in_files)
                cnt += 1
    with open(input_filepath2) as fp:
        for line in fp:
            line = line.strip()
            if (line.startswith('127.0.0.1')):
                record_line_cnt(line, lines_in_files)
                cnt += 1
    with open(input_filepath3) as fp:
        for line in fp:
            line = line.strip()
            if (line.startswith('127.0.0.1')):
                record_line_cnt(line, lines_in_files)
                cnt += 1


    sorted_lines = order_lines_in_files(lines_in_files)
    fh = open(output_file, "w")
    for line in sorted_lines:
        fh.write(line[0] + "\n")
    fh.close()

def order_lines_in_files(lines_in_files, desc=False):  
    lines = [(line, cnt) for line, cnt in lines_in_files.items()]
    return sorted(lines, key=getKey)
#    return sorted(lines, key=lambda x: x[0].split(".")[1] if x[0].split("\t")[1].startswith("www.") else x[0], reverse=desc)
    

def getKey(item):
#    print("item[0].split(t)[1]:" + item[0].split("\t")[1])
    item_test = item[0].split("\t")[1]
#    print("item[0].split(t)[1]:" + item[0].split("\t")[1])
    if item_test.startswith("www."):
#        print("starts with: " + item_test)
        return item_test[4:] + "1" 
    else:
#        print("does not start with:" + item_test)
        return item_test

def record_line_cnt(line, lines_in_files):  
    if line != '':
        if line in lines_in_files:
            lines_in_files[line] += 1
        else:
            lines_in_files[line] = 0

    
if __name__ == '__main__':  
   main()
