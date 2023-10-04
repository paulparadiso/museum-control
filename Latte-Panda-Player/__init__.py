import mqtt
import udp

def get_interface(name, args):
    if name == 'mqtt':
        return mqtt(args)