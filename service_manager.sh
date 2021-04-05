#!/bin/bash

if [ "$1" = "install" ]
then
    echo "Adding pispy service to systemctl..."
    sudo cp pispy.service /etc/systemd/system/pispy.service
    sudo systemctl enable pispy.service
    echo "Done."
elif [ "$1" = "start" ]
then
    echo "Starting pispy service..."
    sudo systemctl start pispy.service
elif [ "$1" = "stop" ]
then
    echo "Stopping pispy service..."
    sudo systemctl stop pispy.service
elif [ "$1" = "enable" ]
then
    echo "Enabling pispy service to start on boot..."
    sudo systemctl enable pispy.service
elif [ "$1" = "disable" ]
then
    echo "Disabling pispy service from starting on boot..."
    sudo systemctl disable pispy.service
elif [ "$1" = "uninstall" ]
then
    echo "Removing pispy service from systemctl..."
    sudo systemctl stop pispy.service
    sudo systemctl disable pispy.service
    sudo rm -f /etc/systemd/system/pispy.service
    sudo systemctl daemon-reload
elif [ "$1" = "help" ]
then
    echo ""
    echo "./service_manager.sh argument"
    echo ""
    echo "install - installs pispy service and enables start on boot"
    echo "start - starts pispy via systemctl (service must be installed)"
    echo "stop - stops pispy via systemctl (service must be installed)"
    echo "enable - enables pispy to start on boot (service must be installed)"
    echo "disable - disables pispy from starting on boot (service must be installed)"
    echo "uninstall - completely removes pispy service from systemctl"
    echo ""
else
    echo "Invalid option. Options are help, install, uninstall, enable, disable, start, stop."
fi