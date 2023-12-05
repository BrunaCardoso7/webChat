import jwt from "jsonwebtoken"

import dotenvt from 'dotenv'
dotenvt.config()

const secret = process.env.SECRET

export const authMiddleware = ( socket, next )=>{
    const cookieHeader = socket.handshake.headers.cookie;

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
    }, {});

    const token = cookies.token;

    console.log("token recebido: " + token)

    if(!token ){
        next(new Error('Authentication Error!'))
    }
    try {
        const decoded = jwt.verify(token, secret)
        socket.user = decoded;
        console.log('bunda'+ socket.user)
        next()
    } catch (error) {
        return next(new Error('Inválid Token: ' + error.message))
    }
}