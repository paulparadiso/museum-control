import netifaces
import socket
import os

def get_interface():
    interfaces = os.listdir('/sys/class/net')
    for i in interfaces:
        if 'enp' in i:
            return i
    return 'enp1s0'
            

def get_mac_address():
    try: 
        return netifaces.ifaddresses(get_interface())[netifaces.AF_LINK][0]['addr']
    except KeyError:
        return netifaces.ifaddresses('wlan0')[netifaces.AF_LINK][0]['addr']

def get_ip_address():
    try:
        return netifaces.ifaddresses(get_interface())[netifaces.AF_INET][0]['addr']
    except KeyError:
        return netifaces.ifaddresses('wlan0')[netifaces.AF_INET][0]['addr']

def get_hostname():
    return socket.gethostname()
