export const loggingMiddleware = (socket, next)=>{
    console.log(`[${new Date()}] connection from ${socket.handshake.address}`)
    socket.onAny((event, ...args) => {
        console.log(`[${new Date()}] Event: ${event}, args: ${JSON.stringify(args)}`)
    })
    next()
}