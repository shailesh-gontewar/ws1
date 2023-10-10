// const ws = require('ws')
import { createServer} from "http"
import {Server} from "socket.io"
const server = new ws.Server({port:"4000"})

server.on('connection',socket =>{
    socket.on('message',message=>{
        const b =Buffer.from(message)
        console.log (b.toString())
        socket.send(`${message}`)
    })
})