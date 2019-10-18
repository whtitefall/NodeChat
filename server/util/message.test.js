var expect = require('expect')

var {generateMessage,generateLocationMessage} = require('./message')

describe('Generate Messgae ', ()=>{
    it('should generate correct message obejct ', ()=>{

        var from = "Brad"
        var text = " random text "
        var message =  generateMessage(from,text)

        expect(typeof message.createdAt).toBe('number')
        expect(message).toMatchObject({from,text})
    })

})

describe('Generate Location Message',()=>{
    it('should generate location message',()=>{
        let from = 'Brad',
            lat = 31,
            lng = 31,
            url = `http://www.google.com/maps?q=${lat}, ${lng}`,
            message = generateLocationMessage(from,lat,lng); 
        

        expect(typeof message.createdAt).toBe('number')
        expect(message).toMatchObject({from,url})
    })

})