const fs = require("fs");
const fse = require("fs-extra");
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
    // arg1 = domaine without www or https
    // arg2 = si le domaine avec www existe (alias) boolean
    // arg3 = document_root du site 

    arg1 = process.argv[2];
    arg2 = process.argv[3];

    if(arg2 == "true"){
        alias = "ServerAlias www."+arg1;
        }else{
            alias = "";
        }


virtualhostdata = "<VirtualHost *:80> \n \
ServerName "+arg1+" \n \
" + alias + " \n \
DocumentRoot "+  +" \n \
<Directory '"+ arg2 + "'> \n \
    Options +FollowSymLinks \n \
    AllowOverride all \n \
    Require all granted \n \
</Directory> \n \
ErrorLog /var/log/apache2/error."+ arg2+ ".log \n \
CustomLog /var/log/apache2/access." + arg2 + ".log combined \n \
</VirtualHost>";



    fs.writeFileSync("/etc/apache2/sites-available/"+arg1+".conf", virtualhostdata);

