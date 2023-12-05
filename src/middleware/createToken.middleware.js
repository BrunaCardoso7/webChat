import jwt from 'jsonwebtoken'
import dotenvt from 'dotenv'
import { serialize } from 'cookie'
dotenvt.config()
const secret = process.env.SECRET

export const createTokenMiddleware = (socket, next)=>{
    const token = jwt.sign(socket.id, secret)

    const cookie = serialize('token', token, {httpOnly: true});
    
    socket.handshake.headers.cookie = cookie 

    console.log("tokenMiddle: " + token + "cookie: " + cookie)

    socket.emit('auth', { token })
    return next()
}