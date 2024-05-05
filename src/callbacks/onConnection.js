import onJoinRoom from './onJoinRoom'
import onSendMessage from './onSendMessage'
import onTyping from './onTyping'

export default async (socket) => {
    // eslint-disable-next-line no-console
    console.log('socket connected')

    socket.on('join chat', (room) => {
        onJoinRoom.call(null, socket, room)
    })

    socket.on('typing', (room) => {
        onTyping.call(null, socket, room)
    })

    socket.on('stop typing', (room) => {
        onTyping.call(null, socket, room)
    })

    socket.on('new message', (newMessageReceived) =>
        onSendMessage.call(null, socket, newMessageReceived)
    )

    socket.on('disconnect', () => {
        // eslint-disable-next-line no-console
        console.log(`User is disconnected`)
    })
}
