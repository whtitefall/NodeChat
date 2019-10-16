const path = require('path')
const http = require('http')

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


    socket.on('disconnect',(socket)=>{
        console.log("User was disconnected")
    })

})




server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})