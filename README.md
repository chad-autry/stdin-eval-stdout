# stdin-eval-stdout
A Node.js application to evaluate JavascriptCode (and data) provided on stdin and allow output to be written to stdout

# Why would you do this?
The goal is to securely evaluate user provided JavaScript on the server. If you research the problem any, you'll find out its hard.
By reading in the code and any data from stdin; the evaluating application can be run in a process which is denied access to network and disk, and is limited in the memory and cpu it can use. 

Again, this project by itself is inately **UNSECURE**
Follow these rules for secure evaluation
1. Assume this process will be compromised
  1. It is meant to be thrown away
  2. Don't inject any data the code under evaluation isn't privileged to see
2. Secure the process itself to the amount of time, the amount of memory, the lack of disk access, the lack of network
3. Treat it as a client, trust nothing which is written back to stdout which isn't validated