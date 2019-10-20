const path = require('path')
const http = require('http')


const {generateMessage,generateLocationMessage} = require('./util/message')
const {isRealString} = require('./util/isRealString')

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
        callback()
        })

        socket.on('join',(parms,callback)=>{
            if(!isRealString(parms.name) || !isRealString(parms.room)){
                callback('Name and room are required')
            }
            socket.join(parms.room)

            socket.emit('newMessage',generateMessage('Admin',`Welcome to ${parms.room}`))

            socket.broadcast.emit('newMessage',generateMessage('Admin','New user is joined'))
            
        } )
        

        // socket.broadcast.emit('newMessage',{
        //         from : message.from,
        //         text: message.text,
        //         createdAt: new Date().getTime()
        //     })
   
        socket.on('createLocation',(coords =>{
            io.emit('newLocationMessage',generateLocationMessage('Admin',
            coords.lat, coords.lng))
        }))


    socket.on('disconnect',(socket)=>{
        console.log("User was disconnected")
    })





})




server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})