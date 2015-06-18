# stdin-eval-stdout
A Node.js application to evaluate JavascriptCode (and data) provided on stdin and write output to stdout

# Why would you do this?
The goal is to securely evaluate user provided JavaScript on the server. If you research the problem any, you'll find out its hard.
By reading in the code and data from stdin; the evaluating application can be run in a process which is denied access to network and disk, and is limited in the memory and cpu it can use. 
