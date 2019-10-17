var expect = require('expect')

var {generateMessage} = require('./message')

describe('Generate Messgae ', ()=>{
    it('should generate correct message obejct ', ()=>{

        var from = "Brad"
        var text = " random text "
        var message =  generateMessage(from,text)

        expect(typeof message.createdAt).toBe('number')
        expect(message).toMatchObject({from,text})
    })

})