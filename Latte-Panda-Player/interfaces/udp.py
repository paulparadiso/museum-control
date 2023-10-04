from .interface import Interface
import socket

class UDP(Interface):

    def __init__(self, args, callback):
        self.port = args['port']
        super().__init__(callback)

    def init_socket(self):
        pass

    def parse_message(self, message):
        pass