const path = require('path')
const http = require('http')


const {generateMessage,generateLocationMessage} = require('./util/message')
const {isRealString} = require('./util/isRealString')
const {User} = require('./util/users')

const socketIO = require('socket.io')
const express = require('express')
const publicPath = path.join(__dirname, '/../public')
const port = process.env.PORT || 3000 
var app = express()

var server = http.createServer(app)
var io = socketIO(server)

var users = new User()

app.use(express.static(publicPath))


io.on('connection',(socket)=>{
    console.log("A new user just connected")


        socket.on('createMessage',(message,callback)=>{
        // console.log('Create message',message)

        var user = users.getUser(socket.id)
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text))
        }
        
        callback()
        })

        socket.on('join',(parms,callback)=>{
            if(!isRealString(parms.name) || !isRealString(parms.room)){
               return  callback('Name and room are required')
            }

            users.removeUser(socket.id)
            socket.join(parms.room)
            users.removeUser(socket.id)
            users.addUser(socket.id, parms.name, parms.room)
            //console.log(socket.id)
            io.to(parms.room).emit('updateUserLisr',users.getUserList(parms.room))
            socket.emit('newMessage',generateMessage('Admin',`Welcome to ${parms.room}`))
            socket.broadcast.to(parms.room).emit('newMessage',generateMessage('Admin','New user is joined'))

            
            callback()
        } )
        

        // socket.broadcast.emit('newMessage',{
        //         from : message.from,
        //         text: message.text,
        //         createdAt: new Date().getTime()
        //     })
   
        socket.on('createLocation',(coords =>{
            var user = users.getUser(socket.id)

            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,
            coords.lat, coords.lng))
        }))


    socket.on('disconnect',()=>{
        console.log("User was disconnected")
       // console.log(socket.id)
        user = users.removeUser(socket.id)
        
        if (user){
            io.to(user.room).emit('updateUserLisr',users.getUserList(user.room))
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left ${user.room} chat room`))
        
        }
    })





})




server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})