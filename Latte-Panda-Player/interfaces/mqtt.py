from .interface import Interface
import paho.mqtt.client as mqtt
import json

class MQTT(Interface):

    def __init__(self, args, callback):
        self.topics = args['topics']
        self.broker = args['broker']
        self.client_id = None
        self.init_mqtt()
        super().__init__(callback)

    def init_mqtt(self):
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print(f'Connected to MQTT broker at {self.broker}.')
                for topic in self.topics:
                    self.client.subscribe(topic)
            else:
                print('Failed to connect, return code %d\n', rc)
        self.client = mqtt.Client(self.client_id)
        self.client.on_connect = on_connect
        self.client.on_message = self.on_message
        try:
            print(self.broker)
            self.client.connect(self.broker, 1883)
        except TimeoutError:
            print(f'Connection to {self.broker} failed.')
            return
        self.client.loop_start()

    def on_message(self, client, userdata, message):
        msg = str(message.payload.decode())
        print(f'Received {msg} on {message.topic}')
        if message.topic == 'museum/devices/update':
            id = json.loads(msg)['device']
            print(f'Sending update for {id}')
            self.callback(['update'], {'id': json.loads(msg)['device']})
        if message.topic == 'museum/players':
            self.callback([msg])
        if message.topic == 'museum/players/sync':
            print(f'sync - {msg}')
            self.callback(['sync'], {'group': msg})
