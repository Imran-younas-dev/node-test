import fs from 'fs'
import onConnection from '../callbacks/onConnection'

module.exports = (app) => {
    let server
    if (process.env.SSL_KEY && process.env.SSL_CERTIFICATE) {
        server = require('https').createServer(
            {
                key: fs.readFileSync(process.env.SSL_KEY),
                cert: fs.readFileSync(process.env.SSL_CERTIFICATE),
            },
            app
        )
    } else {
        server = require('http').createServer(app)
    }

    const io = require('socket.io')(server, {
        pingTimeout: 60000,
        cors: {
            origin: '*',
        },
    })

    io.on('connection', onConnection)

    return server
}
