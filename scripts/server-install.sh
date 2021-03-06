#!/bin/bash




# Preparation
# -----------


# Determine if we should run interactively:
read -p "Press <enter> to run interactively..." -t 4
test $? -eq 0 && INTERACTIVE=yes || INTERACTIVE=no


# Collect user input:
function prompt {
    PARAMETER_DESCRIPTION="${1}"
    PARAMETER_NAME="${2}"
    PARAMETER_DEFAULT="${3}"
    if [[ "${INTERACTIVE}" = "yes" ]]; then
        read -p "Set ${PARAMETER_DESCRIPTION} [${PARAMETER_DEFAULT}]: " TEMP
        declare -g ${PARAMETER_NAME}="${TEMP:-${PARAMETER_DEFAULT}}"
    else
        echo ${PARAMETER_NAME}="${PARAMETER_DEFAULT}"
        declare -g ${PARAMETER_NAME}="${PARAMETER_DEFAULT}"
    fi
}
prompt "application description" APPLICATION_DESCRIPTION "Codex Application Server"
prompt "application name" APPLICATION_NAME "codex"
prompt "application port" APPLICATION_PORT "3030"
prompt "domain name" DOMAIN_NAME "domain.example.com"
prompt "domain email" DOMAIN_EMAIL "domain@example.com"
prompt "repository url" REPOSITORY_URL "https://github.com/adambiltcliffe/codex-feathers-react"
prompt "user name" USER_NAME "codex"


# Exit on error:
set -e


# Redirect stdout/stderr to a file:
exec 3>&1 2>${HOME}/server-install.log 1>&2




# Main Process
# ------------


echo -n "* Installing packages for the application... " >&3
apt-get update
apt-get install -y certbot git nginx nodejs npm openssl sudo
echo "done" >&3


echo -n "* Creating the application user and group... " >&3
USER_HOME="/var/lib/${USER_NAME}"
if ! grep -Pq "^${USER_NAME}:" /etc/passwd; then
    adduser --system --home "${USER_HOME}" --group --disabled-password --disabled-login "${USER_NAME}"
fi
cd "${USER_HOME}"
echo "done" >&3


echo -n "* Installing the application... " >&3
APPLICATION_PATH="${USER_HOME}/${APPLICATION_NAME}"
if ! [[ -e "${APPLICATION_PATH}" ]]; then
    sudo -H -u codex git clone "${REPOSITORY_URL}" "${APPLICATION_PATH}"
    pushd "${APPLICATION_PATH}"
    sudo -H -u codex npm install
    sudo -H -u codex npm run distribute
    popd
fi
echo "done" >&3


echo -n "* Installing the configuration file... " >&3
CONFIG_PATH="${USER_HOME}/config.json"
if ! [[ -e "${CONFIG_PATH}" ]]; then
    install /dev/null "${CONFIG_PATH}" -o "${USER_NAME}" -g "${USER_NAME}" -m 0600;
    cat > "${CONFIG_PATH}" <<EOF
{
  "authentication": {
    "secret": "$(openssl rand -base64 24)"
  },
  "nedb": "../../data"
}
EOF
fi
CONFIG_LINK_PATH="${APPLICATION_PATH}/config/production.json"
if [[ -e "${CONFIG_LINK_PATH}" ]]; then
rm "${CONFIG_LINK_PATH}"
fi
sudo -H -u codex ln -s ../../config.json "${CONFIG_LINK_PATH}"
echo "done" >&3


echo -n "* Installing the service... " >&3
cat > "/etc/systemd/system/${APPLICATION_NAME}.service" <<EOF
[Unit]
Description=${APPLICATION_DESCRIPTION}
After=network.target

[Service]
Type=simple
Restart=always
User=${USER_NAME}
Group=${USER_NAME}
WorkingDirectory=${APPLICATION_PATH}
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
echo "done" >&3


echo -n "* Starting the service... " >&3
service "${APPLICATION_NAME}" restart
echo "done" >&3


echo -n "* Installing the sudoers file... " >&3
cat > "/etc/sudoers.d/${APPLICATION_NAME}" <<EOF
${USER_NAME} ALL=(root) NOPASSWD: /usr/sbin/service codex restart
EOF
echo "done" >&3


echo -n "* Acquiring an SSL certificate... " >&3
if [[ ! -e "/etc/letsencrypt/live/${DOMAIN_NAME}" ]]; then
    certbot certonly --non-interactive --agree-tos --webroot --webroot-path /var/www/html --domain "${DOMAIN_NAME}" --email "${DOMAIN_EMAIL}"
fi
echo "done" >&3


echo -n "* Generating Diffie-Hellman parameters... " >&3
if [[ ! -e /etc/nginx/dhparam.pem ]]; then
    openssl dhparam -out /etc/nginx/dhparam.pem 2048;
fi;
echo "done" >&3


echo -n "* Installing the HTTP proxy... " >&3
cat > "/etc/nginx/sites-available/${APPLICATION_NAME}" <<EOF
# http://${DOMAIN_NAME} -- https redirect
server {

    # Server configuration
    # ====================

    # Basic
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN_NAME};
    server_tokens off;

    # Logging
    access_log /var/log/nginx/${APPLICATION_NAME}_access.log combined;
    error_log /var/log/nginx/${APPLICATION_NAME}_error.log error;

    # Request handling
    # ================

    # Redirect all requests.
    return 301 https://\$server_name\$request_uri;

}

# https://${DOMAIN_NAME} -- proxy for application
server {

    # Server configuration
    # ====================

    # Basic
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${DOMAIN_NAME};
    server_tokens off;

    # Logging
    access_log /var/log/nginx/${APPLICATION_NAME}_access.log combined;
    error_log /var/log/nginx/${APPLICATION_NAME}_error.log error;

    # SSL configuration
    # =================

    # Basic
    ssl on;
    ssl_certificate /etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem;

    # Protocols
    ssl_protocols TLSv1.2;

    # Sessions
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 60m;

    # Ciphers
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_dhparam /etc/nginx/dhparam.pem;
    ssl_ecdh_curve secp384r1;

    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/${DOMAIN_NAME}/chain.pem;
    resolver 8.8.8.8 8.8.4.4;

    # Strict transport security
    add_header Strict-Transport-Security "max-age=31536000" always;

    # Request handling
    # ================

    # Serve RFC-5785 well known URIs from /var/www/html.
    location ~ ^/\.well-known {
        root /var/www/html;
        try_files \$uri \$uri/ =404;
    }

    # Pass all other requests to the appplication.
    location / {
        proxy_pass http://localhost:${APPLICATION_PORT};
    }

}
EOF
ln -f -s "../sites-available/${APPLICATION_NAME}" "/etc/nginx/sites-enabled/${APPLICATION_NAME}"
echo "done" >&3


echo -n "* Restarting the HTTP server... " >&3
nginx -t
service nginx restart
echo "done" >&3