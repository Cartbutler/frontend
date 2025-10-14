#!/bin/bash

# Update DuckDNS IP first (in case it changed)
IP=$(curl -s http://checkip.amazonaws.com)
curl -s "https://www.duckdns.org/update?domains=cartbutler&token=e8f23836-4971-48d6-b743-0c4a1391cc6b&ip=${IP}"

# Wait for DNS to propagate
sleep 10

# Try renewal up to 3 times
for i in 1 2 3; do
    echo "Renewal attempt $i"
    /usr/bin/certbot renew --quiet --no-self-upgrade && break
    sleep 60
done

# Reload nginx if renewal succeeded
if [ -f /etc/letsencrypt/live/cartbutler.duckdns.org/fullchain.pem ]; then
    systemctl reload nginx
fi