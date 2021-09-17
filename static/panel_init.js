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
oldconfig = oldconfig.replace('/var/www/html', '/var/www/panel');
oldconfig = oldconfig + " \
<VirtualHost *:80> \
	ServerAdmin webmaster@localhost \
	DocumentRoot /var/www/ip/ \
	ErrorLog ${APACHE_LOG_DIR}/ip.log \
	CustomLog ${APACHE_LOG_DIR}/ip.access.log combined \
</VirtualHost> \
;";
fs.writeFileSync(config_defauld_conf, oldconfig);
fs.appendFileSync(portconfpath, "Listen 8080");
if(fs.existsSync("/var/www/ip/"))fs.mkdirSync("/var/www/ip/");
  if(!fs.existsSync("static")) fs.mkdirSync("static");
if(fs.existsSync("/var/www/html/index.html")) fse.removeSync("/var/www/html/index.html");
if(fs.existsSync("/var/www/html/")) fse.removeSync("/var/www/html/");
if(!fs.existsSync("/var/www/panel/")) fs.mkdirSync("/var/www/panel/");
if(!fs.existsSync("/panel/node")) fs.mkdirSync("/panel/node");
if(fs.existsSync("/var/www/ip/")) fse.removeSync("/var/www/ip/");


if(!fs.existsSync("/panel/static/index.html")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/index.html", "/panel/static/index.html", () =>{});
if(!fs.existsSync("/panel/node/install.js")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/install.js", "/panel/node/install.js", () =>{});
if(!fs.existsSync("/var/www/ip/index.html")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/ip.html", "/var/www/ip/index.html", () =>{});


shell("systemctl restart apache2");


