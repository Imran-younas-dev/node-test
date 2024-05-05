export default async (socket, room) => {
    socket.join(room)
    // eslint-disable-next-line no-console
    console.log('room joined ', room)

    socket.on('leave room', (room) => {
        socket.leave(room)
        // eslint-disable-next-line no-console
        console.log('user left room', room)
    })
}
