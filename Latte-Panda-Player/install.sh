#!/bin/sh

if [ ! -d "$HOME/.screenlayout" ]; then
	mkdir "$HOME/.screenlayout"
fi

if [ ! -d "media" ]; then
	mkdir "media"
fi

cp ./autostart/screenlayout/panda.sh ~/.screenlayout
cp ./autostart/config/autostart ~/.config/openbox
pip install -r requirements.txt

