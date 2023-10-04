#!/bin/sh

sleep 20

cd /home/u1/Latte-Panda-Player
git pull origin main
export DISPLAY=:0.0
#unclutter &
python player.py
