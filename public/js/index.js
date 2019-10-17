var socket = io();
socket.on('connect',function(){
   console.log('connect to server')

    // socket.emit('createMessage',{
    //     from:"Brad",
    //     text:"hello"
    // })

})

socket.on('disconnect', function(){
   console.log('disconnected from server')
})

socket.on('newMessage',function(message){
    console.log("new Messgae",message)
})