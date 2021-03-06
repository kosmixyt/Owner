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
    arg1= arg1.toString();
    arg2 = process.argv[3];
    arg2 = arg2.toString();
    arg3 = process.argv[4];
    arg3 = arg3.toString();
    if(!arg3.includes(JSON.parse(fs.readFileSync("config.json")).document_root_all_site)){
        console.log("Le document root du site doit etre dans le document_root de tout les sites");
        process.exit();
    }
    while(!fs.existsSync(arg3)) fs.mkdirSync(arg3);
    if(arg2 == "true"){
        alias = "ServerAlias www."+arg1;
        }else{
            alias = "";
        }


virtualhostdata = "<VirtualHost *:80> \n \
ServerName "+arg1+" \n \
" + alias + " \n \
DocumentRoot \""+ arg3 +"\" \n \
<Directory \""+ arg3 + "\"> \n \
    Options +FollowSymLinks \n \
    AllowOverride all \n \
    Require all granted \n \
</Directory> \n \
ErrorLog /var/log/apache2/error."+ arg1+ ".log \n \
CustomLog /var/log/apache2/access." + arg1 + ".log combined \n \
</VirtualHost>";



    fs.writeFileSync("/etc/apache2/sites-available/"+arg1+".conf", virtualhostdata);

shell("a2ensite "+arg1);
shell("systemctl reload apache2");
