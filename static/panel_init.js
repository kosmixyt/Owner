var https = require('https');
var fs = require('fs');
const fse = require('fs-extra')
const { exec } = require("child_process");
config_defauld_conf = "/etc/apache2/sites-available/000-default.conf";
portconfpath = "/etc/apache2/ports.conf";
  
function download (url, path, callback){
https.get(url,(res) => {
    // Image will be stored at this path
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish',() => {
        filePath.close();
      callback();
    })
})
  }


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


oldconfig = fs.readFileSync(config_defauld_conf);
oldconfig = oldconfig.toString();
oldconfig = oldconfig.replace('*:80>', '*:8080>');
fs.writeFileSync(config_defauld_conf, oldconfig);
fs.appendFileSync(portconfpath, "Listen 8080");
shell("systemctl restart apache2");

  if(!fs.existsSync("static")) fs.mkdirSync("static");
if(fs.existsSync("/var/www/html/index.html")) fse.removeSync("/var/www/html/index.html");
if(fs.existsSync("/var/www/html/")) fse.removeSync("/var/www/html/");
if(fs.existsSync("/var/www/panel/")) fs.mkdirSync("/var/www/panel/");

if(!fs.existsSync("/panel/static/index.html")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/index.html", "/panel/static/index.html", () =>{});


