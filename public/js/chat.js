
var socket = io();

function scrollToBottom(){

    var messages = document.querySelector('#messages').lastElementChild
    messages.scrollIntoView()

}

socket.on('connect',function(){


    console.log('connect to server')
    var params = window.location.search.substring(1)

    var p = JSON.parse('{"'+decodeURI(params).replace(/&/g,'","').replace(/=/g,'":"').replace(/\+/g,' ')+'"}')

    socket.emit('join',p, function(err){
        if(err){
            alert(err)
            window.location.href = '/'
        }else{
            console.log('No error')
        }
    })

    // socket.emit('createMessage',{
    //     from:"Brad",
    //     text:"hello"
    // },function (){
        
    // })

})

socket.on('disconnect', function(){
   console.log('disconnected from server')
})

socket.on('updateUserLisr',function(users){
    var ol = document.createElement('ol')
    users.forEach(function(user){
        let li = document.createElement('li')
        li.innerHTML = user
        ol.appendChild(li)
    })

    var userList = document.querySelector('#user-list')
    userList.innerHTML = ''
    userList.appendChild(ol)
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
    div.className += 'message_item'

    document.querySelector('#messages').appendChild(div)

    scrollToBottom()
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
        div.className += 'message_item'
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