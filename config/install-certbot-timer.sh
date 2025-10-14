#!/bin/bash

# Run with sudo
cp certbot-renew.service /etc/systemd/system/
cp certbot-renew.timer /etc/systemd/system/
cp certbot-renew.sh /usr/local/bin/
chmod +x /usr/local/bin/certbot-renew.sh

# Reload systemd to pick up new files
systemctl daemon-reload

# Enable the timer to start on boot
systemctl enable certbot-renew.timer

# Start the timer now
systemctl start certbot-renew.timer

# Check timer status
systemctl status certbot-renew.timer

# List all timers to verify it's scheduled
systemctl list-timers