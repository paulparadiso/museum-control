#!/bin/sh

cd /home/u1/Latte-Panda-Player
git pull origin main
export DISPLAY=:0.0
tmux new -s foo 'python player.py; $SHELL'
