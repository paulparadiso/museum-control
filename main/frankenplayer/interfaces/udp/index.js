const dgram = require('node:dgram');
const { contextIsolated } = require('node:process');

module.exports = config => {
    const server = dgram.createSocket('udp4');

    server.on('error', (err) => {
        console.log(`udp error:${err.stack}`);
        server.close();
    });

    server.on('message', (msg, rinfo) => {
        config.callback({'message': msg, 'sender': {'address': rinfo.address, 'port': rinfo.port}});
    });

    server.on('listening', () => {
        const address = server.address();
        console.log(`server listening ${address.address}:${address.port}`);
    });

    server.bind(config.port);
    
}
