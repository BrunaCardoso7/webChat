import express from 'express'
import { createServer } from "node:http"
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";




import { Server } from "socket.io";
import { createTokenMiddleware } from './src/middleware/createToken.middleware.js';
import { authMiddleware } from './src/middleware/auth.middleware.js';
import { loggingMiddleware } from './src/middleware/logging.middleware.js';
import { rateLimitMiddleware } from './src/middleware/rateLimit.middleware.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

app.use(express.static(join(__dirname, "public")));

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));


const httpserver = createServer(app)
const io = new Server(httpserver, { 
    path: '/socket.io',
    connectionStateRecovery: {} 
});


const users = []
const messages = []

io.use(rateLimitMiddleware)

io.on('connection', (socket) => {
    console.log(`conexão bem sucedida: ` + socket.id)
    
    socket.on('chatOn', (data) => {
        console.log('chat on foi chamado ');
        const message = {
            room: data.room,
            username: data.username,
            createdAt: new Date(),
            msg: data.msg
        };

        messages.push(message);
        console.log(message);

        io.to(data.room).emit('chatOn', message);
    })
    
    socket.on('auth', (data) => {
        if(!data.token){
            console.log(' sem token ')
        }
        console.log('Token recebido:' + data.token);
    });
    
    socket.on('room', (data) => {
        socket.join(data.room)
        const userRoom = users.filter(user=> user.username === data.username && user.room === data.room)
        if(userRoom){
            userRoom.socketId = socket.id
        }
        users.push({
            socketId: socket.id,
            room: data.room,
            username: data.username
        })
        
        console.log(users)
    })


    // socket.on('chatOn', (data) => {
        
    //     console.log('chat on foi chamado ')
    //     const message = {
    //         room: data.room,
    //         username: data.username,
    //         createdAt: new Date(),
    //         msg: data.msg
    //     }
        
    //     messages.push(message)
    //     console.log(message)

    //     io.to(data.room).emit('chatOn', message)
    // })
})

httpserver.listen(3000, ()=>{
    console.log('rodanu')
})