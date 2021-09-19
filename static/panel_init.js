var https = require('https');
var fs = require('fs');
const fse = require('fs-extra')
const { exec } = require("child_process");
const passGen = require("fast-pass-gen");
const bcrypt = require('bcrypt');
var unzipper = require("unzipper");
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


if(!oldconfig.includes("*:8080>")) oldconfig = oldconfig.replace('*:80>', '*:8080>   ');
oldconfig = oldconfig.replace('/var/www/html', '/var/www/panel');
fs.writeFileSync(config_defauld_conf, oldconfig);


aze = fs.readFileSync(config_defauld_conf);
aze = aze.toString();
if(!aze.includes("#not")){

fs.appendFileSync(config_defauld_conf, " \n \
#ipsbloquerdefault \n \
<VirtualHost *:80>#not \n \
	ServerAdmin webmaster@localhost  \n \
	DocumentRoot /var/www/ip/ \n \
	ErrorLog ${APACHE_LOG_DIR}/ip.error.log \n \
	CustomLog ${APACHE_LOG_DIR}/ip.access.log combined \n \
</VirtualHost> \n \
")

}
if(!fs.readFileSync(portconfpath).includes("Listen 8080")) fs.appendFileSync(portconfpath, "Listen 8080");
shell("systemctl restart apache2");

  if(!fs.existsSync("static")) fs.mkdirSync("static");
if(fs.existsSync("/var/www/html/index.html")) fse.removeSync("/var/www/html/index.html");
if(fs.existsSync("/var/www/html/")) fse.removeSync("/var/www/html/");
if(!fs.existsSync("/var/www/ip/")) fs.mkdirSync("/var/www/ip/");
if(!fs.existsSync("/var/www/panel/")) fs.mkdirSync("/var/www/panel/");
if(!fs.existsSync("/panel/node")) fs.mkdirSync("/panel/node");

if(!fs.existsSync("/panel/static/index.html")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/index.html", "/panel/static/index.html", () =>{});
if(!fs.existsSync("/panel/node/install.js")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/install.js", "/panel/node/install.js", () =>{});
if(!fs.existsSync("/panel/node/new_domain.js")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/new_domain.js", "/panel/node/new_domain.js", () =>{});
if(!fs.existsSync("/panel/static/ip.html")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/ip.html", "/panel/static/ip.html", () =>{});
if(!fs.existsSync("/panel/node/ssl.js")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/ssl.js", "/panel/node/ssl.js", () =>{});
if(!fs.existsSync("/panel/static/")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/ssl.js", "/panel/node/ssl.js", () =>{});
if(!fs.existsSync("/var/www/ip/index.html")) fs.copyFileSync("/panel/static/ip.html", "/var/www/ip/index.html");
if(!fs.existsSync("/panel/static/")) download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/ssl.js", "/panel/node/ssl.js", () =>{});
if(!fs.existsSync("/var/www/panel/phpmyadmin/")) 
{
  download("https://raw.githubusercontent.com/kosmixyt/Owner/main/static/phpmyadmins.zip", "/var/www/panel/phpmyadmin.zip", () =>{
fs.createReadStream('/var/www/panel/phpmyadmin.zip').pipe(unzipper.Extract({ path: '/var/www/panel/' })).on('finish', () => {
  console.log("fini");
fs.renameSync("/var/www/panel/phpMyAdmin-5.1.1-all-languages/", "/var/www/panel/phpmyadmin/");
fs.unlinkSync("/var/www/panel/phpmyadmin.zip")
});
  });
}








// gen mysql password
mysqlpass = passGen(15, ["num", "eng"])
adminpanelpassword = passGen(15, ["num", "eng"])
date = Date.now();


console.log("Mysql 'root' password : "+mysqlpass)
console.log("Panel 'ADMIN' password : "+ adminpanelpassword)

//shell("mysql --execute=\"ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '"+mysqlpass+"';\"");
const saltRounds = 10;




shell("mysql -uroot -" + mysqlpass+ " --execute=\"CREATE DATABASE panel;\"");
shell("mysql -uroot -" + mysqlpass + " --execute='USE panel; CREATE TABLE `users` (`id` int NOT NULL,`username` varchar(50) NOT NULL,`last_login_ip` varchar(30) NOT NULL,`register_ip` varchar(30) NOT NULL,`user_type` varchar(10) NOT NULL,`register_date` varchar(300) NOT NULL,`password` varchar(300) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; ALTER TABLE `users` ADD PRIMARY KEY (`id`); ALTER TABLE `users` MODIFY `id` int NOT NULL AUTO_INCREMENT;COMMIT;'");

bcrypt.hash(adminpanelpassword, saltRounds, function(err, hash) {
 

shell("mysql -uroot -" + mysqlpass + " --execute='USE panel; INSERT INTO `users` (`id`, `username`, `last_login_ip`, `register_ip`, `user_type`, `register_date`, `password`) VALUES (NULL, \"admin\", \"0.0.0.0\", \"0.0.0.0\", \"admin_all\", \""+ date +"\", \"" + hash + "\")'");
});