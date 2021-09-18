const { exec } = require("child_process")
function shell ($command){
    exec($command, (error, stdout, stderr) => {
        if (error) {
            return;
        }
        if (stderr) {
    
            return;
        }
    });

    

}
// argument 1 = nom de domaine sans https, www (string)
// argument 2 = le nom de domaine comprend un alias avec www. (bool)
// argument 3 = web root path (string)
// argument 4 = si il y a une redirection de https vers http (true == redirect, false = no redirect)

arg1 = process.argv[2];
arg2 = process.argv[3];
arg3 = process.argv[4];
arg4 = process.argv[5];


domaine_name = arg1;
if(arg2 == 'true') alias = "-d www."+domaine_name; else alias = "";
pathroot = arg3;
if(arg4 == 'true') redirect = '--redirect'; else  redirect = '--no-redirect';

shell("certbot -d "+ domaine_name +" "+ alias + " --webroot-path " + arg3 + " --apache --agree-tos "+ redirect + " --register-unsafely-without-email ");



