## .add_file_to_hosts.js
# Description:
This blocks urls. Since some websites can have a www. prefix to them, this blocks those urls as well. To block the entire site make sure the url has no prefix on it (e.g. "google.com" NOT "http://google.com") Also make sure there is no www. prefix ( e.g. facebook.com NOT "www.facebook.com")

# Usage:
node .add_file_to_hosts.js [url]

## .merge_hosts_files_wo_repeats.py
# Description:
This merges the sites blocked in hosts files by the .add_file_to_hosts.js script. It will only merge lines that start with "127.0.0.1" The paths to the three host files it is set to merge are in the script towards the beginning. It will create one output file, the name of which is also in the script..

# Usage:
python .merge_hosts_files_wo_repeats.py 
