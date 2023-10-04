from .mqtt import MQTT
from .udp import UDP

def get_interface(name, args, callback):
    if name == 'mqtt':
        return MQTT(args, callback)
    if name == 'udp':
        return UDP(args, callback)