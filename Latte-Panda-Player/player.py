import mpv
import json
from interfaces import get_interface
import utils
import requests
import shutil
import time
import os
import time

DEFAULT_PLAYLIST_DIR = './'
DEFAULT_MEDIA_DIR = './media'

SERVER_URL = 'http://172.16.1.72:3005'
#SERVER_URL = 'http://192.168.2.125:3005'

class Player:

    def __init__(self, pl='playlist.json'):
        self.device_config = None
        self.playlist = pl
        self.interfaces = []
        self.sync_groups = []
        self.register()
        self.screens = {}
        self.config = None
        self.load_config()
        self.playing = False
        if self.config is not None:
            if self.config['interfaces'] is not None:
                self.load_interfaces()
        self.load_content()
        self.load_playlist()
        

    def register(self):
        mac_addr = utils.get_mac_address()
        ip_addr = utils.get_ip_address()
        hostname = utils.get_hostname()
        data = {
            'mac': mac_addr,
            'ip': ip_addr,
            'hostname': hostname
        }
        r = requests.post(f'{SERVER_URL}/device/create', data=data)
        self.device_config = r.json()
        print(self.device_config)

    def sync_content(self):
        screens = []
        downloaded_media = []
        playlist = {
            "screens": {
                0: {
                    "playlist": []
                },
                1: {
                    "playlist": []
                }
            }   
        }
        for index, screen in enumerate(self.content['playlists']):
            playlist_id = screen['_id']
            for item in screen['items']:
                filename = item['name']
                if filename in downloaded_media or os.path.isfile(DEFAULT_MEDIA_DIR + f'/{filename}'):
                    print(f'{filename} already dowloaded.')
                    playlist['screens'][index]['playlist'].append(filename)
                    continue
                file_id = item['_id']
                print(f'Downloading {filename}...')
                with requests.get(f'{SERVER_URL}/download/{file_id}', stream=True) as r:
                    with open(DEFAULT_MEDIA_DIR + f'/{filename}', 'wb') as f:
                        shutil.copyfileobj(r.raw, f)
                print('Download complete.')
                playlist['screens'][index]['playlist'].append(filename)
                downloaded_media.append(filename)
        playlist_file = open('./playlist.json', 'w')
        json.dump(playlist, playlist_file, indent=4)
        playlist_file.close()

    def load_content(self):
        while 'content' not in self.device_config:
            print('Waiting for content')
            time.sleep(1)
            self.get_config()
        r = requests.get(f'{SERVER_URL}/content/{self.device_config["content"]}')
        self.content = r.json()['content']
        print(self.content)
        self.sync_content()

    def load_playlist(self):
        f = open(DEFAULT_PLAYLIST_DIR + self.playlist)
        data = json.load(f)
        for screen in data['screens']:
            playlist = data['screens'][screen]['playlist']
            self.screens[screen] = mpv.MPV(hwdec='vaapi',
                                           input_default_bindings=True,
                                           input_vo_keyboard=True)
            #for item in playlist:
            #    media_file = DEFAULT_MEDIA_DIR + '/' + item
            #    self.screens[screen].playlist_append(media_file)
            self.screens[screen].screen = screen    
            self.screens[screen].fullscreen = True
            self.screens[screen].loop = True
            self.screens[screen].playlist_pos = 0

    def get_config(self):
        r = requests.get(f'{SERVER_URL}/device/{self.device_config["_id"]}')
        self.device_config = r.json()

    def load_config(self):
        f = open('./config.json', 'r')
        self.config = json.load(f)

    def load_interfaces(self):
        for interface in self.config['interfaces']:
            self.interfaces.append(get_interface(interface['name'], interface['args'], self.run_commands))


    def run_commands(self, cl, args=None):
        for command in cl:
            if command == 'unpause':
                for player in self.screens:
                    self.screens[player]._set_property("pause", False)
            elif command == 'pause':
                for player in self.screens:
                    self.screens[player]._set_property("pause", True)
            elif command == 'play':
                self.start_players()
            elif command == 'update':
                print(args)
                if args['id'] == self.device_config['_id']:
                    self.get_config()
                    self.reload()
            elif command == 'sync':
                if args['group'] in self.device_config['syncGroups']:
                    self.start_players()
            else:
                print(cl)


    def process_message(self, cmd):
        target = 0
        tokens = cmd.split(':')
        command = cmd
        command_list = []
        if len(tokens) > 1:
            target = tokens[0]
            command = tokens[1]
        if target == 0:
            command_list.append({0, command})
            command_list.append({1, command})
        else:
            command_list.append(target, command)
        self.run_commands(command_list)


    def reload(self):
        self.load_content()
        #self.stop_players()
        self.start_players()

    def restart(self):
        self.stop_players()
        self.start_players()

    def start_players(self):
        f = open(DEFAULT_PLAYLIST_DIR + self.playlist)
        data = json.load(f)
        for screen in self.screens.keys():
            print('Starting screen - ' + screen)
            self.screens[screen].play(DEFAULT_MEDIA_DIR + '/' + data['screens'][screen]['playlist'][0])
        #self.screens["0"].wait_for_playback()

    def stop_players(self):
        for screen in self.screens.keys():
            print('Stopping screen - ' + screen)
            self.screens[screen].terminate()

def main():
    player = Player()
    player.start_players()
    while True:
        pass

if __name__ == '__main__':
    main() 
