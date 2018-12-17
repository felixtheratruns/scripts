# compare_files.py
## Description:
Compares files in unziped schoology "download all" assignment folder. Here's an example of what your folder structure might look like:
folde_name\student, name - 0AAA119SP00084\Revision 1 - On Time\student_submission.extension  
folde_name\student, name - 0AAA119SP00114\Revision 1 - Late\student_submission.extension  
folde_name\Smith, Joe - 0AAA119SP00134\Revision 1 - Late\student_submission.extension  

This has been tested on Windows 7 running the following version of cygwin with the linux diff utility installed:  
C:\Windows\SysWOW64>uname -r   
2.10.0(0.325/5/3)

## Instructions
Change the following line in the program to change the minimum lines difference an assignment can have before it is flaged as copied:  
const diff_line_minimum = 20;

Change the following line in the program to change the list of file extensions the program compares:  
const extensions = ['.java','rtf','.txt'];

The program will write a file called: "output_diffs" and will notify you when it finds a group with console.log in stdout. 

## Usage: 
node compare_files.js [schoology folder]


# add_file_to_hosts.js
## Description:
This blocks urls. Since some websites can have a www. prefix to them, this blocks those urls as well. To block the entire site make sure the url has no prefix on it (e.g. "google.com" NOT "http://google.com") Also make sure there is no www. prefix ( e.g. facebook.com NOT "www.facebook.com")

## Usage:
node add_file_to_hosts.js [url]

# merge_hosts_files_wo_repeats.py
## Description:
This merges the sites blocked in hosts files by the .add_file_to_hosts.js script. It will only merge lines that start with "127.0.0.1" The paths to the three host files it is set to merge are in the script towards the beginning. It will create one output file, the name of which is also in the script..

## Usage:
python merge_hosts_files_wo_repeats.py 

