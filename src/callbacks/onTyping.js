export default async (socket, { room, isTyping }) => {
    if (isTyping) {
        // eslint-disable-next-line no-console
        console.log('typing..........', room)
        socket.in(room).emit('typing')
    } else {
        // eslint-disable-next-line no-console
        console.log('stop typing..........', room)
        socket.in(room).emit('stop typing')
    }
}
