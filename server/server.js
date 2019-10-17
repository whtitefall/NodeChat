const path = require('path')
const http = require('http')


const {generateMessage} = require('./util/message')
const socketIO = require('socket.io')
const express = require('express')
const publicPath = path.join(__dirname, '/../public')
const port = process.env.PORT || 3000 
var app = express()

var server = http.createServer(app)
var io = socketIO(server)


app.use(express.static(publicPath))


io.on('connection',(socket)=>{
    console.log("A new user just connected")


        socket.on('createMessage',(message,callback)=>{
        console.log('Create message',message)
        io.emit('newMessage',generateMessage(message.from,message.text))
        callback('This is the server callback')
        })
        
        socket.emit('newMessage',generateMessage('Admin','Welcome to the chat'))

        socket.broadcast.emit('newMessage',generateMessage('Admin','New message is up'))

        // socket.broadcast.emit('newMessage',{
        //         from : message.from,
        //         text: message.text,
        //         createdAt: new Date().getTime()
        //     })
   



    socket.on('disconnect',(socket)=>{
        console.log("User was disconnected")
    })





})




server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})