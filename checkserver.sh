#!/bin/bash
SERVICE="node"
if pgrep -x "$SERVICE" >/dev/null
then
    echo "$SERVICE is running"
else
    echo "$SERVICE stopped"
    node /avicenna/nodeserver/server.js > /avicenna/nodeserver/logs/"$(date +"%Y_%m_%d_%I_%M_%p").log" &
    # uncomment to start nginx if stopped
    # systemctl start nginx
    # mail
fi

