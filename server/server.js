const path = require('path')
const http = require('http')

const fs = require('fs')
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

app.get('/video', function(req, res) {
    const path = './static/ghs.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  });

server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})

