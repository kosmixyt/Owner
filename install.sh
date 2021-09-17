
apt update && apt upgrade && apt install sudo apache2 php php-ssh2 zip unzip screen && sudo apt install -y curl && curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - &&  sudo apt install -y nodejs && mkdir /panel/ && cd /panel/ && npm i fs fs-extra https && wget https://raw.githubusercontent.com/kosmixyt/Owner/main/static/panel_init.js && node panel_init.js
