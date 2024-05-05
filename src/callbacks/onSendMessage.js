export default async (socket, newMessageReceived) => {
    const { message, room } = newMessageReceived

    // eslint-disable-next-line no-console
    console.log('message send', message)
    socket.to(room).emit('message recieved', message)
}
