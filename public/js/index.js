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


socket.emit('createMessage',{
    from :'Some one',
    text : 'text ....'
},function(message){
    console.log(message,'Server got it')
})