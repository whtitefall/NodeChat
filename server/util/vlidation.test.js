const expect = require('expect')

const {isRealString} = require('./isRealString')



describe('is Real String',()=>{

    it('should reject none-string values',()=>{
        var res = isRealString(98)
        expect(res).toBe(false)

    })
    it('should reject string with only sapces',()=>{
        var res = isRealString('        ')
        expect(res).toBe(false)
    })
    it('should allow string with none space character',()=>{
        var res = isRealString('         bard           ')
        expect(res).toBe(true)
    })

})
