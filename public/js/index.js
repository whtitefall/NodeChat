
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

    const formatedTime = moment(message.createdAt).format('LT')
    const template = document.querySelector('#message-template').innerHTML
    const html = Mustache.render(template, {
        from: message.from, 
        text: message.text, 
        createdAt : formatedTime
    })

    const div = document.createElement('div')
    div.innerHTML = html 
    
    document.querySelector('body').appendChild(div)
    // console.log("new Messgae",message)

    // const formatedTime = moment(message.createdAt).format('LT')
    // var li = document.createElement('li')
    // li.innerText = `${message.from} ${formatedTime}:${message.text}`
    // document.querySelector('body').appendChild(li)
})

socket.on('newLocationMessage',function(message){

        const formatedTime = moment(message.createdAt).format('LT')
        const template = document.querySelector('#location-template').innerHTML
        const html = Mustache.render(template, {
            from: message.from, 
            url: message.url, 
            createdAt : formatedTime
        })
        const div = document.createElement('div')
        div.innerHTML = html 
        
        document.querySelector('body').appendChild(div)
        // const formatedTime = moment(message.createdAt).format('LT')
        // console.log('Location message ', message)
        // var li = document.createElement('li')
        // var a = document.createElement('a')
        // a.setAttribute('target','_blank')
        // a.setAttribute('href',message.url)
        // li.innerText = `${message.from} : ${formatedTime}` 
        // a.innerText = ' My current location'
        // li.appendChild(a)
        // document.querySelector('body').appendChild(li)

})

// socket.emit('createMessage',{
//     from :'Some one',
//     text : 'text ....'
// },function(message){
//     console.log(message,'Server got it')
// })

document.querySelector("#submit-btn").addEventListener('click',
        function(e){
            e.preventDefault()

            socket.emit('createMessage',{
                from:"user",
                text:document.querySelector('input[name="message"]').value
            },function(){


            })
        })

document.querySelector("#send-location").addEventListener('click',
    function(e){
        if(!navigator.geolocation){
            return alert('geo location is not supported by ur browser')
        }
        
        navigator.geolocation.getCurrentPosition(function(position){
            socket.emit('createLocation',{
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        }, function(){

            alert('unable to fetch location')
        })


    })