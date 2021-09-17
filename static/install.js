const fs = require('fs');
const { exec } = require("child_process");
arg1 = process.argv[2];
arg2 = process.argv[3];
arg3 = process.argv[4];
arg4 = process.argv[5];



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
// argument 1 = document_root all site 
// argument 2 = document_root du site principal (pas du panel)
// argument 3 = nom de domaine 
// argument 4 = si l'alias avec www.arg3 existe

try{
while(!fs.existsSync(arg1)){ fs.mkdirSync(arg1)}
while(!fs.existsSync(arg2)){ fs.mkdirSync(arg2)}

if(arg4 == "true"){
alias = "ServerAlias www."+arg3;
}else{
    alias = "";
}

var  virtualhost = "<VirtualHost *:80> \n \
ServerName "+arg3+" \n \
" + alias + " \n \
DocumentRoot "+ arg2 +" \n \
<Directory '"+ arg2 + "'> \n \
    Options +FollowSymLinks \n \
    AllowOverride all \n \
    Require all granted \n \
</Directory> \n \
ErrorLog /var/log/apache2/error."+ arg3+ ".log \n \
CustomLog /var/log/apache2/access." + arg3 + ".log combined \n \
</VirtualHost>";


fs.writeFileSync("/etc/apache2/sites-available/"+arg3+".conf", virtualhost);
shell("a2ensite "+arg3);
shell("systemctl reload apache2");
if(arg2.substr(arg2.lengt - 1) == '/'){
dest = arg2+"index.html";
}else{
    dest = arg2+"/index.html";
}
fs.copyFileSync("/panel/static/index.html", dest);

fs.writeFileSync("config.json", '{"principal_domain":"'+arg3+'"}');













}catch(error){
console.log("Error");


}