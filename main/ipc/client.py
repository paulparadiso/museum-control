from multiprocessing.connection import Client
import time

conn = Client(('localhost', 6000))
conn.send('foo')
time.sleep(1)
conn.send('close connection')


time.sleep(1)

conn = Client(('localhost', 6000))
conn.send('bar')
conn.send('close server')
conn.close()