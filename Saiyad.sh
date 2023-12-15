#!/bin/sh

current_dir=$(cd $(dirname $0); pwd)
echo $current_dir
cd $current_dir
source /etc/profile
./node Saiya.js
