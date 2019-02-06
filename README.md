# compare_files.js
## Description:
Compares files in unziped schoology "download all" assignment folder. Here's an example of what your folder structure might look like:  
folde_name\student, name - 0AAA119SP00084\Revision 1 - On Time\student_submission.extension  
folde_name\student, name - 0AAA119SP00114\Revision 2 - Late\student_submission.extension  
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

## Appendix (notes on submodules in git)   
Source: http://willandorla.com/will/2011/01/convert-folder-into-git-submodule/


### 1. Clone new repository

```bash
$ git clone --no-hardlinks original-repo copied-repo
```

### 2. Filter out the files you want to keep and remove the others

```bash
$ cd copied-repo
$ git filter-branch --subdirectory-filter sub/module/path HEAD -- --all
$ git reset --hard
$ git gc --aggressive
$ git prune
$ git remote rm origin
```

### 3. Push the new repositories to the upstream server

```bash
$ git remote add git@github.com:korya/submodule-repo.git
```

### 4. Add the new repository as submodules to the original repository

```bash
$ cd original-repo
$ git rm sub/module/path
$ git commit -m "Removing the folders that are now repositories"
$ git submodule add git@github.com:korya/submodule-repo.git sub/module/path
$ git submodule init
$ git submoduel update
$ git add .gitmodules sub/module/path
$ git commit -m "Added in submodules for removed folders"
``` 


Cause: Your submodule is not tracking any or correct branch. Solution: Make sure your submodule is tracking the correct branch  
$ cd \<submodule-path\>  
\# if the master branch already exists locally:  
\# (From git docs - branch)  
\# -u <upstream>  
\# --set-upstream-to=\<upstream\>  
\#    Set up \<branchname\>'s tracking information so \<upstream\>  
\#    is considered \<branchname\>'s upstream branch.  
\#    If no \<branchname\> is specified, then it defaults to the current branch.  
$ git branch -u \<origin\>/\<branch\> \<branch\>  
\# else:  
$ git checkout -b \<branch\> --track \<origin\>/\<branch\>  
Cause: Your parent repo is not configured to track submodules branch. Solution: Make your submodule track its remote branch by adding new submodules with the following two commands.  
First you tell git to track your remote \<branch\>.  
Second you tell git to update your submodule from remote.  
    $ git submodule add -b \<branch\> \<repository\> \[\<submodule-path\>\]  
    $ git submodule update --remote  
If you haven't added your existing submodule like this you can easily fix that:  
First you want to make sure that your submodule has the branch checked out which you want to be tracked.  
    $ cd \<submodule-path\>  
    $ git checkout \<branch\>  
    $ cd \<parent-repo-path\>  
    # \<submodule-path\> is here path releative to parent repo root  
    # without starting path separator  
    $ git config -f .gitmodules submodule.\<submodule-path\>.branch \<branch\>  

i got tired of it always detaching so i just use a shell script to build it out for all my modules. i assume all submodules are on master: here is the script:

\#!/bin/bash  
echo "Good Day Friend, building all submodules while checking out from MASTER branch."  
git submodule update    
git submodule foreach git checkout master   
git submodule foreach git pull origin master  

 
